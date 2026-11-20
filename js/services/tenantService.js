/**
 * HomeHub Multi-Tenant SaaS Engine
 * Manages tenant registration, store switching, brand theming,
 * currency formatting, catalog isolation, and isolated storage per tenant.
 */

import { storage } from '../utils/storage.js';
import { INITIAL_PRODUCTS } from '../data/products.js';

// Pre-seeded Tenant Catalogs
const STUDIO_NOOR_PRODUCTS = [
  {
    id: "SN-FUR-001",
    sku: "SN-FUR-001",
    name: "Kuro Low Tatami Bed",
    category: "furniture",
    categoryLabel: "Furniture",
    price: 1850,
    shortDesc: "Low-profile blackened ash bedstead with integrated reed tatami matting.",
    description: "The Kuro Bed channels tranquil Japanese aesthetics into modern sanctuaries. Crafted from solid charred ash timber and fitted with authentic organic rush-grass tatami panels for circadian grounding.",
    material: "FSC-certified solid ash, natural rice straw tatami mat, non-toxic matte lacquer.",
    dimensions: "Width: 200 cm • Depth: 220 cm • Height: 35 cm",
    weight: "82 kg",
    stock: 7,
    isFeatured: true,
    variants: [
      { id: "charcoal", name: "Charcoal Ash", hex: "#2B2B2B", isDefault: true },
      { id: "natural-ash", name: "Natural Ash", hex: "#C8B89E" }
    ],
    images: [
      { url: "assets/magazines/1309dd06-a468-4f6b-a84a-17d6546b6966.webp", caption: "Main View - Low-profile tatami bed in minimalist interior", type: "main" },
      { url: "assets/magazines/15db50fe-f290-462b-ae89-457ee3ab948a.webp", caption: "Joinery Detail - Mortise and tenon corner detail", type: "alternate" },
      { url: "assets/magazines/1aa74f5d-417b-4fed-ad3d-3f05fce90ac1.webp", caption: "Material Texture - Organic rush-grass tatami weave", type: "detail" },
      { url: "assets/magazines/3ffa9485-4bd9-4392-a47d-7010d339117d.webp", caption: "Lifestyle - Morning light in Wabi-Sabi bedroom", type: "lifestyle" }
    ],
    relatedSkus: ["SN-DEC-002", "SN-LGT-001", "SN-SSS-001"]
  },
  {
    id: "SN-FUR-002",
    sku: "SN-FUR-002",
    name: "Sora Minimalist Dining Bench",
    category: "furniture",
    categoryLabel: "Furniture",
    price: 720,
    shortDesc: "Monolithic solid white oak bench sculpted with traditional mortise-and-tenon joints.",
    description: "A continuous timber bench celebrating raw grain patterns and unornamented simplicity. Suitable for dining horizons or peaceful entryway contemplation.",
    material: "Solid quarter-sawn white oak, organic plant-based oil wax finish.",
    dimensions: "Width: 160 cm • Depth: 38 cm • Height: 44 cm",
    weight: "26 kg",
    stock: 12,
    isFeatured: false,
    variants: [
      { id: "smoked-oak", name: "Smoked Oak", hex: "#4A3B32", isDefault: true },
      { id: "bleached-oak", name: "Bleached Oak", hex: "#DDD2C4" }
    ],
    images: [
      { url: "assets/magazines/4aa14b31-2e83-4baa-8af8-a1112955006d.webp", caption: "Main View - Sculpted white oak bench profile", type: "main" },
      { url: "assets/magazines/4f5d0ae3-01f3-41ad-b9df-0624121da53a.webp", caption: "Top Surface - Cathedral grain in natural oak", type: "alternate" },
      { url: "assets/curated/desk-02.jpg", caption: "Joinery Detail - Exposed bridle joint", type: "detail" },
      { url: "assets/curated/desk-03.jpg", caption: "Lifestyle - Dining room styling with ceramic objects", type: "lifestyle" }
    ],
    relatedSkus: ["SN-FUR-001", "SN-DEC-001", "SN-LGT-001"]
  },
  {
    id: "SN-DEC-001",
    sku: "SN-DEC-001",
    name: "Kyoto Wabi Stoneware Urn",
    category: "decor",
    categoryLabel: "Home Décor",
    price: 340,
    shortDesc: "Coil-built unglazed ceramic vessel fired in a wood-burning reduction kiln.",
    description: "Each urn is individually shaped by hand and subjected to high-fire reduction, creating singular scorch marks and natural mineral flashes unique to each piece.",
    material: "High-fire stoneware clay, natural wood ash deposit patina.",
    dimensions: "Diameter: 28 cm • Height: 38 cm",
    weight: "5.8 kg",
    stock: 15,
    isFeatured: true,
    variants: [
      { id: "charcoal-slate", name: "Charcoal Slate", hex: "#3E3E3E", isDefault: true },
      { id: "bone-white", name: "Bone White", hex: "#EFEBE4" }
    ],
    images: [
      { url: "assets/curated/vase-02.jpg", caption: "Main View - Coil-built stoneware urn silhouette", type: "main" },
      { url: "assets/curated/vase-03.jpg", caption: "Surface Detail - Wood ash scorch texture", type: "alternate" },
      { url: "assets/curated/vase-04.jpg", caption: "Neck Detail - Hand-turned lip and natural crackle", type: "detail" },
      { url: "assets/curated/vase-05.jpg", caption: "Lifestyle - Styled atop raw oak credenza", type: "lifestyle" }
    ],
    relatedSkus: ["SN-DEC-002", "SN-LGT-001", "SN-FUR-002"]
  },
  {
    id: "SN-DEC-002",
    sku: "SN-DEC-002",
    name: "Edo Raw Linen Floor Cushion",
    category: "decor",
    categoryLabel: "Home Décor",
    price: 210,
    shortDesc: "Heavyweight loomed organic flax linen filled with natural buckwheat hulls.",
    description: "Traditional meditation and informal lounge cushion. The weighty buckwheat hull filling conforms to posture while offering breathable, supportive comfort.",
    material: "100% Normandy raw flax linen, organic buckwheat hull core.",
    dimensions: "Width: 60 cm • Depth: 60 cm • Height: 18 cm",
    weight: "4.2 kg",
    stock: 20,
    isFeatured: false,
    variants: [
      { id: "natural-flax", name: "Natural Flax", hex: "#B8A99A", isDefault: true },
      { id: "moss-stone", name: "Moss Stone", hex: "#6A7365" }
    ],
    images: [
      { url: "assets/magazines/5b9b473d-4663-476b-8e12-a682c2e662da.webp", caption: "Main View - Heavyweight loomed raw linen cushion", type: "main" },
      { url: "assets/magazines/5e2712ee-dbef-4576-b2e8-73fcba75db23.webp", caption: "Fabric Texture - Slubbed natural linen weave", type: "alternate" },
      { url: "assets/curated/sofa-05.jpg", caption: "Corner Detail - Hand-stitched French seam", type: "detail" },
      { url: "assets/curated/sofa-06.jpg", caption: "Lifestyle - Floor seating arrangement beside low table", type: "lifestyle" }
    ],
    relatedSkus: ["SN-DEC-001", "SN-FUR-001"]
  },
  {
    id: "SN-LGT-001",
    sku: "SN-LGT-001",
    name: "Mulberry Washi Paper Pendant",
    category: "lighting",
    categoryLabel: "Lighting",
    price: 480,
    shortDesc: "Hand-pressed Japanese washi lantern diffusing intimate 2700K ambient warmth.",
    description: "Crafted from long-fiber mulberry bark paper over bent bamboo ribbing. Disperses an enveloping, shadowless ambient glow reminiscent of lantern-lit tea houses.",
    material: "Kozo mulberry paper, bent bamboo ribs, antiqued bronze hardware.",
    dimensions: "Diameter: 55 cm • Height: 48 cm • Cable: 200 cm",
    weight: "1.4 kg",
    stock: 14,
    isFeatured: true,
    variants: [
      { id: "natural-ivory", name: "Natural Ivory", hex: "#F6F3EC", isDefault: true },
      { id: "warm-straw", name: "Warm Straw", hex: "#EAE0CE" }
    ],
    images: [
      { url: "assets/curated/pendant-02.jpg", caption: "Main View - Illuminated washi paper lantern", type: "main" },
      { url: "assets/curated/pendant-03.jpg", caption: "Illumination Glow - Warm 2700K diffused spread", type: "alternate" },
      { url: "assets/curated/pendant-04.jpg", caption: "Canopy Detail - Antiqued bronze ceiling rose", type: "detail" },
      { url: "assets/curated/pendant-05.jpg", caption: "Lifestyle - Suspended above minimalist dining table", type: "lifestyle" }
    ],
    relatedSkus: ["SN-FUR-002", "SN-DEC-001"]
  },
  {
    id: "SN-SSS-001",
    sku: "SN-SSS-001",
    name: "Kuro Compact Floating Desk",
    category: "small-spaces",
    categoryLabel: "Small Space Solutions",
    price: 890,
    shortDesc: "Wall-mounted fold-down workstation with concealed acoustic felt organizer.",
    description: "Designed for compact urban sanctuaries. Folds flush to the wall when not in use, unveiling a felt-lined workstation with magnetic cable docks and concealed paper slots.",
    material: "Charred Shou Sugi Ban cedar, recycled wool acoustic felt, dampened brass hinges.",
    dimensions: "Width: 90 cm • Depth: 24 cm (Closed) / 58 cm (Open) • Height: 52 cm",
    weight: "18 kg",
    stock: 8,
    isFeatured: true,
    variants: [
      { id: "charred-cedar", name: "Charred Cedar", hex: "#1F1F1F", isDefault: true },
      { id: "natural-pine", name: "Natural Hinoki", hex: "#D6C4AD" }
    ],
    images: [
      { url: "assets/curated/desk-04.jpg", caption: "Main View - Wall-hung Shou Sugi Ban fold-down desk", type: "main" },
      { url: "assets/curated/desk-05.jpg", caption: "Interior Detail - Acoustic felt organizer pockets", type: "alternate" },
      { url: "assets/curated/desk-06.jpg", caption: "Hinge Detail - Precision dampened brass hardware", type: "detail" },
      { url: "assets/magazines/6153f7aa-dd19-4669-86f9-0624e3fd51ec.webp", caption: "Lifestyle - Compact bedroom corner home office", type: "lifestyle" }
    ],
    relatedSkus: ["SN-FUR-001", "SN-LGT-001"]
  }
];

const AURELIA_LIVING_PRODUCTS = [
  {
    id: "AL-FUR-001",
    sku: "AL-FUR-001",
    name: "Aegean Linen Modular Sofa",
    category: "furniture",
    categoryLabel: "Furniture",
    price: 2150,
    shortDesc: "Slipcovered modular lounge cushioned with feather-down in sun-bleached linen.",
    description: "The quintessential Mediterranean lounge piece. Deep, relaxed proportions, removable stone-washed linen covers, and layered down cushioning for breezy summer living.",
    material: "100% Belgian stone-washed linen, FSC kiln-dried beech, certified goose feather core.",
    dimensions: "Width: 260 cm • Depth: 110 cm • Height: 78 cm • Seat Height: 44 cm",
    weight: "85 kg",
    stock: 5,
    isFeatured: true,
    variants: [
      { id: "bleached-chalk", name: "Bleached Chalk", hex: "#F5F4EF", isDefault: true },
      { id: "indigo-sea", name: "Indigo Sea", hex: "#2A4356" },
      { id: "warm-sand", name: "Warm Sand", hex: "#DFD5C6" }
    ],
    images: [
      { url: "assets/curated/sofa-05.jpg", caption: "Main View - Sun-bleached linen modular sofa in coastal salon", type: "main" },
      { url: "assets/curated/sofa-06.jpg", caption: "Angle View - Deep lounging contour and loose pillows", type: "alternate" },
      { url: "assets/pexels-pixabay-276746.jpg", caption: "Fabric Detail - Stone-washed slub linen texture", type: "detail" },
      { url: "assets/minh-pham-OtXADkUh3-I-unsplash.jpg", caption: "Lifestyle - Mediterranean sunlit sea-facing villa", type: "lifestyle" }
    ],
    relatedSkus: ["AL-FUR-002", "AL-DEC-001", "AL-LGT-001"]
  },
  {
    id: "AL-FUR-002",
    sku: "AL-FUR-002",
    name: "Capri Honed Calacatta Cocktail Table",
    category: "furniture",
    categoryLabel: "Furniture",
    price: 1350,
    shortDesc: "Sculpted organic cocktail table carved from a single slab of honed Calacatta marble.",
    description: "Organic pillowed corners and subtle beveling highlight the dramatic violet and sea-green veining of honed Calacatta marble, bringing coastal timelessness to the lounge.",
    material: "Italian Calacatta marble, matte honed sealer, felt footing.",
    dimensions: "Width: 130 cm • Depth: 75 cm • Height: 34 cm",
    weight: "62 kg",
    stock: 7,
    isFeatured: true,
    variants: [
      { id: "calacatta-cream", name: "Calacatta Cream", hex: "#F4EFE6", isDefault: true },
      { id: "sea-glass", name: "Sea Glass Green", hex: "#A8B8AF" }
    ],
    images: [
      { url: "assets/magazines/7589a24a-202a-49a0-99c9-5e49e7eb5da5.webp", caption: "Main View - Honed Calacatta marble cocktail table", type: "main" },
      { url: "assets/magazines/7a542e2d-ed2f-4a41-a70e-048a0f5d9961.webp", caption: "Top View - Organic contour and dynamic veining", type: "alternate" },
      { url: "assets/curated/desk-02.jpg", caption: "Edge Detail - Pillowed bullnose hand finish", type: "detail" },
      { url: "assets/curated/desk-03.jpg", caption: "Lifestyle - Styled with terracotta vessels and art books", type: "lifestyle" }
    ],
    relatedSkus: ["AL-FUR-001", "AL-DEC-002", "AL-DEC-001"]
  },
  {
    id: "AL-DEC-001",
    sku: "AL-DEC-001",
    name: "Santorini Terracotta Amphora",
    category: "decor",
    categoryLabel: "Home Décor",
    price: 320,
    shortDesc: "Hand-thrown porous terracotta vessel finished with Mediterranean lime-wash.",
    description: "Wheel-thrown by Aegean ceramicists using iron-rich coastal clay. Finished with a breathable whitewash glaze that develops an authentic sun-aged chalk patina over time.",
    material: "Aegean terracotta clay, mineral lime wash, waterproof internal reservoir.",
    dimensions: "Diameter: 34 cm • Height: 50 cm",
    weight: "7.5 kg",
    stock: 16,
    isFeatured: true,
    variants: [
      { id: "coastal-terracotta", name: "Coastal Terracotta", hex: "#C67252", isDefault: true },
      { id: "chalk-white", name: "Chalk Whitewash", hex: "#F0EBE1" }
    ],
    images: [
      { url: "assets/curated/vase-04.jpg", caption: "Main View - Hand-thrown terracotta amphora vessel", type: "main" },
      { url: "assets/curated/vase-05.jpg", caption: "Surface Detail - Porous mineral lime wash texture", type: "alternate" },
      { url: "assets/curated/vase-06.jpg", caption: "Handle Detail - Pinched loop clay handles", type: "detail" },
      { url: "assets/curated/vase-02.jpg", caption: "Lifestyle - Placed against stone patio wall with olive branch", type: "lifestyle" }
    ],
    relatedSkus: ["AL-DEC-002", "AL-FUR-001"]
  },
  {
    id: "AL-DEC-002",
    sku: "AL-DEC-002",
    name: "Mykonos Organic Asymmetric Mirror",
    category: "decor",
    categoryLabel: "Home Décor",
    price: 490,
    shortDesc: "Fluid cast plaster frame evoking undulating Cycladic island architecture.",
    description: "Undulating sculpted contours hand-shaped in textured plaster capture the changing coastal light throughout the day, opening up living rooms and dressing spaces.",
    material: "Reinforced structural plaster, optic silver mirror, French cleat wall mounting.",
    dimensions: "Width: 70 cm • Height: 115 cm • Depth: 4.5 cm",
    weight: "14 kg",
    stock: 10,
    isFeatured: false,
    variants: [
      { id: "cycladic-white", name: "Cycladic White", hex: "#F9F8F5", isDefault: true },
      { id: "warm-travertine", name: "Warm Travertine", hex: "#DFD5C4" }
    ],
    images: [
      { url: "assets/magazines/923e4bb3-ccc1-4efb-806a-bfc42fdd3565.webp", caption: "Main View - Organic asymmetric plaster mirror", type: "main" },
      { url: "assets/magazines/a3ab6983-e2aa-4589-94ff-b0ce24f9dea1.webp", caption: "Frame Detail - Tactile lime-plaster hand curve", type: "alternate" },
      { url: "assets/magazines/ca22619b-3da0-49d0-9829-0146c7dcc909.webp", caption: "Mounting Profile - Recessed shadow gap", type: "detail" },
      { url: "assets/magazines/de179757-6ab3-4cb0-9b56-84039d2ba4dc.webp", caption: "Lifestyle - Entryway illumination reflection", type: "lifestyle" }
    ],
    relatedSkus: ["AL-FUR-002", "AL-SSS-001"]
  },
  {
    id: "AL-LGT-001",
    sku: "AL-LGT-001",
    name: "Riviera Fluted Glass Pendant",
    category: "lighting",
    categoryLabel: "Lighting",
    price: 410,
    shortDesc: "Mouth-blown optic fluted glass suspension with solid brushed marine brass accents.",
    description: "Prismatic fluted glass casts rhythmic ripples of light across stone surfaces. Unlacquered marine brass develops a natural coastal patina that deepens with age.",
    material: "Mouth-blown borosilicate fluted glass, unlacquered marine brass.",
    dimensions: "Diameter: 36 cm • Height: 42 cm • Cord Length: 220 cm",
    weight: "3.2 kg",
    stock: 11,
    isFeatured: true,
    variants: [
      { id: "clear-fluted", name: "Clear Optic Flute", hex: "#EBF1F5", isDefault: true },
      { id: "sea-amber", name: "Warm Sea Amber", hex: "#E4C49E" }
    ],
    images: [
      { url: "assets/curated/pendant-04.jpg", caption: "Main View - Fluted glass suspension pendant", type: "main" },
      { url: "assets/curated/pendant-05.jpg", caption: "Light Refraction - Prismatic ripple effect", type: "alternate" },
      { url: "assets/curated/pendant-06.jpg", caption: "Hardware Detail - Brushed marine brass gallery", type: "detail" },
      { url: "assets/curated/pendant-02.jpg", caption: "Lifestyle - Suspended above coastal dining island", type: "lifestyle" }
    ],
    relatedSkus: ["AL-FUR-001", "AL-FUR-002"]
  },
  {
    id: "AL-SSS-001",
    sku: "AL-SSS-001",
    name: "Positano Floating Wall Credenza",
    category: "small-spaces",
    categoryLabel: "Small Space Solutions",
    price: 980,
    shortDesc: "Slatted bleach oak hanging console designed for narrow coastal corridors.",
    description: "Slender tambour sliding doors glide effortlessly across continuous oak slats, hiding entertainment accessories and entryway essentials without consuming floor real estate.",
    material: "Solid coastal French oak, tambour door joinery, heavy-duty wall anchors.",
    dimensions: "Width: 135 cm • Depth: 28 cm • Height: 26 cm",
    weight: "21 kg",
    stock: 9,
    isFeatured: false,
    variants: [
      { id: "sun-bleached-oak", name: "Sun-Bleached Oak", hex: "#D9CEBC", isDefault: true },
      { id: "weathered-driftwood", name: "Weathered Driftwood", hex: "#9F9B93" }
    ],
    images: [
      { url: "assets/magazines/ca22619b-3da0-49d0-9829-0146c7dcc909.webp", caption: "Main View - Wall-hung slatted bleached oak credenza", type: "main" },
      { url: "assets/magazines/de179757-6ab3-4cb0-9b56-84039d2ba4dc.webp", caption: "Tambour Action - Smooth curved sliding door", type: "alternate" },
      { url: "assets/magazines/f7b8e266-e96a-4ec0-aaea-d5e15b1942ad.webp", caption: "Wood Texture - Open-pore brushed natural oak grain", type: "detail" },
      { url: "assets/curated/desk-06.jpg", caption: "Lifestyle - Narrow coastal corridor gallery wall", type: "lifestyle" }
    ],
    relatedSkus: ["AL-DEC-002", "AL-DEC-001"]
  }
];

export const SAAS_PLANS = {
  starter: {
    id: 'starter',
    name: 'Starter',
    price: 19,
    billing: 'mo',
    trialDays: 7,
    maxProducts: 15,
    tagline: 'Standard Storefront',
    desc: '$19 / mo after 7-day free trial',
    features: ['7-Day Free Trial Included', 'Up to 15 Products', 'Standard Storefront & Catalog', 'Integrated Cart & Orders']
  },
  pro: {
    id: 'pro',
    name: 'Studio Pro',
    price: 49,
    billing: 'mo',
    trialDays: 7,
    maxProducts: -1,
    tagline: 'Full Studio Experience',
    badge: 'Popular',
    desc: '$49 / mo after 7-day free trial',
    features: ['7-Day Free Trial Included', 'Unlimited Products', '3D Editorial Magazine', 'PWA Installable Mobile App', 'Custom Color Themes']
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99,
    billing: 'mo',
    trialDays: 7,
    maxProducts: -1,
    tagline: 'Multi-Branch & Custom Domain',
    desc: '$99 / mo after 7-day free trial',
    features: ['7-Day Free Trial Included', 'Multi-Branch Stores', 'Custom Domain Support', 'Priority SLA & Cloud Sync', 'Dedicated Manager']
  }
};

export const PRESEEDED_TENANTS = {
  'homehub': {
    slug: 'homehub',
    name: 'HomeHub Luxury Living',
    shortName: 'HomeHub',
    tagline: 'SHOP • STYLE • SMART',
    kicker: 'LUXURY LIVING • ARCHITECTURAL HOMES',
    badge: '🏛️',
    currency: {
      code: 'PKR',
      symbol: '₨',
      locale: 'en-PK',
      label: 'Pakistani Rupee'
    },
    theme: {
      primaryColor: '#C26E4B',
      primaryHover: '#A85735',
      accentColor: '#C26E4B',
      bgLight: '#FDFBF7'
    },
    plan: 'enterprise',
    planPrice: 99,
    status: 'active',
    paymentMethod: 'Platform Master',
    paymentRef: 'PLATFORM-DIRECT',
    description: 'Heirloom modern furniture, Italian bouclé, and monolithic stone living.',
    products: null // Default HomeHub catalog (INITIAL_PRODUCTS + stored custom)
  },

  'studio-noor': {
    slug: 'studio-noor',
    name: 'Studio Noor Minimalist',
    shortName: 'Studio Noor',
    tagline: 'Wabi-Sabi Sanctuary & Japandi Warmth',
    kicker: 'MINIMALIST ARCHITECTURE • JAPANDI FORMS',
    badge: '🌿',
    currency: {
      code: 'USD',
      symbol: '$',
      locale: 'en-US',
      label: 'US Dollar'
    },
    theme: {
      primaryColor: '#5C6B5E',
      primaryHover: '#4A574C',
      accentColor: '#7A8C7C',
      bgLight: '#F7F8F6'
    },
    plan: 'pro',
    planPrice: 49,
    status: 'active',
    paymentMethod: 'Credit Card',
    paymentRef: 'CARD-AUTH-8821',
    description: 'Raw hinoki timber, textured washi illumination, and serene low-profile living.',
    products: STUDIO_NOOR_PRODUCTS
  },

  'aurelia-living': {
    slug: 'aurelia-living',
    name: 'Aurelia Coastal Decor',
    shortName: 'Aurelia Living',
    tagline: 'Organic Mediterranean & Coastal Atmosphere',
    kicker: 'MEDITERRANEAN COASTAL • SUN-BLEACHED TEXTURES',
    badge: '🌊',
    currency: {
      code: 'EUR',
      symbol: '€',
      locale: 'de-DE',
      label: 'Euro'
    },
    theme: {
      primaryColor: '#2E6875',
      primaryHover: '#23515C',
      accentColor: '#458594',
      bgLight: '#F5F9FA'
    },
    plan: 'pro',
    planPrice: 49,
    status: 'active',
    paymentMethod: 'Bank Wire',
    paymentRef: 'WIRE-DE-4401',
    description: 'Sun-bleached linen, porous calcarenite stone, and Aegean seaside ambiance.',
    products: AURELIA_LIVING_PRODUCTS
  }
};

export class TenantService {
  constructor() {
    this.tenants = { ...PRESEEDED_TENANTS };
    this.activeSlug = 'homehub';
    this.loadCustomTenants();
  }

  loadCustomTenants() {
    const customList = storage.get('homehub_custom_tenants', []);
    if (Array.isArray(customList)) {
      customList.forEach(t => {
        if (t && t.slug) {
          if (!t.status) t.status = 'trial';
          if (!t.plan) t.plan = 'pro';
          if (!t.planPrice) t.planPrice = (SAAS_PLANS[t.plan] || SAAS_PLANS.pro).price;
          if (t.status === 'trial' && !t.trialEndsAt) {
            t.trialStartedAt = t.createdAt || new Date().toISOString();
            t.trialEndsAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
            t.trialDays = 7;
          }
          this.tenants[t.slug] = t;
        }
      });
    }
  }

  saveCustomTenants() {
    const customOnly = Object.values(this.tenants).filter(t => !PRESEEDED_TENANTS[t.slug]);
    storage.set('homehub_custom_tenants', customOnly);
  }

  init() {
    // 1. Inspect URL query parameter ?store=<slug>
    let urlSlug = null;
    if (typeof window !== 'undefined' && window.location && window.location.search) {
      try {
        const params = new URLSearchParams(window.location.search);
        urlSlug = params.get('store');
      } catch (_) {}
    }

    // 2. Persisted selection fallback
    const storedSlug = storage.get('active_tenant_slug', null);

    const targetSlug = (urlSlug && this.tenants[urlSlug])
      ? urlSlug
      : ((storedSlug && this.tenants[storedSlug]) ? storedSlug : 'homehub');

    this.activeSlug = targetSlug;
    storage.set('active_tenant_slug', targetSlug);

    // Sync URL if needed
    if (typeof window !== 'undefined' && window.history && urlSlug !== targetSlug && targetSlug !== 'homehub') {
      try {
        const url = new URL(window.location.href);
        url.searchParams.set('store', targetSlug);
        window.history.replaceState(null, '', url.toString());
      } catch (_) {}
    }

    return this.getActiveTenant();
  }

  getActiveSlug() {
    return this.activeSlug || 'homehub';
  }

  getActiveTenant() {
    return this.tenants[this.activeSlug] || this.tenants['homehub'];
  }

  getAllTenants() {
    return Object.values(this.tenants);
  }

  getTenant(slug) {
    return this.tenants[slug] || null;
  }

  setActiveTenant(slug) {
    if (!this.tenants[slug]) {
      console.warn(`Tenant "${slug}" not found, falling back to homehub.`);
      slug = 'homehub';
    }
    this.activeSlug = slug;
    storage.set('active_tenant_slug', slug);

    // Update URL query ?store=<slug>
    if (typeof window !== 'undefined' && window.history) {
      try {
        const url = new URL(window.location.href);
        if (slug === 'homehub') {
          url.searchParams.delete('store');
        } else {
          url.searchParams.set('store', slug);
        }
        window.history.pushState(null, '', url.toString());
      } catch (_) {}
    }

    return this.getActiveTenant();
  }

  createTenant({
    name,
    slug,
    tagline,
    currencyCode = 'USD',
    themeColor = '#5C6B5E',
    badge = '✨',
    planId = 'pro',
    paymentMethod = 'Credit Card',
    paymentRef = '',
    ownerPin = ''
  }) {
    if (!name || !slug) {
      throw new Error('Tenant brand name and slug are required.');
    }

    // Sanitize slug
    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9\-]/g, '-').replace(/^-+|-+$/g, '');
    if (!cleanSlug) {
      throw new Error('Invalid slug format. Use letters, numbers, and hyphens.');
    }

    // Resolve plan
    const plan = SAAS_PLANS[planId] || SAAS_PLANS.pro;

    // Currency metadata map
    const CURRENCY_MAP = {
      'USD': { code: 'USD', symbol: '$', locale: 'en-US', label: 'US Dollar' },
      'EUR': { code: 'EUR', symbol: '€', locale: 'de-DE', label: 'Euro' },
      'GBP': { code: 'GBP', symbol: '£', locale: 'en-GB', label: 'British Pound' },
      'PKR': { code: 'PKR', symbol: '₨', locale: 'en-PK', label: 'Pakistani Rupee' }
    };

    const currency = CURRENCY_MAP[currencyCode] || CURRENCY_MAP['USD'];

    // Check if owner PIN provided for instant activation
    const isOwnerActivated = (ownerPin && ownerPin.trim() === 'OWNER-2026');
    const now = new Date();
    const trialEnds = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const initialStatus = isOwnerActivated ? 'active' : 'trial';

    // Create starter products cloned from existing catalog with tailored prices/skus
    const starterProducts = STUDIO_NOOR_PRODUCTS.slice(0, 4).map((p, idx) => ({
      ...p,
      id: `${cleanSlug.toUpperCase()}-${idx + 1}`,
      sku: `${cleanSlug.toUpperCase()}-${idx + 1}`,
      name: `${name} ${p.name.split(' ').slice(1).join(' ')}`,
      price: currency.code === 'PKR' ? p.price * 270 : p.price
    }));

    const newTenant = {
      slug: cleanSlug,
      name,
      shortName: name.split(' ')[0],
      tagline: tagline || `${name} Atelier Collection`,
      kicker: `${name.toUpperCase()} • CURATED DESIGN`,
      badge: badge || '✨',
      currency,
      theme: {
        primaryColor: themeColor,
        primaryHover: this.adjustBrightness(themeColor, -20),
        accentColor: themeColor,
        bgLight: '#FAFAFA'
      },
      plan: plan.id,
      planName: plan.name,
      planPrice: plan.price,
      status: initialStatus,
      trialStartedAt: isOwnerActivated ? null : now.toISOString(),
      trialEndsAt: isOwnerActivated ? null : trialEnds.toISOString(),
      trialDays: 7,
      paymentMethod: paymentMethod || 'Credit / Debit Card',
      paymentRef: paymentRef || (isOwnerActivated ? 'OWNER-KEY-ACTIVATED' : 'TRIAL-FREE-7D'),
      description: `Bespoke storefront powered by HomeHub Multi-Tenant SaaS.`,
      products: starterProducts,
      createdAt: now.toISOString(),
      activatedAt: isOwnerActivated ? now.toISOString() : null
    };

    this.tenants[cleanSlug] = newTenant;
    this.saveCustomTenants();
    return newTenant;
  }

  checkTrialStatus(slug) {
    if (!slug || slug === 'homehub' || PRESEEDED_TENANTS[slug]) {
      return 'active';
    }
    const t = this.tenants[slug];
    if (!t) return 'unknown';

    if (t.status === 'trial') {
      if (t.trialEndsAt && new Date(t.trialEndsAt).getTime() <= Date.now()) {
        t.status = 'trial_expired';
        this.saveCustomTenants();
      }
    }
    return t.status;
  }

  getTrialDaysRemaining(slug) {
    const t = typeof slug === 'string' ? this.tenants[slug] : slug;
    if (!t || t.status !== 'trial' || !t.trialEndsAt) return 0;
    const diff = new Date(t.trialEndsAt).getTime() - Date.now();
    if (diff <= 0) return 0;
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  isTenantActive(slug) {
    if (!slug || slug === 'homehub' || PRESEEDED_TENANTS[slug]) return true;
    const t = this.tenants[slug];
    if (!t) return false;
    this.checkTrialStatus(slug);
    if (t.status === 'active') return true;
    if (t.status === 'trial') {
      return Boolean(t.trialEndsAt && new Date(t.trialEndsAt).getTime() > Date.now());
    }
    return false;
  }

  updateTenantStatus(slug, newStatus) {
    if (!this.tenants[slug]) {
      throw new Error(`Tenant "${slug}" not found.`);
    }
    const tenant = this.tenants[slug];
    tenant.status = newStatus;
    if (newStatus === 'active') {
      tenant.activatedAt = new Date().toISOString();
    }
    this.saveCustomTenants();
    return tenant;
  }

  extendTenantTrial(slug, days = 7) {
    if (!this.tenants[slug]) {
      throw new Error(`Tenant "${slug}" not found.`);
    }
    const tenant = this.tenants[slug];
    const currentEnd = tenant.trialEndsAt ? new Date(tenant.trialEndsAt).getTime() : Date.now();
    const baseTime = Math.max(Date.now(), currentEnd);
    tenant.trialEndsAt = new Date(baseTime + days * 24 * 60 * 60 * 1000).toISOString();
    tenant.status = 'trial';
    this.saveCustomTenants();
    return tenant;
  }

  simulateTrialExpiry(slug) {
    if (!this.tenants[slug]) {
      throw new Error(`Tenant "${slug}" not found.`);
    }
    const tenant = this.tenants[slug];
    tenant.trialEndsAt = new Date(Date.now() - 3600 * 1000).toISOString();
    tenant.status = 'trial_expired';
    this.saveCustomTenants();
    return tenant;
  }

  activatePaidPlan(slug, paymentMethod, paymentRef) {
    if (!this.tenants[slug]) {
      throw new Error(`Tenant "${slug}" not found.`);
    }
    const tenant = this.tenants[slug];
    tenant.status = 'active';
    tenant.activatedAt = new Date().toISOString();
    if (paymentMethod) tenant.paymentMethod = paymentMethod;
    if (paymentRef) tenant.paymentRef = paymentRef;
    this.saveCustomTenants();
    return tenant;
  }

  calculateMRR() {
    return Object.values(this.tenants)
      .filter(t => t.status === 'active')
      .reduce((sum, t) => sum + (t.planPrice || 0), 0);
  }

  verifyOwnerPin(pin) {
    return typeof pin === 'string' && pin.trim() === 'OWNER-2026';
  }

  adjustBrightness(hex, percent) {
    try {
      const num = parseInt(hex.replace('#', ''), 16);
      const amt = Math.round(2.55 * percent);
      const R = (num >> 16) + amt;
      const G = (num >> 8 & 0x00FF) + amt;
      const B = (num & 0x0000FF) + amt;
      return '#' + (0x1000000 + (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)).toString(16).slice(1);
    } catch (_) {
      return hex;
    }
  }

  getProductsForTenant(slug = null) {
    const targetSlug = slug || this.activeSlug || 'homehub';
    const tenant = this.tenants[targetSlug] || this.tenants['homehub'];

    if (targetSlug === 'homehub') {
      let stored = storage.get('custom_products', null);
      if (!stored || !Array.isArray(stored) || stored.length === 0) {
        if (typeof window !== 'undefined' && window.localStorage) {
          try {
            const raw = window.localStorage.getItem('homehub_custom_products') || window.localStorage.getItem('homehub_products');
            if (raw) stored = JSON.parse(raw);
          } catch (_) {}
        }
      }
      return (Array.isArray(stored) && stored.length > 0) ? stored : INITIAL_PRODUCTS;
    }

    // For non-homehub tenants, inspect tenant-scoped storage first
    const tenantStorageKey = `tenant_${targetSlug}_products`;
    const storedTenantProducts = storage.get(tenantStorageKey, null);
    if (Array.isArray(storedTenantProducts) && storedTenantProducts.length > 0) {
      return storedTenantProducts;
    }

    return tenant.products || [];
  }

  formatPrice(amount, tenant = null) {
    const t = tenant || this.getActiveTenant();
    if (typeof amount !== 'number' || isNaN(amount)) {
      return (t.currency ? t.currency.symbol : '₨') + ' 0';
    }

    const curr = t.currency || { code: 'PKR', symbol: '₨', locale: 'en-PK' };

    // Format localized
    const formattedNum = amount.toLocaleString(curr.locale || 'en-US', {
      maximumFractionDigits: curr.code === 'PKR' ? 0 : 2,
      minimumFractionDigits: 0
    });

    return `${curr.symbol} ${formattedNum}`;
  }

  applyTenantTheme(tenant = null) {
    const t = tenant || this.getActiveTenant();
    if (typeof document === 'undefined') return;

    // Apply CSS Variables
    const root = document.documentElement;
    if (t.theme && t.theme.primaryColor) {
      root.style.setProperty('--color-terracotta', t.theme.primaryColor);
      root.style.setProperty('--color-accent', t.theme.primaryColor);
      root.style.setProperty('--color-primary', t.theme.primaryColor);
      if (t.theme.primaryHover) {
        root.style.setProperty('--color-terracotta-dark', t.theme.primaryHover);
      }
    }

    // Update Header Brand Label & Badge
    const headerTenantBadge = document.getElementById('header-tenant-badge');
    const headerTenantName = document.getElementById('header-tenant-name');
    if (headerTenantBadge) headerTenantBadge.textContent = t.badge || '🏛️';
    if (headerTenantName) headerTenantName.textContent = t.shortName || t.name;

    // Update Document Title
    document.title = `${t.name} — ${t.tagline}`;

    // Update Hero Kicker if present
    const heroKicker = document.querySelector('.hero-kicker');
    if (heroKicker) {
      heroKicker.textContent = t.kicker || `${t.name.toUpperCase()} • CURATED DESIGN`;
    }

    // Update Preloader Brand
    const preloaderBrand = document.querySelector('.preloader-brand');
    const preloaderTag = document.querySelector('.preloader-tagline');
    if (preloaderBrand) preloaderBrand.textContent = (t.shortName || t.name).toUpperCase();
    if (preloaderTag) preloaderTag.textContent = t.tagline;

    // Update PWA Theme Color Meta Tag
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta && t.theme && t.theme.primaryColor) {
      themeColorMeta.setAttribute('content', t.theme.primaryColor);
    }
  }
}

export const tenantService = new TenantService();
