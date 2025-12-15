import { useState } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, Grid3X3, LayoutList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { FurnitureCard } from "./FurnitureCard";

import armchairImg from "@/assets/furniture/armchair-sage.jpg";
import diningTableImg from "@/assets/furniture/dining-table.jpg";
import lampImg from "@/assets/furniture/lamp-terracotta.jpg";
import sofaImg from "@/assets/furniture/sofa-cream.jpg";

const furnitureData = [
  {
    id: 1,
    name: "Nordic Velvet Armchair",
    category: "Kursi",
    price: 2850000,
    image: armchairImg,
    rating: 4.8,
  },
  {
    id: 2,
    name: "Oak Dining Table",
    category: "Meja",
    price: 4500000,
    image: diningTableImg,
    rating: 4.9,
  },
  {
    id: 3,
    name: "Terra Ceramic Lamp",
    category: "Lampu",
    price: 890000,
    image: lampImg,
    rating: 4.7,
  },
  {
    id: 4,
    name: "Cloud Comfort Sofa",
    category: "Sofa",
    price: 8900000,
    image: sofaImg,
    rating: 4.9,
  },
];

const categories = ["Semua", "Sofa", "Kursi", "Meja", "Lampu", "Storage"];

export function CatalogSection() {
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const filteredFurniture = furnitureData.filter((item) => {
    const matchesPrice = item.price >= priceRange[0] && item.price <= priceRange[1];
    const matchesCategory = activeCategory === "Semua" || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPrice && matchesCategory && matchesSearch;
  });

  return (
    <section id="catalog" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
            Katalog Furniture
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Cari furniture sesuai budget dan gaya yang kamu inginkan
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl p-6 mb-8 shadow-sm border border-border"
        >
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Cari furniture..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 bg-background"
              />
            </div>

            {/* Price Range */}
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  Budget Range
                </span>
                <span className="font-medium text-foreground">
                  {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                </span>
              </div>
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                min={0}
                max={10000000}
                step={100000}
                className="py-2"
              />
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="w-5 h-5" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <LayoutList className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mt-6">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "secondary"}
                size="sm"
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Products Grid */}
        <div
          className={`grid gap-6 ${
            viewMode === "grid"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
              : "grid-cols-1"
          }`}
        >
          {filteredFurniture.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <FurnitureCard item={item} viewMode={viewMode} />
            </motion.div>
          ))}
        </div>

        {filteredFurniture.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Tidak ada furniture yang sesuai dengan filter. Coba ubah kriteria pencarian.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
