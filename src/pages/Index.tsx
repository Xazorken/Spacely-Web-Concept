import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { CatalogSection } from "@/components/CatalogSection";
import { RoomVisualizerSection } from "@/components/RoomVisualizerSection";
import { ARSection } from "@/components/ARSection";
import { Footer } from "@/components/Footer";
import { ChatBot } from "@/components/ChatBot";

const Index = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection onOpenChat={() => setIsChatOpen(true)} />
        <CatalogSection />
        <RoomVisualizerSection />
        <ARSection />
      </main>
      <Footer />
      <ChatBot isOpen={isChatOpen} onOpenChange={setIsChatOpen} />
    </div>
  );
};

export default Index;
