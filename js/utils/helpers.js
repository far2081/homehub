/**
 * General helper utilities for HomeHub
 */

let _currencyFormatter = null;

export function setCurrencyFormatter(fn) {
  _currencyFormatter = fn;
}

export function getCurrencyFormatter() {
  return _currencyFormatter;
}

/**
 * Format currency in Pakistani Rupees (PKR) or active tenant currency
 * e.g. 345000 -> "₨ 345,000" or "$ 1,850" depending on active tenant
 */
export function formatPKR(amount) {
  if (_currencyFormatter) {
    return _currencyFormatter(amount);
  }
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '₨ 0';
  }
  return '₨ ' + amount.toLocaleString('en-PK', {
    maximumFractionDigits: 0
  });
}

/**
 * Format specifically in PKR regardless of active tenant
 */
export function formatPKRRaw(amount) {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '₨ 0';
  }
  return '₨ ' + amount.toLocaleString('en-PK', {
    maximumFractionDigits: 0
  });
}

/**
 * Simple debounce utility
 */
export function debounce(fn, wait = 250) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      fn(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Android and Mobile Touch Swipe detector
 */
export function attachSwipeHandler(element, onSwipeLeft, onSwipeRight, threshold = 40) {
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;

  element.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  element.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleGesture();
  }, { passive: true });

  function handleGesture() {
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;

    // Ensure horizontal gesture dominance (not scrolling vertically)
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > threshold) {
      if (diffX < 0) {
        // Swiped left -> Next page
        if (typeof onSwipeLeft === 'function') onSwipeLeft();
      } else {
        // Swiped right -> Previous page
        if (typeof onSwipeRight === 'function') onSwipeRight();
      }
    }
  }
}

/**
 * Scroll to an element or selector smoothly
 */
export function scrollToTarget(target) {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/**
 * Quick toast notification
 */
export function showToast(message, type = 'info', duration = 3000) {
  if (typeof document === 'undefined') return;
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast-item toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${type === 'success' ? '✓' : type === 'warning' ? '!' : 'ℹ'}</span>
    <span class="toast-message">${message}</span>
  `;

  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('toast-show');
  });

  setTimeout(() => {
    toast.classList.remove('toast-show');
    toast.addEventListener('transitionend', () => {
      toast.remove();
    });
  }, duration);
}
