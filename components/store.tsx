'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useState, createContext, useContext, useId } from 'react'
import { ShoppingCart, Cpu, Menu, X, Search, ArrowRight, Plus, Minus, Trash2, CheckCircle2, Mail, Phone, MapPin, Zap, Monitor, ShieldCheck, Truck, Gamepad2 } from 'lucide-react'

// --- Custom Social Media Icons (Lucide-styled SVGs) ---
function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  )
}

function TelegramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"></line>
      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
  )
}

type Product = { id: string; name: string; category: string; price: number; oldPrice?: number; specs: string; image: string }
type CartItem = Product & { qty: number }
const products: Product[] = [
  // --- Graphics Cards (8) ---
  { id: 'gpu-4070s', name: 'GeForce RTX 4070 SUPER', category: 'Graphics Cards', price: 599, oldPrice: 649, specs: '12GB GDDR6X · DLSS 3.5', image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=600&q=80' },
  { id: 'gpu-4090', name: 'GeForce RTX 4090 OC', category: 'Graphics Cards', price: 1699, oldPrice: 1799, specs: '24GB GDDR6X · DLSS 3.5', image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=600&q=80' },
  { id: 'gpu-4080s', name: 'GeForce RTX 4080 SUPER', category: 'Graphics Cards', price: 999, specs: '16GB GDDR6X · DLSS 3.5', image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=600&q=80' },
  { id: 'gpu-4070ti-s', name: 'GeForce RTX 4070 Ti SUPER', category: 'Graphics Cards', price: 799, oldPrice: 849, specs: '16GB GDDR6X · DLSS 3', image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=600&q=80' },
  { id: 'gpu-4060ti', name: 'GeForce RTX 4060 Ti 16GB', category: 'Graphics Cards', price: 449, specs: '16GB GDDR6 · DLSS 3', image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=600&q=80' },
  { id: 'gpu-7900xtx', name: 'Radeon RX 7900 XTX', category: 'Graphics Cards', price: 929, oldPrice: 999, specs: '24GB GDDR6 · DisplayPort 2.1', image: '' },
  { id: 'gpu-7800xt', name: 'Radeon RX 7800 XT', category: 'Graphics Cards', price: 499, oldPrice: 529, specs: '16GB GDDR6 · RDNA 3', image: '' },
  { id: 'gpu-7700xt', name: 'Radeon RX 7700 XT', category: 'Graphics Cards', price: 399, specs: '12GB GDDR6 · RDNA 3', image: '' },

  // --- Processors (8) ---
  { id: 'cpu-7800x3d', name: 'AMD Ryzen 7 7800X3D', category: 'Processors', price: 349, oldPrice: 399, specs: '8 Cores · 4.2GHz · AM5 · 3D V-Cache', image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=600&q=80' },
  { id: 'cpu-14900k', name: 'Intel Core i9-14900K', category: 'Processors', price: 549, oldPrice: 589, specs: '24 Cores · 6.0GHz · LGA1700', image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=600&q=80' },
  { id: 'cpu-7950x3d', name: 'AMD Ryzen 9 7950X3D', category: 'Processors', price: 629, specs: '16 Cores · 5.7GHz · AM5', image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=600&q=80' },
  { id: 'cpu-14700k', name: 'Intel Core i7-14700K', category: 'Processors', price: 389, oldPrice: 419, specs: '20 Cores · 5.6GHz · LGA1700', image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=600&q=80' },
  { id: 'cpu-7600x', name: 'AMD Ryzen 5 7600X', category: 'Processors', price: 209, oldPrice: 249, specs: '6 Cores · 4.7GHz · AM5', image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=600&q=80' },
  { id: 'cpu-14600k', name: 'Intel Core i5-14600K', category: 'Processors', price: 289, specs: '14 Cores · 5.3GHz · LGA1700', image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=600&q=80' },
  { id: 'cpu-7900x', name: 'AMD Ryzen 9 7900X', category: 'Processors', price: 419, oldPrice: 469, specs: '12 Cores · 5.6GHz · AM5', image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=600&q=80' },
  { id: 'cpu-13400f', name: 'Intel Core i5-13400F', category: 'Processors', price: 199, specs: '10 Cores · 4.6GHz · LGA1700', image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=600&q=80' },

  // --- Memory (6) ---
  { id: 'ram-ddr5-32', name: 'Vengeance DDR5 32GB', category: 'Memory', price: 109, specs: '6000MHz · CL30 · 2×16GB', image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=600&q=80' },
  { id: 'ram-ddr5-rgb', name: 'Trident Z5 RGB DDR5 64GB', category: 'Memory', price: 219, oldPrice: 249, specs: '6400MHz · CL32 · 2×32GB', image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=600&q=80' },
  { id: 'ram-fury-ddr4', name: 'Beast DDR4 32GB', category: 'Memory', price: 69, specs: '3600MHz · CL16 · 2×16GB', image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=600&q=80' },
  { id: 'ram-dominator', name: 'Dominator Titanium DDR5 64GB', category: 'Memory', price: 309, specs: '7200MHz · CL34 · 2×32GB', image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=600&q=80' },
  { id: 'ram-fury-ddr5', name: 'Fury Beast DDR5 32GB', category: 'Memory', price: 115, specs: '5600MHz · CL36 · 2×16GB', image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=600&q=80' },
  { id: 'ram-delta-rgb', name: 'T-Force Delta RGB DDR5 32GB', category: 'Memory', price: 119, oldPrice: 135, specs: '6000MHz · White · 2×16GB', image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=600&q=80' },

  // --- Storage (6) ---
  { id: 'ssd-990-2tb', name: '990 PRO NVMe 2TB', category: 'Storage', price: 159, oldPrice: 189, specs: 'PCIe 4.0 · Up to 7,450MB/s', image: '' },
  { id: 'ssd-sn850x', name: 'WD_BLACK SN850X 4TB', category: 'Storage', price: 299, oldPrice: 349, specs: 'PCIe 4.0 · Up to 7,300MB/s', image: '' },
  { id: 'ssd-crucial-t700', name: 'Crucial T700 Gen5 2TB', category: 'Storage', price: 269, specs: 'PCIe 5.0 · Up to 12,400MB/s', image: '' },
  { id: 'ssd-990-1tb', name: '990 PRO NVMe 1TB', category: 'Storage', price: 99, specs: 'PCIe 4.0 · Up to 7,450MB/s', image: '' },
  { id: 'ssd-mp33-2tb', name: 'TeamGroup MP33 2TB NVMe', category: 'Storage', price: 95, oldPrice: 110, specs: 'PCIe 3.0 · Up to 1,800MB/s', image: '' },
  { id: 'ssd-pinnacle-4tb', name: 'Sabrent Rocket 4 Plus 4TB', category: 'Storage', price: 349, specs: 'PCIe 4.0 · High Performance', image: '' },

  // --- Keyboards (8) ---
  { id: 'kb-keychron-q1', name: 'Keychron Q1 Pro Mechanical Keyboard', category: 'Keyboards', price: 199, oldPrice: 219, specs: '75% Layout · Wireless Bluetooth · Hot-Swappable', image: 'https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcSo4LlqalAxAZtVp9iZKKA0g9-m9pWljpA-iniU5t4OrZ9vBdnjd4cdDdxcyFYXem4gP5X0pejTzN1x0rQ' },
  { id: 'kb-wooting-60he', name: 'Wooting 60HE Hall Effect', category: 'Keyboards', price: 174, specs: 'Analog Switches · Rapid Trigger · 60%', image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=600&q=80' },
  { id: 'kb-logi-g915', name: 'Logitech G915 LIGHTSPEED', category: 'Keyboards', price: 209, oldPrice: 249, specs: 'Low Profile · Mechanical · Lightsync RGB', image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80' },
  { id: 'kb-corsair-k100', name: 'Corsair K100 RGB Optical', category: 'Keyboards', price: 229, specs: 'OPX Switches · Elgato Stream Deck Key', image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=600&q=80' },
  { id: 'kb-razer-huntsman-v3', name: 'Razer Huntsman V3 Pro TKL', category: 'Keyboards', price: 219, specs: 'Analog Optical · Gen-2 Switches · TKL', image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80' },
  { id: 'kb-steelseries-apex-pro', name: 'SteelSeries Apex Pro TKL', category: 'Keyboards', price: 189, oldPrice: 209, specs: 'OmniPoint 2.0 Adjustable Switches', image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=600&q=80' },
  { id: 'kb-asus-rog-azoth', name: 'ASUS ROG Azoth Wireless', category: 'Keyboards', price: 249, specs: '75% Custom Keyboard · OLED Display', image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80' },
  { id: 'kb-nuphy-air75', name: 'NuPhy Air75 V2 Low Profile', category: 'Keyboards', price: 119, specs: '75% Layout · QMK/VIA · Bluetooth 5.1', image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=600&q=80' },

  // --- Gaming Mice (7) ---
  { id: 'mouse-superlight-2', name: 'Logitech G PRO X SUPERLIGHT 2', category: 'Mice', price: 159, oldPrice: 179, specs: '60g Ultra-lightweight · LIGHTFORCE Hybrid Switches', image: 'https://encrypted-tbn3.gstatic.com/licensed-image?q=tbn:ANd9GcSG1-ZnyhAyrvnIbjgUHMyz62kxP4hSu3dMTXm0rm23YjJI0bjQZIaMFjUngwGkMF8WqmH6OuYRWjNCVmw' },
  { id: 'mouse-razer-viper-v3', name: 'Razer Viper V3 Pro', category: 'Mice', price: 159, specs: '54g Lightweight · Focus Pro 35K Sensor', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&q=80' },
  { id: 'mouse-deathadder-v3', name: 'Razer DeathAdder V3 Pro', category: 'Mice', price: 139, oldPrice: 149, specs: '63g Ergonomic · 30K Optical Sensor', image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80' },
  { id: 'mouse-finalmouse-ulx', name: 'Finalmouse UltralightX', category: 'Mice', price: 189, specs: 'Carbon Fiber Composite · 31g Ultralight', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&q=80' },
  { id: 'mouse-wlmouse-beastx', name: 'WLmouse Beast X Magnesium', category: 'Mice', price: 139, specs: 'Magnesium Alloy · 39g · 8K Hz Dongle', image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80' },
  { id: 'mouse-g502-x-plus', name: 'Logitech G502 X PLUS RGB', category: 'Mice', price: 149, oldPrice: 159, specs: 'LIGHTFORCE Switches · HERO 25K Sensor', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&q=80' },
  { id: 'mouse-pulsar-x2v2', name: 'Pulsar X2V2 Wireless', category: 'Mice', price: 99, specs: '53g Lightweight · PixArt PAW3395 Sensor', image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80' },

  // --- Consoles & Handhelds (6) ---
  { id: 'ps5-slim', name: 'PlayStation 5 Slim Console', category: 'Consoles', price: 499, specs: '1TB SSD · 4K 120Hz · Ray Tracing', image: 'https://encrypted-tbn2.gstatic.com/licensed-image?q=tbn:ANd9GcQG1jXYlrUsGB4fVgDaanIlQyZpE3xqRPGPvnae_VLb0Owj7bt7CfwlFGgy50zQmTwbT2h3EejJatuBHLk' },
  { id: 'ps5-digital', name: 'PlayStation 5 Digital Edition', category: 'Consoles', price: 449, specs: '1TB SSD · All-Digital · DualSense Included', image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=600&q=80' },
  { id: 'xbox-series-x', name: 'Xbox Series X Console', category: 'Consoles', price: 499, specs: '1TB Custom NVMe · 12 TFLOPS GPU', image: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?auto=format&fit=crop&w=600&q=80' },
  { id: 'switch-oled', name: 'Nintendo Switch OLED Model', category: 'Consoles', price: 349, specs: '7" OLED Screen · 64GB Storage · LAN Port', image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&w=600&q=80' },
  { id: 'steam-deck-oled', name: 'Steam Deck OLED 512GB', category: 'Handhelds', price: 549, specs: '7.4" 90Hz OLED · Custom AMD APU', image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&w=600&q=80' },
  { id: 'rog-ally-x', name: 'ASUS ROG Ally X Handheld', category: 'Handhelds', price: 799, specs: 'AMD Ryzen Z1 Extreme · 24GB LPDDR5 · 1TB', image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&w=600&q=80' },

  // --- Gamepads & Controllers (7) ---
  { id: 'pad-dualsense-edge', name: 'DualSense Edge Wireless Controller', category: 'Gamepads', price: 199, specs: 'Customizable Controls · Replaceable Stick Modules', image: 'https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcQn2ou47BJAdnLBpoXc4VEJmR1d5kqUfTRAtrKdNhrd3a-6BR1qbaLw-aJjXCJRk2mRnOvXmqgbl1aj2Yg' },
  { id: 'pad-dualsense-white', name: 'PS5 DualSense Wireless Controller', category: 'Gamepads', price: 69, specs: 'Haptic Feedback · Adaptive Triggers', image: 'https://images.unsplash.com/photo-1592840496694-26d035b52b48?auto=format&fit=crop&w=600&q=80' },
  { id: 'pad-xbox-elite-2', name: 'Xbox Elite Controller Series 2', category: 'Gamepads', price: 179, oldPrice: 199, specs: 'Adjustable-Tension Thumbsticks · Paddles', image: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=600&q=80' },
  { id: 'pad-xbox-wireless', name: 'Xbox Wireless Controller - Carbon Black', category: 'Gamepads', price: 59, specs: 'Hybrid D-Pad · Bluetooth · Share Button', image: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=600&q=80' },
  { id: 'pad-flydigi-vader3', name: 'Flydigi Vader 3 Pro Wireless Controller', category: 'Gamepads', price: 79, specs: 'Hall Effect Sensing Sticks · Mechanical Keys', image: 'https://images.unsplash.com/photo-1592840496694-26d035b52b48?auto=format&fit=crop&w=600&q=80' },
  { id: 'pad-8bitdo-ultimate', name: '8BitDo Ultimate Bluetooth Controller', category: 'Gamepads', price: 69, specs: 'Hall Effect Joystick · Charging Dock', image: 'https://images.unsplash.com/photo-1592840496694-26d035b52b48?auto=format&fit=crop&w=600&q=80' },
  { id: 'pad-scuf-reflex-fps', name: 'SCUF Reflex FPS PS5 Controller', category: 'Gamepads', price: 249, specs: 'Instant Triggers · 4 Rear Remappable Paddles', image: 'https://images.unsplash.com/photo-1592840496694-26d035b52b48?auto=format&fit=crop&w=600&q=80' },

  // --- Monitors (6) ---
  { id: 'mon-asus-oled', name: 'ASUS ROG Swift OLED PG27AQDM', category: 'Monitors', price: 899, oldPrice: 999, specs: '27" QHD (2560x1440) · 240Hz · 0.03ms GTG', image: 'https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcQioY5NdMhHt6616WQ4RnUmdKozJRGn_Q2vZC24rZD46HUkoGT9p4zfYK373FeeYmMFn8OnPaQvqDPFzW4' },
  { id: 'mon-alienware-34', name: 'Alienware AW3423DWF QD-OLED', category: 'Monitors', price: 799, oldPrice: 999, specs: '34" UWQHD Curved · 165Hz · HDR True Black 400', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80' },
  { id: 'mon-lg-ultragear-27', name: 'LG 27GP850-B UltraGear', category: 'Monitors', price: 349, oldPrice: 429, specs: '27" QHD Nano IPS · 180Hz · 1ms · G-Sync', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80' },
  { id: 'mon-samsung-g9', name: 'Samsung Odyssey OLED G9', category: 'Monitors', price: 1199, oldPrice: 1799, specs: '49" Dual QHD · 240Hz · 0.03ms · Curved', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80' },
  { id: 'mon-benq-zowie', name: 'ZOWIE XL2566K Esports Monitor', category: 'Monitors', price: 599, specs: '24.5" FHD · 360Hz · DyAc⁺ Technology', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80' },
  { id: 'mon-msi-mag274qrf', name: 'MSI MAG 274QRF QD E2', category: 'Monitors', price: 279, specs: '27" WQHD Rapid IPS · 180Hz · Quantum Dot', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80' },

  // --- Pre-built PCs (5) ---
  { id: 'pc-nzxt-player3', name: 'NZXT Player Three Prime Gaming PC', category: 'Pre-built PCs', price: 2499, specs: 'Intel i9-14900KF · RTX 4090 · 64GB DDR5 · 2TB NVMe', image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80' },
  { id: 'pc-corsair-one', name: 'CORSAIR ONE i500 Compact PC', category: 'Pre-built PCs', price: 3599, specs: 'i9-14900K · RTX 4090 · Liquid Cooled', image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80' },
  { id: 'pc-alienware-r16', name: 'Alienware Aurora R16 Gaming PC', category: 'Pre-built PCs', price: 1899, oldPrice: 2099, specs: 'i7-14700KF · RTX 4070 Ti SUPER · 32GB DDR5', image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80' },
  { id: 'pc-skytech-prism', name: 'Skytech Prism III Gaming Desktop', category: 'Pre-built PCs', price: 2999, specs: 'Ryzen 7 7800X3D · RTX 4090 · 32GB DDR5', image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80' },
  { id: 'pc-lenovo-legion-7', name: 'Lenovo Legion Tower 7i Gen 8', category: 'Pre-built PCs', price: 2199, oldPrice: 2399, specs: 'i7-14700KF · RTX 4080 SUPER · 32GB DDR5', image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80' },

  // --- Cooling & Cases (5) ---
  { id: 'cool-nzxt-kraken', name: 'NZXT Kraken Elite 360 RGB AIO', category: 'Cooling', price: 279, specs: '360mm Radiator · Customizable LCD Display', image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80' },
  { id: 'cool-lianli-galahad', name: 'Lian Li Galahad II Trinity 360', category: 'Cooling', price: 169, specs: '360mm AIO Cooler · ARGB Daisy-Chain Fans', image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80' },
  { id: 'case-lianli-o11', name: 'Lian Li O11 Dynamic EVO XL', category: 'Cases', price: 234, specs: 'Dual-Chamber Mid-Tower · Tempered Glass', image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80' },
  { id: 'case-hyte-y70', name: 'HYTE Y70 Touch Infinite Case', category: 'Cases', price: 359, specs: 'Integrated 4K Touchscreen · Dual Chamber', image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80' },
  { id: 'psu-corsair-rm1000x', name: 'Corsair RM1000x Shift 1000W', category: 'Power Supplies', price: 189, specs: '80+ Gold Fully Modular · ATX 3.0 Compatible', image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80' }
];
const CartContext = createContext<{items:CartItem[]; add:(p:Product)=>void; change:(id:string,n:number)=>void; remove:(id:string)=>void}>({items:[],add:()=>{},change:()=>{},remove:()=>{}})

export function StoreProvider({children}:{children:React.ReactNode}) {
  const [items,setItems]=useState<CartItem[]>([])
  const [hydrated,setHydrated]=useState(false)
  useEffect(()=>{try{setItems(JSON.parse(localStorage.getItem('nzz-cart')||'[]'))}catch{}finally{setHydrated(true)}},[])
  useEffect(()=>{if(hydrated)localStorage.setItem('nzz-cart',JSON.stringify(items))},[items,hydrated])
  const add=(p:Product)=>setItems(old=>old.some(x=>x.id===p.id)?old.map(x=>x.id===p.id?{...x,qty:x.qty+1}:x):[...old,{...p,qty:1}])
  const change=(id:string,n:number)=>setItems(old=>old.map(x=>x.id===id?{...x,qty:n}:x).filter(x=>x.qty>0))
  const remove=(id:string)=>setItems(old=>old.filter(x=>x.id!==id))
  return <CartContext.Provider value={{items,add,change,remove}}>{children}</CartContext.Provider>
}

const useCart=()=>useContext(CartContext)
const nav=[['Shop','/'],['PC Builder','/pc-builder'],['Prebuilt PCs','/prebuilt-pcs'],['Deals','/deals'],['Contacts','/contacts']]

export function Header(){
  const path=usePathname();
  const {items}=useCart();
  const [open,setOpen]=useState(false);
  return (
    <>
      <div className="topline">
        NEXT-GEN HARDWARE. BUILT FOR YOUR GAME. <span>FREE SHIPPING ON ORDERS OVER $500</span>
      </div>
      <header className="header">
        <Link href="/" className="logo"><span className="logo-mark">N</span>NZZ<span className="logo-sub">COMPUTERS</span></Link>
        <nav className={open?'nav open':'nav'}>
          {nav.map(([label,href])=><Link key={href} href={href} onClick={()=>setOpen(false)} className={path===href?'active':''}>{label}</Link>)}
        </nav>
        <div className="head-actions">
          <div className="social-links" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" style={{ display: 'inline-flex', alignItems: 'center' }}><InstagramIcon size={18} /></a>
            <a href="https://t.me" target="_blank" rel="noreferrer" aria-label="Telegram" style={{ display: 'inline-flex', alignItems: 'center' }}><TelegramIcon size={18} /></a>
          </div>
          <Link href="/cart" className="cart-link"><ShoppingCart size={19}/><span>Cart</span><b>{items.reduce((s,x)=>s+x.qty,0)}</b></Link>
          <button className="mobile-menu" onClick={()=>setOpen(!open)} aria-label="Toggle menu">{open?<X/>:<Menu/>}</button>
        </div>
      </header>
    </>
  )
}

export function Footer(){
  return (
    <footer className="footer">
      <div>
        <Link href="/" className="logo"><span className="logo-mark">N</span>NZZ</Link>
        <p>Performance hardware. No compromises.</p>
      </div>
      <div>
        <b>Explore</b>
        <Link href="/pc-builder">PC Builder</Link>
        <Link href="/prebuilt-pcs">Prebuilt PCs</Link>
        <Link href="/deals">Latest deals</Link>
      </div>
      <div>
        <b>Support & Social</b>
        <Link href="/contacts">Contact us</Link>
        <Link href="/cart">Your cart</Link>
        <div className="footer-socials" style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><InstagramIcon size={16}/> Instagram</a>
          <a href="https://t.me" target="_blank" rel="noreferrer" aria-label="Telegram" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><TelegramIcon size={16}/> Telegram</a>
        </div>
      </div>
      <small>© 2026 NZZ Computers. All rights reserved.</small>
    </footer>
  )
}

export function Shell({children}:{children:React.ReactNode}){return <StoreProvider><Header/>{children}<Footer/></StoreProvider>}

function ProductCard({p}:{p:Product}){
  const {add}=useCart();
  const isImageURL = p.image.startsWith('http');
  return (
    <article className="product-card">
      <div className="product-art">
        {isImageURL ? <img src={p.image} alt={p.name} style={{width:'100%', height:'100%', objectFit:'cover'}} /> : <span>{p.image}</span>}
        {p.oldPrice&&<em>SALE</em>}
      </div>
      <div className="product-info">
        <small>{p.category}</small>
        <h3>{p.name}</h3>
        <p>{p.specs}</p>
        <div className="product-bottom">
          <div><strong>${p.price}</strong>{p.oldPrice&&<del>${p.oldPrice}</del>}</div>
          <button className="add-btn" onClick={()=>add(p)} aria-label={`Add ${p.name} to cart`}><Plus size={18}/></button>
        </div>
      </div>
    </article>
  )
}

export function HomePage(){return <main><section className="hero"><div className="hero-copy"><span className="eyebrow"><i/> ENGINEERED FOR PERFORMANCE</span><h1>YOUR NEXT<br/><span>LEVEL</span> STARTS HERE.</h1><p>Premium components. Powerful custom builds. Gear that keeps you ahead of the game.</p><div className="hero-buttons"><Link className="btn primary" href="/prebuilt-pcs">Explore PCs <ArrowRight size={17}/></Link><Link className="btn ghost" href="/pc-builder">Build your PC</Link></div><div className="hero-stats"><div><b>500+</b><small>COMPONENTS</small></div><div><b>100%</b><small>QUALITY TESTED</small></div><div><b>24/7</b><small>SUPPORT</small></div></div></div><div className="hero-visual"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="pc-tower"><div className="pc-glass"><div className="fan f1"/><div className="fan f2"/><div className="fan f3"/><div className="gpu-line"/></div><div className="pc-front"><i/><i/><i/></div></div><div className="floating-tag">RTX READY <b>●</b></div><div className="visual-caption">BUILT TO DOMINATE <span>01 / 04</span></div></div></section><section className="benefits"><div><Truck/><b>Fast, safe delivery</b><small>Tracked on every order</small></div><div><ShieldCheck/><b>Quality guaranteed</b><small>Tested components</small></div><div><Zap/><b>Performance first</b><small>Hardware that delivers</small></div><div><Monitor/><b>Build your setup</b><small>Made for your needs</small></div></section><section className="section"><div className="section-heading"><div><span className="eyebrow">HAND-PICKED HARDWARE</span><h2>Featured components<span>.</span></h2></div><Link href="/deals" className="text-link">View all deals <ArrowRight size={16}/></Link></div><div className="product-grid">{products.map(p=><ProductCard key={p.id} p={p}/>)}</div></section><section className="builder-banner"><div><span className="eyebrow">YOUR DREAM SETUP, YOUR RULES</span><h2>Every part matters.<br/><span>Build yours.</span></h2><p>Choose your components and create a PC that fits your performance goals and budget.</p><Link href="/pc-builder" className="btn primary">Start building <ArrowRight size={17}/></Link></div><div className="builder-chip"><Cpu size={100}/><span>YOUR BUILD<br/>YOUR POWER</span></div></section></main>}

function PageTitle({tag,title,desc}:{tag:string;title:string;desc:string}){return <div className="page-title"><span className="eyebrow">{tag}</span><h1>{title}</h1><p>{desc}</p></div>}

export function CartPage(){const {items,change,remove}=useCart();const total=items.reduce((s,x)=>s+x.price*x.qty,0);return <main className="page-wrap"><PageTitle tag="YOUR SELECTION" title="Shopping cart." desc="Review your components before moving to checkout."/>{items.length===0?<div className="empty-state"><ShoppingCart size={42}/><h2>Your cart is waiting.</h2><p>Looks like you haven't added any hardware yet.</p><Link href="/" className="btn primary">Explore components <ArrowRight size={17}/></Link></div>:<div className="cart-layout"><div className="cart-list">{items.map(x=><div className="cart-item" key={x.id}><div className="cart-art">{x.image.startsWith('http')?<img src={x.image} alt={x.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>:x.image}</div><div className="cart-details"><small>{x.category}</small><h3>{x.name}</h3><p>{x.specs}</p><div className="qty"><button onClick={()=>change(x.id,x.qty-1)}><Minus size={14}/></button><b>{x.qty}</b><button onClick={()=>change(x.id,x.qty+1)}><Plus size={14}/></button></div></div><strong>${(x.price*x.qty).toLocaleString()}</strong><button className="remove" onClick={()=>remove(x.id)} aria-label="Remove item"><Trash2 size={17}/></button></div>)}</div><aside className="summary"><h2>Order summary</h2><div><span>Subtotal</span><b>${total.toLocaleString()}</b></div><div><span>Shipping</span><b>{total>=500?'FREE':'Calculated at checkout'}</b></div><div className="summary-total"><span>Estimated total</span><strong>${total.toLocaleString()}</strong></div><button className="btn primary full" onClick={()=>alert('Checkout is a demo. Connect a payment provider to accept orders.')}>Continue to checkout <ArrowRight size={17}/></button><p>Secure checkout · Taxes calculated at checkout</p></aside></div>}</main>}

const buildOptions=[['Processor','AMD Ryzen 7 7800X3D','$349'],['Graphics card','GeForce RTX 4070 SUPER','$599'],['Motherboard','B650 WiFi Motherboard','$179'],['Memory','32GB DDR5 6000MHz','$109'],['Storage','2TB NVMe SSD','$159'],['Power supply','850W 80+ Gold','$129'],['Case','Airflow Mid Tower','$99']]

export function BuilderPage(){const [chosen,setChosen]=useState<boolean[]>(buildOptions.map(() => true));const total=buildOptions.reduce((s,x,i)=>s+(chosen[i]?Number(x[2].replace(/[$,]/g,'')):0),0);return <main className="page-wrap"><PageTitle tag="CUSTOM CONFIGURATION" title="Build your PC." desc="Choose your hardware, shape your performance, and make it yours."/><div className="builder-layout"><div className="component-list">{buildOptions.map((x,i)=><div className="component-row" key={x[0]}><div className="component-icon"><Cpu size={22}/></div><div className="component-copy"><small>0{i+1} / COMPONENT</small><b>{x[0]}</b><span>{x[1]}</span></div><strong>{x[2]}</strong><button className={chosen[i]?'select-btn selected':'select-btn'} onClick={()=>setChosen(old=>old.map((v,j)=>j===i?!v:v))}>{chosen[i]?'Added ✓':'Add +'}</button></div>)}</div><aside className="summary build-summary"><span className="eyebrow">YOUR CONFIGURATION</span><h2>Build summary</h2><div className="build-progress"><span style={{width:`${chosen.filter(Boolean).length/buildOptions.length*100}%`}}/></div><p>{chosen.filter(Boolean).length} of {buildOptions.length} components selected</p>{buildOptions.map((x,i)=><div className="summary-line" key={x[0]}><span>{x[0]}</span><b>{chosen[i]?x[2]:'—'}</b></div>)}<div className="summary-total"><span>Estimated total</span><strong>${total.toLocaleString()}</strong></div><button className="btn primary full" onClick={()=>alert('Your configuration is saved in this preview. Checkout integration can be added next.')}>Save this build <ArrowRight size={17}/></button></aside></div></main>}

const rigs=[{name:'NZZ Starter',desc:'Your entry into PC gaming.',price:899,tag:'1080P GAMING',parts:'Ryzen 5 · RTX 4060 · 16GB RAM',emoji:'🖥️'},{name:'NZZ Performance',desc:'Smooth high-refresh gaming.',price:1499,tag:'1440P GAMING',parts:'Ryzen 7 · RTX 4070 SUPER · 32GB RAM',emoji:'💻'},{name:'NZZ Ultimate',desc:'No-compromise performance.',price:2499,tag:'4K / CREATOR',parts:'Ryzen 9 · RTX 4080 SUPER · 64GB RAM',emoji:'⚡'}]

// Detailed data model with real component breakdowns
type RigDetail = {
  id: string
  name: string
  desc: string
  price: number
  tag: string
  partsSummary: string
  image: string
  detailedSpecs: {
    processor: string
    graphics: string
    ram: string
    storage: string
    motherboard: string
    powerSupply: string
    cooler: string
    caseName: string
    os: string
  }
  highlights: string[]
}

const detailedRigs: RigDetail[] = [
  {
    id: 'rig-starter',
    name: 'NZZ Starter',
    desc: 'Your entry into high-FPS 1080p gaming and daily productivity.',
    price: 899,
    tag: '1080P GAMING',
    partsSummary: 'Ryzen 5 7600X · RTX 4060 · 16GB DDR5',
    image: 'nzz-starter.jpg',
    detailedSpecs: {
      processor: 'AMD Ryzen 5 7600X (6 Cores / 12 Threads, up to 5.3 GHz)',
      graphics: 'NVIDIA GeForce RTX 4060 8GB GDDR6 (DLSS 3 & Ray Tracing)',
      ram: '16GB (2x8GB) Kingston FURY Beast DDR5 5600MHz CL36',
      storage: '1TB Crucial P3 Plus PCIe 4.0 NVMe M.2 SSD (Up to 5000 MB/s)',
      motherboard: 'ASRock B650M Pro RS WiFi Micro-ATX Motherboard',
      powerSupply: '650W Corsair CX650M 80 Plus Bronze Semi-Modular',
      cooler: 'Thermalright Peerless Assassin 120 SE ARGB Air Cooler',
      caseName: 'DeepCool CC560 V2 Mid-Tower ARGB Case (Black)',
      os: 'Windows 11 Home 64-bit (Activated & Tested)'
    },
    highlights: [
      '100+ FPS in modern esports titles (CS2, Valorant, Apex Legends at 1080p High)',
      'NVIDIA DLSS 3 Frame Generation support',
      'PCIe 4.0 NVMe for instant load times',
      'Built-in Wi-Fi 6 & Bluetooth 5.2'
    ]
  },
  {
    id: 'rig-performance',
    name: 'NZZ Performance',
    desc: 'Smooth high-refresh 1440p gaming and stream-ready power.',
    price: 1499,
    tag: '1440P GAMING',
    partsSummary: 'Ryzen 7 7800X3D · RTX 4070 SUPER · 32GB DDR5',
    image: 'nzz-performance.jpg',
    detailedSpecs: {
      processor: 'AMD Ryzen 7 7800X3D (8 Cores / 16 Threads, 3D V-Cache, 5.0 GHz)',
      graphics: 'NVIDIA GeForce RTX 4070 SUPER 12GB GDDR6X (Dual Fan)',
      ram: '32GB (2x16GB) Corsair Vengeance DDR5 6000MHz CL30 (EXPO)',
      storage: '2TB Samsung 990 PRO PCIe 4.0 NVMe SSD (Up to 7450 MB/s)',
      motherboard: 'MSI MAG B650 TOMAHAWK WIFI ATX Motherboard',
      powerSupply: '750W Corsair RM750e 80 Plus Gold Fully Modular ATX 3.0',
      cooler: 'DeepCool LT520 240mm High-Performance Liquid Cooler',
      caseName: 'NZXT H6 Flow RGB Dual-Chamber Mid-Tower Case',
      os: 'Windows 11 Home 64-bit (Activated & Tested)'
    },
    highlights: [
      'Optimized for 1440p Ultra gaming at 144+ FPS',
      'Powered by world-leading gaming CPU (7800X3D)',
      'Ultra-fast 6000MHz CL30 low-latency RAM',
      'Full AV1 encoding for high-quality single-PC streaming'
    ]
  },
  {
    id: 'rig-ultimate',
    name: 'NZZ Ultimate',
    desc: 'No-compromise 4K gaming, ray tracing powerhouse, and workstation speed.',
    price: 2499,
    tag: '4K / CREATOR',
    partsSummary: 'Ryzen 9 7950X3D · RTX 4080 SUPER · 64GB DDR5',
    image: 'nzz-ultimate.jpg',
    detailedSpecs: {
      processor: 'AMD Ryzen 9 7950X3D (16 Cores / 32 Threads, 5.7 GHz boost)',
      graphics: 'NVIDIA GeForce RTX 4080 SUPER 16GB GDDR6X (Triple Fan)',
      ram: '64GB (2x32GB) G.Skill Trident Z5 Neo RGB DDR5 6000MHz CL30',
      storage: '2TB WD_BLACK SN850X Gen4 NVMe (7300 MB/s) + 2TB Secondary NVMe',
      motherboard: 'ASUS ROG STRIX X670E-E GAMING WIFI ATX Motherboard',
      powerSupply: '1000W Seasonic Focus GX-1000 80 Plus Gold ATX 3.0 / PCIe 5.0',
      cooler: 'NZXT Kraken Elite 360 RGB 360mm Liquid Cooler with LCD Display',
      caseName: 'Lian Li O11 Dynamic EVO XL Tempered Glass Tower',
      os: 'Windows 11 Pro 64-bit (Activated & Optimized)'
    },
    highlights: [
      'Uncompromised 4K Ultra gaming with full Ray Tracing & DLSS 3.5',
      'Ideal for heavy 3D rendering, 8K video editing, and AI workloads',
      'Custom LCD display cooler with real-time hardware telemetry',
      'Premium 3-year full warranty with lifetime tech support'
    ]
  }
]

export function PrebuiltPage() {
  const { add } = useCart()
  const [selectedRig, setSelectedRig] = useState<RigDetail | null>(null)

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedRig(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <main className="page-wrap">
      <PageTitle 
        tag="READY WHEN YOU ARE" 
        title="Prebuilt PCs." 
        desc="Expert-selected parts, assembled, wire-managed, and stress-tested for dependable performance." 
      />

      <div className="rig-grid">
        {detailedRigs.map((r, i) => (
          <article 
            className="rig-card clickable" 
            key={r.id} 
            onClick={() => setSelectedRig(r)}
            style={{ cursor: 'pointer' }}
          >
            <div className="rig-art">
              <img src={r.image} alt={r.name} />
              <small>{r.tag}</small>
            </div>
            <div className="rig-info">
              <span className="eyebrow">NZZ SERIES / 0{i + 1}</span>
              <h2>{r.name}</h2>
              <p>{r.desc}</p>
              <div className="rig-spec">{r.partsSummary}</div>
              
              <div style={{ marginTop: '8px', fontSize: '13px', color: '#3b82f6', fontWeight: 500 }}>
                Click to inspect full component specs →
              </div>

              <div className="rig-bottom" style={{ marginTop: '16px' }}>
                <strong>${r.price.toLocaleString()}</strong>
                <button 
                  className="btn primary" 
                  onClick={(e) => {
                    e.stopPropagation() // Prevents opening modal when clicking direct add button
                    add({
                      id: r.id,
                      name: r.name,
                      category: 'Prebuilt PC',
                      price: r.price,
                      specs: r.partsSummary,
                      image: r.image
                    })
                  }}
                >
                  Add to cart <Plus size={16}/>
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* --- RIG SPECIFICATIONS MODAL --- */}
      {selectedRig && (
        <div 
          className="modal-backdrop"
          onClick={() => setSelectedRig(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(6px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div 
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#111827',
              color: '#f9fafb',
              border: '1px solid #374151',
              borderRadius: '16px',
              maxWidth: '700px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '28px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              position: 'relative'
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <span className="eyebrow" style={{ color: '#3b82f6' }}>{selectedRig.tag}</span>
                <h2 style={{ fontSize: '28px', margin: '4px 0 0 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span><img src={selectedRig.image} alt={selectedRig.name} style={{ width: '100%', height: 'auto' }} /></span> {selectedRig.name}
                </h2>
              </div>
              <button 
                onClick={() => setSelectedRig(null)}
                style={{
                  background: '#1f2937',
                  border: 'none',
                  color: '#9ca3af',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                aria-label="Close modal"
              >
                <X size={20}/>
              </button>
            </div>

            <p style={{ color: '#9ca3af', marginBottom: '24px', fontSize: '15px' }}>{selectedRig.desc}</p>

            {/* Detailed Component Table */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9ca3af', marginBottom: '12px' }}>
                Full Hardware Specs
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: '#1f2937', padding: '16px', borderRadius: '12px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', fontSize: '14px' }}>
                  <b style={{ color: '#d1d5db' }}>CPU:</b> <span>{selectedRig.detailedSpecs.processor}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', fontSize: '14px' }}>
                  <b style={{ color: '#d1d5db' }}>GPU:</b> <span>{selectedRig.detailedSpecs.graphics}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', fontSize: '14px' }}>
                  <b style={{ color: '#d1d5db' }}>RAM:</b> <span>{selectedRig.detailedSpecs.ram}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', fontSize: '14px' }}>
                  <b style={{ color: '#d1d5db' }}>Storage:</b> <span>{selectedRig.detailedSpecs.storage}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', fontSize: '14px' }}>
                  <b style={{ color: '#d1d5db' }}>Motherboard:</b> <span>{selectedRig.detailedSpecs.motherboard}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', fontSize: '14px' }}>
                  <b style={{ color: '#d1d5db' }}>Power Supply:</b> <span>{selectedRig.detailedSpecs.powerSupply}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', fontSize: '14px' }}>
                  <b style={{ color: '#d1d5db' }}>Cooler:</b> <span>{selectedRig.detailedSpecs.cooler}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', fontSize: '14px' }}>
                  <b style={{ color: '#d1d5db' }}>Case:</b> <span>{selectedRig.detailedSpecs.caseName}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', fontSize: '14px' }}>
                  <b style={{ color: '#d1d5db' }}>OS:</b> <span>{selectedRig.detailedSpecs.os}</span>
                </div>
              </div>
            </div>

            {/* Highlights Section */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9ca3af', marginBottom: '12px' }}>
                Key Advantages
              </h3>
              <ul style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', color: '#d1d5db', fontSize: '14px' }}>
                {selectedRig.highlights.map((h, index) => (
                  <li key={index}>{h}</li>
                ))}
              </ul>
            </div>

            {/* Modal Footer / Purchase Action */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid #374151' }}>
              <div>
                <span style={{ fontSize: '12px', color: '#9ca3af', display: 'block' }}>Total Price</span>
                <strong style={{ fontSize: '24px', color: '#ffffff' }}>${selectedRig.price.toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn ghost" onClick={() => setSelectedRig(null)}>
                  Close
                </button>
                <button 
                  className="btn primary"
                  onClick={() => {
                    add({
                      id: selectedRig.id,
                      name: selectedRig.name,
                      category: 'Prebuilt PC',
                      price: selectedRig.price,
                      specs: selectedRig.partsSummary,
                      image: selectedRig.image 
                    })
                    setSelectedRig(null)
                  }}
                >
                  Add system to cart <Plus size={16}/>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </main>
  )
}

export function DealsPage(){const {add}=useCart();return <main className="page-wrap"><PageTitle tag="LIMITED-TIME OFFERS" title="Deals & drops." desc="Get more performance for less with these selected hardware offers."/><div className="deal-highlight"><div><span className="eyebrow">THE WEEKLY DROP</span><h2>Upgrade your<br/>game. Not your budget.</h2><p>Save on selected components while stocks last.</p></div><div className="deal-percent">UP TO <b>20%</b><span>OFF SELECT GEAR</span></div></div><div className="section-heading deals-heading"><h2>Offers worth a look<span>.</span></h2><span className="muted">Updated for this week</span></div><div className="product-grid">{products.filter(p=>p.oldPrice).map(p=><ProductCard key={p.id} p={p}/>)}</div></main>}

export function ContactsPage(){
  const [sent,setSent]=useState(false);
  return (
    <main className="page-wrap">
      <PageTitle tag="WE'RE HERE TO HELP" title="Let's talk tech." desc="Need advice on a build, an order update, or help choosing components? Reach out."/>
      <div className="contact-layout">
        <div className="contact-info">
          <h2>Get in touch<span>.</span></h2>
          <p>Our team can help you find the right setup for your needs.</p>
          <div className="contact-method"><Mail/><div><b>Email</b><span>support@nzzcomputers.com</span></div></div>
          <div className="contact-method"><Phone/><div><b>Phone</b><span>+998 (77) 207-00-07</span></div></div>
          <div className="contact-method"><MapPin/><div><b>Location</b><span>Andijan, Uzbekistan</span></div></div>
          <div className="contact-method"><InstagramIcon/><div><b>Instagram</b><span>@nzzcomputers</span></div></div>
          <div className="contact-method"><TelegramIcon/><div><b>Telegram</b><span>t.me/nzzcomputers</span></div></div>
          <div className="contact-note"><CheckCircle2/><span>Typical response time: within one business day.</span></div>
          <div><span></span></div>
        </div>
        <form className="contact-form" onSubmit={e=>{e.preventDefault();setSent(true)}}>
          <h2>Send a message</h2>
          <label>Your name<input required placeholder="Name"/></label>
          <label>Email address<input type="email" required placeholder="you@example.com"/></label>
          <label>Subject<select defaultValue="Build advice"><option>Build advice</option><option>Order support</option><option>Product question</option><option>Other</option></select></label>
          <label>Message<textarea required rows={5} placeholder="How can we help?"/></label>
          <button className="btn primary full" type="submit">{sent?'Message ready ✓':'Send message'} <ArrowRight size={17}/></button>
          {sent&&<p className="form-success">Thanks! This demo form is ready for email-service integration.</p>}
        </form>
      </div>
    </main>
  )
}