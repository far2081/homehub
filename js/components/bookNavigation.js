/**
 * HomeHub - Book-Style Navigation Component
 * Opens a beautiful, authentic printed-book window for every header navigation button.
 * Contains text links only (no product cards/photos/prices in navigation books).
 * Clicking any link opens the corresponding normal full HomeHub webpage.
 */

export const BOOK_NAV_DATA = {
  furniture: {
    id: 'furniture',
    volume: 'VOLUME I',
    title: 'The Furniture Atelier',
    kicker: 'ARCHITECTURAL HORIZONS',
    quote: 'Furniture is the architecture of the human scale, grounding open space with tactile permanence.',
    note: 'Crafted with FSC-certified European hardwoods, hand-honed Roman travertine, and tactile Italian bouclé.',
    leftSectionTitle: 'Curated Living Suites',
    leftLinks: [
      { label: 'Living Room Collection', target: 'collection:living-room', desc: 'Fluid sofas, monolithic tables & armchairs' },
      { label: 'Bedroom Collection', target: 'collection:bedroom', desc: 'Platform beds, floating consoles & nightstands' },
      { label: 'Dining Room Collection', target: 'collection:dining-room', desc: 'Monolithic travertine tables & ceramic settings' },
      { label: 'All Furniture Atelier Pieces', target: 'category:furniture', desc: 'Complete 4-piece furniture catalogue' }
    ],
    rightSectionTitle: 'Departments & Typologies',
    rightFolio: 'CHAPTER 01 • TYPOLOGIES',
    rightLinks: [
      { num: '01', label: 'Sofas & Seating', target: 'collection:sofas-seating' },
      { num: '02', label: 'Tables & Desks', target: 'collection:tables-desks' },
      { num: '03', label: 'Storage & Shelving', target: 'collection:storage-shelving' },
      { num: '04', label: 'Beds & Sleep Architecture', target: 'collection:beds-headboards' }
    ]
  },

  decor: {
    id: 'decor',
    volume: 'VOLUME II',
    title: 'Objects of Home & Décor',
    kicker: 'TACTILE STILLNESS',
    quote: 'Objects in the home should not demand attention; they should reward it with quiet texture and shifting daylight.',
    note: 'Wheel-thrown ceramic vessels, mineral plaster bas-reliefs, and French flax cushions.',
    leftSectionTitle: 'Atelier Object Studies',
    leftLinks: [
      { label: 'Home Décor Collection', target: 'category:decor', desc: 'Curated studio accessories & artistic panels' },
      { label: 'Ceramics & Vessel Study', target: 'collection:vases-ceramics', desc: 'Wheel-thrown matte stoneware in sand & terracotta' },
      { label: 'Mineral Plaster & Bas-Relief Art', target: 'collection:wall-art', desc: 'Layered acoustic plaster panels in solid white ash' }
    ],
    rightSectionTitle: 'Decorative Typologies',
    rightFolio: 'CHAPTER 02 • ACCENTS',
    rightLinks: [
      { num: '01', label: 'Vases & Ceramics', target: 'collection:vases-ceramics' },
      { num: '02', label: 'Wall Art & Bas-Reliefs', target: 'collection:wall-art' },
      { num: '03', label: 'Cushions & French Flax Textiles', target: 'collection:cushions-textiles' },
      { num: '04', label: 'Asymmetric Dressing Mirrors', target: 'collection:mirrors-accessories' },
      { num: '05', label: 'Decorative Accessories', target: 'category:decor' }
    ]
  },

  lighting: {
    id: 'lighting',
    volume: 'VOLUME III',
    title: 'Light & Life Atelier',
    kicker: 'ATMOSPHERIC LUMINESCENCE',
    quote: 'Light shapes the emotion of space. We design for 2700K circadian warmth and sculptural silhouettes.',
    note: 'Mouth-blown triplex opal glass, honed Brescia marble, and precision warm brass joinery.',
    leftSectionTitle: 'Circadian Sanctuaries',
    leftLinks: [
      { label: 'Complete Lighting Collection', target: 'category:lighting', desc: 'All ambient, task, and architectural luminaires' },
      { label: 'Suspended Ceiling Pendants', target: 'collection:ceiling-lights', desc: 'Solar halo pendants with triplex opal glass' },
      { label: 'Sculptural Standing Floor Lamps', target: 'collection:floor-lamps', desc: 'Cantilevered Brescia marble arc luminaires' }
    ],
    rightSectionTitle: 'Lighting Typologies',
    rightFolio: 'CHAPTER 03 • LUMINAIRES',
    rightLinks: [
      { num: '01', label: 'Ceiling Lights', target: 'collection:ceiling-lights' },
      { num: '02', label: 'Pendant Lights', target: 'collection:pendant-lights' },
      { num: '03', label: 'Table Lamps', target: 'collection:table-lamps' },
      { num: '04', label: 'Floor Lamps', target: 'collection:floor-lamps' },
      { num: '05', label: 'Wall Lights & Sconces', target: 'collection:wall-lights' }
    ]
  },

  'living-room': {
    id: 'living-room',
    volume: 'VOLUME IV',
    title: 'The Living Room Salon',
    kicker: 'GENEROUS NEGATIVE SPACE',
    quote: 'Contemporary living asks for low seating horizons, monolithic natural stone, and organic conversational geometry.',
    note: 'Anchored by the CloudCurve sofa, Noma travertine table, and Arc marble floor lamp.',
    leftSectionTitle: 'Living Room Suites',
    leftLinks: [
      { label: 'Living Room Collection', target: 'collection:living-room', desc: 'Harmonious pieces designed for open salons' },
      { label: 'Sofas & Seating', target: 'collection:sofas-seating', desc: 'Sculptural organic contours in textured bouclé' },
      { label: 'Coffee & Accent Tables', target: 'collection:tables-desks', desc: 'Low-horizon solid honed travertine slabs' }
    ],
    rightSectionTitle: 'Featured Living Pieces',
    rightFolio: 'CHAPTER 04 • SALON',
    rightLinks: [
      { num: '01', label: 'CloudCurve Organic Bouclé Sofa', target: 'product:HH-FUR-001' },
      { num: '02', label: 'Noma Monolithic Travertine Table', target: 'product:HH-FUR-002' },
      { num: '03', label: 'Aura Merino Shearling Lounge Chair', target: 'product:HH-FUR-003' },
      { num: '04', label: 'Arc Floor Lamp in Brescia Marble', target: 'product:HH-LGT-002' },
      { num: '05', label: 'Forma Mineral Plaster Wall Panels', target: 'product:HH-DEC-002' }
    ]
  },

  bedroom: {
    id: 'bedroom',
    volume: 'VOLUME V',
    title: 'The Bedroom Sanctuary',
    kicker: 'QUIET RESTORATION',
    quote: 'The bedroom is a sanctuary of restorative stillness, stripped of distraction and enveloped in honest warmth.',
    note: 'Featuring low-profile platform beds, fluted tambour consoles, and bedside circadian lighting.',
    leftSectionTitle: 'Bedroom Suites',
    leftLinks: [
      { label: 'Bedroom Collection', target: 'collection:bedroom', desc: 'Restful timber architecture and tactile accents' },
      { label: 'Beds & Sleep Architecture', target: 'collection:beds-headboards', desc: 'Solid white ash low-profile platform beds' },
      { label: 'Nightstands & Consoles', target: 'collection:bedroom-storage', desc: 'Wall-hung floating tambour oak storage' }
    ],
    rightSectionTitle: 'Featured Bedroom Pieces',
    rightFolio: 'CHAPTER 05 • REST',
    rightLinks: [
      { num: '01', label: 'Haven Low-Profile Platform Bed', target: 'product:HH-FUR-004' },
      { num: '02', label: 'Flute Floating Tambour Console', target: 'product:HH-SSS-002' },
      { num: '03', label: 'Glow Ceramic Dimmable Table Lamp', target: 'product:HH-LGT-003' },
      { num: '04', label: 'Halo Asymmetric Dressing Mirror', target: 'product:HH-DEC-004' },
      { num: '05', label: 'CloudSoft French Flax Cushions', target: 'product:HH-DEC-003' }
    ]
  },

  magazines: {
    id: 'magazines',
    volume: 'VOLUME VI',
    title: 'The 3D Magazine Editions',
    kicker: 'PRINTED EDITORIAL LIBRARY',
    quote: 'Experience authentic physical catalogue reading with 3D natural page curl, silent operation, and 24 pages per book.',
    note: 'Four original publications with continuous double-page spreads across the spine.',
    leftSectionTitle: 'Digital Publications',
    leftLinks: [
      { label: 'The Living Edit (Volume 01)', target: 'magazine:living-edit', desc: 'Fluid Forms & Monolithic Travertine (24 Pages)' },
      { label: 'Objects of Home (Volume 02)', target: 'magazine:objects-of-home', desc: 'Tactile Ceramics & Bas-Relief Art (24 Pages)' },
      { label: 'Light / Life (Volume 03)', target: 'magazine:light-life', desc: 'Circadian Glow & Dimmable Ambiance (24 Pages)' },
      { label: 'Small Spaces (Volume 04)', target: 'magazine:small-spaces', desc: 'Compact Living & Space Intelligence (24 Pages)' }
    ],
    rightSectionTitle: 'Editorial Highlights',
    rightFolio: 'CHAPTER 06 • VOLUMES',
    rightLinks: [
      { num: '01', label: 'The Living Edit • Fluid Curves & Low Horizons', target: 'magazine:living-edit' },
      { num: '02', label: 'Objects of Home • Stoneware & Plaster Shadows', target: 'magazine:objects-of-home' },
      { num: '03', label: 'Light / Life • 2700K Sanctuaries & Arc Profiles', target: 'magazine:light-life' },
      { num: '04', label: 'Small Spaces • Nested Desks & Wall Consoles', target: 'magazine:small-spaces' }
    ]
  }
};

export class BookNavigation {
  constructor(containerIdOrOptions = {}, options = {}) {
    if (typeof containerIdOrOptions === 'string') {
      this.containerId = containerIdOrOptions;
      this.options = options;
    } else {
      this.options = containerIdOrOptions;
      this.containerId = this.options.containerId || 'book-nav-modal';
    }
    this.onNavigate = this.options.onNavigate || (() => {});
    this.onHome = this.options.onHome || (() => {});
    this.currentBookId = null;
    this.init();
  }

  init() {
    let el = document.getElementById(this.containerId);
    if (!el) {
      el = document.createElement('div');
      el.id = this.containerId;
      el.className = 'book-nav-modal';
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-modal', 'true');
      el.setAttribute('aria-hidden', 'true');
      document.body.appendChild(el);
    }
    this.modal = el;
    this.modal.style.display = 'none';
  }

  open(bookId) {
    const data = BOOK_NAV_DATA[bookId];
    if (!data) return;
    this.currentBookId = bookId;

    this.modal.innerHTML = `
      <div class="book-nav-backdrop" id="book-nav-backdrop"></div>
      <div class="book-nav-window" role="dialog" aria-labelledby="book-nav-title">
        
        <!-- Top Control Bar with Visible HOME and Close buttons -->
        <div class="book-nav-topbar">
          <button class="book-nav-home-btn" id="book-nav-home-btn" title="Return to Homepage">
            <span class="home-icon">🏠</span>
            <span class="home-text">HOME</span>
          </button>
          
          <div class="book-nav-top-meta">
            <span class="book-nav-volume">${data.volume}</span>
            <span class="book-nav-divider">•</span>
            <span class="book-nav-brand">HOMEHUB ATELIER</span>
          </div>

          <button class="book-nav-close-btn" id="book-nav-close-btn" aria-label="Close Book Window">✕</button>
        </div>

        <!-- The Book Spread (Two Facing Pages with Bound Central Spine) -->
        <div class="book-nav-spread">
          
          <!-- Central Spine Simulation -->
          <div class="book-nav-spine">
            <div class="spine-stitch"></div>
            <div class="spine-stitch"></div>
            <div class="spine-stitch"></div>
          </div>

          <!-- Left Page -->
          <div class="book-nav-page book-nav-page-left">
            <div class="page-top-header">
              <span class="page-kicker">${data.kicker}</span>
              <span class="page-folio">FOLIO L</span>
            </div>

            <div class="page-body-content">
              <h2 class="book-nav-title" id="book-nav-title">${data.title}</h2>
              <blockquote class="book-nav-quote">"${data.quote}"</blockquote>

              <div class="book-nav-section-title">${data.leftSectionTitle}</div>
              <ul class="book-nav-links-list">
                ${data.leftLinks.map(link => `
                  <li class="book-nav-link-item">
                    <button class="book-nav-action-link" data-target="${link.target}">
                      <div class="link-label-group">
                        <span class="link-name">${link.label}</span>
                        ${link.desc ? `<span class="link-desc">${link.desc}</span>` : ''}
                      </div>
                      <span class="link-arrow">→</span>
                    </button>
                  </li>
                `).join('')}
              </ul>
            </div>

            <div class="page-bottom-footer">
              <span class="footer-note">HOMEHUB • LUXURY MODERN</span>
              <span class="footer-num">P. 01</span>
            </div>
          </div>

          <!-- Right Page -->
          <div class="book-nav-page book-nav-page-right">
            <div class="page-top-header">
              <span class="page-kicker">${data.rightFolio}</span>
              <span class="page-folio">FOLIO R</span>
            </div>

            <div class="page-body-content">
              <div class="book-nav-section-title">${data.rightSectionTitle}</div>
              <ul class="book-nav-links-list right-links-list">
                ${data.rightLinks.map(link => `
                  <li class="book-nav-link-item">
                    <button class="book-nav-action-link" data-target="${link.target}">
                      <span class="link-num">${link.num}</span>
                      <span class="link-name">${link.label}</span>
                      <span class="link-arrow">→</span>
                    </button>
                  </li>
                `).join('')}
              </ul>

              <div class="book-nav-material-note">
                <span class="note-label">✦ ATELIER PROVENANCE</span>
                <p class="note-text">${data.note}</p>
              </div>
            </div>

            <div class="page-bottom-footer">
              <span class="footer-note">ALL LINKS OPEN FULL WEBPAGES</span>
              <span class="footer-num">P. 02</span>
            </div>
          </div>

        </div>

      </div>
    `;

    this.modal.style.display = 'flex';
    // Trigger reflow for CSS transition
    void this.modal.offsetWidth;
    this.modal.classList.add('is-open');
    this.modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    this.bindEvents();
  }

  close() {
    this.modal.classList.remove('is-open');
    this.modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(() => {
      if (!this.modal.classList.contains('is-open')) {
        this.modal.style.display = 'none';
      }
    }, 280);
  }

  bindEvents() {
    const backdrop = this.modal.querySelector('#book-nav-backdrop');
    const closeBtn = this.modal.querySelector('#book-nav-close-btn');
    const homeBtn = this.modal.querySelector('#book-nav-home-btn');

    if (backdrop) backdrop.addEventListener('click', () => this.close());
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());

    if (homeBtn) {
      homeBtn.addEventListener('click', () => {
        this.close();
        this.onHome();
      });
    }

    // Attach click handlers to all text links inside the book window
    const actionLinks = this.modal.querySelectorAll('.book-nav-action-link');
    actionLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.dataset.target;
        this.close();
        this.onNavigate(target);
      });
    });
  }
}
