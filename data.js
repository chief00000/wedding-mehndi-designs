// Structured catalogue source. Each category yields 250 combinations from curated, category-specific directions.
const CATEGORY_SEEDS = [
  {
    "name": "Mehndi Designs",
    "icon": "✿",
    "directions": [
      "bridal mandala",
      "fine paisley trails",
      "jasmine vine",
      "geometric jaali",
      "peacock feather",
      "wrist cuff",
      "fingertip detailing",
      "lotus lattice",
      "negative-space bands",
      "full-hand storytelling"
    ],
    "styles": [
      "henna stain",
      "fine-line henna",
      "dense traditional fill",
      "airy openwork",
      "symmetrical layout"
    ],
    "views": [
      "palm close-up",
      "both hands overhead",
      "hand and forearm",
      "fingertip detail",
      "bridal hand pose"
    ]
  },
  {
    "name": "Bridal Fashion",
    "icon": "♢",
    "directions": [
      "hand-embroidered lehenga",
      "structured bridal gown",
      "velvet wedding ensemble",
      "organza dupatta styling",
      "pearl-work silhouette",
      "heritage couture",
      "sculpted sleeve detail",
      "layered skirt movement",
      "modern modest bridalwear",
      "ceremonial silk outfit"
    ],
    "styles": [
      "couture editorial",
      "heritage craftsmanship",
      "modern romantic",
      "regal maximalist",
      "quiet luxury"
    ],
    "views": [
      "full-length portrait",
      "fabric detail crop",
      "three-quarter editorial",
      "walking movement",
      "studio lookbook"
    ]
  },
  {
    "name": "Wedding Decor",
    "icon": "✧",
    "directions": [
      "layered floral canopy",
      "candlelit aisle",
      "draped fabric installation",
      "heritage courtyard",
      "sculptural floral arch",
      "hanging lantern garden",
      "ceremony entrance",
      "intimate garden setting",
      "textured lounge vignette",
      "ceremonial pathway"
    ],
    "styles": [
      "romantic garden",
      "regal celebration",
      "modern organic",
      "heritage inspired",
      "understated luxury"
    ],
    "views": [
      "wide venue view",
      "centered installation",
      "guest-eye perspective",
      "architectural detail",
      "evening ambience"
    ]
  },
  {
    "name": "Jewellery Designs",
    "icon": "◇",
    "directions": [
      "kundan necklace set",
      "polki choker",
      "jhumka earrings",
      "temple jewellery",
      "pearl hair ornament",
      "meenakari pendant",
      "stacked bridal bangles",
      "gemstone maang tikka",
      "filigree ear cuff",
      "heirloom-inspired ring"
    ],
    "styles": [
      "heritage goldsmithing",
      "royal opulence",
      "minimal sculptural",
      "antique patina",
      "modern heirloom"
    ],
    "views": [
      "macro product shot",
      "on velvet display",
      "three-quarter product view",
      "worn editorial detail",
      "flat lay arrangement"
    ]
  },
  {
    "name": "Wedding Invitations",
    "icon": "▤",
    "directions": [
      "deckled-edge invitation",
      "foil-stamped monogram",
      "botanical linework suite",
      "architectural motif card",
      "hand-painted florals",
      "silk ribbon enclosure",
      "vellum overlay",
      "heritage border suite",
      "minimal typography card",
      "illustrated venue invitation"
    ],
    "styles": [
      "timeless stationery",
      "modern editorial",
      "romantic botanical",
      "art deco elegance",
      "heritage formal"
    ],
    "views": [
      "overhead flat lay",
      "close-up paper texture",
      "layered suite composition",
      "single-card hero",
      "envelope and insert"
    ]
  },
  {
    "name": "Floral Arrangements",
    "icon": "❀",
    "directions": [
      "garden rose bouquet",
      "orchid cascade",
      "marigold garland",
      "calla lily sculptural stem",
      "wildflower gathering",
      "jasmine strings",
      "tropical foliage installation",
      "monochrome rose cluster",
      "seasonal meadow arrangement",
      "floating floral bowl"
    ],
    "styles": [
      "natural garden gathered",
      "sculptural luxury",
      "soft romantic",
      "colour-blocked modern",
      "traditional ceremonial"
    ],
    "views": [
      "bouquet close-up",
      "vase hero shot",
      "overhead arrangement",
      "wide floral installation",
      "hand-held bridal view"
    ]
  },
  {
    "name": "Bridal Makeup",
    "icon": "◉",
    "directions": [
      "soft rose bridal glow",
      "defined kohl eye",
      "bronzed luminous skin",
      "classic red lip",
      "pearl-highlight finish",
      "matte neutral glam",
      "fresh dewy complexion",
      "smoky plum eye",
      "gold shimmer detail",
      "editorial monochrome makeup"
    ],
    "styles": [
      "soft glam",
      "classic bridal",
      "editorial beauty",
      "warm luminous",
      "modern minimal"
    ],
    "views": [
      "beauty close-up",
      "three-quarter portrait",
      "eye detail crop",
      "profile with soft light",
      "bridal prep moment"
    ]
  },
  {
    "name": "Bridal Hairstyles",
    "icon": "⌁",
    "directions": [
      "jasmine-wrapped low bun",
      "sculpted chignon",
      "soft romantic waves",
      "braided crown",
      "sleek center-part bun",
      "floral braid detail",
      "pearl-pinned updo",
      "voluminous bridal ponytail",
      "traditional braid ornament",
      "textured low knot"
    ],
    "styles": [
      "romantic polished",
      "heritage bridal",
      "modern sculptural",
      "soft natural",
      "luxury editorial"
    ],
    "views": [
      "rear hairstyle detail",
      "profile portrait",
      "three-quarter beauty",
      "ornament close-up",
      "full bridal look"
    ]
  },
  {
    "name": "Wedding Photography",
    "icon": "▧",
    "directions": [
      "veil-in-motion portrait",
      "candid laughter frame",
      "ceremony wide shot",
      "hands and rings detail",
      "golden-hour couple portrait",
      "documentary family moment",
      "architectural editorial portrait",
      "black-and-white embrace",
      "rainy-day romance",
      "film-inspired reception frame"
    ],
    "styles": [
      "documentary editorial",
      "cinematic romance",
      "fine-art film",
      "natural candid",
      "fashion campaign"
    ],
    "views": [
      "wide environmental frame",
      "intimate close-up",
      "over-the-shoulder view",
      "symmetrical portrait",
      "motion-filled candid"
    ]
  },
  {
    "name": "Wedding Stage Designs",
    "icon": "▥",
    "directions": [
      "layered floral stage",
      "arched heritage backdrop",
      "minimal monogram stage",
      "draped velvet dais",
      "moon-gate installation",
      "garden-inspired platform",
      "ornate carved panels",
      "floating floral canopy",
      "modern geometric stage",
      "candlelit intimate dais"
    ],
    "styles": [
      "royal grandeur",
      "modern minimal",
      "garden romance",
      "heritage opulence",
      "contemporary sculptural"
    ],
    "views": [
      "frontal stage view",
      "wide venue perspective",
      "detail of backdrop",
      "guest-eye view",
      "evening illuminated view"
    ]
  },
  {
    "name": "Wedding Dresses",
    "icon": "♧",
    "directions": [
      "embroidered ball gown",
      "silk satin column dress",
      "lace-trimmed A-line",
      "pearl-beaded bodice",
      "sculptural off-shoulder gown",
      "heritage red bridal dress",
      "tulle layered skirt",
      "minimal crepe silhouette",
      "floral appliqué gown",
      "long-train couture dress"
    ],
    "styles": [
      "timeless couture",
      "romantic vintage",
      "modern architectural",
      "regal bridal",
      "understated elegance"
    ],
    "views": [
      "runway full-length",
      "bodice detail",
      "back train view",
      "three-quarter portrait",
      "fabric movement shot"
    ]
  },
  {
    "name": "Wedding Cakes",
    "icon": "♜",
    "directions": [
      "pressed-flower tiered cake",
      "gold-leaf fondant tiers",
      "textured buttercream cake",
      "minimal ivory tower",
      "sugar orchid cascade",
      "heritage piped cake",
      "fruit and floral cake",
      "architectural tier cake",
      "painted botanical cake",
      "pearled celebration cake"
    ],
    "styles": [
      "artisan patisserie",
      "editorial luxury",
      "romantic botanical",
      "modern sculptural",
      "heritage celebration"
    ],
    "views": [
      "cake hero portrait",
      "slice and texture detail",
      "dessert table scene",
      "three-quarter product shot",
      "overhead styling"
    ]
  },
  {
    "name": "Wedding Bouquets",
    "icon": "❋",
    "directions": [
      "ivory rose hand-tied bouquet",
      "orchid waterfall bouquet",
      "garden rose and ranunculus",
      "marigold ceremonial bouquet",
      "wild meadow bridal bundle",
      "calla lily minimal bouquet",
      "peony cloud bouquet",
      "dried botanical bouquet",
      "monochrome tulip bundle",
      "jasmine and rose cluster"
    ],
    "styles": [
      "garden gathered",
      "sculptural contemporary",
      "romantic soft",
      "ceremonial traditional",
      "minimal refined"
    ],
    "views": [
      "hand-held portrait",
      "overhead bouquet",
      "ribbon detail macro",
      "vase display",
      "silhouette against dress"
    ]
  },
  {
    "name": "Wedding Tablescapes",
    "icon": "▦",
    "directions": [
      "linen and taper candle table",
      "gold-rimmed porcelain setting",
      "garden runner centerpiece",
      "heritage brass tableware",
      "minimal monochrome tablescape",
      "layered printed menu setting",
      "orchid and crystal centerpiece",
      "candlelit long banquet",
      "woven natural textures",
      "formal silver service"
    ],
    "styles": [
      "modern organic",
      "quiet luxury",
      "heritage formal",
      "romantic garden",
      "editorial minimal"
    ],
    "views": [
      "overhead place setting",
      "long-table perspective",
      "centerpiece close-up",
      "guest-eye view",
      "menu and place card detail"
    ]
  },
  {
    "name": "Wedding Lighting",
    "icon": "☼",
    "directions": [
      "warm festoon canopy",
      "candlelit aisle glow",
      "architectural uplighting",
      "lantern-lined walkway",
      "soft pinspot stage",
      "fairy-light tree canopy",
      "sculptural pendant installation",
      "golden ambient ballroom",
      "floating candle reflections",
      "dramatic silhouette lighting"
    ],
    "styles": [
      "cinematic warm",
      "dreamy romantic",
      "architectural modern",
      "festive glow",
      "understated luxe"
    ],
    "views": [
      "wide night scene",
      "lighting fixture detail",
      "silhouette composition",
      "venue ceiling view",
      "aisle-level perspective"
    ]
  },
  {
    "name": "Bridal Accessories",
    "icon": "✧",
    "directions": [
      "embroidered bridal clutch",
      "pearl shoe detail",
      "ornate veil comb",
      "silk ribbon garter",
      "gemstone hair vine",
      "monogrammed hand fan",
      "embroidered footwear",
      "beaded potli bag",
      "heirloom hand mirror",
      "delicate bridal cape"
    ],
    "styles": [
      "heirloom elegance",
      "modern minimal",
      "handcrafted luxury",
      "romantic vintage",
      "ceremonial ornate"
    ],
    "views": [
      "macro product photography",
      "accessory flat lay",
      "worn styling detail",
      "velvet display",
      "editorial still life"
    ]
  },
  {
    "name": "Groom Fashion",
    "icon": "♙",
    "directions": [
      "ivory sherwani with embroidery",
      "midnight tuxedo",
      "velvet bandhgala",
      "textured achkan",
      "tailored three-piece suit",
      "heritage brocade jacket",
      "minimal black formalwear",
      "embroidered wedding waistcoat",
      "silk pocket-square styling",
      "ceremonial turban detail"
    ],
    "styles": [
      "regal traditional",
      "modern tailoring",
      "quiet luxury",
      "heritage formal",
      "editorial contemporary"
    ],
    "views": [
      "full-length portrait",
      "lapel and textile detail",
      "three-quarter lookbook",
      "walking candid",
      "accessory close-up"
    ]
  },
  {
    "name": "Wedding Themes",
    "icon": "✺",
    "directions": [
      "moonlit garden romance",
      "desert rose celebration",
      "heritage palace evening",
      "coastal ivory gathering",
      "citrus orchard wedding",
      "modern monochrome ceremony",
      "enchanted woodland dinner",
      "art-deco ballroom",
      "terracotta courtyard feast",
      "celestial night celebration"
    ],
    "styles": [
      "immersive editorial",
      "romantic atmospheric",
      "heritage rich",
      "modern curated",
      "nature-led"
    ],
    "views": [
      "wide mood-setting view",
      "table detail",
      "ceremony vignette",
      "colour story flat lay",
      "evening atmosphere"
    ]
  },
  {
    "name": "Traditional Wedding Designs",
    "icon": "❈",
    "directions": [
      "heritage paisley border",
      "ceremonial marigold toran",
      "hand-painted folk motifs",
      "ornate carved mandap",
      "traditional textile pattern",
      "brass ritual tray styling",
      "embroidered heirloom cloth",
      "classic floral garland",
      "heritage architecture detail",
      "ceremonial red-and-gold palette"
    ],
    "styles": [
      "heritage craftsmanship",
      "ceremonial richness",
      "regional folk artistry",
      "classic regal",
      "handcrafted tradition"
    ],
    "views": [
      "ornament close-up",
      "symmetrical ceremonial view",
      "textile macro",
      "wide setting",
      "overhead ritual arrangement"
    ]
  },
  {
    "name": "Modern and Contemporary Wedding Designs",
    "icon": "◈",
    "directions": [
      "asymmetric floral sculpture",
      "clean architectural arch",
      "monochrome bridal styling",
      "abstract stationery suite",
      "linear candle installation",
      "sculptural ceramic tableware",
      "negative-space stage",
      "modern silk draping",
      "minimal floral cluster",
      "gallery-like ceremony space"
    ],
    "styles": [
      "contemporary editorial",
      "architectural minimal",
      "artful asymmetry",
      "quiet luxury",
      "avant-garde romance"
    ],
    "views": [
      "clean hero composition",
      "architectural wide view",
      "material close-up",
      "overhead flat lay",
      "editorial portrait"
    ]
  },
  {
    "name": "Pakistani Wedding Designs",
    "icon": "✿",
    "directions": [
      "zardozi bridal lehenga",
      "gotapatti dupatta detail",
      "mehndi marigold setting",
      "truck-art inspired invitation",
      "jhumar and tikka set",
      "traditional dholki corner",
      "sharara with handwork",
      "phulkari-inspired textile",
      "mehndi stage with rattan",
      "henna and jasmine bridal hands"
    ],
    "styles": [
      "Pakistani heritage luxury",
      "vibrant mehndi festivity",
      "classic formalwear",
      "modern cultural fusion",
      "artisan detail"
    ],
    "views": [
      "bridal editorial portrait",
      "textile close-up",
      "festive wide scene",
      "overhead accessories",
      "ceremonial detail"
    ]
  },
  {
    "name": "Indian Wedding Designs",
    "icon": "❋",
    "directions": [
      "banarasi silk bridal look",
      "temple jewellery styling",
      "marigold mandap installation",
      "rangoli-inspired floor art",
      "heritage palace invitation",
      "lotus wedding stage",
      "silk saree drape detail",
      "traditional kalire ornament",
      "brass diya tablescape",
      "floral varmala presentation"
    ],
    "styles": [
      "Indian heritage craft",
      "ceremonial regal",
      "vibrant festive",
      "modern fusion",
      "timeless tradition"
    ],
    "views": [
      "full ceremonial view",
      "ornament close-up",
      "textile detail",
      "overhead arrangement",
      "wide venue frame"
    ]
  },
  {
    "name": "Arabic Mehndi Designs",
    "icon": "❦",
    "directions": [
      "bold diagonal floral trail",
      "negative-space Arabic vine",
      "wrist-to-finger paisley",
      "bold rose and leaf chain",
      "geometric floral cuff",
      "fine crescent-inspired motif",
      "open palm vine pattern",
      "finger band detailing",
      "asymmetric forearm trail",
      "minimal botanical henna"
    ],
    "styles": [
      "bold Arabic linework",
      "airy negative space",
      "fine-line elegance",
      "modern botanical",
      "ornate festive"
    ],
    "views": [
      "palm close-up",
      "forearm diagonal view",
      "hand and wrist",
      "fingertip macro",
      "both hands composition"
    ]
  },
  {
    "name": "Minimalist Wedding Designs",
    "icon": "○",
    "directions": [
      "single-stem boutonniere",
      "fine-line invitation",
      "one-tier sculptural cake",
      "single floral hairpin",
      "clean silk bridal silhouette",
      "restrained candle table",
      "minimal gold band",
      "airy ceremony arch",
      "monochrome bouquet",
      "quiet neutral stage"
    ],
    "styles": [
      "quiet luxury",
      "essential minimalism",
      "soft contemporary",
      "architectural restraint",
      "organic simplicity"
    ],
    "views": [
      "isolated hero object",
      "negative-space composition",
      "close-up detail",
      "wide airy scene",
      "overhead arrangement"
    ]
  },
  {
    "name": "Luxury Wedding Concepts",
    "icon": "♛",
    "directions": [
      "crystal-lit grand ballroom",
      "couture floral ceiling",
      "hand-finished gold stationery",
      "sculptural orchid installation",
      "bespoke embroidered bridalwear",
      "marble and candle tablescape",
      "private estate ceremony",
      "jewel-toned reception design",
      "artisanal heirloom jewellery",
      "immersive candlelit aisle"
    ],
    "styles": [
      "couture opulence",
      "refined grandeur",
      "bespoke craftsmanship",
      "modern palace luxury",
      "editorial extravagance"
    ],
    "views": [
      "grand wide establishing view",
      "artisan macro detail",
      "centered hero composition",
      "cinematic evening view",
      "editorial close-up"
    ]
  },
  {
    "name": "Wedding Favours",
    "icon": "♧",
    "directions": [
      "monogrammed keepsake box",
      "artisan honey jar",
      "silk-wrapped favour",
      "hand-poured candle gift",
      "mini botanical preserves",
      "custom ceramic token",
      "heritage sweet box",
      "pressed-flower bookmark",
      "embroidered favour pouch",
      "personalised tea tin"
    ],
    "styles": [
      "thoughtful handcrafted",
      "minimal luxury",
      "heritage-inspired",
      "romantic botanical",
      "modern editorial"
    ],
    "views": [
      "overhead gift flat lay",
      "ribbon detail",
      "gift table display",
      "single favour hero",
      "packaging close-up"
    ]
  },
  {
    "name": "Ceremony Backdrops",
    "icon": "▤",
    "directions": [
      "linen panel backdrop",
      "arched timber frame",
      "floral crescent backdrop",
      "textured plaster wall",
      "heritage carved screen",
      "soft voile installation",
      "modern metal frame",
      "garden hedge wall",
      "painted scenic panel",
      "layered paper sculpture"
    ],
    "styles": [
      "architectural modern",
      "romantic garden",
      "heritage detail",
      "quiet luxury",
      "sculptural contemporary"
    ],
    "views": [
      "frontal centered view",
      "wide venue view",
      "material detail",
      "side perspective",
      "ceremony portrait"
    ]
  },
  {
    "name": "Wedding Signage",
    "icon": "↗",
    "directions": [
      "welcome mirror lettering",
      "hand-painted direction sign",
      "acrylic seating chart",
      "brass wayfinding plaque",
      "botanical welcome board",
      "minimal typography sign",
      "etched glass table number",
      "heritage calligraphy panel",
      "linen welcome banner",
      "sculptural freestanding sign"
    ],
    "styles": [
      "editorial typography",
      "handcrafted romantic",
      "modern minimal",
      "heritage formal",
      "luxury understated"
    ],
    "views": [
      "straight-on product view",
      "sign in venue context",
      "lettering close-up",
      "styled flat lay",
      "wide entrance view"
    ]
  },
  {
    "name": "Wedding Rings",
    "icon": "◇",
    "directions": [
      "brushed gold wedding band",
      "diamond pavé ring",
      "engraved heirloom band",
      "two-tone sculptural ring",
      "minimal platinum pair",
      "vintage milgrain ring",
      "organic hammered band",
      "gemstone accent ring",
      "rose-gold matching bands",
      "filigree wedding ring"
    ],
    "styles": [
      "timeless fine jewellery",
      "modern sculptural",
      "heritage artisan",
      "understated luxury",
      "vintage romantic"
    ],
    "views": [
      "macro on silk",
      "rings on stone",
      "paired ring flat lay",
      "side profile detail",
      "hand-worn editorial"
    ]
  },
  {
    "name": "Wedding Venues",
    "icon": "⌂",
    "directions": [
      "heritage courtyard venue",
      "glasshouse garden ceremony",
      "coastal villa reception",
      "stone barn celebration",
      "palace ballroom setting",
      "modern art gallery venue",
      "vineyard long-table dinner",
      "desert resort ceremony",
      "rooftop city celebration",
      "forest clearing wedding"
    ],
    "styles": [
      "romantic atmospheric",
      "architectural editorial",
      "heritage grandeur",
      "nature-led minimal",
      "modern luxury"
    ],
    "views": [
      "wide establishing view",
      "ceremony setup view",
      "architectural detail",
      "golden-hour exterior",
      "evening reception view"
    ]
  }
];
const PALETTE_SETS = [
  {
    "name": "rose, antique gold and warm ivory",
    "bg": "#f1deda",
    "ink": "#a65e70",
    "line": "#8f5261"
  },
  {
    "name": "sage, cream and muted brass",
    "bg": "#e4e9dc",
    "ink": "#637c69",
    "line": "#526858"
  },
  {
    "name": "terracotta, sand and clay",
    "bg": "#eed8c7",
    "ink": "#a96249",
    "line": "#8c4e3c"
  },
  {
    "name": "midnight plum, mauve and champagne",
    "bg": "#e5d6df",
    "ink": "#78516b",
    "line": "#53354b"
  },
  {
    "name": "cobalt, ivory and silver",
    "bg": "#dce5ed",
    "ink": "#577797",
    "line": "#3e5e7d"
  },
  {
    "name": "marigold, fuchsia and deep green",
    "bg": "#f1dfb7",
    "ink": "#b95c7c",
    "line": "#754d3f"
  }
];
const COMPOSITIONS = [
  "a refined centered hero arrangement",
  "an airy asymmetrical composition",
  "a richly layered close-up composition",
  "a balanced editorial composition",
  "a graceful diagonal composition"
];

const CATEGORY_META = {
  "Mehndi Designs":["Bridal","Arabic","Minimal","Traditional","Floral"],
  "Bridal Fashion":["Lehenga","Gown","Saree","Couture","Traditional"],
  "Wedding Decor":["Ceremony","Reception","Floral","Outdoor","Indoor"],
  "Jewellery Designs":["Necklaces","Earrings","Rings","Hair Jewellery","Traditional"],
  "Wedding Invitations":["Luxury","Floral","Minimal","Traditional","Modern"],
  "Floral Arrangements":["Bouquets","Installations","Centerpieces","Garlands","Seasonal"],
  "Bridal Makeup":["Soft Glam","Traditional","Editorial","Eyes","Complexion"],
  "Bridal Hairstyles":["Updos","Braids","Waves","Traditional","Accessories"],
  "Wedding Photography":["Portraits","Candid","Editorial","Ceremony","Details"],
  "Wedding Stage Designs":["Floral","Royal","Minimal","Modern","Traditional"],
  "Wedding Dresses":["Gowns","Traditional","Embellished","Minimal","Couture"],
  "Wedding Cakes":["Floral","Modern","Classic","Luxury","Artisan"],
  "Wedding Bouquets":["Classic","Modern","Wildflower","Traditional","Minimal"],
  "Wedding Tablescapes":["Place Settings","Centerpieces","Lighting","Traditional","Modern"],
  "Wedding Lighting":["Candles","Fairy Lights","Architectural","Outdoor","Reception"],
  "Bridal Accessories":["Bags","Shoes","Hairpieces","Veils","Keepsakes"],
  "Groom Fashion":["Sherwani","Suits","Accessories","Traditional","Modern"],
  "Wedding Themes":["Garden","Heritage","Modern","Destination","Seasonal"],
  "Traditional Wedding Designs":["Textiles","Ceremonial","Heritage","Floral","Folk Art"],
  "Modern and Contemporary Wedding Designs":["Architecture","Stationery","Fashion","Decor","Minimal"],
  "Pakistani Wedding Designs":["Mehndi","Bridalwear","Jewellery","Decor","Tradition"],
  "Indian Wedding Designs":["Mandap","Saree","Jewellery","Rituals","Decor"],
  "Arabic Mehndi Designs":["Floral","Geometric","Bold","Minimal","Bridal"],
  "Minimalist Wedding Designs":["Stationery","Fashion","Florals","Decor","Jewellery"],
  "Luxury Wedding Concepts":["Venue","Couture","Decor","Jewellery","Tablescapes"],
  "Wedding Favours":["Packaging","Edible","Keepsakes","Handmade","Minimal"],
  "Ceremony Backdrops":["Floral","Modern","Heritage","Textured","Outdoor"],
  "Wedding Signage":["Welcome","Wayfinding","Seating","Typography","Table Numbers"],
  "Wedding Rings":["Gold","Platinum","Vintage","Modern","Engraved"],
  "Wedding Venues":["Garden","Heritage","Destination","Modern","Outdoor"]
};
const CATEGORY_DATA = CATEGORY_SEEDS.map((seed, catIndex) => {
  const designs = [];
  let n = 0;
  // 10 creative directions × 5 styles × 5 viewpoints = 250 unique entries.
  for (let d=0; d<seed.directions.length; d++) {
    for (let s=0; s<seed.styles.length; s++) {
      for (let v=0; v<seed.views.length; v++) {
        const palette = PALETTE_SETS[(d*2+s+v+catIndex)%PALETTE_SETS.length];
        const composition = COMPOSITIONS[(d+s+v)%COMPOSITIONS.length];
        const direction = seed.directions[d];
        const style = seed.styles[s];
        const view = seed.views[v];
        const name = `${titleCase(direction)} — ${titleCase(style)} ${viewLabel(view)}`;
        const description = `${style} interpretation of ${direction}, presented as ${view.toLowerCase()} with ${palette.name}.`;
        const prompt = `Create a premium ${seed.name.toLowerCase()} concept featuring ${direction}. Creative direction: ${style}; visual treatment: ${style.toLowerCase()} craftsmanship with carefully resolved details. Composition: ${composition}, captured as ${view}. Colour story: ${palette.name}. Emphasise believable materials, elegant visual hierarchy, refined textures, intentional negative space, cohesive styling, natural detail, and professional art direction. The result should feel distinctive, polished, culturally thoughtful where relevant, and suitable for a high-end wedding design moodboard. Image format: ${view.includes("wide") || view.includes("venue") || view.includes("establishing") ? "landscape 16:9" : "portrait 4:5"}. Avoid text artifacts, logos, watermarks, clutter, and visibly distorted details.`;
        designs.push({id:`c${catIndex+1}-d${++n}`,name,description,prompt,subcategory:(CATEGORY_META[seed.name]||["Featured"])[(d+s+v)%((CATEGORY_META[seed.name]||["Featured"]).length)],palette,mark:["✿","❋","✧","◇","❀","❦","✳","❈","♢","❁"][(d+s+v)%10]});
      }
    }
  }
  return {...seed, id:`category-${catIndex+1}`, designs};
});
function titleCase(s){return s.replace(/\b\w/g, c=>c.toUpperCase());}
function viewLabel(view){return view.split(" ").slice(0,2).map(titleCase).join(" ");}
