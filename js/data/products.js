/**
 * HomeHub - Independent Product Catalogue
 * Visual Direction: Soft Luxury Modern
 * Currency: PKR (Pakistani Rupee)
 * 
 * Note: These are initial catalogue concepts with curated aesthetic imagery.
 * All specifications and placeholder imagery will be bound to real supplier feeds in production.
 */

export const INITIAL_PRODUCTS = [
  // --- FURNITURE ---
  {
    id: "HH-FUR-001",
    sku: "HH-FUR-001",
    name: "CloudCurve Sofa",
    category: "furniture",
    categoryLabel: "Furniture",
    price: 345000,
    shortDesc: "Sculptural organic silhouette wrapped in tactile Italian boucle fabric.",
    description: "The CloudCurve Sofa anchors living spaces with fluid, welcoming contours. Handcrafted with an FSC-certified hardwood frame, dual-density memory foam cushioning, and upholstered in premium textured boucle that softens ambient sound while offering enveloping comfort.",
    material: "Textured Bouclé (90% Wool, 10% Linen blend), kiln-dried beechwood frame, pocket springs.",
    dimensions: "Width: 240 cm • Depth: 105 cm • Height: 74 cm • Seat Height: 42 cm",
    weight: "78 kg",
    stock: 6,
    isFeatured: true,
    variants: [
      { id: "ivory", name: "Soft Ivory", hex: "#F8F5EF", isDefault: true },
      { id: "warm-beige", name: "Warm Beige", hex: "#EADCCB" },
      { id: "sage-mist", name: "Sage Mist", hex: "#DDE8DF" }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=85",
        caption: "Main Product View - Sculptural curved silhouette",
        type: "main"
      },
      {
        url: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=85",
        caption: "Alternate Angle - Low profile architectural back",
        type: "alternate"
      },
      {
        url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=85",
        caption: "Material Detail - Tactile Italian bouclé weave",
        type: "detail"
      },
      {
        url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85",
        caption: "Lifestyle Interior - Soft luxury salon setting",
        type: "lifestyle"
      }
    ],
    relatedSkus: ["HH-FUR-002", "HH-FUR-003", "HH-LGT-001", "HH-DEC-003"]
  },
  {
    id: "HH-FUR-002",
    sku: "HH-FUR-002",
    name: "Noma Coffee Table",
    category: "furniture",
    categoryLabel: "Furniture",
    price: 125000,
    shortDesc: "Monolithic travertine low table with softened bullnose edges.",
    description: "Carved from solid honed Roman travertine, the Noma Coffee Table embodies natural permanence and quiet luxury. Each slab celebrates unique sediment striations and delicate geological veining, sealed with a matte protective finish.",
    material: "Honed Roman Travertine Stone, reinforced internal steel dowels, matte stain sealant.",
    dimensions: "Length: 130 cm • Width: 75 cm • Height: 33 cm",
    weight: "62 kg",
    stock: 9,
    isFeatured: true,
    variants: [
      { id: "warm-travertine", name: "Warm Travertine", hex: "#EADCCB", isDefault: true },
      { id: "chalk-limestone", name: "Chalk Limestone", hex: "#F8F5EF" }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1200&q=85",
        caption: "Main Product View - Honed stone surface with organic edge",
        type: "main"
      },
      {
        url: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1200&q=85",
        caption: "Alternate Angle - Grounded monolithic plinth base",
        type: "alternate"
      },
      {
        url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",
        caption: "Material Detail - Natural travertine sediment veining",
        type: "detail"
      },
      {
        url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85",
        caption: "Lifestyle Interior - Paired with CloudCurve sofa and low ceramics",
        type: "lifestyle"
      }
    ],
    relatedSkus: ["HH-FUR-001", "HH-DEC-001", "HH-LGT-002"]
  },
  {
    id: "HH-FUR-003",
    sku: "HH-FUR-003",
    name: "Aura Lounge Chair",
    category: "furniture",
    categoryLabel: "Furniture",
    price: 165000,
    shortDesc: "Cocooning club chair featuring champagne bronze swivel base.",
    description: "The Aura Lounge Chair pairs tailored curvilinear ergonomics with a smooth 360-degree champagne bronze swivel. Designed for reading nooks and conversational living spaces, it delivers cloud-like lumbar support without visual bulk.",
    material: "Plush Merino-blend shearling, brushed champagne brass steel base, ergonomic molded shell.",
    dimensions: "Width: 88 cm • Depth: 84 cm • Height: 78 cm • Seat Height: 41 cm",
    weight: "28 kg",
    stock: 8,
    isFeatured: true,
    variants: [
      { id: "soft-ivory", name: "Soft Ivory Shearling", hex: "#F8F5EF", isDefault: true },
      { id: "dusty-blush", name: "Dusty Blush Velvet", hex: "#E9D8D0" },
      { id: "sage-mist", name: "Sage Mist Bouclé", hex: "#DDE8DF" }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=1200&q=85",
        caption: "Main Product View - Sculptural shearling armchair",
        type: "main"
      },
      {
        url: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=85",
        caption: "Alternate Angle - 360° Champagne bronze pivot mechanism",
        type: "alternate"
      },
      {
        url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=85",
        caption: "Material Detail - Tactile shearling wool pile",
        type: "detail"
      },
      {
        url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85",
        caption: "Lifestyle Interior - Sunlit reading sanctuary",
        type: "lifestyle"
      }
    ],
    relatedSkus: ["HH-LGT-002", "HH-FUR-001", "HH-DEC-004"]
  },
  {
    id: "HH-FUR-004",
    sku: "HH-FUR-004",
    name: "Haven Bed",
    category: "furniture",
    categoryLabel: "Furniture",
    price: 285000,
    shortDesc: "Low-profile upholstered platform bed with winged floating headboard.",
    description: "Haven Bed reimagines modern slumber as a tranquil retreat. With its seamless wraparound padded headboard, inset solid oak perimeter plinth, and acoustic dampening frame, it brings architectural serenity to master and guest suites.",
    material: "Woven Belgian Linen-Cotton blend, solid white oak recessed plinth, birch slat system.",
    dimensions: "King: Width: 215 cm • Length: 228 cm • Headboard Height: 98 cm",
    weight: "92 kg",
    stock: 5,
    isFeatured: false,
    variants: [
      { id: "warm-beige", name: "Warm Beige Linen", hex: "#EADCCB", isDefault: true },
      { id: "soft-ivory", name: "Soft Ivory Canvas", hex: "#F8F5EF" },
      { id: "sage-mist", name: "Sage Mist Flannel", hex: "#DDE8DF" }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=85",
        caption: "Main Product View - Clean horizontal bedframe and cushioned wings",
        type: "main"
      },
      {
        url: "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=1200&q=85",
        caption: "Alternate Angle - Recessed oak floating effect",
        type: "alternate"
      },
      {
        url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=85",
        caption: "Material Detail - Hand-tailored linen seam stitching",
        type: "detail"
      },
      {
        url: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85",
        caption: "Lifestyle Interior - Monochromatic restful bedroom sanctuary",
        type: "lifestyle"
      }
    ],
    relatedSkus: ["HH-LGT-003", "HH-DEC-003", "HH-DEC-004"]
  },

  // --- HOME DÉCOR ---
  {
    id: "HH-DEC-001",
    sku: "HH-DEC-001",
    name: "Solis Ceramic Vase",
    category: "decor",
    categoryLabel: "Home Décor",
    price: 28500,
    shortDesc: "Wheel-thrown earthenware vessel with matte chalk mineral glaze.",
    description: "Hand-turned by master artisans, the Solis Ceramic Vase celebrates tactile asymmetry and sculptural quietude. Waterproof glazed interior supports fresh botanical stems or stands independently as an objet d'art on consoles and tables.",
    material: "High-fired terracotta stoneware, custom matte chalk glaze, unglazed raw base.",
    dimensions: "Diameter: 22 cm • Height: 34 cm • Neck: 7.5 cm",
    weight: "3.4 kg",
    stock: 15,
    isFeatured: true,
    variants: [
      { id: "soft-ivory", name: "Chalk Ivory", hex: "#F8F5EF", isDefault: true },
      { id: "dusty-blush", name: "Terracotta Blush", hex: "#E9D8D0" },
      { id: "sage-mist", name: "Sage Earth", hex: "#DDE8DF" }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1200&q=85",
        caption: "Main Product View - Sculptural wheel-thrown silhouette",
        type: "main"
      },
      {
        url: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=85",
        caption: "Alternate Angle - Dramatic vessel profile with dried florals",
        type: "alternate"
      },
      {
        url: "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=1200&q=85",
        caption: "Material Detail - Fine matte stoneware glaze texture",
        type: "detail"
      },
      {
        url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=85",
        caption: "Lifestyle Interior - Styled atop Noma travertine table",
        type: "lifestyle"
      }
    ],
    relatedSkus: ["HH-DEC-002", "HH-FUR-002", "HH-DEC-004"]
  },
  {
    id: "HH-DEC-002",
    sku: "HH-DEC-002",
    name: "Forma Wall Art",
    category: "decor",
    categoryLabel: "Home Décor",
    price: 45000,
    shortDesc: "Triptych of tactile plaster relief compositions in raw timber frames.",
    description: "Created in limited studio runs, the Forma Wall Art captures shifting shadows across layered mineral plaster bas-reliefs. Framed in natural solid white ash with float-mounting, each panel plays subtly with changing daylight.",
    material: "Mineral plaster on linen ground, solid white ash frame, UV-filtering acrylic float frame.",
    dimensions: "Each panel: 60 cm x 80 cm x 4 cm (Total span approx 195 cm)",
    weight: "8.5 kg (set of 3)",
    stock: 11,
    isFeatured: false,
    variants: [
      { id: "soft-ivory", name: "Ivory Relief", hex: "#F8F5EF", isDefault: true },
      { id: "warm-beige", name: "Warm Clay Relief", hex: "#EADCCB" }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1200&q=85",
        caption: "Main Product View - Minimalist textured relief artwork",
        type: "main"
      },
      {
        url: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1200&q=85",
        caption: "Alternate Angle - Shadow casting on sculptural plaster folds",
        type: "alternate"
      },
      {
        url: "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=1200&q=85",
        caption: "Material Detail - Natural ash timber frame and textured gesso",
        type: "detail"
      },
      {
        url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=85",
        caption: "Lifestyle Interior - Centered above CloudCurve Sofa",
        type: "lifestyle"
      }
    ],
    relatedSkus: ["HH-FUR-001", "HH-DEC-001", "HH-DEC-004"]
  },
  {
    id: "HH-DEC-003",
    sku: "HH-DEC-003",
    name: "CloudSoft Cushions",
    category: "decor",
    categoryLabel: "Home Décor",
    price: 14500,
    shortDesc: "Feather-filled accent cushion in enzyme-washed French flax linen.",
    description: "The CloudSoft Cushion introduces soft tactile layering to sofas and daybeds. Pre-washed for a relaxed drape with knife-edge tailoring and stuffed with 100% ethically sourced down for effortless chopability.",
    material: "100% French flax linen cover, hidden YKK zip, RDS-certified 90/10 duck down-feather insert.",
    dimensions: "55 cm x 55 cm square",
    weight: "1.2 kg",
    stock: 24,
    isFeatured: false,
    variants: [
      { id: "dusty-blush", name: "Dusty Blush", hex: "#E9D8D0", isDefault: true },
      { id: "sage-mist", name: "Sage Mist", hex: "#DDE8DF" },
      { id: "warm-beige", name: "Warm Beige", hex: "#EADCCB" },
      { id: "soft-ivory", name: "Soft Ivory", hex: "#F8F5EF" }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1200&q=85",
        caption: "Main Product View - Washed linen cushion with natural relaxed hand",
        type: "main"
      },
      {
        url: "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=85",
        caption: "Alternate Angle - Stacked cushion colour palette",
        type: "alternate"
      },
      {
        url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=85",
        caption: "Material Detail - Fine weave French flax texture and flange hem",
        type: "detail"
      },
      {
        url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=85",
        caption: "Lifestyle Interior - Arranged on CloudCurve Sofa",
        type: "lifestyle"
      }
    ],
    relatedSkus: ["HH-FUR-001", "HH-FUR-003", "HH-FUR-004"]
  },
  {
    id: "HH-DEC-004",
    sku: "HH-DEC-004",
    name: "Halo Mirror",
    category: "decor",
    categoryLabel: "Home Décor",
    price: 58000,
    shortDesc: "Asymmetrical organic mirror framed in soft champagne brushed brass.",
    description: "With its pebble-inspired contour and recessed slender brass bezel, the Halo Mirror expands interior light while serving as a fluid focal point. Engineered with museum-grade distortion-free silvered glass and dual cleat hanging for vertical or horizontal orientation.",
    material: "Hand-formed solid brass rim with satin brushed lacquer, 5mm high-definition float mirror.",
    dimensions: "Height: 110 cm • Width: 75 cm • Depth: 3.5 cm",
    weight: "11 kg",
    stock: 7,
    isFeatured: true,
    variants: [
      { id: "soft-champagne", name: "Soft Champagne Brass", hex: "#D6BC91", isDefault: true },
      { id: "dark-bronze", name: "Muted Antique Bronze", hex: "#5C5046" }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=1200&q=85",
        caption: "Main Product View - Asymmetric pebble silhouette and brass rim",
        type: "main"
      },
      {
        url: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1200&q=85",
        caption: "Alternate Angle - Side profile showing deep recessed rim",
        type: "alternate"
      },
      {
        url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",
        caption: "Material Detail - Satin brushed champagne metal edge",
        type: "detail"
      },
      {
        url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85",
        caption: "Lifestyle Interior - Reflected ambient light in grand foyer",
        type: "lifestyle"
      }
    ],
    relatedSkus: ["HH-LGT-004", "HH-FUR-003", "HH-DEC-001"]
  },

  // --- LIGHTING ---
  {
    id: "HH-LGT-001",
    sku: "HH-LGT-001",
    name: "Luna Pendant",
    category: "lighting",
    categoryLabel: "Lighting",
    price: 62000,
    shortDesc: "Mouth-blown opal glass sphere suspended by brushed champagne brass stem.",
    description: "The Luna Pendant casts an ethereal, shadowless glow reminiscent of moonlight. Each triplex opal glass sphere is hand-blown and counter-weighted with precision-milled champagne brass fittings. Includes dim-to-warm integrated LED array.",
    material: "Acid-etched triplex opal glass, solid turned brass, champagne gold suspension rod.",
    dimensions: "Sphere Diameter: 35 cm • Adjustable Drop Length: 60 - 180 cm",
    weight: "4.8 kg",
    stock: 12,
    isFeatured: true,
    variants: [
      { id: "soft-champagne", name: "Soft Champagne Brass", hex: "#D6BC91", isDefault: true },
      { id: "matte-black", name: "Architectural Noir", hex: "#22201E" }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=85",
        caption: "Main Product View - Handblown opal glass orb illuminated",
        type: "main"
      },
      {
        url: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1200&q=85",
        caption: "Alternate Angle - Brushed brass canopy and clean drop rod",
        type: "alternate"
      },
      {
        url: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1200&q=85",
        caption: "Material Detail - Satin matte finish on etched glass",
        type: "detail"
      },
      {
        url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=85",
        caption: "Lifestyle Interior - Clustered above dining table setting",
        type: "lifestyle"
      }
    ],
    relatedSkus: ["HH-FUR-002", "HH-LGT-003", "HH-LGT-004"]
  },
  {
    id: "HH-LGT-002",
    sku: "HH-LGT-002",
    name: "Arc Floor Lamp",
    category: "lighting",
    categoryLabel: "Lighting",
    price: 78500,
    shortDesc: "Graceful cantilevered champagne brass arc anchored in honed beige marble.",
    description: "Balancing engineering poise with delicate presence, the Arc Floor Lamp spans gracefully over lounge seating to provide direct reading illumination or diffused uplight. The monolithic marble base provides unwavering stability.",
    material: "Honed Beige Brescia marble base, spun brass shade, seamless curved tubular steel.",
    dimensions: "Arc Reach: 165 cm • Total Height: 215 cm • Base: 38 cm Dia x 18 cm H",
    weight: "34 kg",
    stock: 6,
    isFeatured: true,
    variants: [
      { id: "soft-champagne", name: "Soft Champagne / Warm Marble", hex: "#D6BC91", isDefault: true },
      { id: "sage-mist", name: "Sage Bronze / Serpentine Marble", hex: "#DDE8DF" }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=85",
        caption: "Main Product View - Sweeping architectural cantilever",
        type: "main"
      },
      {
        url: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1200&q=85",
        caption: "Alternate Angle - Heavy sculpted marble floor anchor",
        type: "alternate"
      },
      {
        url: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1200&q=85",
        caption: "Material Detail - Spun champagne brass shade dome",
        type: "detail"
      },
      {
        url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=85",
        caption: "Lifestyle Interior - Hovering serenely over Aura Lounge Chair",
        type: "lifestyle"
      }
    ],
    relatedSkus: ["HH-FUR-003", "HH-FUR-001", "HH-LGT-001"]
  },
  {
    id: "HH-LGT-003",
    sku: "HH-LGT-003",
    name: "Glow Table Lamp",
    category: "lighting",
    categoryLabel: "Lighting",
    price: 36000,
    shortDesc: "Fluted travertine pedestal with a mushroom dome of warm diffused glow.",
    description: "The Glow Table Lamp casts a calming, downward pool of warm light across desks, nightstands, and side tables. Features tactile step-less touch dimming at the base crown and energy-efficient 2700K warm LED illumination.",
    material: "Solid fluted travertine stone, cast aluminum shade with soft ivory powder-coat, brass rotary dimmer.",
    dimensions: "Diameter: 28 cm • Height: 38 cm",
    weight: "4.2 kg",
    stock: 14,
    isFeatured: false,
    variants: [
      { id: "soft-ivory", name: "Travertine & Soft Ivory", hex: "#F8F5EF", isDefault: true },
      { id: "warm-beige", name: "Warm Beige Limestone", hex: "#EADCCB" },
      { id: "dusty-blush", name: "Rose Travertine & Blush", hex: "#E9D8D0" }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1200&q=85",
        caption: "Main Product View - Warm glowing mushroom dome",
        type: "main"
      },
      {
        url: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=85",
        caption: "Alternate Angle - Compact bedside profile",
        type: "alternate"
      },
      {
        url: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1200&q=85",
        caption: "Material Detail - Fluted natural stone base texture",
        type: "detail"
      },
      {
        url: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85",
        caption: "Lifestyle Interior - Placed on Haven Bed nightstand",
        type: "lifestyle"
      }
    ],
    relatedSkus: ["HH-FUR-004", "HH-DEC-001", "HH-LGT-004"]
  },
  {
    id: "HH-LGT-004",
    sku: "HH-LGT-004",
    name: "Aura Wall Light",
    category: "lighting",
    categoryLabel: "Lighting",
    price: 32500,
    shortDesc: "Concentric disc sconce producing an indirect solar eclipse halo on walls.",
    description: "Designed to transform flat walls into luminous canvases, the Aura Wall Light hides its light source behind twin champagne discs, splashing a soft radial halo outward without harsh glare. Suitable for corridors, bedrooms, and dining accents.",
    material: "Spun aluminum with champagne brass PVD finish, frosted acrylic diffuser ring.",
    dimensions: "Diameter: 30 cm • Projection from wall: 7.5 cm",
    weight: "2.1 kg",
    stock: 18,
    isFeatured: false,
    variants: [
      { id: "soft-champagne", name: "Soft Champagne", hex: "#D6BC91", isDefault: true },
      { id: "sage-mist", name: "Sage Mist Finish", hex: "#DDE8DF" }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1200&q=85",
        caption: "Main Product View - Illuminated eclipse halo on textured wall",
        type: "main"
      },
      {
        url: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=85",
        caption: "Alternate Angle - Ultra slim architectural projection",
        type: "alternate"
      },
      {
        url: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1200&q=85",
        caption: "Material Detail - Brushed champagne metal edge finish",
        type: "detail"
      },
      {
        url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=85",
        caption: "Lifestyle Interior - Flanking hallway art gallery",
        type: "lifestyle"
      }
    ],
    relatedSkus: ["HH-LGT-001", "HH-DEC-004", "HH-DEC-002"]
  },

  // --- SMALL SPACE SOLUTIONS ---
  {
    id: "HH-SSS-001",
    sku: "HH-SSS-001",
    name: "Modula Nested Desk",
    category: "small-spaces",
    categoryLabel: "Small Space Solutions",
    price: 89000,
    shortDesc: "Compact fluted console desk that slides open to reveal dual work surfaces.",
    description: "Specifically engineered for city apartments, the Modula Nested Desk transitions seamlessly between an elegant 35cm hallway console and a generous 75cm laptop workstation. Hidden soft-touch cable management conduits keep cords invisible.",
    material: "Solid and veneered White Ash in Soft Ivory stain, damped concealed brass ball-bearing runners.",
    dimensions: "Closed: 110 cm W x 38 cm D x 78 cm H • Extended: 110 cm W x 72 cm D",
    weight: "31 kg",
    stock: 7,
    isFeatured: true,
    variants: [
      { id: "soft-ivory", name: "Ivory Ash", hex: "#F8F5EF", isDefault: true },
      { id: "warm-beige", name: "Warm Bleached Oak", hex: "#EADCCB" }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=85",
        caption: "Main Product View - Closed minimalist console configuration",
        type: "main"
      },
      {
        url: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=85",
        caption: "Alternate Angle - Extended work surface for compact living",
        type: "alternate"
      },
      {
        url: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1200&q=85",
        caption: "Material Detail - Fluted ash drawer front and soft glides",
        type: "detail"
      },
      {
        url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85",
        caption: "Lifestyle Interior - Nook office styled in light-filled alcove",
        type: "lifestyle"
      }
    ],
    relatedSkus: ["HH-FUR-003", "HH-LGT-003", "HH-SSS-002"]
  },
  {
    id: "HH-SSS-002",
    sku: "HH-SSS-002",
    name: "Flute Floating Console",
    category: "small-spaces",
    categoryLabel: "Small Space Solutions",
    price: 74000,
    shortDesc: "Wall-hung fluted credenza with concealed magnetic drop-down doors.",
    description: "Freeing valuable floor space, the Flute Floating Console provides whisper-quiet enclosed storage with integrated ventilation slots for media components and wireless chargers. Supported by French cleat mounting tested up to 60 kg.",
    material: "FSC-certified fluted oak tambour, matte champagne anodized aluminum handle strip.",
    dimensions: "Width: 140 cm • Depth: 32 cm • Height: 24 cm",
    weight: "22 kg",
    stock: 9,
    isFeatured: false,
    variants: [
      { id: "warm-beige", name: "Warm Beige Oak", hex: "#EADCCB", isDefault: true },
      { id: "soft-ivory", name: "Ivory Chalk Ash", hex: "#F8F5EF" }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1200&q=85",
        caption: "Main Product View - Clean floating wall mount profile",
        type: "main"
      },
      {
        url: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=85",
        caption: "Alternate Angle - Tambour door opening detail",
        type: "alternate"
      },
      {
        url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",
        caption: "Material Detail - Tactile vertical flute wood grooves",
        type: "detail"
      },
      {
        url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85",
        caption: "Lifestyle Interior - Elevated entryway storage setting",
        type: "lifestyle"
      }
    ],
    relatedSkus: ["HH-DEC-004", "HH-DEC-001", "HH-SSS-001"]
  }
];

export const CATEGORIES = [
  { id: "all", name: "All Pieces", count: 14 },
  { id: "furniture", name: "Furniture", count: 4 },
  { id: "decor", name: "Home Décor", count: 4 },
  { id: "lighting", name: "Lighting", count: 4 },
  { id: "small-spaces", name: "Small Space Solutions", count: 2 }
];
