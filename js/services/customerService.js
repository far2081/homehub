/**
 * HomeHub — Client Directory & CRM Service
 * Aggregates client purchase history, contact channels, and lifetime spend in PKR.
 */

import { storage } from '../utils/storage.js';

const STORAGE_KEY = 'homehub_customers';
const CLIENTS_AUTH_KEY = 'homehub_registered_clients';
const ACTIVE_SESSION_KEY = 'homehub_client_session';

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

  /**
   * Register a new client account
   */
  register({ name, email, password, phone, city }) {
    if (!name || !email || !password) {
      throw new Error('Name, email, and password are required.');
    }
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      throw new Error('Please provide a valid email address.');
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters.');
    }

    const registered = storage.get(CLIENTS_AUTH_KEY, []);
    if (registered.some(c => c.email.toLowerCase() === cleanEmail)) {
      throw new Error('An account with this email address already exists. Please sign in.');
    }

    const newClient = {
      id: cleanEmail,
      name: name.trim(),
      email: cleanEmail,
      passwordHash: btoa(password), // simple obfuscation for local prototype session
      phone: phone ? phone.trim() : '',
      city: city ? city.trim() : '',
      tier: 'Silver Patron',
      totalSpent: 0,
      totalOrders: 0,
      createdAt: new Date().toISOString()
    };

    registered.push(newClient);
    storage.set(CLIENTS_AUTH_KEY, registered);

    // Set active session
    const sessionUser = {
      id: newClient.id,
      name: newClient.name,
      email: newClient.email,
      phone: newClient.phone,
      city: newClient.city,
      tier: newClient.tier
    };
    storage.set(ACTIVE_SESSION_KEY, sessionUser);
    return sessionUser;
  }

  /**
   * Authenticate an existing client
   */
  login(email, password) {
    if (!email || !password) {
      throw new Error('Email and password are required.');
    }
    const cleanEmail = email.trim().toLowerCase();
    const registered = storage.get(CLIENTS_AUTH_KEY, []);
    const found = registered.find(c => c.email.toLowerCase() === cleanEmail);

    if (found) {
      if (found.passwordHash !== btoa(password)) {
        throw new Error('Incorrect password. Please verify and try again.');
      }
      const sessionUser = {
        id: found.id,
        name: found.name,
        email: found.email,
        phone: found.phone || '',
        city: found.city || '',
        tier: found.tier || 'Silver Patron'
      };
      storage.set(ACTIVE_SESSION_KEY, sessionUser);
      return sessionUser;
    }

    // Default registered demo account for founder / VIP testing
    const cleanPass = (password || '').trim();
    if ((cleanEmail === 'farzunmir@gmail.com' || cleanEmail === 'farzunmir') && (cleanPass === '2081' || cleanPass === 'homehub2026' || cleanPass === 'admin123')) {
      const founderUser = {
        id: 'farzunmir@gmail.com',
        name: 'Farhana Aamir',
        email: 'farzunmir@gmail.com',
        phone: '+92 300 1234567',
        city: 'Lahore',
        tier: 'Platinum Privileged'
      };
      storage.set(ACTIVE_SESSION_KEY, founderUser);
      return founderUser;
    }

    throw new Error('No client account found with this email. Please register or place a guest order.');
  }

  /**
   * End current client session
   */
  logout() {
    storage.remove(ACTIVE_SESSION_KEY);
  }

  /**
   * Retrieve active client session
   */
  getCurrentUser() {
    return storage.get(ACTIVE_SESSION_KEY, null);
  }

  /**
   * Get all orders placed by this customer
   */
  getCustomerOrders(email) {
    if (!email) return [];
    const cleanEmail = email.trim().toLowerCase();
    let allOrders = storage.get('homehub_orders', []);
    if (!allOrders || allOrders.length === 0) {
      allOrders = storage.get('orders', []);
    }
    if ((!allOrders || allOrders.length === 0) && typeof window !== 'undefined' && window.localStorage) {
      try {
        const raw = window.localStorage.getItem('homehub_orders');
        if (raw) allOrders = JSON.parse(raw);
      } catch (_) {}
    }
    return (allOrders || []).filter(o => {
      const orderEmail = (o.customer_email || o.customerEmail || '').toLowerCase();
      return orderEmail === cleanEmail;
    });
  }
}

export const customerService = new CustomerService();
