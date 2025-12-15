import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { CatalogSection } from "@/components/CatalogSection";
import { RoomVisualizerSection } from "@/components/RoomVisualizerSection";
import { ARSection } from "@/components/ARSection";
import { Footer } from "@/components/Footer";
import { ChatBot } from "@/components/ChatBot";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <CatalogSection />
        <RoomVisualizerSection />
        <ARSection />
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
};

export default Index;
