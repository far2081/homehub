/**
 * HomeHub — Client Directory & CRM Service
 * Aggregates client purchase history, contact channels, and lifetime spend in PKR.
 */

import { storage } from '../utils/storage.js';

const STORAGE_KEY = 'homehub_customers';

const INITIAL_CUSTOMERS = [
  {
    id: 'ayesha.malik@example.com',
    name: 'Ayesha Malik',
    email: 'ayesha.malik@example.com',
    phone: '+92 300 8472910',
    city: 'Lahore (DHA Phase 6)',
    totalOrders: 3,
    totalSpent: 642000,
    firstOrderAt: '2026-08-14T11:20:00Z',
    lastOrderAt: '2026-11-12T16:45:00Z',
    tier: 'Platinum Privileged',
    notes: 'Architectural client. Prefers weekend white-glove delivery.'
  },
  {
    id: 'tariq.siddiqui@example.com',
    name: 'Tariq Siddiqui',
    email: 'tariq.siddiqui@example.com',
    phone: '+92 321 9845123',
    city: 'Karachi (Clifton Block 4)',
    totalOrders: 2,
    totalSpent: 410000,
    firstOrderAt: '2026-09-02T14:10:00Z',
    lastOrderAt: '2026-11-05T09:30:00Z',
    tier: 'Gold Atelier Member',
    notes: 'Completed Living Edit and Dining suite curation.'
  },
  {
    id: 'zainab.rehman@example.com',
    name: 'Dr. Zainab Rehman',
    email: 'zainab.rehman@example.com',
    phone: '+92 333 4512987',
    city: 'Islamabad (Sector F-7/2)',
    totalOrders: 1,
    totalSpent: 185000,
    firstOrderAt: '2026-10-18T10:00:00Z',
    lastOrderAt: '2026-10-18T10:00:00Z',
    tier: 'Silver Patron',
    notes: 'Interested in bespoke travertine lighting collection.'
  }
];

class CustomerService {
  constructor() {
    this._initStorage();
  }

  _initStorage() {
    const existing = storage.get(STORAGE_KEY, null);
    if (!existing || !Array.isArray(existing) || existing.length === 0) {
      storage.set(STORAGE_KEY, INITIAL_CUSTOMERS);
    }
  }

  getAllCustomers(liveOrders = []) {
    const baseCustomers = storage.get(STORAGE_KEY, INITIAL_CUSTOMERS);
    const customerMap = new Map();

    baseCustomers.forEach(c => {
      customerMap.set(c.email.toLowerCase(), { ...c });
    });

    // Merge or update from live orders
    if (Array.isArray(liveOrders) && liveOrders.length > 0) {
      liveOrders.forEach(order => {
        const email = (order.customer_email || order.customerEmail || '').toLowerCase();
        if (!email) return;

        const name = order.customer_name || order.customerName || 'Anonymous Patron';
        const phone = order.customer_phone || order.customerPhone || '—';
        const city = order.shipping_city || order.shippingCity || 'Pakistan';
        const orderTotal = Number(order.total_amount || order.totalAmount || 0);
        const orderDate = order.created_at || new Date().toISOString();

        if (customerMap.has(email)) {
          const cust = customerMap.get(email);
          cust.totalOrders += 1;
          cust.totalSpent += orderTotal;
          if (new Date(orderDate) > new Date(cust.lastOrderAt)) {
            cust.lastOrderAt = orderDate;
          }
        } else {
          customerMap.set(email, {
            id: email,
            name,
            email,
            phone,
            city,
            totalOrders: 1,
            totalSpent: orderTotal,
            firstOrderAt: orderDate,
            lastOrderAt: orderDate,
            tier: orderTotal > 300000 ? 'Platinum Privileged' : 'Silver Patron',
            notes: 'Registered through direct storefront checkout.'
          });
        }
      });
    }

    return Array.from(customerMap.values());
  }

  recordCustomer(order) {
    if (!order) return;
    const email = (order.customer_email || order.customerEmail || '').toLowerCase();
    if (!email) return;

    const customers = storage.get(STORAGE_KEY, INITIAL_CUSTOMERS);
    const existingIdx = customers.findIndex(c => c.email.toLowerCase() === email);
    const orderTotal = Number(order.total_amount || order.totalAmount || 0);
    const now = new Date().toISOString();

    if (existingIdx > -1) {
      customers[existingIdx].totalOrders += 1;
      customers[existingIdx].totalSpent += orderTotal;
      customers[existingIdx].lastOrderAt = now;
      if (customers[existingIdx].totalSpent > 500000) {
        customers[existingIdx].tier = 'Platinum Privileged';
      }
    } else {
      customers.push({
        id: email,
        name: order.customer_name || order.customerName || 'Client',
        email,
        phone: order.customer_phone || order.customerPhone || '—',
        city: order.shipping_city || order.shippingCity || 'Pakistan',
        totalOrders: 1,
        totalSpent: orderTotal,
        firstOrderAt: now,
        lastOrderAt: now,
        tier: orderTotal > 300000 ? 'Platinum Privileged' : 'Silver Patron',
        notes: 'Placed first bespoke order via HomeHub Atelier storefront.'
      });
    }

    storage.set(STORAGE_KEY, customers);
  }
}

export const customerService = new CustomerService();
