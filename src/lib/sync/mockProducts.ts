// Mock product data generators for different platforms

interface MockProduct {
  name: string;
  description: string;
  price: number; // in LKR
  stock: number;
  category: string;
  image_url: string;
}

const AMAZON_PRODUCTS: MockProduct[] = [
  {
    name: "Apple AirPods Pro (2nd Generation)",
    description: "Active Noise Cancellation, Adaptive Transparency, Personalized Spatial Audio with dynamic head tracking",
    price: 80000,
    stock: 50,
    category: "Audio",
    image_url: "https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_SL1500_.jpg",
  },
  {
    name: "Samsung Galaxy Buds2 Pro",
    description: "True Wireless Bluetooth Earbuds, Noise Cancelling, Hi-Fi Sound, 360 Audio",
    price: 55000,
    stock: 35,
    category: "Audio",
    image_url: "https://images.samsung.com/is/image/samsung/p6pim/my/2202/gallery/my-galaxy-buds2-pro-r510-sm-r510nzaaxtc-thumb-531850697",
  },
  {
    name: "Logitech MX Master 3S Wireless Mouse",
    description: "Ergonomic, 8K DPI, Quiet Clicks, USB-C, Bluetooth, Multi-Device, Compatible with Mac, PC, iPad",
    price: 32000,
    stock: 75,
    category: "Accessories",
    image_url: "https://resource.logitechg.com/w_692,c_lpad,ar_4:3,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/mx-master-3s/gallery/mx-master-3s-gallery-graphite-1.png",
  },
  {
    name: "Anker PowerCore 20100mAh Power Bank",
    description: "Ultra-High Capacity Portable Charger with 4.8A Output and PowerIQ Technology",
    price: 12500,
    stock: 120,
    category: "Accessories",
    image_url: "https://m.media-amazon.com/images/I/61V4ioK9MqL._AC_SL1500_.jpg",
  },
  {
    name: "Kindle Paperwhite (16 GB)",
    description: "Now with a 6.8 display and adjustable warm light, Waterproof",
    price: 45000,
    stock: 40,
    category: "Electronics",
    image_url: "https://m.media-amazon.com/images/I/51QCk82iGcL._AC_SL1000_.jpg",
  },
];

const ALIEXPRESS_PRODUCTS: MockProduct[] = [
  {
    name: "Xiaomi Redmi Buds 4 Pro TWS Earphones",
    description: "Active Noise Cancellation, Wireless Charging, 43dB ANC, Touch Control",
    price: 18500,
    stock: 200,
    category: "Audio",
    image_url: "https://ae01.alicdn.com/kf/S0e5c3d3e3d5c4c5f9d5e5f5e5f5e5f5f/Xiaomi-Redmi-Buds-4-Pro.jpg",
  },
  {
    name: "SANLEPUS Smart Watch with Bluetooth Call",
    description: "1.85 HD Screen, Heart Rate Monitor, 100+ Sport Modes, IP68 Waterproof",
    price: 8500,
    stock: 350,
    category: "Wearables",
    image_url: "https://ae01.alicdn.com/kf/S6d6a6b6a6b6a6b6a6b6a6b6a6b6a6b6a/SANLEPUS-Smart-Watch.jpg",
  },
  {
    name: "Baseus 100W USB C Cable 5A Fast Charging",
    description: "Type C to Type C PD Cable for MacBook Pro, Samsung Galaxy, iPad Pro",
    price: 2500,
    stock: 500,
    category: "Accessories",
    image_url: "https://ae01.alicdn.com/kf/H1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a/Baseus-USB-C-Cable.jpg",
  },
  {
    name: "Mini Portable Bluetooth Speaker",
    description: "Wireless Loudspeaker Sound System, 10W Stereo Music, Waterproof Outdoor",
    price: 4500,
    stock: 280,
    category: "Audio",
    image_url: "https://ae01.alicdn.com/kf/H2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b/Mini-Bluetooth-Speaker.jpg",
  },
  {
    name: "Wireless Gaming Mouse RGB LED 7200DPI",
    description: "Rechargeable Silent Mouse with 6 Buttons for PC Laptop Gamer",
    price: 3800,
    stock: 180,
    category: "Gaming",
    image_url: "https://ae01.alicdn.com/kf/H3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c/Gaming-Mouse-RGB.jpg",
  },
];

const TEMU_PRODUCTS: MockProduct[] = [
  {
    name: "LED Strip Lights 10M RGB Color Changing",
    description: "Smart WiFi LED Light Strip with Remote Control, Music Sync, App Control",
    price: 3200,
    stock: 450,
    category: "Home & Living",
    image_url: "https://img.kwcdn.com/product/fancy/led-strip-lights.jpg",
  },
  {
    name: "Portable Handheld Mini Fan",
    description: "USB Rechargeable Personal Fan with 3 Speeds, Foldable Desk Fan",
    price: 1800,
    stock: 600,
    category: "Home & Living",
    image_url: "https://img.kwcdn.com/product/fancy/mini-fan.jpg",
  },
  {
    name: "Phone Ring Holder Stand 360° Rotation",
    description: "Metal Finger Ring Grip Kickstand for iPhone, Samsung, Universal",
    price: 850,
    stock: 800,
    category: "Accessories",
    image_url: "https://img.kwcdn.com/product/fancy/phone-ring.jpg",
  },
  {
    name: "Wireless Earbuds Bluetooth 5.3 Headphones",
    description: "HD Stereo Sound, IPX7 Waterproof, 40H Playtime, LED Display",
    price: 5500,
    stock: 320,
    category: "Audio",
    image_url: "https://img.kwcdn.com/product/fancy/wireless-earbuds.jpg",
  },
  {
    name: "Laptop Stand Adjustable Aluminum",
    description: "Ergonomic Notebook Holder for MacBook Pro Air, Dell, HP 10-17 inches",
    price: 6800,
    stock: 150,
    category: "Accessories",
    image_url: "https://img.kwcdn.com/product/fancy/laptop-stand.jpg",
  },
];

const EBAY_PRODUCTS: MockProduct[] = [
  {
    name: "Sony WH-1000XM5 Wireless Headphones",
    description: "Industry Leading Noise Canceling, 30Hr Battery, Multipoint Connection",
    price: 95000,
    stock: 25,
    category: "Audio",
    image_url: "https://i.ebayimg.com/images/g/sony-wh-1000xm5.jpg",
  },
  {
    name: "GoPro HERO11 Black Action Camera",
    description: "5.3K60 Ultra HD Video, 27MP Photos, Waterproof, HyperSmooth 5.0",
    price: 125000,
    stock: 15,
    category: "Cameras",
    image_url: "https://i.ebayimg.com/images/g/gopro-hero11.jpg",
  },
  {
    name: "Mechanical Gaming Keyboard RGB Backlit",
    description: "Blue Switches, Anti-Ghosting, Wired USB, 104 Keys, for PC Mac",
    price: 15500,
    stock: 85,
    category: "Gaming",
    image_url: "https://i.ebayimg.com/images/g/gaming-keyboard.jpg",
  },
  {
    name: "iPad Pro 11-inch Wi-Fi 128GB (Refurbished)",
    description: "Apple M2 chip, Liquid Retina Display, 12MP Camera, USB-C",
    price: 185000,
    stock: 10,
    category: "Tablets",
    image_url: "https://i.ebayimg.com/images/g/ipad-pro-11.jpg",
  },
  {
    name: "Bose SoundLink Flex Bluetooth Speaker",
    description: "Waterproof Portable Speaker, Wireless, Up to 12 Hours Battery Life",
    price: 42000,
    stock: 30,
    category: "Audio",
    image_url: "https://i.ebayimg.com/images/g/bose-soundlink.jpg",
  },
];

export function getMockProductsByPlatform(platform: string): MockProduct[] {
  switch (platform.toLowerCase()) {
    case "amazon":
      return AMAZON_PRODUCTS;
    case "aliexpress":
      return ALIEXPRESS_PRODUCTS;
    case "temu":
      return TEMU_PRODUCTS;
    case "ebay":
      return EBAY_PRODUCTS;
    default:
      return [];
  }
}

export function getPlatformName(platform: string): string {
  const names: { [key: string]: string } = {
    amazon: "Amazon",
    aliexpress: "AliExpress",
    temu: "Temu",
    ebay: "eBay",
    shopify: "Shopify",
    custom: "Custom",
  };
  return names[platform.toLowerCase()] || platform;
}
