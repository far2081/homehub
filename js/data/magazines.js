/**
 * HomeHub - The 4 Independent Digital Magazine Books
 * Visual Direction: Soft Luxury Modern
 * Editorial Principle: Magazine First, Shopping Second
 */

export const MAGAZINE_BOOKS = {
  "living-edit": {
    id: "living-edit",
    title: "The Living Edit",
    issue: "Volume 01 • Autumn / Winter",
    subtitle: "Fluid Forms, Grounded Serenity & Tactile Architecture",
    themeColor: "#EADCCB",
    coverImage: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85",
    description: "An exploration of modern communal living through sculptural curves, monolithic stone, and tactile Italian bouclé.",
    coverLines: [
      "The Architecture of Rest: CloudCurve Sofa in Situ",
      "Roman Travertine: The Geological Permanence of Noma",
      "Cantilevered Illumination: The Arc Floor Lamp Profile",
      "Low-Horizon Living: 42cm Seating Planes for Open Lofts"
    ],
    totalPages: 8,
    pages: [
      {
        pageNumber: 1,
        type: "cover",
        headline: "The Living Edit",
        kicker: "HOMEHUB EDITORIAL • ISSUE N° 1",
        deck: "Fluid curves, monolithic travertine, and the gentle art of stillness in contemporary living spaces.",
        heroImage: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85",
        colophon: "Curated by HomeHub Design Studio • Photography by Atelier Nord",
        coverLines: [
          "The Architecture of Rest: CloudCurve Sofa in Situ",
          "Roman Travertine: Geological Permanence of Noma",
          "Cantilevered Illumination: The Arc Lamp Profile",
          "Low-Horizon Living: 42cm Seating Planes for Lofts"
        ],
        products: []
      },
      {
        pageNumber: 2,
        type: "essay",
        kicker: "ESSAY 01 / FORM & WEIGHT",
        headline: "The Architecture of Rest",
        quote: "True luxury is not ornament; it is the presence of generous negative space and honest, enduring materials.",
        body: [
          "The modern living room is no longer an exhibition hall for static symmetry. Today, it behaves as a psychological sanctuary—a sensory cocoon where physical form directly influences mental decompression.",
          "By discarding rigid sharp angles in favor of organic contours, the CloudCurve Sofa introduces an intuitive rhythm into the room. It does not demand that you sit upright; it invites posture to soften, conversation to linger, and evening shadows to pool gently against woven bouclé."
        ],
        heroImage: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=85",
        products: [
          { sku: "HH-FUR-001", label: "CloudCurve Sofa", price: "₨ 345,000", badge: "Centerpiece", hotspot: { x: 50, y: 62 } }
        ]
      },
      {
        pageNumber: 3,
        type: "feature",
        kicker: "MATERIAL DIALOGUE",
        headline: "Geological Permanence",
        body: [
          "Set against the softness of upholstery, Roman travertine introduces a grounded, ancient counterweight. The Noma Coffee Table honors this dialogue with its bullnosed perimeter and untreated matte stone grain.",
          "Every vein in honed travertine records millennia of sediment. In an era of ephemeral disposable furniture, living with solid stone anchors our everyday rituals."
        ],
        heroImage: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1000&q=85",
        products: [
          { sku: "HH-FUR-002", label: "Noma Coffee Table", price: "₨ 125,000", badge: "Natural Stone", hotspot: { x: 52, y: 68 } }
        ]
      },
      {
        pageNumber: 4,
        type: "curation-spread",
        kicker: "THE EDIT / IN SITU",
        headline: "A Conversational Circle",
        deck: "Three key elements that balance sightlines and sensory tactile warmth.",
        body: [
          "Pairing the low-slung 360-degree Aura Lounge Chair with cantilevered illumination creates an intimate pocket within an open-concept loft.",
          "Notice how natural daylight from floor-to-ceiling glazing catches the champagne bronze base, echoing the warm undertones of the bouclé wool."
        ],
        heroImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=85",
        products: [
          { sku: "HH-FUR-003", label: "Aura Lounge Chair", price: "₨ 165,000", badge: "360° Swivel", hotspot: { x: 38, y: 60 } },
          { sku: "HH-LGT-002", label: "Arc Floor Lamp", price: "₨ 78,500", badge: "Cantilever", hotspot: { x: 74, y: 35 } }
        ]
      },
      {
        pageNumber: 5,
        type: "editorial-gallery",
        kicker: "STYLING NOTES",
        headline: "Sensory Textures & Earth Tones",
        body: [
          "To achieve the Soft Luxury Modern aesthetic without clutter, limit the palette to four tonal cousins: Soft Ivory, Sage Mist, Warm Beige, and Champagne.",
          "Layering Belgian linen cushions against curly wool bouclé provides rich depth without jarring contrast. Here, touch precedes sight."
        ],
        heroImage: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1000&q=85",
        products: [
          { sku: "HH-DEC-003", label: "CloudSoft Cushions", price: "₨ 14,500", badge: "French Flax", hotspot: { x: 48, y: 55 } }
        ]
      },
      {
        pageNumber: 6,
        type: "design-profile",
        kicker: "STUDIO FOCUS",
        headline: "Sculpting the Low Horizon",
        quote: "When furniture keeps a low profile, ceilings feel grander, breathing becomes easier, and the eye travels freely.",
        body: [
          "Maintaining an unbroken 42cm seat plane across the entire seating arrangement preserves unobstructed sightlines toward garden terraces and morning vistas.",
          "Explore the complete Living Room collection below or tap any item to inspect material swatches and dimensions."
        ],
        heroImage: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85",
        products: [
          { sku: "HH-FUR-001", label: "CloudCurve Sofa", price: "₨ 345,000", badge: "In Stock", hotspot: { x: 36, y: 64 } },
          { sku: "HH-FUR-002", label: "Noma Coffee Table", price: "₨ 125,000", badge: "Honed Stone", hotspot: { x: 68, y: 72 } }
        ]
      },
      {
        pageNumber: 7,
        type: "lookbook",
        kicker: "CURATED COMPOSITION",
        headline: "The Living Collection At a Glance",
        deck: "Coordinated pieces ready to transform your living room into an oasis of understated elegance.",
        heroImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85",
        products: [
          { sku: "HH-FUR-001", label: "CloudCurve Sofa", price: "₨ 345,000", hotspot: { x: 28, y: 56 } },
          { sku: "HH-FUR-002", label: "Noma Coffee Table", price: "₨ 125,000", hotspot: { x: 50, y: 68 } },
          { sku: "HH-FUR-003", label: "Aura Lounge Chair", price: "₨ 165,000", hotspot: { x: 76, y: 58 } },
          { sku: "HH-DEC-001", label: "Solis Ceramic Vase", price: "₨ 28,500", hotspot: { x: 52, y: 48 } }
        ]
      },
      {
        pageNumber: 8,
        type: "backcover",
        headline: "HomeHub",
        kicker: "SHOP • STYLE • SMART",
        deck: "The Living Edit concludes here. Continue your journey through Objects of Home, Light / Life, and Small Spaces.",
        heroImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=85",
        colophon: "All pieces handcrafted in limited runs. Available exclusively via HomeHub Atelier.",
        products: []
      }
    ]
  },

  "objects-of-home": {
    id: "objects-of-home",
    title: "Objects of Home",
    issue: "Volume 02 • Curated Form",
    subtitle: "Ceramics, Tactile Art & Vessels of Intent",
    themeColor: "#E9D8D0",
    coverImage: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1200&q=85",
    description: "Celebrating the intimate power of singular handcrafted objects that transform surfaces into meditative still lifes.",
    coverLines: [
      "The Soul of the Vessel: Wheel-Thrown Solis Ceramics",
      "Shadows in Plaster: Forma Bas-Relief Wall Sculptures",
      "Pebble Geometries: Organic Reflections with Halo Mirror",
      "Pumice-Washed French Flax: CloudSoft Cushions Palette"
    ],
    totalPages: 8,
    pages: [
      {
        pageNumber: 1,
        type: "cover",
        headline: "Objects of Home",
        kicker: "HOMEHUB EDITORIAL • ISSUE N° 2",
        deck: "Artisan ceramics, bas-relief plaster, and the tactile beauty of handcrafted daily rituals.",
        heroImage: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1200&q=85",
        colophon: "Studio Edition • Curated with artisan ceramicists & textile weavers",
        coverLines: [
          "The Soul of the Vessel: Wheel-Thrown Solis Ceramics",
          "Shadows in Plaster: Forma Bas-Relief Wall Art",
          "Pebble Geometries: Reflections with Halo Mirror",
          "Pumice-Washed French Flax: CloudSoft Cushions"
        ],
        products: []
      },
      {
        pageNumber: 2,
        type: "essay",
        kicker: "ESSAY 02 / INTENTIONAL OBJECTS",
        headline: "The Soul of the Vessel",
        quote: "An object earns its place in our home when its quiet presence rewards slow observation day after day.",
        body: [
          "In an overwhelming world of digital speed, touchable mineral textures reconnect us to the earth. The Solis Ceramic Vase is shaped by hand on a slow potter's wheel, allowing natural irregularities to remain visible.",
          "Finished with a matte chalk mineral slip, it rejects artificial high-gloss shine, catching sunlight with velvety softness on dining consoles and stone hearths."
        ],
        heroImage: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1000&q=85",
        products: [
          { sku: "HH-DEC-001", label: "Solis Ceramic Vase", price: "₨ 28,500", badge: "Wheel-Thrown", hotspot: { x: 50, y: 55 } }
        ]
      },
      {
        pageNumber: 3,
        type: "feature",
        kicker: "TACTILE ARTWORK",
        headline: "Shadows in Plaster Relief",
        body: [
          "Forma Wall Art exists at the intersection of painting and architectural sculpture. Rather than loud pigment, it relies on raking light across stepped mineral plaster bas-reliefs.",
          "As the sun traverses your room from dawn to dusk, the cast shadows lengthen and transform, offering an ever-shifting focal point framed in solid white ash."
        ],
        heroImage: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1000&q=85",
        products: [
          { sku: "HH-DEC-002", label: "Forma Wall Art", price: "₨ 45,000", badge: "Bas-Relief", hotspot: { x: 52, y: 44 } }
        ]
      },
      {
        pageNumber: 4,
        type: "curation-spread",
        kicker: "REFLECTIVE HORIZONS",
        headline: "Expanding Negative Space",
        deck: "The organic geometry of the Halo Mirror softens vertical wall planes.",
        body: [
          "Rigid rectangular mirrors can feel utilitarian. The Halo Mirror adopts an asymmetrical pebble perimeter, surrounded by a slender lip of champagne brushed brass.",
          "Hung above an entryway credenza or over a bedroom vanity, it doubles ambient illumination and softens hard room corners."
        ],
        heroImage: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=1000&q=85",
        products: [
          { sku: "HH-DEC-004", label: "Halo Mirror", price: "₨ 58,000", badge: "Brushed Brass", hotspot: { x: 48, y: 40 } }
        ]
      },
      {
        pageNumber: 5,
        type: "editorial-gallery",
        kicker: "TEXTILE CURATION",
        headline: "Washed French Linen Layering",
        body: [
          "Bedding and sofa styling require relaxed tactile comfort. Our CloudSoft Cushions in Dusty Blush and Sage Mist are stonewashed with volcanic pumice to soften flax fibers without chemical treatments.",
          "Generously filled with certified duck down, they yield effortlessly when leaned upon."
        ],
        heroImage: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1000&q=85",
        products: [
          { sku: "HH-DEC-003", label: "CloudSoft Cushions", price: "₨ 14,500", badge: "Pure Linen", hotspot: { x: 52, y: 58 } }
        ]
      },
      {
        pageNumber: 6,
        type: "design-profile",
        kicker: "STILL LIFE STYLING",
        headline: "The Rule of Singular Groupings",
        quote: "Do not fill every corner. Leave three-quarters of your tabletop empty so the singular chosen piece can truly breathe.",
        body: [
          "A single tall branch inside the Solis Ceramic Vase, accompanied only by a low stack of art monographs, creates a serene gallery aesthetic in the living room.",
          "Simplicity is not absence; it is the deliberate elevation of the essential."
        ],
        heroImage: "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=1000&q=85",
        products: [
          { sku: "HH-DEC-001", label: "Solis Ceramic Vase", price: "₨ 28,500", badge: "Artisan", hotspot: { x: 46, y: 52 } }
        ]
      },
      {
        pageNumber: 7,
        type: "lookbook",
        kicker: "OBJECTS CATALOGUE",
        headline: "Artisanal Décor Essentials",
        deck: "Handcrafted additions to elevate shelves, tables, and walls.",
        heroImage: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1000&q=85",
        products: [
          { sku: "HH-DEC-001", label: "Solis Ceramic Vase", price: "₨ 28,500", hotspot: { x: 26, y: 58 } },
          { sku: "HH-DEC-002", label: "Forma Wall Art", price: "₨ 45,000", hotspot: { x: 48, y: 36 } },
          { sku: "HH-DEC-003", label: "CloudSoft Cushions", price: "₨ 14,500", hotspot: { x: 74, y: 64 } },
          { sku: "HH-DEC-004", label: "Halo Mirror", price: "₨ 58,000", hotspot: { x: 80, y: 32 } }
        ]
      },
      {
        pageNumber: 8,
        type: "backcover",
        headline: "HomeHub",
        kicker: "SHOP • STYLE • SMART",
        deck: "Objects of Home concludes here. Explore Light / Life for architectural illumination.",
        heroImage: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1000&q=85",
        colophon: "Every object arrives in sustainable archival packaging.",
        products: []
      }
    ]
  },

  "light-life": {
    id: "light-life",
    title: "Light / Life",
    issue: "Volume 03 • Architectural Glow",
    subtitle: "Luminosity, Sculpted Shadows & Twilight Ambiance",
    themeColor: "#D6BC91",
    coverImage: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=85",
    description: "Mastering the emotional temperature of living spaces through dimmable layers of diffused, warm illumination.",
    coverLines: [
      "Circadian Glow: Mouth-Blown Triplex Glass Luna Pendant",
      "Cantilever Grace: Brescia Marble Base of Arc Floor Lamp",
      "Solar Halos: Indirect Eclipse Beams with Aura Wall Sconce",
      "Fluted Travertine: Dimmable Mushroom Domes on Bedside Tables"
    ],
    totalPages: 8,
    pages: [
      {
        pageNumber: 1,
        type: "cover",
        headline: "Light / Life",
        kicker: "HOMEHUB EDITORIAL • ISSUE N° 3",
        deck: "The poetry of illumination: hand-blown glass, cantilevered arches, and warm 2700K sanctuaries.",
        heroImage: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=85",
        colophon: "Illumination Guide • Engineered for circadian harmony",
        coverLines: [
          "Circadian Glow: Mouth-Blown Luna Pendant",
          "Cantilever Grace: Marble Base Arc Floor Lamp",
          "Solar Halos: Indirect Eclipse Aura Sconces",
          "Fluted Travertine: Dimmable Glow Table Lamp"
        ],
        products: []
      },
      {
        pageNumber: 2,
        type: "essay",
        kicker: "ESSAY 03 / CIRCADIAN GLOW",
        headline: "Banishing the Overhead Glare",
        quote: "Nothing destroys the romance of an interior faster than a cold ceiling fixture. Light must hug the floor, wash the walls, and float at eye level.",
        body: [
          "Light defines human emotion before conscious thought begins. When nighttime falls, harsh downlights signal alertness to our brain. To cultivate evening rest, illumination must be layered into three distinct strata: low accent, mid-level task, and soft diffuse ambient.",
          "The Luna Pendant suspends a mouth-blown opal sphere at eye level, diffusing photons through triplex glass so the source feels like a captured moon rather than an industrial bulb."
        ],
        heroImage: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1000&q=85",
        products: [
          { sku: "HH-LGT-001", label: "Luna Pendant", price: "₨ 62,000", badge: "Hand-Blown", hotspot: { x: 50, y: 38 } }
        ]
      },
      {
        pageNumber: 3,
        type: "feature",
        kicker: "ARCHITECTURAL PROJECTION",
        headline: "The Graceful Cantilever",
        body: [
          "The Arc Floor Lamp solves a classic dilemma: how to cast generous overhead light above a conversation area without cutting into ceiling wiring.",
          "Rooted in a 34kg block of honed Brescia marble, its champagne brass arc extends effortlessly across 165cm, allowing the spun brass shade to hover weightlessly above your lounge chairs."
        ],
        heroImage: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=85",
        products: [
          { sku: "HH-LGT-002", label: "Arc Floor Lamp", price: "₨ 78,500", badge: "Marble Base", hotspot: { x: 62, y: 46 } }
        ]
      },
      {
        pageNumber: 4,
        type: "curation-spread",
        kicker: "SCULPTURAL SCONCES",
        headline: "Solar Halo Reflections",
        deck: "Turning blank drywall into luminous textured art.",
        body: [
          "Rather than shining directly into the eyes, the Aura Wall Light directs its beam backward against the wall surface, framing itself in an indirect eclipse halo.",
          "Use them in pairs down a corridor or as bedtime reading lights on either side of the Haven Bed."
        ],
        heroImage: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1000&q=85",
        products: [
          { sku: "HH-LGT-004", label: "Aura Wall Light", price: "₨ 32,500", badge: "Eclipse Halo", hotspot: { x: 48, y: 36 } }
        ]
      },
      {
        pageNumber: 5,
        type: "editorial-gallery",
        kicker: "DESK & BEDSIDE",
        headline: "Mushroom Domes & Travertine",
        body: [
          "The Glow Table Lamp combines a heavy fluted travertine cylinder with a classic spun dome. Integrated touch-sensitive dimming allows you to transition smoothly from morning reading light to midnight candle simulation.",
          "Its solid stone weight gives it satisfying permanence when operating the dimmer crown."
        ],
        heroImage: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1000&q=85",
        products: [
          { sku: "HH-LGT-003", label: "Glow Table Lamp", price: "₨ 36,000", badge: "Touch Dimmer", hotspot: { x: 50, y: 55 } }
        ]
      },
      {
        pageNumber: 6,
        type: "design-profile",
        kicker: "LIGHTING GUIDE",
        headline: "The Golden Rules of Color Temperature",
        quote: "2700 Kelvin is the magic threshold: warm enough to flatter skin tones and soothe eyes, yet crisp enough to read by.",
        body: [
          "All HomeHub fixtures are paired with integrated high-CRI (95+) LEDs tuned specifically to 2700K. This preserves the authentic tones of your linen, bouclé, and stone surfaces.",
          "Never settle for harsh blue glare again."
        ],
        heroImage: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1000&q=85",
        products: [
          { sku: "HH-LGT-001", label: "Luna Pendant", price: "₨ 62,000", badge: "CRI 95+", hotspot: { x: 38, y: 34 } },
          { sku: "HH-LGT-003", label: "Glow Table Lamp", price: "₨ 36,000", badge: "Warm 2700K", hotspot: { x: 68, y: 62 } }
        ]
      },
      {
        pageNumber: 7,
        type: "lookbook",
        kicker: "LIGHTING SUITE",
        headline: "Luminous Fixtures Collection",
        deck: "Coordinated architectural lighting for every room in the residence.",
        heroImage: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=85",
        products: [
          { sku: "HH-LGT-001", label: "Luna Pendant", price: "₨ 62,000", hotspot: { x: 25, y: 32 } },
          { sku: "HH-LGT-002", label: "Arc Floor Lamp", price: "₨ 78,500", hotspot: { x: 50, y: 44 } },
          { sku: "HH-LGT-003", label: "Glow Table Lamp", price: "₨ 36,000", hotspot: { x: 74, y: 65 } },
          { sku: "HH-LGT-004", label: "Aura Wall Light", price: "₨ 32,500", hotspot: { x: 80, y: 30 } }
        ]
      },
      {
        pageNumber: 8,
        type: "backcover",
        headline: "HomeHub",
        kicker: "SHOP • STYLE • SMART",
        deck: "Light / Life concludes here. Discover space-maximizing designs in Small Spaces.",
        heroImage: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1000&q=85",
        colophon: "UL listed & CE certified electrical components with 5-year warranty.",
        products: []
      }
    ]
  },

  "small-spaces": {
    id: "small-spaces",
    title: "Small Spaces",
    issue: "Volume 04 • Smart Living",
    subtitle: "Compact Living, Clever Architecture & Elevated Restraint",
    themeColor: "#DDE8DF",
    coverImage: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=85",
    description: "Proving that restricted square meters can produce the most thoughtful, refined, and serene living environments.",
    coverLines: [
      "The Freedom of Less: Modula Nested Desk Transformations",
      "Floating Horizontally: Cleat-Mounted Flute Tambour Console",
      "Integrated Platforms: Acoustic Sanctuaries with Haven Bed",
      "Optical Horizons: Asymmetrical Halo Mirrors in Narrow Entries"
    ],
    totalPages: 8,
    pages: [
      {
        pageNumber: 1,
        type: "cover",
        headline: "Small Spaces",
        kicker: "HOMEHUB EDITORIAL • ISSUE N° 4",
        deck: "Urban compactness, multifunctional elegance, and the art of uncrowded living.",
        heroImage: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=85",
        colophon: "Urban Edition • Solutions for modern metropolitan apartments",
        coverLines: [
          "The Freedom of Less: Modula Nested Desk",
          "Floating Horizontally: Flute Tambour Console",
          "Integrated Platforms: Rest in Haven Bed",
          "Optical Horizons: Halo Mirrors in Entries"
        ],
        products: []
      },
      {
        pageNumber: 2,
        type: "essay",
        kicker: "ESSAY 04 / SPACE INTELLIGENCE",
        headline: "The Freedom of Less",
        quote: "Compact square footage is not a limitation; it is a creative catalyst that demands thoughtful proportion and multi-functional grace.",
        body: [
          "Designing for compact spaces requires a shift from accumulation to intentional curation. When every piece must earn its floor area, furniture transforms from passive decor into dynamic architectural infrastructure.",
          "Our Modula Nested Desk exemplifies this philosophy: resting as a slender 38cm hallway console by evening, it glides forward on smooth concealed brass tracks into a 72cm dedicated workspace during morning hours."
        ],
        heroImage: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1000&q=85",
        products: [
          { sku: "HH-SSS-001", label: "Modula Nested Desk", price: "₨ 89,000", badge: "Extendable", hotspot: { x: 50, y: 58 } }
        ]
      },
      {
        pageNumber: 3,
        type: "feature",
        kicker: "VERTICAL PROPORTIONS",
        headline: "Floating Horizontally",
        body: [
          "Floor space is precious. When the floor remains visible from wall to wall, the human brain perceives the room as substantially more expansive.",
          "The Flute Floating Console mounts securely with French cleats, keeping shoes, cords, and media components discreetly hidden behind acoustic tambour panels."
        ],
        heroImage: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1000&q=85",
        products: [
          { sku: "HH-SSS-002", label: "Flute Floating Console", price: "₨ 74,000", badge: "Wall-Hung", hotspot: { x: 52, y: 64 } }
        ]
      },
      {
        pageNumber: 4,
        type: "curation-spread",
        kicker: "OPTICAL REFLECTION",
        headline: "Bouncing Light in Narrow Entries",
        deck: "How organic curves and vertical mirrors multiply daylight.",
        body: [
          "Narrow hallways and studio entries often suffer from dark corners. By pairing the asymmetrical Halo Mirror with the wall-mounted Aura sconce, light is reflected twice across the entryway.",
          "The pebble curve softens the rigid boxiness of apartment corridors."
        ],
        heroImage: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=1000&q=85",
        products: [
          { sku: "HH-DEC-004", label: "Halo Mirror", price: "₨ 58,000", badge: "Optical Depth", hotspot: { x: 42, y: 38 } },
          { sku: "HH-LGT-004", label: "Aura Wall Light", price: "₨ 32,500", badge: "Slim Fit", hotspot: { x: 72, y: 34 } }
        ]
      },
      {
        pageNumber: 5,
        type: "editorial-gallery",
        kicker: "BEDROOM RETREAT",
        headline: "Integrated Sleep Sanctuaries",
        body: [
          "In compact master rooms, bulky dressers clutter walking paths. The Haven Bed incorporates recessed platform bases with acoustic dampening padding, keeping the profile low so daylight reaches deep into the space.",
          "Dressed in breathable Belgian linen, it fosters a clean hotel-suite calm."
        ],
        heroImage: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=85",
        products: [
          { sku: "HH-FUR-004", label: "Haven Bed", price: "₨ 285,000", badge: "Platform", hotspot: { x: 46, y: 60 } },
          { sku: "HH-LGT-003", label: "Glow Table Lamp", price: "₨ 36,000", badge: "Bedside", hotspot: { x: 78, y: 50 } }
        ]
      },
      {
        pageNumber: 6,
        type: "design-profile",
        kicker: "COMPACT APARTMENT RULES",
        headline: "The Five Pillars of Small-Space Harmony",
        quote: "Prioritize legs over solid bases, light colors over heavy darks, and multi-functional adaptability over single-purpose bulk.",
        body: [
          "1. Keep sightlines open beneath furniture.\n2. Leverage wall cleat mounting to preserve square footage.\n3. Install swivel seating that pivots between conversation and desk use.\n4. Stick to a monochromatic palette of Soft Ivory and Warm Beige.\n5. Choose recessed hidden handles over protruding knobs."
        ],
        heroImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=85",
        products: [
          { sku: "HH-FUR-003", label: "Aura Lounge Chair", price: "₨ 165,000", badge: "Compact Footprint", hotspot: { x: 50, y: 58 } }
        ]
      },
      {
        pageNumber: 7,
        type: "lookbook",
        kicker: "SMALL SPACE SUITE",
        headline: "Smart Studio Edit",
        deck: "Engineered pieces for apartments, studios, and high-efficiency homes.",
        heroImage: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1000&q=85",
        products: [
          { sku: "HH-SSS-001", label: "Modula Nested Desk", price: "₨ 89,000", hotspot: { x: 30, y: 60 } },
          { sku: "HH-SSS-002", label: "Flute Floating Console", price: "₨ 74,000", hotspot: { x: 52, y: 55 } },
          { sku: "HH-LGT-003", label: "Glow Table Lamp", price: "₨ 36,000", hotspot: { x: 74, y: 68 } },
          { sku: "HH-DEC-004", label: "Halo Mirror", price: "₨ 58,000", hotspot: { x: 78, y: 34 } }
        ]
      },
      {
        pageNumber: 8,
        type: "backcover",
        headline: "HomeHub",
        kicker: "SHOP • STYLE • SMART",
        deck: "Small Spaces concludes here. Browse our complete catalogue online or visit our studios.",
        heroImage: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1000&q=85",
        colophon: "HomeHub Atelier • Designed for living well in every square meter.",
        products: []
      }
    ]
  }
};
