/**
 * HomeHub — Coupon & Promotional Discount Engine
 * Modular Vanilla JS ES6 Module for promotional vouchers and discounts.
 */

import { storage } from '../utils/storage.js';

const STORAGE_KEY = 'homehub_coupons';

const DEFAULT_COUPONS = [
  {
    code: 'HOMEHUB10',
    type: 'percentage',
    value: 10,
    minOrder: 0,
    active: true,
    description: '10% off any atelier piece across all room categories',
    timesUsed: 14
  },
  {
    code: 'WELCOME5000',
    type: 'fixed',
    value: 5000,
    minOrder: 50000,
    active: true,
    description: '₨ 5,000 welcome discount on orders above ₨ 50,000',
    timesUsed: 8
  },
  {
    code: 'SPRINGSTYLE',
    type: 'percentage',
    value: 15,
    minOrder: 100000,
    active: true,
    description: '15% seasonal styling privilege on curated orders above ₨ 100,000',
    timesUsed: 5
  },
  {
    code: 'LUXURY20',
    type: 'percentage',
    value: 20,
    minOrder: 200000,
    active: true,
    description: '20% private salon privilege on bespoke collections above ₨ 200,000',
    timesUsed: 3
  }
];

class CouponService {
  constructor() {
    this._initStorage();
  }

  _initStorage() {
    const existing = storage.get(STORAGE_KEY, null);
    if (!existing || !Array.isArray(existing) || existing.length === 0) {
      storage.set(STORAGE_KEY, DEFAULT_COUPONS);
    }
  }

  getAllCoupons() {
    return storage.get(STORAGE_KEY, DEFAULT_COUPONS);
  }

  getCoupon(code) {
    if (!code || typeof code !== 'string') return null;
    const cleanCode = code.trim().toUpperCase();
    const coupons = this.getAllCoupons();
    return coupons.find(c => c.code.toUpperCase() === cleanCode) || null;
  }

  validateCoupon(code, subtotal = 0) {
    if (!code || typeof code !== 'string') {
      return { valid: false, message: 'Please enter a valid coupon code.', discount: 0 };
    }

    const coupon = this.getCoupon(code);
    if (!coupon) {
      return { valid: false, message: `Coupon code "${code.trim().toUpperCase()}" is invalid.`, discount: 0 };
    }

    if (!coupon.active) {
      return { valid: false, message: `Coupon "${coupon.code}" has expired or is inactive.`, discount: 0 };
    }

    if (coupon.minOrder && subtotal < coupon.minOrder) {
      return {
        valid: false,
        message: `Coupon "${coupon.code}" requires a minimum order of ₨ ${coupon.minOrder.toLocaleString()}.`,
        discount: 0
      };
    }

    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = Math.round((subtotal * coupon.value) / 100);
    } else if (coupon.type === 'fixed') {
      discount = Math.min(coupon.value, subtotal);
    }

    return {
      valid: true,
      message: `Coupon "${coupon.code}" applied successfully!`,
      discount,
      coupon
    };
  }

  recordUsage(code) {
    if (!code) return;
    const coupons = this.getAllCoupons();
    const cleanCode = code.trim().toUpperCase();
    const idx = coupons.findIndex(c => c.code.toUpperCase() === cleanCode);
    if (idx > -1) {
      coupons[idx].timesUsed = (coupons[idx].timesUsed || 0) + 1;
      storage.set(STORAGE_KEY, coupons);
    }
  }

  createCoupon(couponData) {
    if (!couponData || !couponData.code) {
      throw new Error('Coupon code is required.');
    }
    const cleanCode = couponData.code.trim().toUpperCase();
    const coupons = this.getAllCoupons();
    if (coupons.some(c => c.code.toUpperCase() === cleanCode)) {
      throw new Error(`Coupon "${cleanCode}" already exists.`);
    }

    const newCoupon = {
      code: cleanCode,
      type: couponData.type === 'fixed' ? 'fixed' : 'percentage',
      value: Number(couponData.value) || 10,
      minOrder: Number(couponData.minOrder) || 0,
      active: couponData.active !== false,
      description: couponData.description || `${couponData.value}% discount coupon`,
      timesUsed: 0
    };

    coupons.push(newCoupon);
    storage.set(STORAGE_KEY, coupons);
    return newCoupon;
  }

  updateCoupon(code, updates) {
    const coupons = this.getAllCoupons();
    const cleanCode = code.trim().toUpperCase();
    const idx = coupons.findIndex(c => c.code.toUpperCase() === cleanCode);
    if (idx === -1) {
      throw new Error(`Coupon "${cleanCode}" not found.`);
    }

    coupons[idx] = { ...coupons[idx], ...updates };
    storage.set(STORAGE_KEY, coupons);
    return coupons[idx];
  }

  deleteCoupon(code) {
    const coupons = this.getAllCoupons();
    const cleanCode = code.trim().toUpperCase();
    const filtered = coupons.filter(c => c.code.toUpperCase() !== cleanCode);
    storage.set(STORAGE_KEY, filtered);
    return true;
  }

  toggleCouponStatus(code) {
    const coupons = this.getAllCoupons();
    const cleanCode = code.trim().toUpperCase();
    const coupon = coupons.find(c => c.code.toUpperCase() === cleanCode);
    if (!coupon) return false;
    coupon.active = !coupon.active;
    storage.set(STORAGE_KEY, coupons);
    return coupon.active;
  }
}

export const couponService = new CouponService();
