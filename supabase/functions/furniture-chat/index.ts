import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// CSV URL for furniture data
const FURNITURE_CSV_URL = 'https://raw.githubusercontent.com/Ertyuuu55/Spacely2/main/Furniture%20(1).csv';
const USD_TO_IDR = 16000;

interface FurnitureItem {
  category: string;
  price: number;
  material: string;
  color: string;
}

interface DesiredCategory {
  category: string;
  quantity: number;
}

// Parse CSV to array of objects
function parseCSV(csvText: string): FurnitureItem[] {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  
  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim());
    const item: Record<string, string | number> = {};
    headers.forEach((header, index) => {
      if (header === 'price') {
        item[header] = parseFloat(values[index]) || 0;
      } else {
        item[header] = values[index] || '';
      }
    });
    return item as unknown as FurnitureItem;
  }).filter(item => item.category && item.price);
}

// Format number to Rupiah
function formatRupiah(angka: number): string {
  return `Rp${Math.round(angka).toLocaleString('id-ID')}`;
}

// Parse user prompt to extract budget and desired categories
function parseUserPrompt(prompt: string, categories: string[]): { budget: number | null; desired: DesiredCategory[]; error: string | null } {
  const lowerPrompt = prompt.toLowerCase();
  
  // Extract all numbers with their positions
  const numberMatches: { value: number; start: number; end: number }[] = [];
  const numberRegex = /\d{1,3}(?:\.\d{3})+|\d+/g;
  let match;
  
  while ((match = numberRegex.exec(lowerPrompt)) !== null) {
    const value = parseInt(match[0].replace(/\./g, ''), 10);
    numberMatches.push({
      value,
      start: match.index,
      end: match.index + match[0].length
    });
  }
  
  if (numberMatches.length === 0) {
    return { budget: null, desired: [], error: "Budget tidak ditemukan dalam pesan Anda." };
  }
  
  // Budget = largest number
  const budgetItem = numberMatches.reduce((max, curr) => curr.value > max.value ? curr : max);
  const budget = budgetItem.value;
  
  // Remove budget from quantity candidates
  const quantityNumbers = numberMatches.filter(n => n !== budgetItem);
  
  const desired: DesiredCategory[] = [];
  const usedNumbers: typeof quantityNumbers = [];
  
  for (const cat of categories) {
    const catRegex = new RegExp(`\\b${cat}\\b`, 'gi');
    let catMatch;
    
    while ((catMatch = catRegex.exec(lowerPrompt)) !== null) {
      const catPos = catMatch.index;
      
      // Find nearest unused number
      let nearest: typeof quantityNumbers[0] | null = null;
      let minDistance = Infinity;
      
      for (const num of quantityNumbers) {
        if (usedNumbers.includes(num)) continue;
        const distance = Math.min(Math.abs(num.start - catPos), Math.abs(num.end - catPos));
        if (distance < minDistance) {
          minDistance = distance;
          nearest = num;
        }
      }
      
      let qty = 1;
      if (nearest && minDistance < 30) {
        qty = nearest.value;
        usedNumbers.push(nearest);
      }
      
      // Check if category already exists
      const existingIdx = desired.findIndex(d => d.category.toLowerCase() === cat.toLowerCase());
      if (existingIdx === -1) {
        desired.push({ category: cat, quantity: qty });
      } else {
        desired[existingIdx].quantity += qty;
      }
    }
  }
  
  return { budget, desired, error: null };
}

// Greedy selection algorithm
function selectFurnitureBasedOnRequest(
  items: FurnitureItem[],
  budgetIDR: number,
  requestedItems: DesiredCategory[]
): { selected: FurnitureItem[]; totalCostIDR: number; messages: string[] } {
  const budgetUSD = budgetIDR / USD_TO_IDR;
  const selected: FurnitureItem[] = [];
  let totalCost = 0;
  const messages: string[] = [];
  const remainingItems = [...items];
  
  // If no specific furniture requested, get one of each default category
  if (requestedItems.length === 0) {
    const defaultCategories = ['table', 'sofa', 'chair', 'desk', 'bed'];
    for (const cat of defaultCategories) {
      const catItems = remainingItems
        .filter(item => item.category.toLowerCase() === cat)
        .sort((a, b) => a.price - b.price);
      
      if (catItems.length > 0) {
        const item = catItems[0];
        if (totalCost + item.price <= budgetUSD) {
          selected.push(item);
          totalCost += item.price;
          const idx = remainingItems.findIndex(i => i === item);
          if (idx > -1) remainingItems.splice(idx, 1);
        }
      }
    }
    
    if (selected.length === 0) {
      messages.push("Budget tidak mencukupi untuk membeli furniture apa pun.");
    }
    
    return { selected, totalCostIDR: totalCost * USD_TO_IDR, messages };
  }
  
  // Process requested items
  for (const req of requestedItems) {
    const category = req.category;
    const qty = req.quantity;
    
    const catItems = remainingItems
      .filter(item => item.category.toLowerCase() === category.toLowerCase())
      .sort((a, b) => a.price - b.price);
    
    if (catItems.length === 0) {
      messages.push(`Tidak ada item untuk kategori ${category}`);
      continue;
    }
    
    let selectedQty = 0;
    for (const item of catItems) {
      if (selectedQty >= qty) break;
      if (totalCost + item.price <= budgetUSD) {
        selected.push(item);
        totalCost += item.price;
        selectedQty++;
        const idx = remainingItems.findIndex(i => i === item);
        if (idx > -1) remainingItems.splice(idx, 1);
      }
    }
    
    if (selectedQty > 0) {
      messages.push(`Menampilkan ${selectedQty} item untuk kategori '${category}'.`);
    }
  }
  
  return { selected, totalCostIDR: totalCost * USD_TO_IDR, messages };
}

// Generate AI response with recommendations
async function generateAIResponse(
  userMessage: string,
  recommendations: { selected: FurnitureItem[]; totalCostIDR: number; messages: string[] },
  budget: number,
  conversationHistory: { role: string; content: string }[]
): Promise<string> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  
  if (!LOVABLE_API_KEY) {
    console.error("LOVABLE_API_KEY is not configured");
    throw new Error("AI service not configured");
  }
  
  const remainingBudget = budget - recommendations.totalCostIDR;
  
  let contextMessage = "";
  if (recommendations.selected.length > 0) {
    contextMessage = `
Berdasarkan algoritma rekomendasi, berikut hasil pencarian furniture:
Budget pengguna: ${formatRupiah(budget)}

Furniture yang direkomendasikan:
${recommendations.selected.map((item, i) => 
  `${i + 1}. ${item.category} - ${formatRupiah(item.price * USD_TO_IDR)} (Material: ${item.material}, Warna: ${item.color})`
).join('\n')}

Total biaya: ${formatRupiah(recommendations.totalCostIDR)}
Sisa budget: ${formatRupiah(remainingBudget)}

Catatan sistem: ${recommendations.messages.join('; ')}
`;
  } else {
    contextMessage = `Pengguna tidak menyebutkan budget spesifik atau kategori furniture. ${recommendations.messages.join('; ')}`;
  }
  
  const systemPrompt = `Kamu adalah Spacely AI, asisten furniture Indonesia yang ramah dan membantu.

TUGAS UTAMA:
1. Bantu pengguna menemukan furniture sesuai budget dan kebutuhan
2. Jika ada rekomendasi dari sistem, presentasikan dengan menarik
3. Berikan saran tambahan yang relevan
4. Gunakan bahasa Indonesia yang natural dan ramah

FORMAT REKOMENDASI:
- Tampilkan setiap item dengan emoji yang sesuai (🪵 table, 💺 chair, 🛋️ sofa, 🗄️ desk, 🛏️ bed)
- Sertakan harga, material, dan warna
- Berikan ringkasan total dan sisa budget

${contextMessage}`;

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: systemPrompt },
        ...conversationHistory.slice(-6),
        { role: "user", content: userMessage }
      ],
      stream: false,
    }),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error("AI Gateway error:", response.status, errorText);
    
    if (response.status === 429) {
      throw new Error("Rate limit exceeded. Silakan coba lagi dalam beberapa saat.");
    }
    if (response.status === 402) {
      throw new Error("Layanan AI memerlukan top-up. Silakan hubungi administrator.");
    }
    throw new Error("Gagal menghubungi layanan AI");
  }
  
  const data = await response.json();
  return data.choices?.[0]?.message?.content || "Maaf, saya tidak dapat memproses permintaan Anda saat ini.";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { message, conversationHistory = [] } = await req.json();
    
    if (!message) {
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    console.log("Processing message:", message);
    
    // Fetch furniture data
    const csvResponse = await fetch(FURNITURE_CSV_URL);
    if (!csvResponse.ok) {
      console.error("Failed to fetch CSV:", csvResponse.status);
      throw new Error("Failed to fetch furniture data");
    }
    
    const csvText = await csvResponse.text();
    const furnitureItems = parseCSV(csvText);
    console.log("Loaded furniture items:", furnitureItems.length);
    
    // Get unique categories
    const categories = [...new Set(furnitureItems.map(item => item.category.toLowerCase()))];
    console.log("Available categories:", categories);
    
    // Parse user request
    const { budget, desired, error: parseError } = parseUserPrompt(message, categories);
    console.log("Parsed - Budget:", budget, "Desired:", desired, "Error:", parseError);
    
    let recommendations = { selected: [] as FurnitureItem[], totalCostIDR: 0, messages: [] as string[] };
    
    if (budget && !parseError) {
      recommendations = selectFurnitureBasedOnRequest(furnitureItems, budget, desired);
      console.log("Recommendations:", recommendations.selected.length, "items");
    }
    
    // Generate AI response
    const aiResponse = await generateAIResponse(
      message,
      recommendations,
      budget || 0,
      conversationHistory
    );
    
    return new Response(
      JSON.stringify({ 
        response: aiResponse,
        recommendations: recommendations.selected.map(item => ({
          ...item,
          priceIDR: item.price * USD_TO_IDR
        })),
        totalCostIDR: recommendations.totalCostIDR,
        budget: budget || 0
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("Error in furniture-chat:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
