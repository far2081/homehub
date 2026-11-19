/**
 * HomeHub - Room Category Inspiration & Editorial Data
 * Brand: HOMEHUB — SHOP • STYLE • SMART
 * Visual Direction: Soft Luxury Modern
 * 
 * Provides authentic, room-specific interior design inspiration,
 * room makeover masterclasses, before-and-after transformations,
 * and architectural placement rules for all 9 primary categories.
 */

export const CATEGORY_INSPIRATION_DATA = {
  'bedroom': {
    id: 'bedroom',
    name: 'Bedroom',
    title: 'The Bedroom Sanctuary',
    subtitle: 'Restful Joinery, Organic Linens & Circadian Glow',
    heroImage: 'assets/magazines/3ffa9485-4bd9-4392-a47d-7010d339117d.webp',
    deck: 'A bedroom should be a sanctuary of restorative stillness, stripped of visual noise and enveloped in natural timber and breathable textiles.',
    stylingPrinciples: [
      {
        tag: 'Spatial Horizon',
        title: 'Low-Profile Bed Placement',
        text: 'Align the platform bed with natural window sightlines while maintaining a minimum 75cm perimeter walkway to create continuous optical expansiveness.'
      },
      {
        tag: 'Concealed Order',
        title: 'Floating Wall Storage',
        text: 'Replace bulky floor chests with wall-hung fluted credenzas. Elevating storage off the floor visually extends the room’s square footage.'
      },
      {
        tag: 'Atmosphere',
        title: '2700K Circadian Evening Light',
        text: 'Eliminate central recessed ceiling glare. Position dimmable alabaster and ceramic table lamps at eye level for natural melatonin release.'
      }
    ],
    makeoverVideo: {
      id: 'vid-small-bedroom',
      title: 'Sanctuary in 12 Square Meters',
      duration: '3:45',
      author: 'Urban Architecture Collective',
      description: 'Clever spatial layout strategies for compact bedrooms: floating nightstands, recessed platform beds, and diffuse bedside illumination.',
      thumbnail: 'assets/magazines/7589a24a-202a-49a0-99c9-5e49e7eb5da5.webp',
      embedUrl: 'https://www.youtube-nocookie.com/embed/O6vYf5Z1jWg?rel=0&modestbranding=1&playsinline=1',
      takeaways: [
        'A platform bed with recessed plinth creates the optical illusion of continuous floor space.',
        'Replace floor lamps with wall sconces or compact mushroom table lights.',
        'A soft warm beige monochrome palette visually expands small bedroom walls.'
      ]
    },
    beforeAfter: {
      tag: 'TRANSFORMATION STUDY',
      headline: 'Small Bedroom Optimization',
      before: 'Cluttered floor layout with oversized nightstands blocking wardrobe doors and harsh overhead lighting.',
      after: 'Low-profile Haven platform bed, floating tambour credenza, and warm bedside ceramic illumination.'
    },
    productFilter: (p) => ['HH-FUR-004', 'HH-SSS-002', 'HH-LGT-003', 'HH-DEC-003', 'HH-DEC-004'].includes(p.id) || p.name.toLowerCase().includes('bed')
  },

  'living-room': {
    id: 'living-room',
    name: 'Living Room',
    title: 'The Living Room Salon',
    subtitle: 'Low Horizons, Monolithic Stone & Fluid Lounge Curves',
    heroImage: 'assets/minh-pham-OtXADkUh3-I-unsplash.jpg',
    deck: 'Designed around grounded low seating and monolithic stone anchors, the living room balances fluid curves with architectural permanence.',
    stylingPrinciples: [
      {
        tag: 'Seating Cadence',
        title: 'The 42cm Horizon Rule',
        text: 'Keeping primary sofa and coffee table heights below 45cm expands perceived ceiling volume and creates an unhurried, grounded lounge atmosphere.'
      },
      {
        tag: 'Material Contrast',
        title: 'Monolithic Stone Anchors',
        text: 'Contrast soft, fluid textured bouclé upholstery with a heavy, honed Roman travertine coffee table to provide a tactile anchor in open-plan spaces.'
      },
      {
        tag: 'Acoustics',
        title: 'Tactile Sound Dampening',
        text: 'Incorporate textured wool bouclé, natural French linen drapery, and loop-pile wool rugs to soften flutter echoes and create an intimate acoustic cocoon.'
      }
    ],
    makeoverVideo: {
      id: 'vid-living-styling',
      title: 'Sculpting the Modern Organic Living Room',
      duration: '4:12',
      author: 'HomeHub Editorial Studio',
      description: 'Discover how low-slung bouclé seating, monolithic travertine tables, and linen drapery compose a tranquil sanctuary for modern living.',
      thumbnail: 'assets/pexels-fotografiagmazg-12420730.jpg',
      embedUrl: 'https://www.youtube-nocookie.com/embed/2V1a44eBsp4?rel=0&modestbranding=1&playsinline=1',
      takeaways: [
        'Keep primary seating heights under 45cm for continuous eye level.',
        'Anchor organic sofas with a heavy, grounding natural stone coffee table.',
        'Incorporate tactile materials like bouclé and raw linen to dampen room acoustics.'
      ]
    },
    beforeAfter: {
      tag: 'TRANSFORMATION STUDY',
      headline: 'Organic Salon Makeover',
      before: 'Rigid sectional sofa pressed against walls with reflective glass surfaces and echoey acoustics.',
      after: 'Floating CloudCurve curved sofa, monolithic Noma travertine table, and ambient arc illumination.'
    },
    productFilter: (p) => ['HH-FUR-001', 'HH-FUR-002', 'HH-FUR-003', 'HH-LGT-002', 'HH-DEC-002', 'HH-DEC-003'].includes(p.id) || p.category === 'furniture'
  },

  'dining-room': {
    id: 'dining-room',
    name: 'Dining Room',
    title: 'The Dining Room Atelier',
    subtitle: 'Monolithic Gathering Surfaces & Sculpted Seating',
    heroImage: 'assets/clay-banks-BnDI_MVomAI-unsplash.jpg',
    deck: 'Gathering around honest natural materials: honed Roman travertine slabs, solid FSC European white oak, and intimate pendant illumination.',
    stylingPrinciples: [
      {
        tag: 'Illumination',
        title: 'The Pendant Horizon',
        text: 'Suspend dining pendants exactly 75–85cm above the tabletop to cast an intimate pool of warm light without interrupting sightlines across guests.'
      },
      {
        tag: 'Proportion',
        title: 'Travertine Durability',
        text: 'Honed travertine with a matte protective sealant withstands daily culinary life while developing a gentle, authentic natural patina.'
      },
      {
        tag: 'Vignette',
        title: 'Curated Table Vessels',
        text: 'Pair one tall wheel-thrown stoneware vase with seasonal dry branches to add vertical grace without obstructing dining conversation.'
      }
    ],
    makeoverVideo: {
      id: 'vid-dining-styling',
      title: 'Dining Room Styling & Intimate Illumination',
      duration: '3:50',
      author: 'Atelier Dining Architecture',
      description: 'Composing a warm gathering space: balancing stone table proportions, acoustic seating upholstery, and focused pendant lighting.',
      thumbnail: 'assets/clay-banks-BnDI_MVomAI-unsplash.jpg',
      embedUrl: 'https://www.youtube-nocookie.com/embed/2V1a44eBsp4?rel=0&modestbranding=1&playsinline=1',
      takeaways: [
        'Maintain at least 90cm clearance between table edge and walls for effortless chair egress.',
        'Use dimmable 2700K lighting to transition seamlessly from breakfast to evening dinner parties.',
        'Incorporate tactile linen tableware to harmonize with honed natural stone surfaces.'
      ]
    },
    beforeAfter: {
      tag: 'TRANSFORMATION STUDY',
      headline: 'Architectural Dining Transformation',
      before: 'Cold industrial dining setup with glare-heavy central spotlight and noisy metal chairs.',
      after: 'Monolithic travertine table, warm bouclé Aura chairs, and brushed brass Luna pendant.'
    },
    productFilter: (p) => ['HH-FUR-002', 'HH-FUR-003', 'HH-DEC-001', 'HH-LGT-001', 'HH-DEC-004'].includes(p.id) || p.name.toLowerCase().includes('table') || p.name.toLowerCase().includes('chair')
  },

  'furniture': {
    id: 'furniture',
    name: 'Furniture',
    title: 'The Furniture Atelier',
    subtitle: 'Heirloom Joinery, Solid Hardwoods & Monolithic Stone',
    heroImage: 'assets/pexels-fotografiagmazg-12420730.jpg',
    deck: 'Handcrafted architectural pieces designed to age with dignity: solid white oak, Roman travertine, and Italian textured bouclé.',
    stylingPrinciples: [
      {
        tag: 'Craftsmanship',
        title: 'Solid Hardwood Joinery',
        text: 'Our timber frames utilize traditional mortise-and-tenon joints that allow natural seasonal wood movement without structural compromise.'
      },
      {
        tag: 'Tactility',
        title: 'Italian Wool Bouclé',
        text: 'Woven with 90% natural wool and 10% flax, offering deep textural dimension, natural stain resistance, and superior acoustic dampening.'
      },
      {
        tag: 'Geological Permanence',
        title: 'Honed Roman Travertine',
        text: 'Each stone piece is hand-selected from historical quarries, celebrating natural sediment striations and delicate geological veining.'
      }
    ],
    makeoverVideo: {
      id: 'vid-furniture-craft',
      title: 'Architectural Furniture Proportions & Detailing',
      duration: '4:15',
      author: 'HomeHub Craft Workshop',
      description: 'Inside the atelier: how solid wood frames, double-density foam cores, and hand-finished stone slabs are crafted to last generations.',
      thumbnail: 'assets/pexels-pixabay-276746.jpg',
      embedUrl: 'https://www.youtube-nocookie.com/embed/1z48Yp95wls?rel=0&modestbranding=1&playsinline=1',
      takeaways: [
        'Inspect structural joint integrity rather than relying on surface finishes alone.',
        'Choose dual-density foam layers for supportive firmness with soft contact surface.',
        'Natural unlacquered stone develops character with gentle daily use.'
      ]
    },
    beforeAfter: {
      tag: 'TRANSFORMATION STUDY',
      headline: 'Atelier Quality Elevation',
      before: 'Short-lived flat-pack particle board furniture prone to sagging and surface chipping.',
      after: 'Heirloom solid oak and travertine pieces backed by HomeHub’s 5-year structural guarantee.'
    },
    productFilter: (p) => p.category === 'furniture'
  },

  'small-spaces': {
    id: 'small-spaces',
    name: 'Small Spaces',
    title: 'Small Spaces & Smart Living',
    subtitle: 'Space Intelligence, Nested Joinery & Micro-Living',
    heroImage: 'assets/magazines/4f5d0ae3-01f3-41ad-b9df-0624121da53a.webp',
    deck: 'Compact living does not mean compromise. Space-intelligent nested engineering and wall-hung joinery preserve full freedom of movement.',
    stylingPrinciples: [
      {
        tag: 'Floor Sightlines',
        title: 'Clear Continuous Floors',
        text: 'By mounting credenzas and nightstands directly to walls with French cleats, floorboards remain visible from wall to wall, expanding room scale.'
      },
      {
        tag: 'Flexibility',
        title: 'Telescoping Workspaces',
        text: 'A shallow 35cm console that glides forward into an 80cm ergonomic desk only when needed preserves daytime living room flow.'
      },
      {
        tag: 'Zoning',
        title: 'Low Swivel Seating',
        text: 'A low-profile swivel armchair can pivot effortlessly between living conversation and the work console without demanding extra square footage.'
      }
    ],
    makeoverVideo: {
      id: 'vid-space-saving',
      title: 'Multi-Functional Micro-Living Engineering',
      duration: '4:40',
      author: 'Compact Living Studio',
      description: 'Watch how compact telescoping desks and floating storage adapt seamlessly between work hours and evening relaxation.',
      thumbnail: 'assets/magazines/de179757-6ab3-4cb0-9b56-84039d2ba4dc.webp',
      embedUrl: 'https://www.youtube-nocookie.com/embed/1z48Yp95wls?rel=0&modestbranding=1&playsinline=1',
      takeaways: [
        'Telescoping console desks offer full work ergonomics without consuming permanent floor footprint.',
        'French-cleat wall credenzas maintain clear floor sightlines from edge to edge.',
        'Swivel lounge armchairs eliminate the need for separate reading and office task chairs.'
      ]
    },
    beforeAfter: {
      tag: 'TRANSFORMATION STUDY',
      headline: '45m² Studio Apartment Transformation',
      before: 'Overcrowded studio with bulky desk occupying main corridor and messy exposed cables.',
      after: 'Modula nested desk, Flute floating console, and wall-mounted Halo mirror doubling natural light.'
    },
    productFilter: (p) => ['HH-SSS-001', 'HH-SSS-002', 'HH-FUR-003', 'HH-LGT-003', 'HH-DEC-004'].includes(p.id) || p.category === 'small-spaces'
  },

  'kitchen': {
    id: 'kitchen',
    name: 'Kitchen',
    title: 'Culinary Architecture & Kitchen Living',
    subtitle: 'Streamlined Stone, Fluted Timber & Warm Illumination',
    heroImage: 'assets/magazines/1aa74f5d-417b-4fed-ad3d-3f05fce90ac1.webp',
    deck: 'Elevating the culinary landscape into a serene living space with honed stone worktops, fluted timber cabinetry, and warm task illumination.',
    stylingPrinciples: [
      {
        tag: 'Visual Order',
        title: 'Countertop Stillness',
        text: 'Keep secondary appliances concealed in fluted pocket larders; curate only wheel-thrown ceramic oil vessels and natural timber prep boards.'
      },
      {
        tag: 'Lighting Zones',
        title: 'Task vs Dining Glow',
        text: 'Use concealed 2700K LED strips beneath cabinets for food preparation, paired with warm brass pendants over the island for evening drinks.'
      },
      {
        tag: 'Material Care',
        title: 'Natural Stone Sealing',
        text: 'Treat honed travertine and limestone counters with breathable food-safe wax sealants to protect against acid staining while preserving tactile texture.'
      }
    ],
    makeoverVideo: {
      id: 'vid-kitchen-org',
      title: 'Minimalist Kitchen Organization & Culinary Vignettes',
      duration: '4:05',
      author: 'Atelier Culinary Architecture',
      description: 'Designing high-efficiency kitchen workstations with concealed pantries, acoustic timber paneling, and tactile ceramic storage.',
      thumbnail: 'assets/magazines/15db50fe-f290-462b-ae89-457ee3ab948a.webp',
      embedUrl: 'https://www.youtube-nocookie.com/embed/kJQP7kiw5Fk?rel=0&modestbranding=1&playsinline=1',
      takeaways: [
        'Store everyday culinary tools within one arm’s reach using concealed modular drawers.',
        'Use raw brass pendant lighting over prep islands for a warm, welcoming gathering ambiance.',
        'Incorporate handcrafted ceramic vessels to soften clinical stainless steel appliances.'
      ]
    },
    beforeAfter: {
      tag: 'TRANSFORMATION STUDY',
      headline: 'Minimalist Kitchen Makeover',
      before: 'Cluttered laminate counters, fluorescent ceiling tubes, and exposed plastic spice racks.',
      after: 'Streamlined honed travertine counters, brushed brass Luna pendants, and Solis stoneware jars.'
    },
    productFilter: (p) => ['HH-DEC-001', 'HH-LGT-001', 'HH-SSS-002', 'HH-FUR-002'].includes(p.id) || p.material.toLowerCase().includes('stone') || p.name.toLowerCase().includes('pendant')
  },

  'lighting': {
    id: 'lighting',
    name: 'Lighting',
    title: 'Light / Life Architectural Illumination',
    subtitle: 'Warm 2700K Temperatures, Diffused Sconces & Arc Profiles',
    heroImage: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1600&q=85',
    deck: 'Illumination is the brush that paints spatial depth. We craft three-tier 2700K illumination systems that eliminate glare and soothe evening rhythm.',
    stylingPrinciples: [
      {
        tag: 'Hierarchy',
        title: 'Three-Tier Illumination Hierarchy',
        text: 'Distribute light across low table accents (30–60cm), eye-level wall sconces (150cm), and diffused brass ceiling pendants to eliminate harsh ceiling glare.'
      },
      {
        tag: 'Color Purity',
        title: '2700K Warm Temperature & 90+ CRI',
        text: 'Ensure all luminaires share an identical 2700K color temperature with a high color rendering index to showcase natural wood and stone pigments.'
      },
      {
        tag: 'Shadow Play',
        title: 'Grazing Wall Textures',
        text: 'Direct adjustable brass arms to graze light across textured lime wash or mineral plaster walls, casting organic ambient shadows.'
      }
    ],
    makeoverVideo: {
      id: 'vid-lighting-insp',
      title: 'The Art of the Evening Glow',
      duration: '5:20',
      author: 'Lumina Architectural Labs',
      description: 'Layering three tiers of 2700K illumination to eliminate ceiling glare and create an intimate, cocooning atmospheric temperature.',
      thumbnail: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=85',
      embedUrl: 'https://www.youtube-nocookie.com/embed/Q5aQ9mE5u9Q?rel=0&modestbranding=1&playsinline=1',
      takeaways: [
        'Avoid single-source central downlights; distribute light at three distinct eye-height levels.',
        'Use indirect wall sconces to throw soft eclipse reflections across textured drywall.',
        'Ensure all bulbs share consistent 2700K warm color temperature with 90+ CRI.'
      ]
    },
    beforeAfter: {
      tag: 'TRANSFORMATION STUDY',
      headline: 'Circadian Lighting Elevation',
      before: 'Cold 4000K ceiling pot lights creating harsh downward facial shadows and evening restlessness.',
      after: 'Multi-tiered 2700K warmth with Luna brass pendant, Arc marble floor lamp, and Glow table lamp.'
    },
    productFilter: (p) => p.category === 'lighting'
  },

  'decor': {
    id: 'decor',
    name: 'Home Décor',
    title: 'Objects of Home & Curated Décor',
    subtitle: 'Wheel-Thrown Stoneware, Mineral Plaster & Raw Linens',
    heroImage: 'assets/magazines/923e4bb3-ccc1-4efb-806a-bfc42fdd3565.webp',
    deck: 'Objects in the home should not demand attention; they should reward it with quiet texture, natural asymmetry, and shifting daylight.',
    stylingPrinciples: [
      {
        tag: 'Composition',
        title: 'The Rule of Asymmetric Odds',
        text: 'Group decorative pieces in clusters of three or five with varying heights (one vertical vessel, one flat stone tray, one medium textured object).'
      },
      {
        tag: 'Negative Space',
        title: 'Generous Breathing Room',
        text: 'Leave at least 40% of shelf and console surfaces unadorned. Negative space gives sculptural objects room to resonate.'
      },
      {
        tag: 'Reflections',
        title: 'Asymmetric Mirror Placement',
        text: 'Position asymmetric cast-bronze mirrors opposite natural windows to reflect outdoor foliage and bounce natural daylight into dark alcoves.'
      }
    ],
    makeoverVideo: {
      id: 'vid-home-decoration',
      title: 'Still Life Vignettes & Curated Ceramics',
      duration: '3:18',
      author: 'Atelier Nord Ceramics',
      description: 'Styling coffee tables, mantels, and entryway consoles using the rule of odd numbers, asymmetric heights, and raw earthen vessels.',
      thumbnail: 'assets/magazines/923e4bb3-ccc1-4efb-806a-bfc42fdd3565.webp',
      embedUrl: 'https://www.youtube-nocookie.com/embed/kJQP7kiw5Fk?rel=0&modestbranding=1&playsinline=1',
      takeaways: [
        'Pair one tall ceramic vessel with one low flat stone tray or art monograph.',
        'Leave ample unadorned surface area around each curated grouping.',
        'Embrace wheel-thrown tactile irregularities over machine-perfect finishes.'
      ]
    },
    beforeAfter: {
      tag: 'TRANSFORMATION STUDY',
      headline: 'Console Vignette Styling',
      before: 'Overcrowded shelf with mass-produced knick-knacks and random plastic photo frames.',
      after: 'Solis wheel-thrown stoneware vase, Forma plaster wall art, and French flax cushions.'
    },
    productFilter: (p) => p.category === 'decor'
  },

  'storage': {
    id: 'storage',
    name: 'Storage Solutions',
    title: 'Storage Solutions & Architectural Joinery',
    subtitle: 'Floating Consoles, Slatted Tambour & Concealed Cable Order',
    heroImage: 'assets/magazines/ca22619b-3da0-49d0-9829-0146c7dcc909.webp',
    deck: 'Concealed storage joinery maintains peaceful domestic order. Floating credenzas, tambour slats, and integrated wire management keep surfaces pristine.',
    stylingPrinciples: [
      {
        tag: 'Concealed Tech',
        title: 'Integrated Cable Architecture',
        text: 'Use rear ventilation channels and internal wire raceways inside tambour consoles so media boxes and power cables remain completely hidden.'
      },
      {
        tag: 'Acoustics',
        title: 'Slatted Timber Tambour',
        text: 'Vertical fluted wood profiles allow infrared remote signals and component ventilation while dampening room echo.'
      },
      {
        tag: 'Weight Capacity',
        title: 'French Cleat Installation',
        text: 'Mounting heavy credenzas onto load-bearing structural studs using interlocked aluminum French cleats guarantees rock-solid stability up to 60 kg.'
      }
    ],
    makeoverVideo: {
      id: 'vid-storage-solutions',
      title: 'Hidden Storage & Space-Intelligent Joinery',
      duration: '4:20',
      author: 'HomeHub Atelier Joinery',
      description: 'How floating consoles, recessed plinths, and concealed tambour doors transform chaotic rooms into serene, minimalist architecture.',
      thumbnail: 'assets/magazines/ca22619b-3da0-49d0-9829-0146c7dcc909.webp',
      embedUrl: 'https://www.youtube-nocookie.com/embed/1z48Yp95wls?rel=0&modestbranding=1&playsinline=1',
      takeaways: [
        'Concealed cable passages keep desktops and entertainment units free of visual clutter.',
        'Wall-hung cabinetry creates an unbroken floor sightline that makes rooms feel larger.',
        'Slatted tambour doors allow electronic airflow while preserving minimalist visual lines.'
      ]
    },
    beforeAfter: {
      tag: 'TRANSFORMATION STUDY',
      headline: 'Media & Cable Concealment',
      before: 'Floor media stand with tangled power cords, visible routers, and dust-gathering open shelves.',
      after: 'Flute floating tambour console mounted on French cleats with 100% concealed cables.'
    },
    productFilter: (p) => ['HH-SSS-001', 'HH-SSS-002', 'HH-FUR-004'].includes(p.id) || p.category === 'small-spaces'
  }
};
