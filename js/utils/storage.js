/**
 * Safe LocalStorage abstraction with in-memory fallback for private browsing and Node testing
 */

const memoryStorage = {};

const hasLocalStorage = () => {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
};

export const storage = {
  get(key, defaultValue = null) {
    if (!hasLocalStorage()) {
      return memoryStorage[key] !== undefined ? memoryStorage[key] : defaultValue;
    }
    try {
      const item = window.localStorage.getItem(`homehub_${key}`);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      return memoryStorage[key] !== undefined ? memoryStorage[key] : defaultValue;
    }
  },

  set(key, value) {
    memoryStorage[key] = value;
    if (!hasLocalStorage()) {
      return true;
    }
    try {
      window.localStorage.setItem(`homehub_${key}`, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  },

  remove(key) {
    delete memoryStorage[key];
    if (hasLocalStorage()) {
      try {
        window.localStorage.removeItem(`homehub_${key}`);
      } catch (e) {
        // ignore
      }
    }
  }
};
