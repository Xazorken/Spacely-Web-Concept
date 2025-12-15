import { Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FurnitureItem {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  rating: number;
}

interface FurnitureCardProps {
  item: FurnitureItem;
  viewMode: "grid" | "list";
}

export function FurnitureCard({ item, viewMode }: FurnitureCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (viewMode === "list") {
    return (
      <div className="flex gap-6 bg-card rounded-2xl p-4 border border-border hover:shadow-md transition-all duration-300">
        <div className="w-40 h-40 rounded-xl overflow-hidden flex-shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <span className="text-xs font-medium text-primary bg-sage-light px-2 py-1 rounded-full">
              {item.category}
            </span>
            <h3 className="text-xl font-heading font-semibold text-foreground mt-2">
              {item.name}
            </h3>
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-4 h-4 fill-terracotta text-terracotta" />
              <span className="text-sm text-muted-foreground">{item.rating}</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <span className="text-2xl font-heading font-bold text-foreground">
              {formatPrice(item.price)}
            </span>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon">
                <Heart className="w-5 h-5" />
              </Button>
              <Button variant="hero" size="default">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Tambah
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Quick Actions */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
          <Button variant="glass" size="icon-sm" className="rounded-full">
            <Heart className="w-4 h-4" />
          </Button>
          <Button variant="glass" size="icon-sm" className="rounded-full">
            <ShoppingCart className="w-4 h-4" />
          </Button>
        </div>

        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
          <Button variant="hero" className="w-full">
            Lihat Detail
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-2">
        <span className="text-xs font-medium text-primary">{item.category}</span>
        <h3 className="font-heading font-semibold text-foreground line-clamp-1">
          {item.name}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-lg font-heading font-bold text-foreground">
            {formatPrice(item.price)}
          </span>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-terracotta text-terracotta" />
            <span className="text-sm text-muted-foreground">{item.rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
