/**
 * HomeHub - Curated for Considered Spaces (Single-Subject Collections)
 * Strictly single-subject archives:
 * 1. Sofas: strictly sofas only (zero beds, chairs, tables, or lamps)
 * 2. Desks: strictly study desks & workstations only
 * 3. Pendants: strictly suspended opal glass & ambient fixtures only
 * 4. Vases: strictly handcrafted ceramic & stoneware vases only
 */

export const CURATED_SUBJECTS = {
  sofa: {
    id: "sofa",
    kicker: "CURATED SUBJECT STUDY • 100% SOFAS ONLY",
    title: "Sculptural Sofas & Low Horizons",
    tagline: "Strictly Sofas Only • 6 Curated Pieces",
    description: "An exclusive monograph of low-slung Italian bouclé seating, organic curved silhouettes, and 42cm seating planes designed to maintain unbroken negative space.",
    heroThumbnail: "assets/minh-pham-OtXADkUh3-I-unsplash.jpg",
    accentLabel: "Sofas",
    items: [
      {
        id: "sofa-01",
        sku: "HH-FUR-001",
        name: "CloudCurve Bouclé 3-Seater Sofa",
        badge: "Flagship 3-Seater",
        category: "Sculptural Seating",
        price: 345000,
        image: "assets/minh-pham-OtXADkUh3-I-unsplash.jpg",
        desc: "Organic curvilinear 3-seater in textured Italian bouclé with 42cm low datum and FSC beech frame.",
        specs: "Width: 240 cm • Depth: 105 cm • Height: 74 cm • Seat Height: 42 cm"
      },
      {
        id: "sofa-02",
        sku: "HH-FUR-001",
        name: "CloudCurve Low-Profile Salon Sofa",
        badge: "Low Datum Contour",
        category: "Modular Seating",
        price: 345000,
        image: "assets/pexels-pixabay-276746.jpg",
        desc: "Deep-seated conversational sofa wrapped in warm cream woven upholstery with memory foam cushioning.",
        specs: "Width: 220 cm • Depth: 100 cm • Height: 72 cm • Seat Height: 40 cm"
      },
      {
        id: "sofa-03",
        sku: "HH-FUR-001",
        name: "CloudCurve Tailored Bouclé Contour Sofa",
        badge: "Italian Bouclé Weave",
        category: "Architectural Lounging",
        price: 345000,
        image: "assets/magazines/1309dd06-a468-4f6b-a84a-17d6546b6966.webp",
        desc: "Tactile bouclé weave with precision knife-edge seams, engineered for quiet acoustics and posture balance.",
        specs: "Width: 240 cm • Depth: 105 cm • Height: 74 cm • Seat Height: 42 cm"
      },
      {
        id: "sofa-04",
        sku: "HH-FUR-001",
        name: "CloudCurve Compact 2-Seater Studio Sofa",
        badge: "Studio Proportion",
        category: "Urban Lounging",
        price: 345000,
        image: "assets/pexels-fotografiagmazg-12420730.jpg",
        desc: "Scaled specifically for compact urban living rooms and library nooks without sacrificing seating depth.",
        specs: "Width: 185 cm • Depth: 95 cm • Height: 72 cm • Seat Height: 42 cm"
      },
      {
        id: "sofa-05",
        sku: "HH-FUR-001",
        name: "CloudCurve Curved Ivory Bouclé Sofa",
        badge: "Curvilinear Form",
        category: "Sculptural Seating",
        price: 360000,
        image: "assets/curated/sofa-05.jpg",
        desc: "Flowing asymmetrical bouclé contours inspired by Nordic stone forms with high-resilience latex core.",
        specs: "Width: 235 cm • Depth: 110 cm • Height: 73 cm • Seat Height: 41 cm"
      },
      {
        id: "sofa-06",
        sku: "HH-FUR-001",
        name: "CloudCurve Modular Oat Linen Sectional",
        badge: "Japandi Modular",
        category: "Modular Lounging",
        price: 385000,
        image: "assets/curated/sofa-06.jpg",
        desc: "Low-slung modular sectional sofa in textured natural oat linen with monolithic travertine pairing.",
        specs: "Width: 260 cm • Depth: 160 cm (chaise) • Height: 70 cm • Seat Height: 39 cm"
      }
    ]
  },

  desk: {
    id: "desk",
    kicker: "CURATED SUBJECT STUDY • 100% DESKS ONLY",
    title: "Compact Study Desks & Workstations",
    tagline: "Strictly Desks Only • 6 Curated Pieces",
    description: "Multi-functional architectural workstations and gliding ash study consoles engineered for compact city footprints with zero visual clutter.",
    heroThumbnail: "assets/magazines/4aa14b31-2e83-4baa-8af8-a1112955006d.webp",
    accentLabel: "Workspaces",
    items: [
      {
        id: "desk-01",
        sku: "HH-SSS-001",
        name: "Modula Studio Workstation & Pegboard",
        badge: "Studio Workstation",
        category: "Gliding Workstations",
        price: 89000,
        image: "assets/magazines/4aa14b31-2e83-4baa-8af8-a1112955006d.webp",
        desc: "Full architectural workstation with integrated upper tambour shelving, desk organizer, and ergonomic seat.",
        specs: "Width: 110 cm • Depth: 65 cm • Height: 155 cm"
      },
      {
        id: "desk-02",
        sku: "HH-SSS-001",
        name: "Modula Scandinavian Light Oak Desk",
        badge: "Solid Oak Worktop",
        category: "Compact Study",
        price: 94000,
        image: "assets/curated/desk-02.jpg",
        desc: "Heirloom Scandinavian light oak writing desk with precision concealed pencil drawer and paper-cord chair.",
        specs: "Width: 120 cm • Depth: 60 cm • Height: 75 cm"
      },
      {
        id: "desk-03",
        sku: "HH-SSS-001",
        name: "Modula Architect's Wood-Grain Study Desk",
        badge: "Tactile Joinery",
        category: "Architectural Worktop",
        price: 89000,
        image: "assets/curated/desk-03.jpg",
        desc: "Close-tolerance mortise and tenon joinery featuring chamfered edge profiles and warm matte lacquer.",
        specs: "Width: 115 cm • Depth: 62 cm • Height: 75 cm"
      },
      {
        id: "desk-04",
        sku: "HH-SSS-001",
        name: "Modula Concealed Joinery Compact Desk",
        badge: "Concealed Drawer",
        category: "Joinery Workspace",
        price: 89000,
        image: "assets/curated/desk-04.jpg",
        desc: "Precision study surface with flush-fit storage drawer and quiet damping guides for zero floor rattle.",
        specs: "Width: 105 cm • Depth: 55 cm • Height: 74 cm"
      },
      {
        id: "desk-05",
        sku: "HH-SSS-001",
        name: "Modula Sunlit Alcove Writing Console",
        badge: "Alcove Console",
        category: "Compact Study",
        price: 85000,
        image: "assets/curated/desk-05.jpg",
        desc: "Engineered specifically to activate residential window bays with maximum natural light pass-through.",
        specs: "Width: 100 cm • Depth: 48 cm • Height: 75 cm"
      },
      {
        id: "desk-06",
        sku: "HH-SSS-001",
        name: "Modula Integrated Modular Study Desk",
        badge: "Modular System",
        category: "Modular Workspace",
        price: 92000,
        image: "assets/curated/desk-06.jpg",
        desc: "Comprehensive study suite incorporating wall-mounted library rails, work plane, and matching stool.",
        specs: "Width: 110 cm • Depth: 58 cm • Wall Reach: 140 cm"
      }
    ]
  },

  pendant: {
    id: "pendant",
    kicker: "CURATED SUBJECT STUDY • 100% PENDANTS ONLY",
    title: "Opal Glass Suspended Pendants",
    tagline: "Strictly Pendants Only • 6 Curated Pieces",
    description: "Mouth-blown triplex opal glass spheres and architectural luminaires for shadowless, intimate 2700K evening glow.",
    heroThumbnail: "assets/clay-banks-BnDI_MVomAI-unsplash.jpg",
    accentLabel: "Lighting",
    items: [
      {
        id: "pendant-01",
        sku: "HH-LGT-001",
        name: "Luna Sphere Opal Glass Pendant",
        badge: "Opal Sphere",
        category: "Suspended Lighting",
        price: 62000,
        image: "assets/clay-banks-BnDI_MVomAI-unsplash.jpg",
        desc: "Acid-etched triplex opal glass casting an ethereal, shadowless glow with integrated dim-to-warm LED array.",
        specs: "Diameter: 35 cm • Adjustable Drop: 60 - 180 cm"
      },
      {
        id: "pendant-02",
        sku: "HH-LGT-001",
        name: "Luna Triplex Opal Glass Luminaire",
        badge: "Triplex Sphere",
        category: "Diffuse Lighting",
        price: 64000,
        image: "assets/curated/pendant-02.jpg",
        desc: "Focused suspended orb luminaire providing 360-degree ambient diffusion for dining tables and reading nooks.",
        specs: "Sphere Dia: 32 cm • Ceiling Rose: 12 cm Dia • 2700K Warm White"
      },
      {
        id: "pendant-03",
        sku: "HH-LGT-001",
        name: "Luna Precision Turned Cylinder Fixture",
        badge: "Turned Cylinder",
        category: "Architectural Lighting",
        price: 58000,
        image: "assets/curated/pendant-03.jpg",
        desc: "Monolithic turned architectural cylinder pendant in deep obsidian black casting glare-free downward task light.",
        specs: "Cylinder: 22 cm Dia x 18 cm H • Drop: 150 cm"
      },
      {
        id: "pendant-04",
        sku: "HH-LGT-001",
        name: "Luna Architectural Arc Reading Luminaire",
        badge: "Arc Luminaire",
        category: "Living Lighting",
        price: 72000,
        image: "assets/curated/pendant-04.jpg",
        desc: "Sweeping cantilevered arch fixture positioned over deep salon seating for intimate evening reading ambiance.",
        specs: "Reach: 140 cm • Height: 210 cm • Dimmer Included"
      },
      {
        id: "pendant-05",
        sku: "HH-LGT-001",
        name: "Luna Dining Atelier Suspended Fixture",
        badge: "Dining Atelier",
        category: "Dining Pendants",
        price: 68000,
        image: "assets/curated/pendant-05.jpg",
        desc: "Horizontal ambient suspension chandelier balanced directly above dining table for glare-free conversation.",
        specs: "Width: 90 cm • Drop: 80 - 140 cm • Voltage: 220-240V"
      },
      {
        id: "pendant-06",
        sku: "HH-LGT-001",
        name: "Luna Ambient Champagne Brass Luminaire",
        badge: "Warm 2700K Glow",
        category: "Ambient Lighting",
        price: 62000,
        image: "assets/curated/pendant-06.jpg",
        desc: "Intimate tabletop ceramic and brass luminaire producing warm 2700K diffusion across architectural credenzas.",
        specs: "Diameter: 28 cm • Height: 44 cm • Fabric Braided Cord"
      }
    ]
  },

  vase: {
    id: "vase",
    kicker: "CURATED SUBJECT STUDY • 100% VASES ONLY",
    title: "Handcrafted Ceramic & Stoneware Vases",
    tagline: "Strictly Vases Only • 6 Curated Pieces",
    description: "Wheel-thrown earthenware vessels celebrating tactile asymmetry, natural mineral glazes, and sculptural quietude across credenzas and tables.",
    heroThumbnail: "assets/magazines/923e4bb3-ccc1-4efb-806a-bfc42fdd3565.webp",
    accentLabel: "Objet d'Art",
    items: [
      {
        id: "vase-01",
        sku: "HH-DEC-001",
        name: "Solis Wheel-Thrown Stoneware Vase",
        badge: "Terracotta Stoneware",
        category: "Artisan Ceramics",
        price: 28500,
        image: "assets/magazines/923e4bb3-ccc1-4efb-806a-bfc42fdd3565.webp",
        desc: "Hand-turned high-fired terracotta vessel with waterproof glazed interior for fresh or dried botanicals.",
        specs: "Diameter: 22 cm • Height: 34 cm • Neck: 7.5 cm"
      },
      {
        id: "vase-02",
        sku: "HH-DEC-001",
        name: "Solis Textured Artisan Earthenware Vase",
        badge: "Textured Clay",
        category: "Artisan Ceramics",
        price: 29500,
        image: "assets/curated/vase-02.jpg",
        desc: "Hand-pinched earthy stoneware vessel with organic throwing ridges and waterproof glazed interior.",
        specs: "Diameter: 20 cm • Height: 32 cm • Studio Edition"
      },
      {
        id: "vase-03",
        sku: "HH-DEC-001",
        name: "Solis Matte Chalk Mineral Glaze Vessel",
        badge: "Matte Chalk",
        category: "Glazed Ceramics",
        price: 28500,
        image: "assets/curated/vase-03.jpg",
        desc: "Custom matte chalk white mineral slip fired at 1220°C with raw unglazed terracotta foot and lunaria stems.",
        specs: "Diameter: 18 cm • Height: 26 cm • Weight: 2.4 kg"
      },
      {
        id: "vase-04",
        sku: "HH-DEC-001",
        name: "Solis Handcrafted Ribbed Ceramic Amphora",
        badge: "Fluted Ribbed",
        category: "Ribbed Ceramics",
        price: 31000,
        image: "assets/curated/vase-04.jpg",
        desc: "Sculptural fluted porcelain vessel with rhythmic ribs and wide rim designed for lush floral blooms.",
        specs: "Diameter: 24 cm • Height: 25 cm • Glaze: Satin Bone"
      },
      {
        id: "vase-05",
        sku: "HH-DEC-001",
        name: "Solis Tactile Tabletop Stoneware Urn",
        badge: "Tabletop Anchor",
        category: "Sculptural Vessels",
        price: 27500,
        image: "assets/curated/vase-05.jpg",
        desc: "Low-center-of-gravity stoneware urn with soft tactile tooth, designed as an independent salon centerpiece.",
        specs: "Diameter: 20 cm • Height: 24 cm • Matte Stone Finish"
      },
      {
        id: "vase-06",
        sku: "HH-DEC-001",
        name: "Solis Artisan Terracotta Botanical Vessel",
        badge: "Artisan Terracotta",
        category: "Tactile Pottery",
        price: 32000,
        image: "assets/curated/vase-06.jpg",
        desc: "Traditional wheel-turned terracotta amphora holding fresh garden stems with natural earthy mineral warmth.",
        specs: "Diameter: 25 cm • Height: 35 cm • Signed Studio Edition"
      }
    ]
  }
};
