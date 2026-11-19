/**
 * HomeHub - Interior Video Inspiration Gallery
 * Legitimate HTML5 & Embed video player modal with curated design inspiration cards.
 * 6-Video Complete Row Series
 */

import { INSPIRATION_VIDEOS } from '../data/videos.js';

export class VideoGallery {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.videos = INSPIRATION_VIDEOS;
    this.products = options.products || [];
    this.currentCategory = 'all';
    this.activeVideo = null;
    this.onProductClick = options.onProductClick || (() => {});

    this.render();
  }

  setCategory(cat) {
    this.currentCategory = cat;
    this.renderGrid();
  }

  render() {
    this.container.innerHTML = `
      <div class="video-section-wrap">
        <div class="video-section-header">
          <div class="video-header-left">
            <span class="video-badge">EDITORIAL IN MOTION</span>
            <h2 class="video-heading">Interior Video Masterclasses</h2>
            <p class="video-subhead">
              Visual styling guides, architectural proportions, and space-saving engineering filmed in real architectural homes across 6 complete episodes.
            </p>
          </div>
          
          <!-- Category Filters (Clean 6 categories, zero duplicate small-bedroom, zero home-decor) -->
          <div class="video-pills" role="tablist">
            <button class="video-pill active" data-vcat="all">All Masterclasses (6)</button>
            <button class="video-pill" data-vcat="living-room">Living Room</button>
            <button class="video-pill" data-vcat="bedroom">Bedroom</button>
            <button class="video-pill" data-vcat="dining-room">Dining Room</button>
            <button class="video-pill" data-vcat="lighting">Lighting</button>
            <button class="video-pill" data-vcat="space-saving">Space Saving</button>
            <button class="video-pill" data-vcat="furniture">Furniture</button>
          </div>
        </div>

        <!-- Video Cards Grid (Symmetrical 6-video layout) -->
        <div class="video-grid" id="video-grid">
          <!-- Injected via renderGrid -->
        </div>

        <!-- Video Player Modal Slot -->
        <div class="video-modal-wrap" id="video-modal-wrap"></div>
      </div>
    `;

    this.bindEvents();
    this.renderGrid();
  }

  bindEvents() {
    const pills = this.container.querySelectorAll('.video-pill');
    pills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        pills.forEach(p => p.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.setCategory(e.currentTarget.dataset.vcat);
      });
    });
  }

  renderGrid() {
    const grid = this.container.querySelector('#video-grid');
    if (!grid) return;

    let filtered = this.videos;
    if (this.currentCategory !== 'all') {
      filtered = this.videos.filter(v => v.category === this.currentCategory);
    }

    grid.innerHTML = filtered.map(vid => `
      <div class="video-card" data-video-id="${vid.id}">
        <div class="video-card-thumb">
          <img src="${vid.thumbnail}" alt="${vid.title}" loading="lazy" />
          <div class="video-play-btn" aria-label="Play Video">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          </div>
          <span class="video-duration">${vid.duration}</span>
          <span class="video-cat-badge">${vid.categoryLabel}</span>
        </div>

        <div class="video-card-body">
          <span class="video-author">${vid.author}</span>
          <h3 class="video-title">${vid.title}</h3>
          <p class="video-desc">${vid.description}</p>

          <div class="video-card-footer">
            <span class="takeaway-hint">${vid.keyTakeaways.length} Key Styling Principles</span>
            <button class="watch-now-btn">Watch Masterclass →</button>
          </div>
        </div>
      </div>
    `).join('');

    grid.querySelectorAll('.video-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.videoId;
        this.openVideoModal(id);
      });
    });
  }

  openVideoModal(videoId) {
    const vid = this.videos.find(v => v.id === videoId);
    if (!vid) return;

    const modalWrap = this.container.querySelector('#video-modal-wrap');
    if (!modalWrap) return;

    // Resolve featured products
    const featuredProds = (vid.featuredSkus || []).map(sku => this.products.find(p => p.sku === sku)).filter(Boolean);

    // Guaranteed working embed URL with proper origin, autoplay & playsinline
    const autoplayUrl = vid.embedUrl ? (vid.embedUrl.includes('?') ? `${vid.embedUrl}&autoplay=1` : `${vid.embedUrl}?autoplay=1`) : '';

    modalWrap.innerHTML = `
      <div class="vmodal-backdrop" id="vmodal-backdrop"></div>
      <div class="vmodal-dialog" id="video-modal" role="dialog" aria-modal="true" aria-labelledby="vmodal-title">
        <button class="vmodal-close-btn" id="vmodal-close-btn" aria-label="Close Video">✕</button>

        <div class="vmodal-player-area">
          <div class="vmodal-iframe-wrap" id="vmodal-iframe-wrap">
            <iframe 
              src="${autoplayUrl}" 
              title="${vid.title}" 
              class="vmodal-iframe-element" 
              id="vmodal-iframe"
              frameborder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowfullscreen
              referrerpolicy="strict-origin-when-cross-origin"
            ></iframe>
          </div>
        </div>

        <div class="vmodal-info-area">
          <div class="vmodal-header">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:0.4rem;">
              <span class="vmodal-cat">${vid.categoryLabel} • ${vid.duration}</span>
              <a 
                href="https://www.youtube.com/watch?v=${vid.youtubeId}" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="vmodal-external-link"
                style="font-size:0.75rem; color:var(--color-terracotta, #C85A32); text-decoration:none; font-weight:600;"
              >
                Open in YouTube Player ↗
              </a>
            </div>
            <h2 id="vmodal-title">${vid.title}</h2>
            <p class="vmodal-desc">${vid.description}</p>
          </div>

          <div class="vmodal-takeaways">
            <h4>Key Architectural Principles:</h4>
            <ul>
              ${vid.keyTakeaways.map(t => `<li class="takeaway-item">${t}</li>`).join('')}
            </ul>
          </div>

          ${featuredProds.length > 0 ? `
            <div class="vmodal-featured-pieces">
              <h4>Pieces Featured in this Episode:</h4>
              <div class="vmodal-piece-chips">
                ${featuredProds.map(p => `
                  <button class="vmodal-piece-btn video-shop-chip" data-modal-sku="${p.sku}">
                    <img src="${p.images[0].url}" alt="${p.name}" />
                    <div class="vmodal-piece-text">
                      <span class="vpiece-name">${p.name}</span>
                      <span class="vpiece-sku">${p.sku}</span>
                    </div>
                    <span class="vpiece-arrow">↗</span>
                  </button>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `;

    modalWrap.classList.add('is-open');
    document.body.style.overflow = 'hidden';

    const close = () => {
      const iframe = modalWrap.querySelector('.vmodal-iframe-element');
      if (iframe) iframe.src = '';
      modalWrap.classList.remove('is-open');
      document.body.style.overflow = '';
      modalWrap.innerHTML = '';
    };

    modalWrap.querySelector('#vmodal-backdrop').addEventListener('click', close);
    modalWrap.querySelector('#vmodal-close-btn').addEventListener('click', close);

    modalWrap.querySelectorAll('[data-modal-sku]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const sku = e.currentTarget.dataset.modalSku;
        close();
        this.onProductClick(sku);
      });
    });
  }
}
