import { Link } from "react-router-dom";
import { Sparkles, Instagram, Facebook, Twitter, Youtube } from "lucide-react";

const footerLinks = {
  Produk: ["Katalog", "AR View", "AI Visualizer", "Konsultasi"],
  Perusahaan: ["Tentang Kami", "Karir", "Blog", "Press Kit"],
  Bantuan: ["FAQ", "Kontak", "Pengiriman", "Pengembalian"],
  Legal: ["Syarat & Ketentuan", "Kebijakan Privasi", "Cookies"],
};

const socialLinks = [
  { icon: Instagram, href: "#" },
  { icon: Facebook, href: "#" },
  { icon: Twitter, href: "#" },
  { icon: Youtube, href: "#" },
];

export function Footer() {
  return (
    <footer className="bg-charcoal text-sand py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-sage flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-heading font-bold text-xl">Spacely</span>
            </Link>
            <p className="text-sand-dark text-sm max-w-xs">
              Platform furniture cerdas dengan AI untuk membantu kamu menemukan
              dan memvisualisasikan furniture impian.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 rounded-lg bg-sand/10 flex items-center justify-center hover:bg-sand/20 transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-heading font-semibold mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-sand-dark hover:text-sand transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-sand/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-sand-dark">
            © 2024 Spacely. All rights reserved.
          </p>
          <p className="text-sm text-sand-dark">
            Made with ❤️ in Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}
