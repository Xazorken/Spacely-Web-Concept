import { motion } from "framer-motion";
import { MessageCircle, Camera, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-living-room.jpg";

interface HeroSectionProps {
  onOpenChat?: () => void;
}

export function HeroSection({ onOpenChat }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-hero">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-sage-light blur-3xl" />
        <div className="absolute bottom-20 left-20 w-80 h-80 rounded-full bg-sand blur-3xl" />
      </div>

      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sage-light text-primary text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              AI-Powered Furniture Discovery
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-foreground leading-tight">
              Temukan Furniture{" "}
              <span className="text-gradient">Sempurna</span> untuk Ruanganmu
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-lg">
              Dengan AI Spacely, visualisasikan furniture di ruanganmu, dapatkan
              rekomendasi sesuai budget, dan konsultasi dengan asisten cerdas kami.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="xl" className="group">
                Mulai Eksplorasi
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="outline" size="xl" onClick={onOpenChat}>
                <MessageCircle className="w-5 h-5" />
                Chat dengan AI
              </Button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-4">
              <div>
                <div className="text-3xl font-heading font-bold text-foreground">10K+</div>
                <div className="text-sm text-muted-foreground">Produk Furniture</div>
              </div>
              <div>
                <div className="text-3xl font-heading font-bold text-foreground">98%</div>
                <div className="text-sm text-muted-foreground">Kepuasan Pelanggan</div>
              </div>
              <div>
                <div className="text-3xl font-heading font-bold text-foreground">24/7</div>
                <div className="text-sm text-muted-foreground">AI Assistance</div>
              </div>
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-lg">
              <img
                src={heroImage}
                alt="Modern living room dengan furniture Spacely"
                className="w-full h-auto object-cover"
              />
              
              {/* Floating Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="absolute bottom-6 left-6 right-6 glass rounded-2xl p-4 border border-border/50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-sage flex items-center justify-center">
                    <Camera className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-foreground">Upload Foto Ruangan</div>
                    <div className="text-sm text-muted-foreground">Lihat visualisasi furniture dengan AI</div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </motion.div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-2xl bg-terracotta/20 blur-xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 rounded-full bg-sage/20 blur-xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
