/**
 * HomeHub - Curated for Considered Spaces (Single-Subject Collections)
 * Strictly single-subject archives:
 * 1. Sofas: strictly sofas only (zero beds, chairs, tables, or lamps)
 * 2. Desks: strictly study desks & workstations only
 * 3. Pendants: strictly suspended opal glass pendants only
 * 4. Vases: strictly handcrafted ceramic & stoneware vases only
 */

export const CURATED_SUBJECTS = {
  sofa: {
    id: "sofa",
    kicker: "CURATED SUBJECT STUDY • 100% SOFAS ONLY",
    title: "Sculptural Sofas & Low Horizons",
    tagline: "Strictly Sofas Only • 4 Curated Pieces",
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
      }
    ]
  },

  desk: {
    id: "desk",
    kicker: "CURATED SUBJECT STUDY • 100% DESKS ONLY",
    title: "Compact Study Desks & Workstations",
    tagline: "Strictly Desks Only • 4 Curated Pieces",
    description: "Multi-functional architectural workstations and gliding ash study consoles engineered for compact city footprints with zero visual clutter.",
    heroThumbnail: "assets/magazines/4aa14b31-2e83-4baa-8af8-a1112955006d.webp",
    accentLabel: "Workspaces",
    items: [
      {
        id: "desk-01",
        sku: "HH-SSS-001",
        name: "Modula Nested Study Desk",
        badge: "Console-to-Desk",
        category: "Gliding Workstations",
        price: 89000,
        image: "assets/magazines/4aa14b31-2e83-4baa-8af8-a1112955006d.webp",
        desc: "Glides effortlessly from an elegant 38cm hallway console to a full 72cm dual-surface oak workstation.",
        specs: "Closed: 110 cm W x 38 cm D • Extended: 110 cm W x 72 cm D"
      },
      {
        id: "desk-02",
        sku: "HH-SSS-001",
        name: "Modula Extended Dual-Surface Desk",
        badge: "Extended Worktop",
        category: "Compact Study",
        price: 89000,
        image: "assets/magazines/4f5d0ae3-01f3-41ad-b9df-0624121da53a.webp",
        desc: "Integrated whisper-quiet ball bearing slides revealing lower drafting surface and cord organizers.",
        specs: "Width: 110 cm • Full Depth: 72 cm • Height: 78 cm"
      },
      {
        id: "desk-03",
        sku: "HH-SSS-001",
        name: "Modula Fluted White Ash Alcove Desk",
        badge: "Fluted Tambour",
        category: "Joinery Workspace",
        price: 89000,
        image: "assets/magazines/4aa14b31-2e83-4baa-8af8-a1112955006d.webp",
        desc: "Tactile fluted drawer front with damped soft-close guides and invisible power cord channels.",
        specs: "Width: 110 cm • Height: 78 cm • Concealed Soft-Close"
      },
      {
        id: "desk-04",
        sku: "HH-SSS-001",
        name: "Modula Nook Workstation & Writing Table",
        badge: "Study Nook",
        category: "Architectural Worktop",
        price: 89000,
        image: "assets/magazines/4f5d0ae3-01f3-41ad-b9df-0624121da53a.webp",
        desc: "Designed to activate small apartment alcoves with zero floor intrusion and clean cable management.",
        specs: "Width: 110 cm • Work Surface: Solid White Ash & Birch"
      }
    ]
  },

  pendant: {
    id: "pendant",
    kicker: "CURATED SUBJECT STUDY • 100% PENDANTS ONLY",
    title: "Opal Glass Suspended Pendants",
    tagline: "Strictly Pendants Only • 4 Curated Pieces",
    description: "Mouth-blown triplex opal glass spheres suspended by precision-milled champagne brass stems for shadowless, intimate 2700K evening glow.",
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
        name: "Luna Champagne Brass Stem Pendant",
        badge: "Champagne Brass",
        category: "Architectural Brass",
        price: 62000,
        image: "assets/magazines/de179757-6ab3-4cb0-9b56-84039d2ba4dc.webp",
        desc: "Solid turned champagne gold brass canopy and counter-weighted suspension rod with concealed wiring.",
        specs: "Rod Reach: 120 cm • Ceiling Canopy: 14 cm Dia"
      },
      {
        id: "pendant-03",
        sku: "HH-LGT-001",
        name: "Luna Triplex Acid-Etched Ambient Pendant",
        badge: "2700K Glow",
        category: "Diffuse Lighting",
        price: 62000,
        image: "assets/clay-banks-BnDI_MVomAI-unsplash.jpg",
        desc: "Satin matte finish diffusing 360-degree ambient warmth across dining tables and open salon volumes.",
        specs: "Output: 950 Lumens • Color Temp: 2700K Warm White"
      },
      {
        id: "pendant-04",
        sku: "HH-LGT-001",
        name: "Luna Architectural Suspended Pendant",
        badge: "Minimal Canopy",
        category: "Dining Pendants",
        price: 62000,
        image: "assets/clay-banks-BnDI_MVomAI-unsplash.jpg",
        desc: "Precision suspension fixture suspended 75cm above tabletop for intimate glare-free illumination.",
        specs: "Drop: Customizable • Voltage: 220-240V"
      }
    ]
  },

  vase: {
    id: "vase",
    kicker: "CURATED SUBJECT STUDY • 100% VASES ONLY",
    title: "Handcrafted Ceramic & Stoneware Vases",
    tagline: "Strictly Vases Only • 4 Curated Pieces",
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
        name: "Solis Matte Chalk Mineral Glaze Vessel",
        badge: "Matte Chalk",
        category: "Glazed Ceramics",
        price: 28500,
        image: "assets/magazines/923e4bb3-ccc1-4efb-806a-bfc42fdd3565.webp",
        desc: "Custom matte chalk white mineral slip fired at 1220°C with raw unglazed terracotta foot.",
        specs: "Diameter: 20 cm • Height: 30 cm • Weight: 3.1 kg"
      },
      {
        id: "vase-03",
        sku: "HH-DEC-001",
        name: "Solis Sculptural Asymmetric Vase",
        badge: "Hand-Turned",
        category: "Sculptural Vessels",
        price: 28500,
        image: "assets/magazines/923e4bb3-ccc1-4efb-806a-bfc42fdd3565.webp",
        desc: "Each piece displays deliberate throwing rings and organic variations from the artisan wheel.",
        specs: "Height: 34 cm • Signed Studio Edition"
      },
      {
        id: "vase-04",
        sku: "HH-DEC-001",
        name: "Solis Studio Raw Earthenware Vase",
        badge: "Raw Terra Base",
        category: "Tactile Pottery",
        price: 28500,
        image: "assets/magazines/923e4bb3-ccc1-4efb-806a-bfc42fdd3565.webp",
        desc: "Subtle earth tone exterior with soft tactile tooth, designed as an independent architectural tabletop anchor.",
        specs: "Diameter: 22 cm • Height: 32 cm"
      }
    ]
  }
};
