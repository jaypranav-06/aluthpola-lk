import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, CreditCard, Building2, Smartphone, Banknote } from "lucide-react";

const LINKS = {
  Company:  [
    { label: "About Us",    href: "/about" },
    { label: "Careers",     href: "/careers" },
    { label: "Press",       href: "/press" },
    { label: "Blog",        href: "/blog" },
  ],
  Help:     [
    { label: "Help Center",   href: "/help" },
    { label: "FAQ",           href: "/faq" },
    { label: "Track Order",   href: "/track" },
    { label: "Returns",       href: "/returns" },
  ],
  Sellers:  [
    { label: "Sell on Aluthpola", href: "/seller" },
    { label: "Seller Center",     href: "/seller/center" },
    { label: "Seller Login",      href: "/seller/login" },
    { label: "Partner Program",   href: "/partners" },
  ],
  Legal:    [
    { label: "Privacy Policy",  href: "/privacy" },
    { label: "Terms of Use",    href: "/terms" },
    { label: "Cookie Policy",   href: "/cookies" },
    { label: "Refund Policy",   href: "/refunds" },
  ],
};

const PAYMENT_ICONS = [CreditCard, Building2, Smartphone, Banknote];
const SOCIALS = [
  { icon: Facebook,  href: "#", color: "#1877f2" },
  { icon: Instagram, href: "#", color: "#e1306c" },
  { icon: Twitter,   href: "#", color: "#1da1f2" },
  { icon: Youtube,   href: "#", color: "#ff0000" },
];

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-10">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-lg"
                style={{ background: "linear-gradient(135deg,#f97316,#fb923c)" }}>
                A
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                Aluthpola<span style={{ color: "#f97316" }}>.lk</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              Sri Lanka's trusted online marketplace. Discover thousands of products from verified sellers — delivered to your door.
            </p>
            <div className="flex flex-col gap-2 text-sm">
              <a href="mailto:support@aluthpola.lk" className="flex items-center gap-2 text-gray-400 hover:text-orange-400 transition-colors">
                <Mail className="w-4 h-4 flex-shrink-0" /> support@aluthpola.lk
              </a>
              <a href="tel:+94112345678" className="flex items-center gap-2 text-gray-400 hover:text-orange-400 transition-colors">
                <Phone className="w-4 h-4 flex-shrink-0" /> +94 11 234 5678
              </a>
              <span className="flex items-center gap-2 text-gray-400">
                <MapPin className="w-4 h-4 flex-shrink-0" /> Colombo, Sri Lanka
              </span>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-bold text-sm mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href}
                      className="text-sm text-gray-400 hover:text-orange-400 transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            &copy; 2026 Aluthpola.lk. All rights reserved.
          </p>

          {/* Payment icons */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 mr-1">We accept:</span>
            {PAYMENT_ICONS.map((Icon, i) => (
              <span key={i} className="w-9 h-6 bg-gray-800 rounded flex items-center justify-center">
                <Icon className="w-3.5 h-3.5 text-gray-400" />
              </span>
            ))}
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-2">
            {SOCIALS.map(({ icon: Icon, href, color }) => (
              <a key={color} href={href}
                className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center hover:scale-110 transition-all"
                style={{ "--hover-color": color } as React.CSSProperties}>
                <Icon className="w-4 h-4 text-gray-400 hover:text-white" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
