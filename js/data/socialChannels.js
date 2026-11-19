/**
 * HomeHub - Editorial Social Channels Data
 * Active social profiles for Facebook, X / Twitter, YouTube, and Instagram.
 */

export const SOCIAL_CHANNELS = {
  facebook: {
    id: "facebook",
    platform: "Facebook",
    name: "HomeHub Atelier",
    handle: "@homehub.atelier",
    verified: true,
    badgeText: "Verified Editorial Studio",
    metrics: "42,800 Followers • 1,240 Following",
    bio: "Official Atelier publication page. Architectural small-space case studies, slow tactile craftsmanship, and 3D digital publications. Stockholm • Lahore • London.",
    avatar: "assets/logo-mark.svg",
    banner: "assets/magazines/1aa74f5d-417b-4fed-ad3d-3f05fce90ac1.webp",
    ctaLabel: "Follow Page",
    posts: [
      {
        id: "fb-1",
        date: "Yesterday at 14:30",
        text: "Volume 04 of 'The Art of Compact Living' is now live in our interactive 3D digital reading room. Explore realistic double-page spreads analyzing 52 sq ft galley kitchens and 76 sq ft bedroom sanctuaries in situ.",
        image: "assets/magazines/1aa74f5d-417b-4fed-ad3d-3f05fce90ac1.webp",
        likes: "1,240 Likes",
        comments: "86 Comments",
        shares: "42 Shares"
      },
      {
        id: "fb-2",
        date: "3 days ago",
        text: "The low-horizon living principle: keeping primary seating heights under 42cm preserves unbroken negative space in urban lofts. Featuring the CloudCurve 3-seater in textured Italian bouclé.",
        image: "assets/minh-pham-OtXADkUh3-I-unsplash.jpg",
        likes: "2,180 Likes",
        comments: "142 Comments",
        shares: "95 Shares"
      },
      {
        id: "fb-3",
        date: "5 days ago",
        text: "Behind the joinery: how our solid white ash consoles glide effortlessly from a 38cm hallway plinth into a 72cm dedicated study desk with hidden power conduits.",
        image: "assets/magazines/4aa14b31-2e83-4baa-8af8-a1112955006d.webp",
        likes: "980 Likes",
        comments: "54 Comments",
        shares: "31 Shares"
      }
    ]
  },

  twitter: {
    id: "twitter",
    platform: "X (Twitter)",
    name: "HomeHub Atelier",
    handle: "@homehub_atelier",
    verified: true,
    badgeText: "Atelier Official",
    metrics: "28,400 Followers • 342 Following",
    bio: "Quiet proportions, compact living intelligence, and enduring craftsmanship. Publications & architectural case studies. Shop • Style • Smart.",
    avatar: "assets/logo-mark.svg",
    banner: "assets/clay-banks-BnDI_MVomAI-unsplash.jpg",
    ctaLabel: "Follow @homehub_atelier",
    posts: [
      {
        id: "tw-1",
        date: "4h ago",
        text: "Space is not a void to fill; it is the canvas that allows natural light and breath to circulate. Our three principles of considered living are now open on HomeHub.",
        image: null,
        likes: "432 Likes",
        comments: "28 Retweets",
        shares: "12 Quotes"
      },
      {
        id: "tw-2",
        date: "Nov 17",
        text: "Roman travertine vs synthetic resin composites: why geological permanence and natural sediment veining always outlast trend cycles in compact living spaces.",
        image: "assets/clay-banks-BnDI_MVomAI-unsplash.jpg",
        likes: "890 Likes",
        comments: "64 Retweets",
        shares: "22 Quotes"
      },
      {
        id: "tw-3",
        date: "Nov 15",
        text: "New video masterclass streaming: 'The Art of the Evening Glow' — layering three tiers of 2700K illumination without ceiling glare.",
        image: "assets/pexels-pixabay-276746.jpg",
        likes: "1,120 Likes",
        comments: "82 Retweets",
        shares: "39 Quotes"
      }
    ]
  },

  youtube: {
    id: "youtube",
    platform: "YouTube",
    name: "HomeHub Atelier",
    handle: "@HomeHubAtelier",
    verified: true,
    badgeText: "Official Studio Channel",
    metrics: "86,500 Subscribers • 48 Masterclasses",
    bio: "Stream 4K architectural interior home tours, masterclass styling guides, and joinery workshops produced by HomeHub Editorial Studio.",
    avatar: "assets/logo-mark.svg",
    banner: "assets/minh-pham-OtXADkUh3-I-unsplash.jpg",
    ctaLabel: "Subscribe (86.5K)",
    posts: [
      {
        id: "yt-1",
        date: "Premiered 2 days ago",
        text: "MASTERCLASS 01: Sculpting the Modern Organic Living Room (4:12) — Low-slung bouclé seating, monolithic travertine tables, and acoustic linen drapery.",
        image: "assets/minh-pham-OtXADkUh3-I-unsplash.jpg",
        likes: "4.8K Likes",
        comments: "312 Comments",
        shares: "42K Views"
      },
      {
        id: "yt-2",
        date: "Premiered 1 week ago",
        text: "MASTERCLASS 02: Sanctuary & Rest: Low-Profile Architectural Joinery (3:45) — Clever spatial layout strategies for 76 sq ft compact bedrooms.",
        image: "assets/magazines/3ffa9485-4bd9-4392-a47d-7010d339117d.webp",
        likes: "6.2K Likes",
        comments: "480 Comments",
        shares: "58K Views"
      },
      {
        id: "yt-3",
        date: "Premiered 2 weeks ago",
        text: "MASTERCLASS 03: The Art of the Evening Glow: 2700K Layered Atmosphere (5:20) — Eliminating ceiling glare with indirect radial eclipse wall sconces.",
        image: "assets/pexels-pixabay-276746.jpg",
        likes: "8.9K Likes",
        comments: "720 Comments",
        shares: "91K Views"
      }
    ]
  },

  instagram: {
    id: "instagram",
    platform: "Instagram",
    name: "HomeHub Atelier",
    handle: "@homehub.atelier",
    verified: true,
    badgeText: "Verified Atelier",
    metrics: "114,000 Followers • 412 Posts • 240 Following",
    bio: "HomeHub (SHOP • STYLE • SMART). Quiet living, natural stone, textured bouclé, and 3D architectural flipbooks. Curated by Farhana Aamir.",
    avatar: "assets/logo-mark.svg",
    banner: "assets/magazines/7589a24a-202a-49a0-99c9-5e49e7eb5da5.webp",
    ctaLabel: "Follow",
    posts: [
      {
        id: "ig-1",
        date: "3 hours ago",
        text: "The tactile warmth of Italian bouclé meets Scandinavian micro-cement floors. CloudCurve 3-seater in soft ivory.",
        image: "assets/minh-pham-OtXADkUh3-I-unsplash.jpg",
        likes: "3,840 Likes",
        comments: "128 Comments",
        shares: "Saved 940 times"
      },
      {
        id: "ig-2",
        date: "1 day ago",
        text: "Honed Roman travertine sediment striations on the Noma Coffee Table. Each geological fissure tells a story.",
        image: "assets/clay-banks-BnDI_MVomAI-unsplash.jpg",
        likes: "4,190 Likes",
        comments: "176 Comments",
        shares: "Saved 1,280 times"
      },
      {
        id: "ig-3",
        date: "3 days ago",
        text: "Wheel-turned terracotta with raw mineral chalk glazes. Solis Ceramic Vessel series in the afternoon sun.",
        image: "assets/magazines/923e4bb3-ccc1-4efb-806a-bfc42fdd3565.webp",
        likes: "2,980 Likes",
        comments: "94 Comments",
        shares: "Saved 810 times"
      }
    ]
  }
};
