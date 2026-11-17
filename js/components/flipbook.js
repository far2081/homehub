/**
 * HomeHub - Realistic 3D Magazine Flipbook Engine
 * Supports two-page spread on desktop, single-page touch reader on mobile / Android.
 * Features 3D page turning with realistic paper spine shadows, swipe support, and procedural sound.
 */

import { MAGAZINE_BOOKS } from '../data/magazines.js';
import { sound } from './sound.js';
import { attachSwipeHandler } from '../utils/helpers.js';

export class Flipbook {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.currentBookId = options.initialBook || 'living-edit';
    this.currentPageIndex = 0; // 0-indexed page number
    this.isDesktopSpread = window.innerWidth >= 900;
    this.isFlipping = false;
    this.onProductSelect = options.onProductSelect || (() => {});
    this.onBookChange = options.onBookChange || (() => {});

    this.init();
  }

  init() {
    window.addEventListener('resize', () => {
      const wasDesktop = this.isDesktopSpread;
      this.isDesktopSpread = window.innerWidth >= 900;
      if (wasDesktop !== this.isDesktopSpread) {
        this.render();
      }
    });

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
      // Only when magazine section is in view or active
      const rect = this.container.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      if (!isVisible) return;

      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        this.nextPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        this.prevPage();
      }
    });

    this.render();
  }

  loadBook(bookId, targetPage = 0) {
    if (!MAGAZINE_BOOKS[bookId]) return;
    this.currentBookId = bookId;
    this.currentPageIndex = targetPage;
    this.render();
    if (typeof this.onBookChange === 'function') {
      this.onBookChange(bookId);
    }
  }

  getCurrentBook() {
    return MAGAZINE_BOOKS[this.currentBookId];
  }

  getTotalPages() {
    const book = this.getCurrentBook();
    return book ? book.pages.length : 0;
  }

  nextPage() {
    if (this.isFlipping) return;
    const total = this.getTotalPages();
    const step = this.isDesktopSpread ? 2 : 1;

    if (this.currentPageIndex + step < total) {
      this.animateTurn('forward', () => {
        this.currentPageIndex += step;
        sound.playPageTurn();
        this.renderSpreadContent();
      });
    } else if (this.currentPageIndex + 1 < total) {
      // Last odd page
      this.animateTurn('forward', () => {
        this.currentPageIndex += 1;
        sound.playPageTurn();
        this.renderSpreadContent();
      });
    }
  }

  prevPage() {
    if (this.isFlipping) return;
    const step = this.isDesktopSpread ? 2 : 1;

    if (this.currentPageIndex - step >= 0) {
      this.animateTurn('backward', () => {
        this.currentPageIndex -= step;
        sound.playPageTurn();
        this.renderSpreadContent();
      });
    } else if (this.currentPageIndex > 0) {
      this.animateTurn('backward', () => {
        this.currentPageIndex = 0;
        sound.playPageTurn();
        this.renderSpreadContent();
      });
    }
  }

  goToPage(pageIdx) {
    if (this.isFlipping) return;
    const total = this.getTotalPages();
    if (pageIdx >= 0 && pageIdx < total) {
      // In spread mode, align to even index for two-page spread (unless page 0 is cover)
      let target = pageIdx;
      if (this.isDesktopSpread && target > 0 && target % 2 === 0) {
        target = target - 1;
      }
      this.currentPageIndex = target;
      sound.playPageTurn();
      this.renderSpreadContent();
    }
  }

  animateTurn(direction, callback) {
    this.isFlipping = true;
    const bookEl = this.container.querySelector('.flipbook-viewport');
    if (!bookEl) {
      callback();
      this.isFlipping = false;
      return;
    }

    const turningLeaf = document.createElement('div');
    turningLeaf.className = `flipbook-turning-leaf flip-${direction}`;
    bookEl.appendChild(turningLeaf);

    // CSS 3D transform execution
    requestAnimationFrame(() => {
      turningLeaf.classList.add('is-animating');
    });

    setTimeout(() => {
      callback();
      turningLeaf.remove();
      this.isFlipping = false;
    }, 450);
  }

  render() {
    const book = this.getCurrentBook();
    if (!book) return;

    this.container.innerHTML = `
      <div class="flipbook-wrapper">
        <!-- Magazine Header / Bar -->
        <div class="flipbook-header">
          <div class="book-meta">
            <span class="book-badge">DIGITAL EDITORIAL</span>
            <h2 class="book-headline">${book.title}</h2>
            <p class="book-issue">${book.issue} • <em>${book.subtitle}</em></p>
          </div>

          <div class="book-controls-top">
            <!-- Book Switcher Quick Pills -->
            <div class="book-pills" role="tablist" aria-label="Magazine Books">
              ${Object.values(MAGAZINE_BOOKS).map(b => `
                <button 
                  class="book-pill-btn ${b.id === this.currentBookId ? 'active' : ''}" 
                  data-book="${b.id}"
                  role="tab"
                  aria-selected="${b.id === this.currentBookId}"
                >
                  <span class="pill-dot"></span>
                  ${b.title}
                </button>
              `).join('')}
            </div>

            <!-- Audio & Info Controls -->
            <div class="book-action-icons">
              <button class="sound-toggle-btn ${sound.isSoundEnabled() ? 'sound-on' : 'sound-off'}" id="magazine-sound-btn" title="Toggle Page Turn Sound">
                <span class="sound-icon">${sound.isSoundEnabled() ? '🔊' : '🔇'}</span>
                <span class="sound-label">${sound.isSoundEnabled() ? 'Sound On' : 'Sound Off'}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 3D Perspective Stage -->
        <div class="flipbook-stage">
          <div class="flipbook-viewport ${this.isDesktopSpread ? 'mode-spread' : 'mode-single'}">
            <!-- Central Spine / Binding Shadow (Desktop Spread) -->
            <div class="magazine-spine"></div>
            
            <!-- Pages Container -->
            <div class="magazine-pages-container" id="magazine-pages-slot">
              <!-- Content injected by renderSpreadContent -->
            </div>
          </div>

          <!-- Side Navigation Arrows -->
          <button class="flip-arrow flip-prev" id="flip-prev-btn" aria-label="Previous Page" title="Previous Page">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <button class="flip-arrow flip-next" id="flip-next-btn" aria-label="Next Page" title="Next Page">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>

        <!-- Bottom Controls & Page Scrubber -->
        <div class="flipbook-footer">
          <div class="footer-page-counter" id="footer-page-counter">
            <!-- Dynamic page counter text -->
          </div>

          <div class="footer-scrubber" id="footer-scrubber">
            <!-- Scrubber dots -->
          </div>

          <div class="footer-tip">
            <span class="tip-icon">💡</span>
            <span class="tip-text">${this.isDesktopSpread ? 'Use Left / Right arrow keys or click pages to turn' : 'Swipe left or right to flip pages'}</span>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
    this.renderSpreadContent();
  }

  bindEvents() {
    // Book Pills
    const pills = this.container.querySelectorAll('.book-pill-btn');
    pills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        const bookId = e.currentTarget.dataset.book;
        this.loadBook(bookId, 0);
      });
    });

    // Sound toggle
    const soundBtn = this.container.querySelector('#magazine-sound-btn');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        const isEnabled = sound.toggleSound();
        soundBtn.className = `sound-toggle-btn ${isEnabled ? 'sound-on' : 'sound-off'}`;
        soundBtn.querySelector('.sound-icon').textContent = isEnabled ? '🔊' : '🔇';
        soundBtn.querySelector('.sound-label').textContent = isEnabled ? 'Sound On' : 'Sound Off';
        if (isEnabled) sound.playClick();
      });
    }

    // Prev / Next Arrows
    const prevBtn = this.container.querySelector('#flip-prev-btn');
    const nextBtn = this.container.querySelector('#flip-next-btn');

    if (prevBtn) prevBtn.addEventListener('click', () => this.prevPage());
    if (nextBtn) nextBtn.addEventListener('click', () => this.nextPage());

    // Swipe navigation on touch devices (Android, etc.)
    const viewport = this.container.querySelector('.flipbook-viewport');
    if (viewport) {
      attachSwipeHandler(
        viewport,
        () => this.nextPage(), // Swipe left -> Next
        () => this.prevPage()  // Swipe right -> Prev
      );
    }
  }

  renderSpreadContent() {
    const book = this.getCurrentBook();
    if (!book) return;

    const slot = this.container.querySelector('#magazine-pages-slot');
    const counter = this.container.querySelector('#footer-page-counter');
    const scrubber = this.container.querySelector('#footer-scrubber');
    const prevBtn = this.container.querySelector('#flip-prev-btn');
    const nextBtn = this.container.querySelector('#flip-next-btn');

    const total = book.pages.length;

    let leftPage = null;
    let rightPage = null;

    if (this.isDesktopSpread) {
      if (this.currentPageIndex === 0) {
        // Page 0: Cover display (left side can be elegant brand statement, right side is cover)
        leftPage = { type: 'brand-flyleaf', pageNumber: 0 };
        rightPage = book.pages[0];
      } else {
        // Even index left, odd index right
        let lIdx = this.currentPageIndex;
        if (lIdx % 2 === 0) lIdx -= 1; // align spread
        let rIdx = lIdx + 1;

        leftPage = book.pages[lIdx] || null;
        rightPage = book.pages[rIdx] || null;
      }
    } else {
      // Mobile single page
      rightPage = book.pages[this.currentPageIndex];
    }

    // Render pages into slot
    let html = '';
    if (this.isDesktopSpread) {
      html += `<div class="magazine-page page-left" data-page="${leftPage ? leftPage.pageNumber : ''}">
        ${this.buildPageHTML(leftPage, 'left')}
      </div>`;
      html += `<div class="magazine-page page-right" data-page="${rightPage ? rightPage.pageNumber : ''}">
        ${this.buildPageHTML(rightPage, 'right')}
      </div>`;
    } else {
      html += `<div class="magazine-page page-single" data-page="${rightPage ? rightPage.pageNumber : ''}">
        ${this.buildPageHTML(rightPage, 'single')}
      </div>`;
    }

    slot.innerHTML = html;

    // Attach product click triggers inside the newly rendered pages
    const productPills = slot.querySelectorAll('[data-product-sku]');
    productPills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        e.stopPropagation();
        const sku = e.currentTarget.dataset.productSku;
        if (typeof this.onProductSelect === 'function') {
          this.onProductSelect(sku);
        }
      });
    });

    // Update Counter
    if (counter) {
      if (this.isDesktopSpread) {
        if (this.currentPageIndex === 0) {
          counter.innerHTML = `Cover <span>•</span> Page 1 of ${total}`;
        } else {
          const lNum = leftPage ? leftPage.pageNumber : 1;
          const rNum = rightPage ? rightPage.pageNumber : total;
          counter.innerHTML = `Pages ${lNum}–${rNum} <span>of</span> ${total}`;
        }
      } else {
        counter.innerHTML = `Page ${this.currentPageIndex + 1} <span>of</span> ${total}`;
      }
    }

    // Update Scrubber
    if (scrubber) {
      let scrubberHtml = '';
      for (let i = 0; i < total; i++) {
        const isActive = this.isDesktopSpread
          ? (i === this.currentPageIndex || (leftPage && leftPage.pageNumber === i + 1) || (rightPage && rightPage.pageNumber === i + 1))
          : i === this.currentPageIndex;
        scrubberHtml += `
          <button 
            class="scrubber-dot ${isActive ? 'active' : ''}" 
            data-goto="${i}" 
            title="Page ${i + 1}"
            aria-label="Go to Page ${i + 1}"
          ></button>
        `;
      }
      scrubber.innerHTML = scrubberHtml;

      scrubber.querySelectorAll('.scrubber-dot').forEach(dot => {
        dot.addEventListener('click', (e) => {
          const idx = parseInt(e.currentTarget.dataset.goto, 10);
          this.goToPage(idx);
        });
      });
    }

    // Update button states
    if (prevBtn) {
      prevBtn.disabled = this.currentPageIndex === 0;
      prevBtn.style.opacity = this.currentPageIndex === 0 ? '0.35' : '1';
    }
    if (nextBtn) {
      const isEnd = this.isDesktopSpread 
        ? (this.currentPageIndex >= total - 2 || (rightPage && rightPage.pageNumber === total))
        : this.currentPageIndex >= total - 1;
      nextBtn.disabled = isEnd;
      nextBtn.style.opacity = isEnd ? '0.35' : '1';
    }
  }

  buildPageHTML(page, position) {
    if (!page) {
      return `
        <div class="empty-page-wrapper">
          <div class="empty-colophon">
            <span class="brand-monogram">HH</span>
            <p>HomeHub Atelier</p>
          </div>
        </div>
      `;
    }

    if (page.type === 'brand-flyleaf') {
      return `
        <div class="page-flyleaf">
          <div class="flyleaf-content">
            <span class="editorial-brand">HOMEHUB</span>
            <p class="brand-tagline">SHOP • STYLE • SMART</p>
            <div class="flyleaf-divider"></div>
            <p class="flyleaf-quote">"Architecture is the learned game, correct and magnificent, of forms assembled in the light."</p>
            <p class="flyleaf-note">Soft Luxury Modern Editorial Series</p>
          </div>
          <div class="page-folio">HOMEHUB ATELIER</div>
        </div>
      `;
    }

    if (page.type === 'cover') {
      return `
        <div class="page-cover" style="background-image: linear-gradient(180deg, rgba(20,18,16,0.15) 0%, rgba(20,18,16,0.7) 100%), url('${page.heroImage}')">
          <div class="cover-top-meta">
            <span class="cover-kicker">${page.kicker || 'HOMEHUB EDITORIAL'}</span>
            <span class="cover-issue-badge">${this.getCurrentBook().issue}</span>
          </div>
          <div class="cover-center-branding">
            <h1 class="cover-title">${page.headline}</h1>
            <p class="cover-deck">${page.deck || ''}</p>
          </div>
          <div class="cover-footer-meta">
            <p class="cover-colophon">${page.colophon || ''}</p>
            <div class="cover-cta-wrap">
              <span class="cover-tap-hint">Tap next or swipe to explore spread →</span>
            </div>
          </div>
          <div class="page-folio-corner">P. 1</div>
        </div>
      `;
    }

    if (page.type === 'backcover') {
      return `
        <div class="page-backcover" style="background-image: linear-gradient(180deg, rgba(20,18,16,0.4) 0%, rgba(20,18,16,0.85) 100%), url('${page.heroImage}')">
          <div class="backcover-content">
            <span class="editorial-brand">${page.headline}</span>
            <p class="backcover-tagline">${page.kicker}</p>
            <p class="backcover-deck">${page.deck}</p>
            <div class="backcover-divider"></div>
            <p class="backcover-colophon">${page.colophon}</p>
            <button class="backcover-reopen-btn" onclick="document.querySelector('.book-pill-btn[data-book=\\'${this.currentBookId}\\']').click()">
              ↺ Re-read Issue
            </button>
          </div>
          <div class="page-folio-corner">P. ${page.pageNumber}</div>
        </div>
      `;
    }

    // Standard Editorial Pages (essay, feature, curation-spread, etc.)
    const hasProducts = page.products && page.products.length > 0;

    return `
      <div class="page-editorial ${page.type}">
        <div class="page-header-strip">
          <span class="page-kicker">${page.kicker || 'EDITORIAL'}</span>
          <span class="page-number-folio">N° ${page.pageNumber}</span>
        </div>

        <div class="page-visual-wrap">
          <img src="${page.heroImage}" alt="${page.headline}" class="page-photo" loading="lazy" />
          ${page.quote ? `<div class="page-pullquote"><blockquote>${page.quote}</blockquote></div>` : ''}
        </div>

        <div class="page-text-content">
          <h3 class="page-headline">${page.headline}</h3>
          ${page.deck ? `<p class="page-deck">${page.deck}</p>` : ''}
          <div class="page-paragraphs">
            ${(page.body || []).map(p => `<p>${p}</p>`).join('')}
          </div>
        </div>

        ${hasProducts ? `
          <div class="page-shop-strip">
            <span class="shop-strip-label">FEATURED IN THIS SPREAD:</span>
            <div class="shop-chips">
              ${page.products.map(p => `
                <button class="shop-chip-btn" data-product-sku="${p.sku}" title="Inspect ${p.label}">
                  <span class="chip-dot"></span>
                  <span class="chip-name">${p.label}</span>
                  <span class="chip-price">${p.price}</span>
                  <span class="chip-arrow">↗</span>
                </button>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <div class="page-footer-strip">
          <span class="page-footer-brand">HOMEHUB MAGAZINE • ${this.getCurrentBook().title.toUpperCase()}</span>
          <span class="page-footer-num">${page.pageNumber}</span>
        </div>
      </div>
    `;
  }
}
