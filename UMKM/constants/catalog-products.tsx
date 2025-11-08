import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import type { ReactElement } from 'react';

export type CatalogProduct = {
  slug: string;
  name: string;
  category: string;
  origin: string;
  price: string;
  description: string;
  icon: (color: string) => ReactElement;
  highlight: string;
  badges: string[];
  features: string[];
  logistics: string[];
  bannerImage: string;
  contactEmail: string;
  contactPhone: string;
};

export const CATALOG_PRODUCTS: CatalogProduct[] = [
  {
    slug: 'kopi-rempah-nusantara',
    name: 'Kopi Rempah Nusantara',
    category: 'Kuliner',
    origin: 'Bandung, Jawa Barat',
    price: 'Rp58.000 / 200gr',
    description:
      'Blend arabika dengan rempah hangat (kayu manis, kapulaga, cengkih) yang diproses medium roast dan cocok menjadi signature drink kafe modern.',
    icon: (color) => <MaterialCommunityIcons name="coffee" size={26} color={color} />,
    highlight: 'Best Seller • 4.8⭐',
    badges: ['Non-GMO', 'Fair Trade', 'Cold Brew Ready'],
    features: [
      'Biji arabika 100% dengan profil rasa manis-rempah yang seimbang.',
      'Proses roasting menggunakan airflow roaster untuk menjaga aroma rempah.',
      'Tersedia varian bubuk dripbag dan biji utuh untuk kebutuhan kafe.',
    ],
    logistics: [
      'MOQ 25 pack (200gr) per pengiriman.',
      'Lead time produksi 3 hari kerja, pengiriman nasional via ekspedisi reguler/instan.',
      'Kemasan aluminium foil dengan valve, ketahanan rasa 6 bulan.',
    ],
    bannerImage:
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1400&q=80',
    contactEmail: 'catalog@kopinusantara.id',
    contactPhone: '+62 812-3456-7890',
  },
  {
    slug: 'tenun-ikat-larantuka',
    name: 'Tenun Ikat Larantuka',
    category: 'Fesyen & Kriya',
    origin: 'Flores Timur, NTT',
    price: 'Rp325.000 / lembar',
    description:
      'Tenun ikat motif Larantuka yang diwarnai secara alami dari daun tarum, kunyit, dan kulit kayu. Cocok untuk busana etnik, scarf premium, maupun dekorasi rumah.',
    icon: (color) => <MaterialCommunityIcons name="tshirt-crew" size={26} color={color} />,
    highlight: 'Kurasi Nasional 2025',
    badges: ['Pewarna Alami', 'Handloom', 'Limited Batch'],
    features: [
      'Setiap lembar ditenun manual oleh perajin perempuan dengan teknik pewarnaan bertingkat.',
      'Tersedia ukuran 210 x 60 cm dan dapat dipesan custom motif corporate.',
      'Sertifikasi kriya daerah dan didampingi pelatihan desain kontemporer.',
    ],
    logistics: [
      'MOQ 10 lembar / pesanan, dapat mix motif.',
      'Lead time produksi 7-10 hari tergantung kompleksitas motif.',
      'Pengemasan hard box dan silika gel, aman untuk pengiriman ekspor.',
    ],
    bannerImage:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1400&q=80',
    contactEmail: 'catalog@larantukatenun.com',
    contactPhone: '+62 813-9988-1122',
  },
  {
    slug: 'snack-sehat-sorgum-crunch',
    name: 'Snack Sehat Sorgum Crunch',
    category: 'Pangan Fungsional',
    origin: 'Gunung Kidul, DIY',
    price: 'Rp32.000 / pack',
    description:
      'Camilan renyah berbahan utama sorgum lokal, tinggi serat, tanpa gula rafinasi, dan diperkaya prebiotik inulin. Varian rasa original, keju, dan smoky bbq.',
    icon: (color) => <Feather name="heart" size={24} color={color} />,
    highlight: 'Sertifikasi PIRT & Halal',
    badges: ['Gluten-Free', 'High Fiber', 'Low GI'],
    features: [
      'Menggunakan sorgum lokal Gunung Kidul yang kaya antioksidan dan mineral.',
      'Dipanggang (bukan digoreng) untuk menjaga kalori tetap rendah.',
      'Kemasan travel pack 80gr dan family pack 200gr dengan zipper lock.',
    ],
    logistics: [
      'MOQ 50 pack per rasa, bisa mix varian.',
      'Lead time 5 hari kerja, dapat fulfillment dropship dan B2B.',
      'Sudah tersedia kemasan white-label untuk private brand.',
    ],
    bannerImage:
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1400&q=80',
    contactEmail: 'catalog@sorgumcrunch.co.id',
    contactPhone: '+62 811-5566-7788',
  },
  {
    slug: 'essential-oil-citrus-bloom',
    name: 'Essential Oil Citrus Bloom',
    category: 'Kecantikan & Aromaterapi',
    origin: 'Denpasar, Bali',
    price: 'Rp74.000 / 10ml',
    description:
      'Campuran jeruk bali, ylang-ylang, dan jeruk purut secara cold-pressed. Ideal untuk aromaterapi diffuser, spa, maupun lini wellness hotel.',
    icon: (color) => <MaterialCommunityIcons name="flower" size={26} color={color} />,
    highlight: 'Eco Packaging • Refill',
    badges: ['IFRA Certified', 'Cruelty-Free', 'Vegan'],
    features: [
      'Konsentrasi pure essential oil tanpa campuran carrier, tingkat penguapan medium.',
      'Tersedia layanan private label dan custom aroma untuk hotel/resort.',
      'Kemasan kaca amber dengan dropper dan opsi refill 50ml.',
    ],
    logistics: [
      'MOQ 40 botol 10ml atau 10 botol refill 50ml.',
      'Lead time 4 hari kerja, pengiriman aman dengan bubble wrap & kotak kayu.',
      'Dokumen MSDS tersedia untuk kebutuhan ekspor/ritel modern.',
    ],
    bannerImage:
      'https://images.unsplash.com/photo-1501426026826-31c667bdf23d?auto=format&fit=crop&w=1400&q=80',
    contactEmail: 'catalog@citrusbloom.id',
    contactPhone: '+62 812-2222-3344',
  },
];

export function findCatalogProduct(slug: string | undefined) {
  if (!slug) {
    return undefined;
  }
  return CATALOG_PRODUCTS.find((product) => product.slug === slug);
}

