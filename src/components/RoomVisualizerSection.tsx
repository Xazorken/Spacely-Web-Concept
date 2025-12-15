import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Camera, Upload, Sparkles, ArrowRight, X, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import emptyRoomImg from "@/assets/empty-room.jpg";

export function RoomVisualizerSection() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVisualize = () => {
    setIsProcessing(true);
    // Simulate AI processing
    setTimeout(() => {
      setIsProcessing(false);
    }, 3000);
  };

  const clearImage = () => {
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <section id="visualizer" className="py-24 bg-cream">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sage-light text-primary text-sm font-medium">
              <Camera className="w-4 h-4" />
              AI Room Visualizer
            </div>

            <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground">
              Visualisasikan Furniture di Ruanganmu
            </h2>

            <p className="text-lg text-muted-foreground">
              Upload foto ruangan kosong atau yang ingin di-redesign. AI kami akan
              memberikan visualisasi furniture yang cocok dengan ruangan dan budget kamu.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-sage flex items-center justify-center flex-shrink-0">
                  <Upload className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-foreground">
                    Upload Foto Ruangan
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Foto kamar tidur, ruang tamu, atau area manapun
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-sage flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-foreground">
                    AI Menganalisis Ruangan
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Deteksi dimensi, pencahayaan, dan gaya yang cocok
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-accent flex items-center justify-center flex-shrink-0">
                  <ImageIcon className="w-5 h-5 text-accent-foreground" />
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-foreground">
                    Lihat Hasil Visualisasi
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Preview furniture di ruanganmu dengan AR view
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right - Upload Area */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-card rounded-3xl p-6 border border-border shadow-md">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />

              {!uploadedImage ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative aspect-[4/3] rounded-2xl border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer overflow-hidden group"
                >
                  <img
                    src={emptyRoomImg}
                    alt="Contoh ruangan kosong"
                    className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6">
                    <div className="w-16 h-16 rounded-2xl bg-sage-light flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Camera className="w-8 h-8 text-primary" />
                    </div>
                    <div className="text-center">
                      <p className="font-heading font-semibold text-foreground">
                        Upload Foto Ruangan
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Drag & drop atau klik untuk memilih
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="mt-2">
                      Pilih File
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                    <img
                      src={uploadedImage}
                      alt="Uploaded room"
                      className="w-full h-full object-cover"
                    />
                    <Button
                      variant="glass"
                      size="icon-sm"
                      className="absolute top-3 right-3 rounded-full"
                      onClick={clearImage}
                    >
                      <X className="w-4 h-4" />
                    </Button>

                    {isProcessing && (
                      <div className="absolute inset-0 bg-charcoal/60 flex items-center justify-center">
                        <div className="text-center space-y-3">
                          <div className="w-12 h-12 rounded-full border-4 border-primary-foreground/30 border-t-primary-foreground animate-spin mx-auto" />
                          <p className="text-primary-foreground font-medium">
                            AI sedang menganalisis...
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <Button
                    variant="hero"
                    size="lg"
                    className="w-full"
                    onClick={handleVisualize}
                    disabled={isProcessing}
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    {isProcessing ? "Memproses..." : "Visualisasikan dengan AI"}
                    {!isProcessing && <ArrowRight className="w-5 h-5 ml-2" />}
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
