export interface Product {
  id: number;
  brand: string;
  name: string;
  nameKh: string;
  category: string;
  categoryKh: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviews: number;
  inStock: boolean;
  isNew: boolean;
  isFeatured: boolean;
  image: string;
  images: string[];
  description: string;
  specs: Record<string, string>;
}

export const products: Product[] = [
  {
    "id": 1,
    "brand": "Apple",
    "name": "iPhone 18 Pro Max 1TB Titanium",
    "nameKh": "iPhone 18 Pro Max 1TB Titanium (Flagship ជំនាន់ថ្មី)",
    "category": "phones",
    "categoryKh": "ទូរសព្ទដៃ",
    "price": 1699,
    "originalPrice": 1799,
    "discount": 6,
    "rating": 5,
    "reviews": 320,
    "inStock": true,
    "isNew": true,
    "isFeatured": true,
    "image": "/products/iphone-18-pro-max.jpg",
    "images": [
      "/products/iphone-18-pro-max.jpg",
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop"
    ],
    "description": "iPhone 18 Pro Max កំពូលស្មាតហ្វូនជំនាន់ថ្មី តួខ្លួន Liquid Titanium កម្រិតអវកាស អេក្រង់ Super Retina XDR 144Hz ProMotion បំពាក់បន្ទះឈីប A20 Pro Bionic និងកាមេរ៉ា 3D Periscope 100x Zoom។",
    "specs": {
      "CPU": "Apple A20 Pro Bionic (2nm ជំនាន់ថ្មី)",
      "GPU": "Apple 8-core Neural GPU",
      "RAM": "16GB Unified LPDDR5X",
      "Storage": "1TB NVMe Superfast",
      "អេក្រង់": "6.9\" Super Retina XDR OLED 144Hz",
      "ថ្ម": "5,200mAh (សាកលឿន 65W & MagSafe)",
      "កាមេរ៉ា": "48MP Main + 48MP Ultra-Wide + 48MP 10x Periscope",
      "ការធានា": "1 ឆ្នាំ Apple ផ្លូវការ"
    }
  },
  {
    "id": 2,
    "brand": "Apple",
    "name": "Apple MacBook Pro 16\" M5 Max",
    "nameKh": "Apple MacBook Pro 16\" M5 Max (កម្លាំងខ្លាំងបំផុត)",
    "category": "laptops",
    "categoryKh": "កុំព្យូទ័រយួរដៃ",
    "price": 3499,
    "originalPrice": 3699,
    "discount": 5,
    "rating": 5,
    "reviews": 189,
    "inStock": true,
    "isNew": true,
    "isFeatured": true,
    "image": "/products/macbook-pro-m5.jpg",
    "images": [
      "/products/macbook-pro-m5.jpg",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop"
    ],
    "description": "MacBook Pro 16\" ជំនាន់ចុងក្រោយបង្អស់ជាមួយ Apple M5 Max chip (16-core CPU, 40-core GPU), អេក្រង់ Tandem Liquid Retina XDR 2000 nits, និងថ្មប្រើបានរហូតដល់ 24 ម៉ោង សម្រាប់ការងារ 3D និង 8K ProRes Video។",
    "specs": {
      "CPU": "Apple M5 Max 16-Core",
      "GPU": "Apple M5 40-Core GPU",
      "RAM": "64GB Unified Memory",
      "SSD": "2TB Superfast SSD",
      "អេក្រង់": "16.2\" Tandem Liquid Retina XDR 120Hz",
      "ថ្ម": "100Wh, រហូតដល់ 24 ម៉ោង",
      "ទម្ងន់": "2.14kg",
      "ការធានា": "1 ឆ្នាំ Apple ផ្លូវការ"
    }
  },
  {
    "id": 3,
    "brand": "Samsung",
    "name": "Samsung Galaxy S25 Ultra 5G",
    "nameKh": "Samsung Galaxy S25 Ultra 5G (Galaxy AI)",
    "category": "phones",
    "categoryKh": "ទូរសព្ទដៃ",
    "price": 1299,
    "originalPrice": 1399,
    "discount": 7,
    "rating": 4.9,
    "reviews": 245,
    "inStock": true,
    "isNew": true,
    "isFeatured": true,
    "image": "/products/samsung-galaxy-s25-ultra.jpg",
    "images": [
      "/products/samsung-galaxy-s25-ultra.jpg",
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&auto=format&fit=crop"
    ],
    "description": "Samsung Galaxy S25 Ultra ជាមួយតួខ្លួន Titanium Armor, ប៊ិច S Pen កាមេរ៉ា 200MP Quad Telephoto និងមុខងារ Galaxy AI ឆ្លាតវៃបំផុត។",
    "specs": {
      "CPU": "Snapdragon 8 Elite (3nm)",
      "RAM": "16GB LPDDR5X",
      "SSD": "512GB UFS 4.0",
      "អេក្រង់": "6.9\" Dynamic AMOLED 2X 1-120Hz",
      "ថ្ម": "5,200mAh (សាក 45W Fast Charging)",
      "កាមេរ៉ា": "200MP Main + 50MP Ultra-Wide + 50MP Periscope + 10MP Tele",
      "ការធានា": "1 ឆ្នាំ Samsung ផ្លូវការ"
    }
  },
  {
    "id": 4,
    "brand": "Samsung",
    "name": "Samsung Galaxy Z Fold 6 AI",
    "nameKh": "Samsung Galaxy Z Fold 6 AI (ទូរសព្ទបត់)",
    "category": "phones",
    "categoryKh": "ទូរសព្ទដៃ",
    "price": 1799,
    "originalPrice": 1999,
    "discount": 10,
    "rating": 4.8,
    "reviews": 132,
    "inStock": true,
    "isNew": true,
    "isFeatured": true,
    "image": "/products/samsung-galaxy-z-fold-6.jpg",
    "images": [
      "/products/samsung-galaxy-z-fold-6.jpg"
    ],
    "description": "Samsung Galaxy Z Fold 6 ទូរសព្ទបត់ស្តើងបំផុត អេក្រង់ភ្លឺ 2600 nits ជាមួយកម្លាំង Snapdragon 8 Gen 3 និង Galaxy AI ពេញលេញ។",
    "specs": {
      "CPU": "Snapdragon 8 Gen 3 for Galaxy",
      "RAM": "12GB",
      "SSD": "512GB",
      "អេក្រង់ខាងក្នុង": "7.6\" Dynamic AMOLED 2X 120Hz",
      "អេក្រង់ខាងក្រៅ": "6.3\" Dynamic AMOLED 2X",
      "ថ្ម": "4,400mAh",
      "ការធានា": "1 ឆ្នាំ Samsung"
    }
  },
  {
    "id": 5,
    "brand": "Apple",
    "name": "Apple iMac 24\" Retina 4.5K M4",
    "nameKh": "Apple iMac 24\" Retina 4.5K M4 (Ocean Blue)",
    "category": "desktops",
    "categoryKh": "កុំព្យូទ័រលើតុ",
    "price": 1399,
    "originalPrice": 1499,
    "discount": 7,
    "rating": 4.9,
    "reviews": 110,
    "inStock": true,
    "isNew": true,
    "isFeatured": true,
    "image": "/products/apple-imac-24-m4.jpg",
    "images": [
      "/products/apple-imac-24-m4.jpg"
    ],
    "description": "Apple iMac 24\" ជំនាន់ M4 ពណ៌ Ocean Blue ស្រស់ស្អាត អេក្រង់ 4.5K Retina Display ថែមជូន Magic Keyboard និង Magic Mouse ពណ៌ដូចគ្នា។",
    "specs": {
      "CPU": "Apple M4 10-core CPU",
      "GPU": "10-core GPU",
      "RAM": "16GB Unified Memory",
      "SSD": "512GB SSD",
      "អេក្រង់": "24\" 4.5K Retina 4480x2520 500 nits",
      "ការធានា": "1 ឆ្នាំ Apple"
    }
  },
  {
    "id": 6,
    "brand": "Apple",
    "name": "Apple Mac mini M4 Pro",
    "nameKh": "Apple Mac mini M4 Pro (កម្លាំងខ្លាំង ទំហំតូច)",
    "category": "desktops",
    "categoryKh": "កុំព្យូទ័រលើតុ",
    "price": 1299,
    "originalPrice": 1399,
    "discount": 7,
    "rating": 4.9,
    "reviews": 140,
    "inStock": true,
    "isNew": true,
    "isFeatured": true,
    "image": "/products/apple-mac-mini-m4.jpg",
    "images": [
      "/products/apple-mac-mini-m4.jpg"
    ],
    "description": "Apple Mac mini M4 Pro ទំហំតូចច្រឡឹង 5x5 អ៊ីញ កម្លាំងខ្លាំងក្លា ច្រក Thunderbolt 5 និងរន្ធ USB-C ខាងមុខ គាំទ្រអេក្រង់រហូតដល់ 3។",
    "specs": {
      "CPU": "Apple M4 Pro 12-core CPU",
      "GPU": "16-core GPU",
      "RAM": "24GB Unified Memory",
      "SSD": "512GB SSD",
      "ច្រកភ្ជាប់": "Thunderbolt 5, HDMI, Front USB-C, Gigabit Ethernet",
      "ការធានា": "1 ឆ្នាំ Apple"
    }
  },
  {
    "id": 7,
    "brand": "Apple",
    "name": "iPad Pro 13\" M4 Tandem OLED",
    "nameKh": "iPad Pro 13\" M4 Tandem OLED (Space Black)",
    "category": "tablets",
    "categoryKh": "ថេប្លេត",
    "price": 1299,
    "originalPrice": 1399,
    "discount": 7,
    "rating": 4.9,
    "reviews": 184,
    "inStock": true,
    "isNew": true,
    "isFeatured": true,
    "image": "/products/ipad-pro-13-m4.jpg",
    "images": [
      "/products/ipad-pro-13-m4.jpg"
    ],
    "description": "iPad Pro 13\" M4 កម្រាស់ត្រឹម 5.1mm អេក្រង់ Ultra Retina XDR Tandem OLED ភ្លឺច្បាស់ 1600 nits និង chip Apple M4 ខ្លាំងមិនគួរឱ្យជឿ។",
    "specs": {
      "CPU": "Apple M4 9-Core",
      "RAM": "8GB Unified",
      "SSD": "256GB",
      "អេក្រង់": "13\" Ultra Retina XDR Tandem OLED 120Hz",
      "ការធានា": "1 ឆ្នាំ Apple"
    }
  },
  {
    "id": 8,
    "brand": "ASUS",
    "name": "ASUS ROG Strix SCAR 16 Gaming",
    "nameKh": "ASUS ROG Strix SCAR 16 (RTX 4080 • 240Hz)",
    "category": "laptops",
    "categoryKh": "កុំព្យូទ័រយួរដៃ",
    "price": 2599,
    "originalPrice": 2899,
    "discount": 10,
    "rating": 4.9,
    "reviews": 95,
    "inStock": true,
    "isNew": true,
    "isFeatured": true,
    "image": "/products/asus-rog-strix-scar16.jpg",
    "images": [
      "/products/asus-rog-strix-scar16.jpg"
    ],
    "description": "ASUS ROG Strix SCAR 16 អេក្រង់ ROG Nebula HDR 2.5K 240Hz Mini-LED, Intel Core i9-14900HX, RTX 4080 12GB កម្លាំងលេងហ្គេមកំពូល។",
    "specs": {
      "CPU": "Intel Core i9-14900HX",
      "GPU": "NVIDIA GeForce RTX 4080 12GB 175W",
      "RAM": "32GB DDR5 5600MHz",
      "SSD": "1TB NVMe Gen4 SSD",
      "អេក្រង់": "16\" Mini-LED 2.5K 240Hz Nebula HDR",
      "ការធានា": "2 ឆ្នាំ ASUS"
    }
  },
  {
    "id": 9,
    "brand": "ASUS",
    "name": "ASUS ROG Strix G16CHR Gaming PC",
    "nameKh": "ASUS ROG Strix G16CHR Gaming PC (RTX 4070)",
    "category": "desktops",
    "categoryKh": "កុំព្យូទ័រលើតុ",
    "price": 1899,
    "originalPrice": 2099,
    "discount": 10,
    "rating": 4.8,
    "reviews": 78,
    "inStock": true,
    "isNew": true,
    "isFeatured": true,
    "image": "/products/asus-rog-strix-pc.jpg",
    "images": [
      "/products/asus-rog-strix-pc.jpg"
    ],
    "description": "ASUS ROG Strix G16CHR Gaming PC កម្លាំងខ្លាំង Intel Core i7-14700F, RTX 4070 12GB, Liquid Cooling និងភ្លើង RGB Aura Sync។",
    "specs": {
      "CPU": "Intel Core i7-14700F",
      "GPU": "NVIDIA GeForce RTX 4070 12GB",
      "RAM": "32GB DDR5 5600MHz",
      "SSD": "1TB NVMe PCIe 4.0",
      "ការធានា": "2 ឆ្នាំ ASUS"
    }
  },
  {
    "id": 10,
    "brand": "DJI",
    "name": "DJI Osmo Pocket 3 Creator Combo",
    "nameKh": "DJI Osmo Pocket 3 Creator Combo",
    "category": "cameras",
    "categoryKh": "កាមេរ៉ា & DJI",
    "price": 669,
    "originalPrice": 729,
    "discount": 8,
    "rating": 4.9,
    "reviews": 215,
    "inStock": true,
    "isNew": true,
    "isFeatured": true,
    "image": "/products/dji-osmo-pocket-3.jpg",
    "images": [
      "/products/dji-osmo-pocket-3.jpg"
    ],
    "description": "DJI Osmo Pocket 3 កាមេរ៉ា Gimbal កាន់ដៃ Sensor 1\" CMOS អេក្រង់បង្វិល OLED 2\" ថតវីដេអូ 4K 120fps D-Log M និងស្ទ្រីមផ្ទាល់។",
    "specs": {
      "Sensor": "1-inch CMOS Sensor",
      "Video": "4K up to 120fps, D-Log M 10-bit",
      "អេក្រង់": "2.0\" Rotatable OLED Touchscreen",
      "ថ្ម": "សាកលឿន 16 នាទីបាន 80%",
      "ការធានា": "1 ឆ្នាំ DJI"
    }
  },
  {
    "id": 11,
    "brand": "DJI",
    "name": "DJI Mic 2 (2 TX + 1 RX + Charging Case)",
    "nameKh": "DJI Mic 2 Wireless Microphone System",
    "category": "accessories",
    "categoryKh": "គ្រឿងបន្លាស់",
    "price": 349,
    "originalPrice": 399,
    "discount": 13,
    "rating": 4.9,
    "reviews": 167,
    "inStock": true,
    "isNew": true,
    "isFeatured": true,
    "image": "/products/dji-mic-2.jpg",
    "images": [
      "/products/dji-mic-2.jpg"
    ],
    "description": "DJI Mic 2 ឈុតមេក្រូឥតខ្សែប្រណិត កាត់បន្ថយសំឡេងរំខាន AI Noise Cancelling ថតសំឡេងផ្ទៃក្នុង 32-bit Float និងចម្ងាយរហូតដល់ 250m។",
    "specs": {
      "Audio": "32-bit Float Internal Recording",
      "Distance": "250m (LOS)",
      "ថ្ម": "រហូតដល់ 18 ម៉ោងជាមួយ Charging Case",
      "ការធានា": "1 ឆ្នាំ DJI"
    }
  },
  {
    "id": 12,
    "brand": "Sony",
    "name": "Sony Alpha A7 IV Full-Frame Camera",
    "nameKh": "Sony Alpha A7 IV Kit 24-70mm GM",
    "category": "cameras",
    "categoryKh": "កាមេរ៉ា & DJI",
    "price": 2499,
    "originalPrice": 2699,
    "discount": 7,
    "rating": 4.9,
    "reviews": 154,
    "inStock": true,
    "isNew": false,
    "isFeatured": true,
    "image": "/products/sony-alpha-a7-iv.jpg",
    "images": [
      "/products/sony-alpha-a7-iv.jpg"
    ],
    "description": "Sony Alpha A7 IV កាមេរ៉ា Full-Frame 33MP BSI CMOS Sensor, ថតវីដេអូ 4K 60p 10-bit 4:2:2, Real-time Eye AF និងកែសម្រួលរូបភាពលំដាប់ខ្ពស់។",
    "specs": {
      "Sensor": "33MP Full-Frame Exmor R CMOS",
      "Video": "4K 60p 10-bit 4:2:2, S-Cinetone",
      "Lens": "FE 24-70mm F2.8 GM",
      "ការធានា": "1 ឆ្នាំ Sony"
    }
  },
  {
    "id": 13,
    "brand": "DJI",
    "name": "DJI Mini 4 Pro Drone Fly More Combo",
    "nameKh": "DJI Mini 4 Pro Drone Fly More Combo Plus (DJI RC 2)",
    "category": "cameras",
    "categoryKh": "កាមេរ៉ា & DJI",
    "price": 959,
    "originalPrice": 1049,
    "discount": 9,
    "rating": 4.9,
    "reviews": 188,
    "inStock": true,
    "isNew": true,
    "isFeatured": true,
    "image": "/products/dji-mini-4-pro.jpg",
    "images": [
      "/products/dji-mini-4-pro.jpg"
    ],
    "description": "DJI Mini 4 Pro ទម្ងន់ក្រោម 249g ថតវីដេអូ 4K/60fps HDR បញ្ឈរពិតៗ ឧបករណ៍ចាប់ឧបសគ្គគ្រប់ទិស Omnidirectional និងតេឡេ DJI RC 2។",
    "specs": {
      "Weight": "< 249g",
      "Video": "4K/60fps HDR True Vertical Shooting",
      "Transmission": "20km FHD Video O4",
      "ថ្ម": "ហោះហើរបាន 34 នាទី/ថ្មមួយ",
      "ការធានា": "1 ឆ្នាំ DJI"
    }
  },
  {
    "id": 14,
    "brand": "ASUS",
    "name": "ASUS Vivobook 15 OLED",
    "nameKh": "ASUS Vivobook 15 OLED (Core i5-13500H)",
    "category": "laptops",
    "categoryKh": "កុំព្យូទ័រយួរដៃ",
    "price": 749,
    "originalPrice": 899,
    "discount": 17,
    "rating": 4.8,
    "reviews": 128,
    "inStock": true,
    "isNew": false,
    "isFeatured": true,
    "image": "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&auto=format&fit=crop",
    "images": [
      "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&auto=format&fit=crop"
    ],
    "description": "ASUS Vivobook 15 OLED អេក្រង់ច្បាស់ត្រជាក់ភ្នែក ពណ៌ត្រឹមត្រូវ 100% DCI-P3 ល្អសម្រាប់ការងារ Office រៀនសូត្រ និង Graphic Design។",
    "specs": {
      "CPU": "Intel Core i5-13500H",
      "RAM": "16GB DDR4",
      "SSD": "512GB NVMe",
      "អេក្រង់": "15.6\" FHD OLED 600 nits",
      "ការធានា": "2 ឆ្នាំ ASUS"
    }
  },
  {
    "id": 15,
    "brand": "Apple",
    "name": "MacBook Air 13\" M3",
    "nameKh": "Apple MacBook Air 13\" M3 (Liquid Retina)",
    "category": "laptops",
    "categoryKh": "កុំព្យូទ័រយួរដៃ",
    "price": 1099,
    "originalPrice": 1199,
    "discount": 8,
    "rating": 4.9,
    "reviews": 312,
    "inStock": true,
    "isNew": false,
    "isFeatured": true,
    "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop",
    "images": [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop"
    ],
    "description": "MacBook Air M3 ជាកុំព្យូទ័រយួរដៃស្តើង ស្រាល ជាមួយ chip Apple M3 ថ្មី និងថ្ម 18ម៉ោង។",
    "specs": {
      "CPU": "Apple M3 8-core CPU",
      "GPU": "10-core GPU",
      "RAM": "8GB Unified",
      "SSD": "256GB SSD",
      "អេក្រង់": "13.6\" Liquid Retina",
      "ការធានា": "1 ឆ្នាំ Apple"
    }
  },
  {
    "id": 16,
    "brand": "Dell",
    "name": "Dell UltraSharp U2723D 27\" 4K Monitor",
    "nameKh": "Dell UltraSharp U2723D 27\" 4K IPS Monitor",
    "category": "monitors",
    "categoryKh": "ម៉ូនីទ័រ",
    "price": 399,
    "originalPrice": 479,
    "discount": 17,
    "rating": 4.8,
    "reviews": 89,
    "inStock": true,
    "isNew": false,
    "isFeatured": true,
    "image": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop",
    "images": [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop"
    ],
    "description": "Dell UltraSharp U2723D ម៉ូនីទ័រ 27 អ៊ីញ 4K IPS Black Technology កម្រិតកម្រិតពណ៌ 98% DCI-P3 សម្រាប់អ្នកឌីហ្សាញអាជីព។",
    "specs": {
      "អេក្រង់": "27\" IPS Black 4K 3840x2160",
      "ច្រកភ្ជាប់": "USB-C Hub (90W PD), HDMI 2.0, DP 1.4",
      "ការធានា": "3 ឆ្នាំ Dell"
    }
  },
  {
    "id": 17,
    "brand": "Logitech",
    "name": "Logitech MX Master 3S Wireless Mouse",
    "nameKh": "Logitech MX Master 3S (Quiet Clicks • 8K DPI)",
    "category": "accessories",
    "categoryKh": "គ្រឿងបន្លាស់",
    "price": 89,
    "originalPrice": 109,
    "discount": 18,
    "rating": 4.9,
    "reviews": 456,
    "inStock": true,
    "isNew": false,
    "isFeatured": false,
    "image": "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop",
    "images": [
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop"
    ],
    "description": "Logitech MX Master 3S កណ្ដុរឥតខ្សែប្រណិត Silent Click និង MagSpeed Scroll wheel ដំណើរការបានគ្រប់ផ្ទៃ សូម្បីលើកញ្ចក់។",
    "specs": {
      "DPI": "8,000 DPI Darkfield sensor",
      "ភ្ជាប់": "Bluetooth, Logi Bolt Receiver",
      "ថ្ម": "70 ថ្ងៃ (សាក 1 នាទីប្រើបាន 3 ម៉ោង)",
      "ការធានា": "1 ឆ្នាំ Logitech"
    }
  },
  {
    "id": 18,
    "brand": "MSI",
    "name": "MSI Raider GE78 HX Gaming",
    "nameKh": "MSI Raider GE78 HX (RTX 4090 • Core i9)",
    "category": "gaming",
    "categoryKh": "ឧបករណ៍ Gaming",
    "price": 2199,
    "originalPrice": 2499,
    "discount": 12,
    "rating": 4.8,
    "reviews": 67,
    "inStock": true,
    "isNew": false,
    "isFeatured": true,
    "image": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop",
    "images": [
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop"
    ],
    "description": "MSI Raider GE78 HX ជា Gaming Laptop លំដាប់កំពូល ជាមួយ RTX 4090 16GB និង Intel i9-14900HX ត្រជាក់ខ្លាំងជាមួយ Cooler Boost 5។",
    "specs": {
      "CPU": "Intel Core i9-14900HX",
      "GPU": "NVIDIA RTX 4090 16GB GDDR6",
      "RAM": "32GB DDR5",
      "SSD": "2TB NVMe Gen4",
      "អេក្រង់": "17.3\" QHD+ 240Hz 100% DCI-P3",
      "ការធានា": "2 ឆ្នាំ MSI"
    }
  },
  {
    "id": 19,
    "brand": "Apple",
    "name": "iPad Pro M4 11\"",
    "nameKh": "Apple iPad Pro 11\" M4 (Ultra Retina XDR)",
    "category": "tablets",
    "categoryKh": "ថេប្លេត",
    "price": 999,
    "originalPrice": 1099,
    "discount": 9,
    "rating": 4.9,
    "reviews": 134,
    "inStock": true,
    "isNew": false,
    "isFeatured": false,
    "image": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop",
    "images": [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop"
    ],
    "description": "iPad Pro M4 11\" ថេប្លេតស្តើងស្រាល អេក្រង់ Tandem OLED ច្បាស់ និង Chip Apple M4 ល្បឿនលឿន។",
    "specs": {
      "CPU": "Apple M4",
      "RAM": "8GB",
      "SSD": "256GB",
      "អេក្រង់": "11\" Ultra Retina XDR OLED",
      "ការធានា": "1 ឆ្នាំ Apple"
    }
  },
  {
    "id": 20,
    "brand": "Lenovo",
    "name": "Lenovo ThinkPad X1 Carbon Gen 12",
    "nameKh": "Lenovo ThinkPad X1 Carbon Gen 12",
    "category": "laptops",
    "categoryKh": "កុំព្យូទ័រយួរដៃ",
    "price": 1349,
    "originalPrice": 1499,
    "discount": 10,
    "rating": 4.8,
    "reviews": 98,
    "inStock": true,
    "isNew": false,
    "isFeatured": false,
    "image": "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&auto=format&fit=crop",
    "images": [
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&auto=format&fit=crop"
    ],
    "description": "Lenovo ThinkPad X1 Carbon Gen 12 ជា Business Laptop ស្រាល និងធន់ល្អបំផុត ជាមួយ Intel Core Ultra 7។",
    "specs": {
      "CPU": "Intel Core Ultra 7 155H",
      "RAM": "16GB LPDDR5X",
      "SSD": "512GB NVMe Gen4",
      "អេក្រង់": "14\" 2.8K OLED 120Hz",
      "ទម្ងន់": "1.09kg",
      "ការធានា": "3 ឆ្នាំ Lenovo"
    }
  },
  {
    "id": 21,
    "brand": "Canon",
    "name": "Canon EOS R50 Mirrorless Camera",
    "nameKh": "Canon EOS R50 Kit RF-S 18-45mm",
    "category": "cameras",
    "categoryKh": "កាមេរ៉ា & DJI",
    "price": 679,
    "originalPrice": 799,
    "discount": 15,
    "rating": 4.8,
    "reviews": 142,
    "inStock": true,
    "isNew": false,
    "isFeatured": false,
    "image": "https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=800&auto=format&fit=crop",
    "images": [
      "https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=800&auto=format&fit=crop"
    ],
    "description": "Canon EOS R50 កាមេរ៉ា Mirrorless តូចច្រឡឹង 24.2MP APS-C Sensor, ថត 4K 30p Uncropped, Dual Pixel AF II ល្អឥតខ្ចោះសម្រាប់ Vloggers។",
    "specs": {
      "Sensor": "24.2MP APS-C CMOS Sensor",
      "Video": "4K 30p (6K oversampling)",
      "AF": "Dual Pixel CMOS AF II",
      "ការធានា": "1 ឆ្នាំ Canon"
    }
  },
  {
    "id": 22,
    "brand": "Nikon",
    "name": "Nikon Z6 III Mirrorless Camera",
    "nameKh": "Nikon Z6 III Body (Partially Stacked Sensor)",
    "category": "cameras",
    "categoryKh": "កាមេរ៉ា & DJI",
    "price": 2499,
    "originalPrice": 2699,
    "discount": 7,
    "rating": 4.9,
    "reviews": 86,
    "inStock": true,
    "isNew": true,
    "isFeatured": false,
    "image": "https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?w=800&auto=format&fit=crop",
    "images": [
      "https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?w=800&auto=format&fit=crop"
    ],
    "description": "Nikon Z6 III បំពាក់ Partially-Stacked Sensor 24.5MP ដំបូងគេ ថតរូប 120 fps ថតវីដេអូ 6K 60p RAW ផ្ទៃក្នុង និង EVF ភ្លឺ 4000 nits។",
    "specs": {
      "Sensor": "24.5MP Partially-Stacked CMOS",
      "Video": "6K 60p N-RAW, 4K 120p",
      "EVF": "5.76M-dot OLED 4000 nits",
      "ការធានា": "1 ឆ្នាំ Nikon"
    }
  },
  {
    "id": 23,
    "brand": "GoPro",
    "name": "GoPro HERO13 Black Action Camera",
    "nameKh": "GoPro HERO13 Black (Magnetic Latch)",
    "category": "cameras",
    "categoryKh": "កាមេរ៉ា & DJI",
    "price": 399,
    "originalPrice": 449,
    "discount": 11,
    "rating": 4.8,
    "reviews": 178,
    "inStock": true,
    "isNew": true,
    "isFeatured": false,
    "image": "/products/gopro-hero13.jpg",
    "images": [
      "/products/gopro-hero13.jpg"
    ],
    "description": "GoPro HERO13 Black កាមេរ៉ាសកម្មភាពចុងក្រោយ ថតវីដេអូ 5.3K 60fps, 400fps Slow-mo, ថ្ម Enduro 1900mAh និងគាំទ្រ HB-Series Lens។",
    "specs": {
      "Video": "5.3K 60fps / 4K 120fps / 2.7K 400fps",
      "Stabilization": "HyperSmooth 6.0 + 360 Horizon Lock",
      "មិនជ្រាបទឹក": "10 ម៉ែត្រដោយគ្មាន Case",
      "ការធានា": "1 ឆ្នាំ GoPro"
    }
  },
  {
    "id": 24,
    "brand": "DJI",
    "name": "DJI Osmo Action 5 Pro",
    "nameKh": "DJI Osmo Action 5 Pro Standard Combo",
    "category": "cameras",
    "categoryKh": "កាមេរ៉ា & DJI",
    "price": 349,
    "originalPrice": 389,
    "discount": 10,
    "rating": 4.8,
    "reviews": 130,
    "inStock": true,
    "isNew": true,
    "isFeatured": false,
    "image": "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop",
    "images": [
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop"
    ],
    "description": "DJI Osmo Action 5 Pro បំពាក់ Next-Gen 1/1.3\" Sensor, 13.5 Stops Dynamic Range, អេក្រង់ OLED ភ្លឺច្បាស់ទាំងមុខក្រោយ និងថ្មប្រើបាន 4 ម៉ោង។",
    "specs": {
      "Sensor": "1/1.3-inch CMOS Sensor 4K 120fps",
      "Screens": "Dual High-Brightness OLED Touchscreens",
      "មិនជ្រាបទឹក": "20 ម៉ែត្រ",
      "ការធានា": "1 ឆ្នាំ DJI"
    }
  },
  {
    "id": 25,
    "brand": "Apple",
    "name": "Apple MacBook Pro 14\" M3 Pro",
    "nameKh": "Apple MacBook Pro 14\" M3 Pro (Space Black)",
    "category": "laptops",
    "categoryKh": "កុំព្យូទ័រយួរដៃ",
    "price": 1899,
    "originalPrice": 2099,
    "discount": 10,
    "rating": 4.9,
    "reviews": 165,
    "inStock": true,
    "isNew": false,
    "isFeatured": false,
    "image": "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop",
    "images": [
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop"
    ],
    "description": "MacBook Pro 14\" M3 Pro កម្លាំងខ្លាំង ពណ៌ Space Black ស្រស់ស្អាត អេក្រង់ Liquid Retina XDR 120Hz ProMotion សម្រាប់ Professional Users។",
    "specs": {
      "CPU": "Apple M3 Pro 11-core CPU",
      "GPU": "14-core GPU",
      "RAM": "18GB Unified Memory",
      "SSD": "512GB SSD",
      "អេក្រង់": "14.2\" Liquid Retina XDR",
      "ការធានា": "1 ឆ្នាំ Apple"
    }
  },
  {
    "id": 26,
    "brand": "ASUS",
    "name": "ASUS ZenBook 14 OLED",
    "nameKh": "ASUS ZenBook 14 OLED (Intel Core Ultra 7)",
    "category": "laptops",
    "categoryKh": "កុំព្យូទ័រយួរដៃ",
    "price": 999,
    "originalPrice": 1099,
    "discount": 9,
    "rating": 4.8,
    "reviews": 142,
    "inStock": true,
    "isNew": false,
    "isFeatured": false,
    "image": "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&auto=format&fit=crop",
    "images": [
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&auto=format&fit=crop"
    ],
    "description": "ASUS ZenBook 14 OLED ស្តើងត្រឹម 14.9mm ទម្ងន់ 1.2kg អេក្រង់ 3K 120Hz OLED ពណ៌ស្រស់ត្រជាក់ភ្នែក និងថ្ម 75Wh ប្រើបានពេញមួយថ្ងៃ។",
    "specs": {
      "CPU": "Intel Core Ultra 7 155H",
      "RAM": "16GB LPDDR5X",
      "SSD": "1TB PCIe 4.0 SSD",
      "អេក្រង់": "14\" 3K OLED 120Hz 0.2ms",
      "ការធានា": "2 ឆ្នាំ ASUS"
    }
  },
  {
    "id": 27,
    "brand": "ASUS",
    "name": "ASUS TUF Gaming A15",
    "nameKh": "ASUS TUF Gaming A15 (RTX 4060 • Ryzen 7)",
    "category": "laptops",
    "categoryKh": "កុំព្យូទ័រយួរដៃ",
    "price": 899,
    "originalPrice": 999,
    "discount": 10,
    "rating": 4.7,
    "reviews": 198,
    "inStock": true,
    "isNew": false,
    "isFeatured": false,
    "image": "https://images.unsplash.com/photo-1542393545-10f5cde2c810?w=800&auto=format&fit=crop",
    "images": [
      "https://images.unsplash.com/photo-1542393545-10f5cde2c810?w=800&auto=format&fit=crop"
    ],
    "description": "ASUS TUF Gaming A15 ធន់កម្រិតស្តង់ដារយោធា MIL-STD-810H បំពាក់ AMD Ryzen 7 7735HS, RTX 4060 8GB និងអេក្រង់ 144Hz G-Sync។",
    "specs": {
      "CPU": "AMD Ryzen 7 7735HS",
      "GPU": "NVIDIA RTX 4060 8GB 140W",
      "RAM": "16GB DDR5",
      "SSD": "512GB PCIe 4.0",
      "អេក្រង់": "15.6\" FHD 144Hz sRGB 100%",
      "ការធានា": "2 ឆ្នាំ ASUS"
    }
  },
  {
    "id": 28,
    "brand": "Dell",
    "name": "Dell XPS 15 InfinityEdge",
    "nameKh": "Dell XPS 15 (Core i7 • OLED 3.5K)",
    "category": "laptops",
    "categoryKh": "កុំព្យូទ័រយួរដៃ",
    "price": 1499,
    "originalPrice": 1699,
    "discount": 12,
    "rating": 4.8,
    "reviews": 87,
    "inStock": true,
    "isNew": false,
    "isFeatured": false,
    "image": "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop",
    "images": [
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop"
    ],
    "description": "Dell XPS 15 តួខ្លួនអាលុយមីញ៉ូម CNC និង Carbon Fiber ស្រស់ស្អាត អេក្រង់ 3.5K OLED InfinityEdge ស្ទើរតែគ្មានគែម។",
    "specs": {
      "CPU": "Intel Core i7-13700H",
      "GPU": "NVIDIA RTX 4050 6GB",
      "RAM": "16GB DDR5",
      "SSD": "1TB NVMe Gen4",
      "អេក្រង់": "15.6\" 3.5K OLED Touch",
      "ការធានា": "2 ឆ្នាំ Dell"
    }
  },
  {
    "id": 29,
    "brand": "Lenovo",
    "name": "Lenovo Legion Pro 5i Gaming",
    "nameKh": "Lenovo Legion Pro 5i (RTX 4070 • 240Hz)",
    "category": "laptops",
    "categoryKh": "កុំព្យូទ័រយួរដៃ",
    "price": 1399,
    "originalPrice": 1549,
    "discount": 10,
    "rating": 4.8,
    "reviews": 112,
    "inStock": true,
    "isNew": false,
    "isFeatured": false,
    "image": "https://images.unsplash.com/photo-1595327656903-2f54937ce09b?w=800&auto=format&fit=crop",
    "images": [
      "https://images.unsplash.com/photo-1595327656903-2f54937ce09b?w=800&auto=format&fit=crop"
    ],
    "description": "Lenovo Legion Pro 5i បំពាក់ប្រព័ន្ធ Legion ColdFront 5.0 ត្រជាក់ស្ងាត់ អេក្រង់ 16\" WQXGA 240Hz PureSight Gaming Display។",
    "specs": {
      "CPU": "Intel Core i7-14650HX",
      "GPU": "NVIDIA RTX 4070 8GB",
      "RAM": "32GB DDR5",
      "SSD": "1TB NVMe",
      "អេក្រង់": "16\" 2.5K 240Hz 500 nits",
      "ការធានា": "2 ឆ្នាំ Lenovo"
    }
  },
  {
    "id": 30,
    "brand": "Acer",
    "name": "Acer Nitro 16 Gaming Laptop",
    "nameKh": "Acer Nitro 16 (Ryzen 7 • RTX 4060)",
    "category": "laptops",
    "categoryKh": "កុំព្យូទ័រយួរដៃ",
    "price": 899,
    "originalPrice": 999,
    "discount": 10,
    "rating": 4.7,
    "reviews": 84,
    "inStock": true,
    "isNew": false,
    "isFeatured": false,
    "image": "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop",
    "images": [
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop"
    ],
    "description": "Acer Nitro 16 អេក្រង់ 16\" 165Hz sRGB 100% ត្រជាក់ខ្លាំងជាមួយ Liquid Metal thermal paste និងកង្ហារភ្លោះ dual-fan cooling។",
    "specs": {
      "CPU": "AMD Ryzen 7 7840HS",
      "GPU": "NVIDIA RTX 4060 8GB",
      "RAM": "16GB DDR5",
      "SSD": "512GB PCIe 4.0",
      "អេក្រង់": "16\" WUXGA 165Hz G-Sync",
      "ការធានា": "2 ឆ្នាំ Acer"
    }
  },
  {
    "id": 31,
    "brand": "HP",
    "name": "HP Omen 16 Gaming Laptop",
    "nameKh": "HP Omen 16 (Core i7 • RTX 4070)",
    "category": "laptops",
    "categoryKh": "កុំព្យូទ័រយួរដៃ",
    "price": 1249,
    "originalPrice": 1399,
    "discount": 11,
    "rating": 4.7,
    "reviews": 76,
    "inStock": true,
    "isNew": false,
    "isFeatured": false,
    "image": "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&auto=format&fit=crop",
    "images": [
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&auto=format&fit=crop"
    ],
    "description": "HP Omen 16 រូបរាងស្អាតបែប Professional Minimalist អេក្រង់ QHD 240Hz សំឡេង Bang & Olufsen និងកម្លាំងលេងហ្គេមរលូន។",
    "specs": {
      "CPU": "Intel Core i7-14700HX",
      "GPU": "NVIDIA RTX 4070 8GB",
      "RAM": "16GB DDR5",
      "SSD": "1TB PCIe 4.0",
      "អេក្រង់": "16.1\" QHD 240Hz 3ms",
      "ការធានា": "2 ឆ្នាំ HP"
    }
  },
  {
    "id": 32,
    "brand": "Dell",
    "name": "Dell Inspiron 24 All-In-One Desktop",
    "nameKh": "Dell Inspiron 24 All-In-One Desktop PC",
    "category": "desktops",
    "categoryKh": "កុំព្យូទ័រលើតុ",
    "price": 799,
    "originalPrice": 899,
    "discount": 11,
    "rating": 4.8,
    "reviews": 62,
    "inStock": true,
    "isNew": false,
    "isFeatured": false,
    "image": "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800&auto=format&fit=crop",
    "images": [
      "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800&auto=format&fit=crop"
    ],
    "description": "Dell Inspiron 24 All-In-One កុំព្យូទ័រលើតុអេក្រង់ 23.8\" FHD IPS Pop-up Camera សំឡេង Waves MaxxAudio Pro រួមបញ្ចូលគ្នាលើតុយ៉ាងស្អាត។",
    "specs": {
      "CPU": "Intel Core i5-1335U",
      "RAM": "16GB DDR4",
      "SSD": "512GB NVMe SSD",
      "អេក្រង់": "23.8\" FHD IPS Anti-Glare",
      "ការធានា": "2 ឆ្នាំ Dell"
    }
  },
  {
    "id": 33,
    "brand": "Apple",
    "name": "iPhone 16 Pro Max 256GB",
    "nameKh": "iPhone 16 Pro Max 256GB (Natural Titanium)",
    "category": "phones",
    "categoryKh": "ទូរសព្ទដៃ",
    "price": 1199,
    "originalPrice": 1299,
    "discount": 8,
    "rating": 4.9,
    "reviews": 320,
    "inStock": true,
    "isNew": false,
    "isFeatured": true,
    "image": "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop",
    "images": [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop"
    ],
    "description": "iPhone 16 Pro Max តួខ្លួន Titanium Grade 5 អេក្រង់ 6.9\" Super Retina XDR ប៊ូតុង Camera Control ថ្មី និង chip A18 Pro លឿនបំផុត។",
    "specs": {
      "CPU": "Apple A18 Pro 6-core",
      "RAM": "8GB",
      "Storage": "256GB NVMe",
      "អេក្រង់": "6.9\" Super Retina XDR 120Hz",
      "ការធានា": "1 ឆ្នាំ Apple"
    }
  },
  {
    "id": 34,
    "brand": "Apple",
    "name": "iPhone 16 128GB",
    "nameKh": "iPhone 16 128GB (Apple Intelligence)",
    "category": "phones",
    "categoryKh": "ទូរសព្ទដៃ",
    "price": 799,
    "originalPrice": 849,
    "discount": 6,
    "rating": 4.8,
    "reviews": 145,
    "inStock": true,
    "isNew": false,
    "isFeatured": false,
    "image": "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop",
    "images": [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop"
    ],
    "description": "iPhone 16 ពណ៌ស្រស់ឆើតឆាយ ប៊ូតុង Action Button & Camera Control, បន្ទះឈីប A18 គាំទ្រមុខងារ Apple Intelligence យ៉ាងពេញលេញ។",
    "specs": {
      "CPU": "Apple A18 6-core",
      "RAM": "8GB",
      "Storage": "128GB",
      "អេក្រង់": "6.1\" Super Retina XDR OLED",
      "ការធានា": "1 ឆ្នាំ Apple"
    }
  },
  {
    "id": 35,
    "brand": "Apple",
    "name": "iPad Air 11\" M2",
    "nameKh": "iPad Air 11\" M2 (Liquid Retina)",
    "category": "tablets",
    "categoryKh": "ថេប្លេត",
    "price": 599,
    "originalPrice": 649,
    "discount": 8,
    "rating": 4.8,
    "reviews": 180,
    "inStock": true,
    "isNew": false,
    "isFeatured": false,
    "image": "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&auto=format&fit=crop",
    "images": [
      "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&auto=format&fit=crop"
    ],
    "description": "iPad Air 11\" M2 កម្លាំងកើនឡើង 50% បើធៀបនឹងជំនាន់មុន គាំទ្រ Apple Pencil Pro និង Magic Keyboard ថ្មី។",
    "specs": {
      "CPU": "Apple M2 8-core CPU",
      "RAM": "8GB",
      "SSD": "128GB",
      "អេក្រង់": "11\" Liquid Retina 500 nits",
      "ការធានា": "1 ឆ្នាំ Apple"
    }
  },
  {
    "id": 36,
    "brand": "Apple",
    "name": "iPad mini 7 A17 Pro",
    "nameKh": "iPad mini 7 (8.3\" A17 Pro Chip)",
    "category": "tablets",
    "categoryKh": "ថេប្លេត",
    "price": 499,
    "originalPrice": 549,
    "discount": 9,
    "rating": 4.8,
    "reviews": 95,
    "inStock": true,
    "isNew": true,
    "isFeatured": false,
    "image": "https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?w=800&auto=format&fit=crop",
    "images": [
      "https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?w=800&auto=format&fit=crop"
    ],
    "description": "iPad mini 7 ទំហំតូចល្មមដៃ 8.3\" Liquid Retina ជាមួយ chip A17 Pro កម្លាំងលេងហ្គេម 3A និងគាំទ្រ Apple Pencil Pro។",
    "specs": {
      "CPU": "Apple A17 Pro 6-core",
      "Storage": "128GB",
      "អេក្រង់": "8.3\" Liquid Retina True Tone",
      "ការធានា": "1 ឆ្នាំ Apple"
    }
  },
  {
    "id": 37,
    "brand": "Apple",
    "name": "iPad 10th Gen 10.9\"",
    "nameKh": "iPad 10th Gen (10.9\" Wi-Fi 64GB)",
    "category": "tablets",
    "categoryKh": "ថេប្លេត",
    "price": 349,
    "originalPrice": 399,
    "discount": 13,
    "rating": 4.8,
    "reviews": 167,
    "inStock": true,
    "isNew": false,
    "isFeatured": false,
    "image": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop",
    "images": [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop"
    ],
    "description": "iPad 10th Gen រូបរាងទំនើប Bezel ស្តើង ច្រក Type-C អេក្រង់ 10.9\" Liquid Retina ពេញនិយមបំផុតសម្រាប់ការរៀន និងមើលកុន។",
    "specs": {
      "CPU": "Apple A14 Bionic",
      "Storage": "64GB",
      "អេក្រង់": "10.9\" Liquid Retina",
      "ការធានា": "1 ឆ្នាំ Apple"
    }
  },
  {
    "id": 38,
    "brand": "Anker",
    "name": "Anker 60W Type-C to Type-C Fast Cable (1m)",
    "nameKh": "ខ្សែសាកល្បឿនលឿន Anker Type-C 60W (សាកល្បង $2)",
    "category": "accessories",
    "categoryKh": "គ្រឿងបន្លាស់",
    "price": 2,
    "originalPrice": 5,
    "discount": 60,
    "rating": 4.9,
    "reviews": 88,
    "inStock": true,
    "isNew": true,
    "isFeatured": true,
    "image": "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop",
    "images": [
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop"
    ],
    "description": "ខ្សែសាក Anker Type-C to Type-C គុណភាពខ្ពស់ កម្លាំង 60W សាកលឿន ធន់មិនងាយដាច់ ពិសេសសាកល្បងទិញ និងបាញ់ប្រាក់ KHQR ត្រឹមតែ $2 ប៉ុណ្ណោះ!",
    "specs": {
      "ប្រវែង": "1 ម៉ែត្រ",
      "កម្លាំង": "60W Fast Charging",
      "រន្ធដោត": "Type-C to Type-C",
      "ការធានា": "6 ខែ"
    }
  },
  {
    "id": 39,
    "brand": "Baseus",
    "name": "Baseus OTG Type-C to USB 3.0 Adapter Metal",
    "nameKh": "ក្បាលបំប្លែង Baseus OTG Type-C to USB 3.0 (សាកល្បង $3)",
    "category": "accessories",
    "categoryKh": "គ្រឿងបន្លាស់",
    "price": 3,
    "originalPrice": 6,
    "discount": 50,
    "rating": 4.8,
    "reviews": 112,
    "inStock": true,
    "isNew": true,
    "isFeatured": true,
    "image": "https://images.unsplash.com/photo-1622445262464-84b14e324513?w=800&auto=format&fit=crop",
    "images": [
      "https://images.unsplash.com/photo-1622445262464-84b14e324513?w=800&auto=format&fit=crop"
    ],
    "description": "ក្បាលបំប្លែង Baseus OTG Type-C ទៅ USB 3.0 តួអាលុយមីញ៉ូម ល្បឿនបញ្ជូនទិន្នន័យ 5Gbps ប្រើជាមួយ Flash Drive, Mouse, Keyboard បានគ្រប់ទូរសព្ទ និងកុំព្យូទ័រ តម្លៃសាកល្បង KHQR ត្រឹម $3!",
    "specs": {
      "តួខ្លួន": "Aluminum Alloy",
      "ល្បឿន": "USB 3.0 5Gbps",
      "មុខងារ": "Plug & Play",
      "ការធានា": "6 ខែ"
    }
  },
  {
    "id": 40,
    "brand": "Hoco",
    "name": "Hoco 9D Privacy Tempered Glass Screen Protector",
    "nameKh": "កញ្ចក់ការពារអេក្រង់ 9D Privacy Hoco (សាកល្បង $5)",
    "category": "accessories",
    "categoryKh": "គ្រឿងបន្លាស់",
    "price": 5,
    "originalPrice": 10,
    "discount": 50,
    "rating": 5,
    "reviews": 145,
    "inStock": true,
    "isNew": true,
    "isFeatured": true,
    "image": "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&auto=format&fit=crop",
    "images": [
      "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&auto=format&fit=crop"
    ],
    "description": "កញ្ចក់ការពារអេក្រង់ 9D Privacy កម្រិតរឹង 9H ការពារអ្នកជិតខាងលួចមើលអេក្រង់ កម្រិតច្បាស់ HD ការពារការបែកនិងឆ្កូតបានយ៉ាងល្អឥតខ្ចោះ តម្លៃសាកល្បង KHQR ត្រឹម $5!",
    "specs": {
      "កម្រិតរឹង": "9H Tempered Glass",
      "មុខងារ": "Anti-Spy 28° Privacy",
      "ភាពស្តើង": "0.33mm Ultra Slim",
      "ការធានា": "ធានាគុណភាព 100%"
    }
  }
];

export const categories = [
  {
    "id": "laptops",
    "nameKh": "កុំព្យូទ័រយួរដៃ",
    "count": 11,
    "image": "/products/macbook-pro-m5.jpg",
    "icon": "💻"
  },
  {
    "id": "desktops",
    "nameKh": "កុំព្យូទ័រលើតុ",
    "count": 4,
    "image": "/products/apple-imac-24-m4.jpg",
    "icon": "🖥️"
  },
  {
    "id": "phones",
    "nameKh": "ទូរសព្ទដៃ",
    "count": 5,
    "image": "/products/iphone-18-pro-max.jpg",
    "icon": "📱"
  },
  {
    "id": "tablets",
    "nameKh": "iPad & ថេប្លេត",
    "count": 5,
    "image": "/products/ipad-pro-13-m4.jpg",
    "icon": "📟"
  },
  {
    "id": "cameras",
    "nameKh": "កាមេរ៉ា & DJI",
    "count": 8,
    "image": "/products/dji-osmo-pocket-3.jpg",
    "icon": "📷"
  },
  {
    "id": "monitors",
    "nameKh": "ម៉ូនីទ័រ",
    "count": 1,
    "image": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop",
    "icon": "🖥️"
  },
  {
    "id": "gaming",
    "nameKh": "ឧបករណ៍ Gaming",
    "count": 2,
    "image": "/products/asus-rog-strix-scar16.jpg",
    "icon": "🎮"
  },
  {
    "id": "accessories",
    "nameKh": "គ្រឿងបន្លាស់ ($2 - $5)",
    "count": 5,
    "image": "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop",
    "icon": "🔌"
  }
];

export const brands = [
  "Apple",
  "Samsung",
  "ASUS",
  "Acer",
  "Dell",
  "HP",
  "Lenovo",
  "MSI",
  "Logitech",
  "Sony",
  "Canon",
  "Nikon",
  "GoPro",
  "DJI",
  "Anker",
  "Baseus",
  "Hoco"
];
