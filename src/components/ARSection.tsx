import { motion } from "framer-motion";
import { Smartphone, View, Rotate3D, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ARSection() {
  return (
    <section id="ar" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-terracotta/10 text-terracotta text-sm font-medium mb-4">
            <View className="w-4 h-4" />
            Augmented Reality
          </div>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
            Lihat Furniture di Ruanganmu dengan AR
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Gunakan kamera smartphone untuk melihat bagaimana furniture akan terlihat
            di ruangan asli sebelum membelinya
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Smartphone,
              title: "Scan Ruangan",
              description:
                "Arahkan kamera smartphone ke ruangan yang ingin kamu isi furniture",
            },
            {
              icon: Rotate3D,
              title: "Pilih & Posisikan",
              description:
                "Pilih furniture dari katalog dan posisikan di mana saja dalam ruangan",
            },
            {
              icon: View,
              title: "Preview Realistis",
              description:
                "Lihat visualisasi 3D realistis dengan pencahayaan yang akurat",
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-8 rounded-3xl bg-card border border-border hover:shadow-md transition-all"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-accent flex items-center justify-center mx-auto mb-6">
                <feature.icon className="w-8 h-8 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-4 p-6 rounded-3xl bg-card border border-border">
            <div className="w-12 h-12 rounded-xl bg-gradient-sage flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="text-left">
              <p className="font-heading font-semibold text-foreground">
                Download Spacely AR App
              </p>
              <p className="text-sm text-muted-foreground">
                Tersedia untuk iOS dan Android
              </p>
            </div>
            <Button variant="accent" size="lg">
              Coming Soon
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
