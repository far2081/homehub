/**
 * HomeHub - Premium Coated Paper & 3D Curved Page-Turn Flipbook Engine
 * Features:
 * 1. Premium Glossy Art Paper material shaders (subtle specular highlights, paper grain, coated sheen).
 * 2. Natural curved cylindrical page bending (multi-strip 3D mesh, non-flat rotation, progressive bending).
 * 3. Physical central binding/spine with saddle-stitch staples and layered paper edges.
 * 4. Interactive mouse dragging (peel & flip) and Android touch swipe.
 * 5. Silent operation (no sound).
 * 6. Preserves all 4 digital books, product hotspots, and catalogue links.
 */

import { MAGAZINE_BOOKS } from '../data/magazines.js';
import { attachSwipeHandler, showToast } from '../utils/helpers.js';

export class Flipbook {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.currentBookId = options.initialBook || 'living-edit';
    this.currentPageIndex = 0; // 0-indexed page number
    this.isDesktopSpread = typeof window !== 'undefined' ? window.innerWidth >= 992 : true;
    this.isFlipping = false;
    this.isDragging = false;
    this.dragProgress = 0;
    this.activeLeaf = null;
    this.onProductSelect = options.onProductSelect || (() => {});
    this.onAddToCart = options.onAddToCart || (() => {});
    this.onBookChange = options.onBookChange || (() => {});

    this.init();
  }

  init() {
    if (typeof window === 'undefined') return;

    window.addEventListener('resize', () => {
      const wasDesktop = this.isDesktopSpread;
      this.isDesktopSpread = window.innerWidth >= 992;
      if (wasDesktop !== this.isDesktopSpread) {
        this.render();
      }
    });

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
      if (!this.container) return;
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

  getSpreadPages(pageIdx) {
    const book = this.getCurrentBook();
    if (!book) return { leftPage: null, rightPage: null };

    if (this.isDesktopSpread) {
      if (pageIdx === 0) {
        return {
          leftPage: { type: 'brand-flyleaf', pageNumber: 0 },
          rightPage: book.pages[0] || null
        };
      } else {
        let lIdx = pageIdx;
        if (lIdx % 2 === 0) lIdx -= 1;
        let rIdx = lIdx + 1;
        return {
          leftPage: book.pages[lIdx] || null,
          rightPage: book.pages[rIdx] || null
        };
      }
    } else {
      return {
        leftPage: null,
        rightPage: book.pages[pageIdx] || null
      };
    }
  }

  nextPage() {
    if (this.isFlipping) return;
    const total = this.getTotalPages();
    const step = this.isDesktopSpread ? 2 : 1;

    let targetIndex = this.currentPageIndex;
    if (this.currentPageIndex === 0 && this.isDesktopSpread) {
      targetIndex = 1;
    } else if (this.currentPageIndex + step < total) {
      targetIndex = this.currentPageIndex + step;
    } else if (this.currentPageIndex + 1 < total) {
      targetIndex = this.currentPageIndex + 1;
    } else {
      return; // Already at end
    }

    this.animateCurvedTurn('forward', () => {
      this.currentPageIndex = targetIndex;
      this.renderSpreadContent();
    });
  }

  prevPage() {
    if (this.isFlipping) return;
    const step = this.isDesktopSpread ? 2 : 1;

    let targetIndex = this.currentPageIndex;
    if (this.currentPageIndex - step >= 0) {
      targetIndex = this.currentPageIndex - step;
    } else if (this.currentPageIndex > 0) {
      targetIndex = 0;
    } else {
      return; // Already at start
    }

    this.animateCurvedTurn('backward', () => {
      this.currentPageIndex = targetIndex;
      this.renderSpreadContent();
    });
  }

  goToPage(pageIdx) {
    if (this.isFlipping) return;
    const total = this.getTotalPages();
    if (pageIdx >= 0 && pageIdx < total) {
      let target = pageIdx;
      if (this.isDesktopSpread && target > 0 && target % 2 === 0) {
        target = target - 1;
      }
      if (target > this.currentPageIndex) {
        this.animateCurvedTurn('forward', () => {
          this.currentPageIndex = target;
          this.renderSpreadContent();
        });
      } else if (target < this.currentPageIndex) {
        this.animateCurvedTurn('backward', () => {
          this.currentPageIndex = target;
          this.renderSpreadContent();
        });
      }
    }
  }

  /**
   * Natural Curved Page-Turn Engine
   * Slices the turning leaf into 10 connected vertical strips with cylindrical curvature,
   * specular highlights, dynamic under-leaf drop shadows, and progressive bending.
   */
  animateCurvedTurn(direction, callback) {
    this.isFlipping = true;
    const viewport = this.container ? this.container.querySelector('.flipbook-viewport') : null;
    if (!viewport) {
      callback();
      this.isFlipping = false;
      return;
    }

    const { turningLeaf, strips, underShadow, pageWidth } = this.createCurvedTurningLeaf(direction);
    if (!turningLeaf) {
      callback();
      this.isFlipping = false;
      return;
    }

    viewport.appendChild(turningLeaf);

    const duration = 520; // Natural physical duration in ms
    const startTime = performance.now();

    const frame = (now) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      // Smooth natural cubic ease-in-out
      const p = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      this.updateCurl(p, direction, strips, underShadow, pageWidth);

      if (t < 1) {
        requestAnimationFrame(frame);
      } else {
        callback();
        if (turningLeaf.parentNode) {
          turningLeaf.parentNode.removeChild(turningLeaf);
        }
        this.isFlipping = false;
      }
    };

    requestAnimationFrame(frame);
  }

  createCurvedTurningLeaf(direction) {
    const viewport = this.container.querySelector('.flipbook-viewport');
    if (!viewport) return { turningLeaf: null };

    const vpRect = viewport.getBoundingClientRect();
    const pageWidth = this.isDesktopSpread ? vpRect.width / 2 : vpRect.width;
    const N = 10;
    const stripWidth = pageWidth / N;

    // Determine current and target pages
    const curPages = this.getSpreadPages(this.currentPageIndex);
    let frontPage = null;
    let backPage = null;

    if (direction === 'forward') {
      frontPage = curPages.rightPage;
      const nextIdx = this.currentPageIndex === 0 && this.isDesktopSpread
        ? 1
        : (this.currentPageIndex + (this.isDesktopSpread ? 2 : 1));
      const nextPages = this.getSpreadPages(nextIdx);
      backPage = this.isDesktopSpread ? nextPages.leftPage : nextPages.rightPage;
    } else {
      frontPage = curPages.leftPage;
      const prevIdx = this.currentPageIndex <= 2
        ? 0
        : (this.currentPageIndex - (this.isDesktopSpread ? 2 : 1));
      const prevPages = this.getSpreadPages(prevIdx);
      backPage = this.isDesktopSpread ? prevPages.rightPage : prevPages.leftPage;
    }

    const turningLeaf = document.createElement('div');
    turningLeaf.className = `flipbook-curved-leaf flip-${direction}`;

    // Dynamic curved under-leaf drop shadow
    const underShadow = document.createElement('div');
    underShadow.className = 'flip-under-shadow';
    turningLeaf.appendChild(underShadow);

    // Strips track
    const stripsTrack = document.createElement('div');
    stripsTrack.className = 'flip-curved-strips-track';
    turningLeaf.appendChild(stripsTrack);

    const frontHTML = this.buildPageHTML(frontPage, direction === 'forward' ? 'right' : 'left');
    const backHTML = this.buildPageHTML(backPage, direction === 'forward' ? 'left' : 'right');

    const strips = [];

    for (let k = 0; k < N; k++) {
      const strip = document.createElement('div');
      strip.className = 'curved-strip';
      strip.style.width = `${stripWidth + 0.9}px`; // 0.9px subpixel overlap ensures continuous sheet
      strip.style.left = '0px';

      // Front Face
      const frontFace = document.createElement('div');
      frontFace.className = 'strip-face strip-front';
      const frontWrap = document.createElement('div');
      frontWrap.className = 'strip-content-wrap';
      frontWrap.style.width = `${pageWidth}px`;
      frontWrap.style.transform = `translateX(-${k * stripWidth}px)`;
      frontWrap.innerHTML = frontHTML;
      frontFace.appendChild(frontWrap);

      const frontGloss = document.createElement('div');
      frontGloss.className = 'strip-specular-gloss';
      frontFace.appendChild(frontGloss);

      const frontShadow = document.createElement('div');
      frontShadow.className = 'strip-ambient-shadow';
      frontFace.appendChild(frontShadow);

      strip.appendChild(frontFace);

      // Back Face
      const backFace = document.createElement('div');
      backFace.className = 'strip-face strip-back';
      const backWrap = document.createElement('div');
      backWrap.className = 'strip-content-wrap';
      backWrap.style.width = `${pageWidth}px`;
      const backOffsetK = (N - 1 - k);
      backWrap.style.transform = `translateX(-${backOffsetK * stripWidth}px)`;
      backWrap.innerHTML = backHTML;
      backFace.appendChild(backWrap);

      const backGloss = document.createElement('div');
      backGloss.className = 'strip-specular-gloss';
      backFace.appendChild(backGloss);

      const backShadow = document.createElement('div');
      backShadow.className = 'strip-ambient-shadow';
      backFace.appendChild(backShadow);

      strip.appendChild(backFace);

      stripsTrack.appendChild(strip);
      strips.push({
        el: strip,
        frontGloss,
        frontShadow,
        backGloss,
        backShadow,
        index: k
      });
    }

    return { turningLeaf, strips, underShadow, pageWidth };
  }

  /**
   * Physically calculates 3D coordinates, progressive cylindrical bending angles,
   * specular glossy sheen, and curved drop shadows along the paper surface.
   */
  updateCurl(p, direction, strips, underShadow, pageWidth) {
    if (!strips || strips.length === 0) return;
    const N = strips.length;
    const ds = pageWidth / N;
    const isForward = direction === 'forward';

    // 1. Root angle progression (from 0 to -180 for forward, -180 to 0 for backward)
    let rootAngle = 0;
    let totalBend = 0;
    let u_peak = 0.5;

    if (isForward) {
      rootAngle = -180 * Math.pow(p, 1.35);
      totalBend = -115 * Math.sin(Math.PI * p);
      u_peak = 0.85 - 0.7 * p;
    } else {
      rootAngle = -180 + 180 * Math.pow(p, 1.35);
      totalBend = 115 * Math.sin(Math.PI * p);
      u_peak = 0.85 - 0.7 * p;
    }

    const sigma = 0.28;
    const weights = [];
    for (let i = 0; i < N - 1; i++) {
      const u = (i + 0.5) / (N - 1);
      const d = (u - u_peak) / sigma;
      weights.push(Math.exp(-0.5 * d * d));
    }
    const sumW = weights.reduce((a, b) => a + b, 0);
    const deltaAngles = weights.map(w => (w / sumW) * totalBend);

    // Compute strip angles
    const angles = [rootAngle];
    let curAngle = rootAngle;
    for (const da of deltaAngles) {
      curAngle += da;
      angles.push(curAngle);
    }

    // Natural 3D paper arch lift towards viewer (Z axis)
    const maxZ = 120 * Math.sin(Math.PI * p);
    // Subtle diagonal corner curl tilt
    const tiltZ = (isForward ? 1 : -1) * 4.5 * Math.sin(Math.PI * p);

    let curX = 0;
    let curZ = 0;

    for (let k = 0; k < N; k++) {
      const seg = strips[k];
      const rad = angles[k] * Math.PI / 180;
      const startX = curX;
      // Arch lift component along paper curve
      const archLift = maxZ * Math.sin(Math.PI * (k + 0.5) / N);
      const startZ = curZ + archLift;

      // Advance to next strip position
      curX += Math.cos(rad) * ds;
      curZ += Math.sin(rad) * ds;

      const segTilt = tiltZ * (k / N);

      // Hardware-accelerated 3D transform for current strip
      seg.el.style.transform = `translate3d(${startX.toFixed(1)}px, 0, ${startZ.toFixed(1)}px) rotateY(${angles[k].toFixed(2)}deg) rotateZ(${segTilt.toFixed(2)}deg)`;

      // Dynamic Specular Gloss Shading (highlights the apex of the curved paper)
      const lightFacing = Math.abs(angles[k] - (isForward ? -50 : -130));
      const specularIntensity = Math.max(0, 1 - lightFacing / 35);
      seg.frontGloss.style.opacity = (specularIntensity * 0.75).toFixed(2);
      seg.backGloss.style.opacity = (Math.max(0, 1 - Math.abs(angles[k] - (isForward ? -130 : -50)) / 35) * 0.75).toFixed(2);

      // Ambient Concave Shadows
      const shadowFactor = Math.sin(Math.PI * p) * (1 - k / N);
      seg.frontShadow.style.opacity = (shadowFactor * 0.42).toFixed(2);
      seg.backShadow.style.opacity = (shadowFactor * 0.35).toFixed(2);
    }

    // Under-Leaf Curved Drop Shadow
    if (underShadow) {
      const shadowX = curX * 0.55;
      const shadowOpacity = Math.sin(Math.PI * p) * 0.62;
      const blurRadius = 12 + 16 * Math.sin(Math.PI * p);
      underShadow.style.opacity = shadowOpacity.toFixed(2);
      underShadow.style.filter = `blur(${blurRadius.toFixed(1)}px)`;
      underShadow.style.transform = `translate3d(${shadowX.toFixed(1)}px, 0, 0) scaleX(${(0.6 + 0.5 * Math.sin(Math.PI * p)).toFixed(2)})`;
    }
  }

  render() {
    if (!this.container) return;
    const book = this.getCurrentBook();
    if (!book) return;

    this.container.innerHTML = `
      <div class="flipbook-wrapper">
        <!-- Magazine Top Header & Book Switcher -->
        <div class="flipbook-header">
          <div class="book-meta">
            <span class="book-badge">DIGITAL EDITORIAL • 3D READER</span>
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

            <!-- Paper Quality & Silent Mode Indicators -->
            <div class="book-action-icons">
              <span class="paper-badge" title="Coated Art Paper with Natural Page Curl">
                <span class="paper-dot"></span>
                <span>Coated Paper 170gsm</span>
              </span>
            </div>
          </div>
        </div>

        <!-- 3D Perspective Stage -->
        <div class="flipbook-stage">
          <div class="flipbook-viewport ${this.isDesktopSpread ? 'mode-spread' : 'mode-single'}" id="flipbook-viewport">
            <!-- Ambient Specular Reflection Layer (tracks cursor/light) -->
            <div class="ambient-specular-light"></div>

            <!-- Paper Stack Rim Simulation (Left & Right page depth) -->
            <div class="book-edge-stack edge-left"></div>
            <div class="book-edge-stack edge-right"></div>

            <!-- Central Spine / Binding Shadow (Desktop Spread) -->
            <div class="magazine-spine">
              <div class="spine-binding-line"></div>
              <div class="spine-staple spine-staple-top"></div>
              <div class="spine-staple spine-staple-bottom"></div>
            </div>
            
            <!-- Pages Container -->
            <div class="magazine-pages-container" id="magazine-pages-slot">
              <!-- Content injected by renderSpreadContent -->
            </div>

            <!-- Corner Lift / Drag Indicators -->
            <div class="page-corner-cue corner-cue-right" title="Drag or click to turn page">
              <div class="page-corner-curl"></div>
            </div>
            <div class="page-corner-cue corner-cue-left" title="Drag or click to turn page">
              <div class="page-corner-curl"></div>
            </div>
          </div>

          <!-- Side Navigation Arrows -->
          <button class="flip-arrow flip-prev" id="flip-prev-btn" aria-label="Previous Page" title="Previous Page (Left Arrow)">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <button class="flip-arrow flip-next" id="flip-next-btn" aria-label="Next Page" title="Next Page (Right Arrow)">
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
            <span class="tip-icon">✦</span>
            <span class="tip-text">${this.isDesktopSpread ? 'Drag page edge with mouse or use arrow keys to curl pages' : 'Swipe left or right across screen to curl pages'}</span>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
    this.renderSpreadContent();
  }

  bindEvents() {
    if (!this.container) return;

    // Book Pills
    const pills = this.container.querySelectorAll('.book-pill-btn');
    pills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        const bookId = e.currentTarget.dataset.book;
        this.loadBook(bookId, 0);
      });
    });

    // Prev / Next Arrows
    const prevBtn = this.container.querySelector('#flip-prev-btn');
    const nextBtn = this.container.querySelector('#flip-next-btn');

    if (prevBtn) prevBtn.addEventListener('click', () => this.prevPage());
    if (nextBtn) nextBtn.addEventListener('click', () => this.nextPage());

    // Interactive Ambient Light Tracking (mouse sheen across glossy coated paper)
    const viewport = this.container.querySelector('#flipbook-viewport');
    if (viewport) {
      viewport.addEventListener('mousemove', (e) => {
        const rect = viewport.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        viewport.style.setProperty('--sheen-x', `${x.toFixed(1)}%`);
        viewport.style.setProperty('--sheen-y', `${y.toFixed(1)}%`);
      });

      // Bind Interactive Mouse & Touch Dragging
      this.bindDragEvents(viewport);
    }
  }

  /**
   * Interactive Drag Engine
   * Allows clicking/touching on the page and dragging horizontally to peel & curl the paper in real-time.
   */
  bindDragEvents(viewport) {
    let startX = 0;
    let startY = 0;
    let startTime = 0;
    let direction = null;
    let activeDrag = null;

    const onStart = (clientX, clientY, target) => {
      if (this.isFlipping) return;
      // Do not initiate drag on buttons, pins, or links
      if (target.closest('.magazine-hotspot-pin, button, a, input, select, textarea, .shop-chip-btn, .shop-chip-add-btn, .cover-open-btn, .backcover-shop-btn, .backcover-reopen-btn')) {
        return;
      }

      const rect = viewport.getBoundingClientRect();
      const relativeX = clientX - rect.left;
      const isRightHalf = relativeX > rect.width / 2;

      // Determine direction
      if (isRightHalf) {
        direction = 'forward';
        const total = this.getTotalPages();
        const isEnd = this.isDesktopSpread
          ? (this.currentPageIndex >= total - 2)
          : (this.currentPageIndex >= total - 1);
        if (isEnd) return;
      } else {
        direction = 'backward';
        if (this.currentPageIndex === 0) return;
      }

      startX = clientX;
      startY = clientY;
      startTime = performance.now();
      this.isDragging = true;

      // Create live turning leaf
      activeDrag = this.createCurvedTurningLeaf(direction);
      if (activeDrag && activeDrag.turningLeaf) {
        viewport.appendChild(activeDrag.turningLeaf);
        this.updateCurl(0, direction, activeDrag.strips, activeDrag.underShadow, activeDrag.pageWidth);
      }
    };

    const onMove = (clientX, clientY) => {
      if (!this.isDragging || !activeDrag) return;
      const deltaX = clientX - startX;
      const pageWidth = activeDrag.pageWidth;

      let p = 0;
      if (direction === 'forward') {
        p = Math.max(0, Math.min(1, -deltaX / (pageWidth * 0.9)));
      } else {
        p = Math.max(0, Math.min(1, deltaX / (pageWidth * 0.9)));
      }

      this.dragProgress = p;
      this.updateCurl(p, direction, activeDrag.strips, activeDrag.underShadow, pageWidth);
    };

    const onEnd = (clientX) => {
      if (!this.isDragging || !activeDrag) return;
      this.isDragging = false;
      const duration = performance.now() - startTime;
      const deltaX = clientX - startX;
      const velocity = Math.abs(deltaX) / Math.max(1, duration);

      const p = this.dragProgress;
      const shouldFlip = p > 0.35 || (velocity > 0.35 && p > 0.1);

      const leaf = activeDrag.turningLeaf;
      const strips = activeDrag.strips;
      const underShadow = activeDrag.underShadow;
      const pageWidth = activeDrag.pageWidth;
      const dir = direction;

      this.isFlipping = true;

      if (shouldFlip) {
        // Complete the flip smoothly to 1.0
        const animDuration = Math.max(180, (1 - p) * 420);
        const animStart = performance.now();
        const startP = p;

        const animateComplete = (now) => {
          const t = Math.min(1, (now - animStart) / animDuration);
          const currentP = startP + (1 - startP) * (t * t * (3 - 2 * t));
          this.updateCurl(currentP, dir, strips, underShadow, pageWidth);

          if (t < 1) {
            requestAnimationFrame(animateComplete);
          } else {
            // Commit page turn
            if (dir === 'forward') {
              const step = this.isDesktopSpread ? (this.currentPageIndex === 0 ? 1 : 2) : 1;
              this.currentPageIndex += step;
            } else {
              const step = this.isDesktopSpread ? (this.currentPageIndex <= 2 ? this.currentPageIndex : 2) : 1;
              this.currentPageIndex = Math.max(0, this.currentPageIndex - step);
            }
            this.renderSpreadContent();
            if (leaf.parentNode) leaf.parentNode.removeChild(leaf);
            this.isFlipping = false;
            activeDrag = null;
          }
        };
        requestAnimationFrame(animateComplete);
      } else {
        // Snap back to 0.0
        const animDuration = Math.max(150, p * 320);
        const animStart = performance.now();
        const startP = p;

        const animateSnap = (now) => {
          const t = Math.min(1, (now - animStart) / animDuration);
          const currentP = startP * (1 - t * t);
          this.updateCurl(currentP, dir, strips, underShadow, pageWidth);

          if (t < 1) {
            requestAnimationFrame(animateSnap);
          } else {
            if (leaf.parentNode) leaf.parentNode.removeChild(leaf);
            this.isFlipping = false;
            activeDrag = null;
          }
        };
        requestAnimationFrame(animateSnap);
      }
    };

    // Mouse listeners
    viewport.addEventListener('mousedown', (e) => {
      onStart(e.clientX, e.clientY, e.target);
    });

    window.addEventListener('mousemove', (e) => {
      onMove(e.clientX, e.clientY);
    });

    window.addEventListener('mouseup', (e) => {
      onEnd(e.clientX);
    });

    // Touch listeners (Android mobile viewport)
    viewport.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches.length === 1) {
        onStart(e.touches[0].clientX, e.touches[0].clientY, e.target);
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches.length === 1) {
        onMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
      const clientX = e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientX : 0;
      onEnd(clientX);
    });

    // Corner cues click
    const cornerRight = this.container.querySelector('.corner-cue-right');
    const cornerLeft = this.container.querySelector('.corner-cue-left');
    if (cornerRight) cornerRight.addEventListener('click', () => this.nextPage());
    if (cornerLeft) cornerLeft.addEventListener('click', () => this.prevPage());
  }

  renderSpreadContent() {
    if (!this.container) return;
    const book = this.getCurrentBook();
    if (!book) return;

    const slot = this.container.querySelector('#magazine-pages-slot');
    const counter = this.container.querySelector('#footer-page-counter');
    const scrubber = this.container.querySelector('#footer-scrubber');
    const prevBtn = this.container.querySelector('#flip-prev-btn');
    const nextBtn = this.container.querySelector('#flip-next-btn');

    const total = book.pages.length;
    const { leftPage, rightPage } = this.getSpreadPages(this.currentPageIndex);

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

    // Attach "Open Magazine" buttons on the cover
    const openCoverBtns = slot.querySelectorAll('.cover-open-btn');
    openCoverBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.nextPage();
      });
    });

    // Attach Hotspot & Product click triggers
    this.attachProductTriggers(slot);

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

  attachProductTriggers(slot) {
    // 1. Hotspot pin clicks & direct action buttons
    slot.querySelectorAll('.magazine-hotspot-pin').forEach(pin => {
      pin.addEventListener('click', (e) => {
        e.stopPropagation();
        const sku = pin.dataset.productSku;
        const card = pin.querySelector('.hotspot-card');
        if (card) {
          card.classList.toggle('active');
        } else if (typeof this.onProductSelect === 'function') {
          this.onProductSelect(sku);
        }
      });
    });

    // 2. View details buttons inside hotspot card and chips
    slot.querySelectorAll('[data-view-product]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const sku = e.currentTarget.dataset.viewProduct;
        if (typeof this.onProductSelect === 'function') {
          this.onProductSelect(sku);
        }
      });
    });

    // 3. Quick Add To Bag buttons inside hotspot card and chips (silent, no sound)
    slot.querySelectorAll('[data-quick-add]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const sku = e.currentTarget.dataset.quickAdd;
        if (typeof this.onAddToCart === 'function') {
          this.onAddToCart(sku, 1);
          showToast(`Added piece to your shopping bag.`);
        }
      });
    });

    // 4. Shop chips trigger PDP
    slot.querySelectorAll('[data-product-sku]').forEach(pill => {
      if (pill.classList.contains('shop-chip-btn')) {
        pill.addEventListener('click', (e) => {
          e.stopPropagation();
          const sku = e.currentTarget.dataset.productSku;
          if (typeof this.onProductSelect === 'function') {
            this.onProductSelect(sku);
          }
        });
      }
    });
  }

  buildPageHTML(page, position) {
    if (!page) {
      return `
        <div class="empty-page-wrapper">
          <div class="empty-colophon">
            <img src="assets/logo-mark.svg" alt="HomeHub" style="width:36px; height:36px; opacity:0.3; margin:0 auto 10px;" />
            <p>HomeHub Atelier</p>
          </div>
        </div>
      `;
    }

    if (page.type === 'brand-flyleaf') {
      const book = this.getCurrentBook();
      return `
        <div class="page-flyleaf">
          <div class="flyleaf-content">
            <img src="assets/logo-mark.svg" alt="HomeHub" class="mag-brand-mark" />
            <span class="editorial-brand">HOMEHUB</span>
            <p class="brand-tagline">SHOP • STYLE • SMART</p>
            <div class="flyleaf-divider"></div>
            <p class="flyleaf-volume">${book.issue}</p>
            <h3 class="flyleaf-book-title">${book.title}</h3>
            <p class="flyleaf-quote">"True luxury is not ornament; it is the presence of generous negative space and honest, enduring materials."</p>
            <div class="flyleaf-toc">
              <span class="toc-title">IN THIS ISSUE</span>
              <ul>
                ${(book.coverLines || []).map(line => `<li>${line}</li>`).join('')}
              </ul>
            </div>
            <p class="flyleaf-note">Soft Luxury Modern Editorial Series</p>
          </div>
          <div class="page-folio">HOMEHUB ATELIER • PAKISTAN</div>
        </div>
      `;
    }

    if (page.type === 'cover') {
      const book = this.getCurrentBook();
      const coverLines = page.coverLines || book.coverLines || [];
      return `
        <div class="page-cover" style="background-image: linear-gradient(180deg, rgba(20,18,16,0.2) 0%, rgba(20,18,16,0.45) 40%, rgba(20,18,16,0.85) 100%), url('${page.heroImage}')">
          <div class="cover-top-meta">
            <div class="cover-brand-header">
              <img src="assets/logo-mark.svg" alt="HomeHub" class="cover-logo-mark" />
              <div class="cover-brand-text">
                <span class="cover-brand-name">HOMEHUB</span>
                <span class="cover-kicker">${page.kicker || 'EDITORIAL EDITION'}</span>
              </div>
            </div>
            <span class="cover-issue-badge">${book.issue}</span>
          </div>

          <div class="cover-center-branding">
            <h1 class="cover-title">${page.headline}</h1>
            <p class="cover-deck">${page.deck || ''}</p>
            
            ${coverLines.length > 0 ? `
              <div class="cover-lines-box">
                <span class="cover-lines-heading">FEATURING:</span>
                <ul class="cover-lines-list">
                  ${coverLines.map(line => `<li><span class="bullet">✦</span> ${line}</li>`).join('')}
                </ul>
              </div>
            ` : ''}
          </div>

          <div class="cover-footer-meta">
            <p class="cover-colophon">${page.colophon || ''}</p>
            <div class="cover-action-wrap">
              <button class="cover-open-btn" aria-label="Open Magazine">
                <span>Open Magazine</span>
                <span class="open-arrow">→</span>
              </button>
            </div>
          </div>
          <div class="page-folio-corner">PAGE 1</div>
        </div>
      `;
    }

    if (page.type === 'backcover') {
      return `
        <div class="page-backcover" style="background-image: linear-gradient(180deg, rgba(20,18,16,0.45) 0%, rgba(20,18,16,0.9) 100%), url('${page.heroImage}')">
          <div class="backcover-content">
            <img src="assets/logo-mark.svg" alt="HomeHub" style="width:48px; height:48px; margin:0 auto 1.2rem; display:block;" />
            <span class="editorial-brand">${page.headline}</span>
            <p class="backcover-tagline">${page.kicker}</p>
            <p class="backcover-deck">${page.deck}</p>
            <div class="backcover-divider"></div>
            <p class="backcover-colophon">${page.colophon}</p>
            <div class="backcover-buttons">
              <button class="backcover-reopen-btn" onclick="document.querySelector('.book-pill-btn[data-book=\\'${this.currentBookId}\\']').click()">
                ↺ Re-read Issue
              </button>
              <a href="#catalogue-section" class="backcover-shop-btn">
                Browse Complete Catalogue →
              </a>
            </div>
          </div>
          <div class="page-folio-corner">PAGE ${page.pageNumber}</div>
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
          
          <!-- Interactive Visual Hotspot Pins directly on the photography -->
          ${hasProducts ? page.products.map((p, idx) => {
            const x = p.hotspot ? p.hotspot.x : (35 + idx * 30);
            const y = p.hotspot ? p.hotspot.y : (50 + idx * 12);
            return `
              <div class="magazine-hotspot-pin" style="left:${x}%; top:${y}%;" data-product-sku="${p.sku}" title="Inspect ${p.label}">
                <div class="hotspot-pulse"></div>
                <div class="hotspot-dot">✦</div>
                <div class="hotspot-card">
                  <span class="hotspot-card-badge">${p.badge || 'Featured Piece'}</span>
                  <strong class="hotspot-card-title">${p.label}</strong>
                  <span class="hotspot-card-price">${p.price}</span>
                  <div class="hotspot-card-actions">
                    <button class="hotspot-btn-view" data-view-product="${p.sku}">Inspect</button>
                    <button class="hotspot-btn-add" data-quick-add="${p.sku}">+ Add to Bag</button>
                  </div>
                </div>
              </div>
            `;
          }).join('') : ''}

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
                <div class="shop-chip-group">
                  <button class="shop-chip-btn" data-product-sku="${p.sku}" title="Inspect ${p.label}">
                    <span class="chip-dot"></span>
                    <span class="chip-name">${p.label}</span>
                    <span class="chip-price">${p.price}</span>
                    <span class="chip-arrow">↗</span>
                  </button>
                  <button class="shop-chip-add-btn" data-quick-add="${p.sku}" title="Quick add ${p.label} to bag">
                    + Bag
                  </button>
                </div>
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
