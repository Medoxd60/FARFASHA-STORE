const sections = {
  home: document.getElementById('section-home'),
  products: document.getElementById('section-products'),
  category: document.getElementById('section-category'),
  'product-detail': document.getElementById('section-product-detail'),
  cart: document.getElementById('section-cart'),
  checkout: document.getElementById('section-checkout'),
  admin: document.getElementById('section-admin'),
  auth: document.getElementById('section-auth'),
};
const navLinks = document.querySelectorAll('[data-link]');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const mobileMenu = document.querySelector('.menu');

function closeMobileMenu() {
  if (!mobileMenu) return;
  mobileMenu.classList.remove('open');
  if (mobileMenuToggle) mobileMenuToggle.setAttribute('aria-expanded', 'false');
}

function toggleMobileMenu() {
  if (!mobileMenu || !mobileMenuToggle) return;
  const opened = mobileMenu.classList.toggle('open');
  mobileMenuToggle.setAttribute('aria-expanded', opened ? 'true' : 'false');
}

navLinks.forEach(link => link.addEventListener('click', closeMobileMenu));
if (mobileMenuToggle) mobileMenuToggle.addEventListener('click', toggleMobileMenu);
window.addEventListener('resize', () => {
  if (window.innerWidth > 960) closeMobileMenu();
});

const productGrid = document.getElementById('products-grid');
const latestProductsGrid = document.getElementById('latest-products-grid');
const discountedProductsGrid = document.getElementById('discounted-products-grid');
const pickedProductsGrid = document.getElementById('picked-products-grid');
const categorySlider = document.getElementById('category-slider');
const cartTableBody = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const bottomCartCount = document.getElementById('bottom-cart-count');
const cartTotal = document.getElementById('cart-total');
const orderSummary = document.getElementById('checkout-summary');
const confirmMessage = document.getElementById('confirm-message');
const adminGreeting = document.getElementById('admin-greeting');
const categoryPageTitle = document.getElementById('category-page-title');
const categoryPageDescription = document.getElementById('category-page-description');
const categoryProductsGrid = document.getElementById('category-products-grid');
const adminPanel = document.getElementById('admin-panel');
const loginPanel = document.getElementById('admin-login');
const adminError = document.getElementById('admin-error');
const ordersList = document.getElementById('orders-list');
const adminProductsTable = document.getElementById('admin-products-table');
const addProductForm = document.getElementById('add-product-form');
const orderCount = document.getElementById('order-count');
const adminTabButtons = document.querySelectorAll('.tab-btn');
const adminOrderBadge = document.getElementById('admin-order-badge');
const reviewImagesGrid = document.getElementById('review-images-grid');
const reviewImagesPreview = document.getElementById('review-images-preview');
const sliderImagesPreview = document.getElementById('slider-images-preview');
const userOrdersList = document.getElementById('user-orders-list');
// Category options elements (dynamic fields under category select)
const categoryOptionsToggle = document.getElementById('category-options-toggle');
const categoryOptionsPanel = document.getElementById('category-options-panel');
const categoryOptionsContainer = document.getElementById('category-options-container');
const addCategoryOptionBtn = document.getElementById('add-category-option');

function createCategoryOptionRow(value = '') {
  const row = document.createElement('div');
  row.className = 'category-option-row';
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'category-option-input';
  input.placeholder = 'خيار جديد';
  input.value = value || '';
  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.className = 'remove-option-btn';
  removeBtn.title = 'إزالة';
  removeBtn.textContent = '✕';
  removeBtn.addEventListener('click', () => {
    row.remove();
  });
  row.appendChild(input);
  row.appendChild(removeBtn);
  return row;
}

if (addCategoryOptionBtn && categoryOptionsContainer) {
  addCategoryOptionBtn.addEventListener('click', () => {
    const newRow = createCategoryOptionRow();
    categoryOptionsContainer.appendChild(newRow);
    const input = newRow.querySelector('input');
    if (input) input.focus();
  });
}

if (categoryOptionsToggle && categoryOptionsPanel) {
  categoryOptionsToggle.addEventListener('click', () => {
    const expanded = categoryOptionsToggle.getAttribute('aria-expanded') === 'true';
    categoryOptionsToggle.setAttribute('aria-expanded', String(!expanded));
    categoryOptionsPanel.classList.toggle('hidden');
    categoryOptionsPanel.setAttribute('aria-hidden', String(expanded));
  });
}

let state = {
  products: [],
  cart: [],
  orders: [],
  social: {
    telegram: '#',
    whatsapp: '#',
    facebook: '#'
  },
  reviewImages: [],
  sliderImages: [],
  categories: [],
  shippingRates: {
    'القاهرة': 0,
    'الإسكندرية': 50,
    'الجيزة': 20,
    'القليوبية': 30,
    'بورسعيد': 60,
    'السويس': 55,
    'دمياط': 65,
    'الدقهلية': 40,
    'الشرقية': 45,
    'الإسماعيلية': 50,
    'البحيرة': 70,
    'كفر الشيخ': 75,
    'الغربية': 35,
    'المنوفية': 40,
    'بني سويف': 80,
    'الفيوم': 85,
    'المنيا': 90,
    'أسيوط': 95,
    'سوهاج': 100,
    'قنا': 105,
    'الأقصر': 110,
    'أسوان': 115,
    'البحر الأحمر': 120,
    'الوادي الجديد': 125,
    'مطروح': 130,
    'شمال سيناء': 135,
    'جنوب سيناء': 140
  },
  coupons: [],
  admin: { authenticated: false, name: 'مدير FARFASHA' },
};
let categoryEditId = null;
let editProductId = null;
let couponEditId = null;
let adminProductSearch = '';
let adminCouponSearch = '';
let adminProductPage = 1;
let adminOrderSearch = '';
let mainImageData = null;
let galleryImagesData = [];
let homeSliderIndex = 0;
let homeSliderTimer = null;

const SUPABASE_URL = 'https://spvrkohlqflsyjiexcvo.supabase.co';
const SUPABASE_PUBLIC_KEY = 'sb_publishable_hFZTx_2ZRGoWv93qFMnuRw_G_WNueVe';
let supabaseClient = null;
let firebaseApp = null;
let firebaseDb = null;
let firebaseAuth = null;
let firebaseStorage = null;
let firebaseEnabled = false;
let settingsField = 'value'; // Changed default to 'value' as it's more common in Supabase settings tables

function parseSettingsValue(value) {
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch (err) {
    return value;
  }
}

// Push Notifications removed - not needed for web version

class SimpleSupabaseClient {
  constructor(url, key) {
    this.url = url;
    this.key = key;
  }

  async request(endpoint, options = {}) {
    const url = `${this.url}/rest/v1/${endpoint}`;
    const headers = {
      'apikey': this.key,
      'Authorization': `Bearer ${this.key}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
      ...options.headers
    };

    const response = await fetch(url, {
      ...options,
      headers
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  from(table) {
    return {
      select: (columns = '*') => {
        const state = { columns, filters: [], order: null, limit: null };
        const buildPath = () => {
          const params = [];
          params.push(`select=${state.columns}`);
          if (state.filters.length) params.push(state.filters.join('&'));
          if (state.order) params.push(`order=${state.order}`);
          if (state.limit != null) params.push(`limit=${state.limit}`);
          return `${table}?${params.join('&')}`;
        };
        const query = async () => {
          const data = await this.request(buildPath());
          return { data, error: null };
        };
        const queryObj = {
          eq: (column, value) => {
            state.filters.push(`${column}=eq.${encodeURIComponent(value)}`);
            return queryObj;
          },
          order: (column, { ascending = true } = {}) => {
            state.order = `${column}.${ascending ? 'asc' : 'desc'}`;
            return queryObj;
          },
          limit: (count) => {
            state.limit = count;
            return queryObj;
          },
          then: (resolve, reject) => query().then(resolve, reject),
          catch: (reject) => query().catch(reject),
          single: async () => {
            const result = await query();
            return { data: Array.isArray(result.data) ? result.data[0] || null : result.data, error: null };
          }
        };
        return queryObj;
      },
      insert: (data) => {
        const execute = async () => {
          const response = await fetch(`${this.url}/rest/v1/${table}`, {
            method: 'POST',
            headers: {
              'apikey': this.key,
              'Authorization': `Bearer ${this.key}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=representation'
            },
            body: JSON.stringify(data)
          });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const result = await response.json();
          return { data: result[0] || result, error: null };
        };
        return {
          select: () => ({
            single: execute
          }),
          then: (resolve, reject) => execute().then(resolve, reject),
          catch: (reject) => execute().catch(reject)
        };
      },
      upsert: (data, { onConflict } = {}) => {
        const execute = async () => {
          const headers = {
            'apikey': this.key,
            'Authorization': `Bearer ${this.key}`,
            'Content-Type': 'application/json',
            'Prefer': 'resolution=merge-duplicates,return=representation'
          };
          if (onConflict) {
            headers['Prefer'] += `,onConflict=${onConflict}`;
          }
          const response = await fetch(`${this.url}/rest/v1/${table}`, {
            method: 'POST',
            headers,
            body: JSON.stringify(data)
          });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const result = await response.json();
          return { data: result, error: null };
        };
        return {
          select: () => {
            const promise = execute();
            return {
              single: async () => {
                const result = await promise;
                return { data: Array.isArray(result.data) ? result.data[0] || null : result.data, error: null };
              },
              then: (resolve, reject) => promise.then(result => resolve({ data: result, error: null }), reject),
              catch: (reject) => promise.catch(reject)
            };
          },
          then: (resolve, reject) => execute().then(resolve, reject),
          catch: (reject) => execute().catch(reject)
        };
      },
      update: (data) => {
        const execute = async (filter) => {
          const url = filter ? `${this.url}/rest/v1/${table}?${filter}` : `${this.url}/rest/v1/${table}`;
          const response = await fetch(url, {
            method: 'PATCH',
            headers: {
              'apikey': this.key,
              'Authorization': `Bearer ${this.key}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=representation'
            },
            body: JSON.stringify(data)
          });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const result = await response.json();
          return { data: result, error: null };
        };
        return {
          eq: (column, value) => {
            const promise = execute(`${column}=eq.${encodeURIComponent(value)}`);
            return {
              then: (resolve, reject) => promise.then(result => resolve({ data: result, error: null }), reject),
              catch: (reject) => promise.catch(reject)
            };
          }
        };
      },
      delete: () => {
        const execute = async (filter) => {
          const url = filter ? `${this.url}/rest/v1/${table}?${filter}` : `${this.url}/rest/v1/${table}`;
          const response = await fetch(url, {
            method: 'DELETE',
            headers: {
              'apikey': this.key,
              'Authorization': `Bearer ${this.key}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=representation'
            }
          });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const result = await response.json();
          return { data: result, error: null };
        };
        return {
          eq: (column, value) => {
            const promise = execute(`${column}=eq.${encodeURIComponent(value)}`);
            return {
              then: (resolve, reject) => promise.then(result => resolve({ data: result, error: null }), reject),
              catch: (reject) => promise.catch(reject)
            };
          }
        };
      }
    };
  }
}

async function initFirebaseClient() {
  firebaseEnabled = false;
  if (!navigator.onLine) {
    console.warn('Offline: skipping Firebase initialization');
    return;
  }
  if (window.firebaseDB && window.firebaseAuth && window.firebaseStorage) {
    firebaseApp = window.firebaseApp || window.firebase.app();
    firebaseDb = window.firebaseDB;
    firebaseAuth = window.firebaseAuth;
    firebaseStorage = window.firebaseStorage;
    firebaseEnabled = true;
    console.log('Firebase client initialized');

    // Do not enable multi-tab persistence or anonymous auth by default.
    // This avoids extra network calls and timeout errors in environments
    // where Firebase access is blocked or not required.
    if (window.firebase && window.firebase.firestore && typeof window.firebase.firestore === 'function') {
      console.log('Skipping Firebase offline persistence to avoid compatibility/network errors');
    }

    console.log('Firebase current user:', firebaseAuth ? firebaseAuth.currentUser : 'none');
  } else {
    console.warn('Firebase client not available or not ready, skipping initialization');
  }
}

async function loadSupabaseScript() {
  if (window.supabase && typeof window.supabase.createClient === 'function') {
    return;
  }
  return new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-supabase-loader]');
    if (existing) {
      if (existing.getAttribute('data-supabase-loaded') === 'true') {
        return resolve();
      }
      existing.remove();
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/supabase.min.js';
    script.async = true;
    script.setAttribute('data-supabase-loader', 'true');
    script.onload = () => {
      script.setAttribute('data-supabase-loaded', 'true');
      resolve();
    };
    script.onerror = () => reject(new Error('Failed to load Supabase SDK'));
    document.head.appendChild(script);
  });
}

async function initSupabaseClient() {
  // Use the lightweight REST fallback immediately to avoid waiting for the SDK.
  // The SDK is attempted in the background, but data loads should not be blocked.
  if (!supabaseClient) {
    supabaseClient = new SimpleSupabaseClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
    console.debug('Initialized simple Supabase client fallback for immediate data loading');
  }

  const tryLoadOfficialClient = async () => {
    if (window.supabase && typeof window.supabase.createClient === 'function') {
      try {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
        console.debug('Supabase official client initialized from existing SDK', { client: supabaseClient?.constructor?.name });
        return;
      } catch (e) {
        console.warn('Supabase official client create failed:', e?.message || e);
      }
    }
    let lastErr = null;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        await loadSupabaseScript();
        if (window.supabase && typeof window.supabase.createClient === 'function') {
          supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
          console.debug('Supabase official client initialized after loading SDK', { client: supabaseClient?.constructor?.name });
          return;
        }
        lastErr = new Error('Supabase SDK loaded but createClient unavailable');
        break;
      } catch (loadError) {
        lastErr = loadError;
        console.warn(`Supabase SDK load attempt ${attempt + 1} failed:`, loadError?.message || loadError);
        await new Promise(res => setTimeout(res, 300 * (attempt + 1)));
      }
    }
    if (lastErr) {
      console.info('Supabase official client unavailable, continuing with REST fallback', lastErr?.message || lastErr);
    }
  };

  try {
    await tryLoadOfficialClient();
  } catch (e) {
    console.info('Background Supabase SDK initialization failed:', e?.message || e);
  }
}

async function testSupabaseConnection() {
  if (!supabaseClient) {
    console.warn('testSupabaseConnection: supabaseClient not initialized');
    return { ok: false, error: 'client-not-init' };
  }
  try {
    // Try official client path first
    if (supabaseClient && typeof supabaseClient.from === 'function') {
      const op = supabaseClient.from('products').select('*').order ? supabaseClient.from('products').select('*').order('id', { ascending: true }) : supabaseClient.from('products').select('*');
      // support both simple client and official client
      let res;
      if (typeof op.then === 'function') {
        res = await op;
      } else if (typeof op.single === 'function') {
        res = await op.single();
      } else {
        res = op;
      }
      console.log('testSupabaseConnection result:', res);
      return { ok: true, data: res };
    }
    // fallback to direct REST request
    const data = await directSupabaseRequest('products?select=*', 'GET');
    console.log('testSupabaseConnection REST result length:', Array.isArray(data) ? data.length : 0);
    return { ok: true, data };
  } catch (error) {
    console.error('testSupabaseConnection error:', error);
    return { ok: false, error };
  }
}

function initRealtimeSubscriptions() {
  if (window.supabase && supabaseClient && typeof supabaseClient.from === 'function') {
    const subscribeToTable = (table, handler) => {
      try {
        const listener = supabaseClient.from(table);
        if (listener && typeof listener.on === 'function') {
          listener
            .on('*', payload => {
              console.debug(`Real-time update for ${table}:`, payload.eventType || payload.event);
              handler(payload.eventType || payload.event, payload.new || payload.record, payload.old);
            })
            .subscribe();
          console.debug(`✓ Real-time listener attached to ${table} (method 1)`);
          return;
        }
      } catch (error) {
        console.warn(`Supabase realtime first path failed for ${table}:`, error);
      }

      try {
        const channel = supabaseClient.channel(`realtime-${table}`);
        channel.on('postgres_changes', { event: '*', schema: 'public', table }, payload => {
          console.debug(`Real-time update for ${table}:`, payload.eventType || payload.event);
          handler(payload.eventType || payload.event, payload.new || payload.record, payload.old);
        }).subscribe();
        console.debug(`✓ Real-time listener attached to ${table} (method 2)`);
      } catch (error) {
        console.warn(`Supabase realtime fallback failed for ${table}:`, error);
      }
    };

    subscribeToTable('products', handleRealtimeProducts);
    subscribeToTable('categories', handleRealtimeCategories);
    subscribeToTable('coupons', handleRealtimeCoupons);
    subscribeToTable('orders', handleRealtimeOrders);
    subscribeToTable('settings', handleRealtimeSettings);
    console.log('✓ All real-time subscriptions initialized');
  } else {
    console.warn('Real-time subscriptions not available (Supabase client not ready)');
  }

  if (firebaseEnabled && firebaseDb) {
    initFirebaseRealtimeSubscriptions();
  }
}

function initFirebaseRealtimeSubscriptions() {
  if (!firebaseEnabled || !firebaseDb) return;

  const listenCollection = (collectionName, callback) => {
    try {
      firebaseDb.collection(collectionName).onSnapshot(snapshot => {
        const rows = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(rows);
      }, error => {
        console.warn(`Firebase realtime snapshot failed for ${collectionName}:`, error.message || error);
      });
    } catch (error) {
      console.warn(`Firebase realtime listen failed for ${collectionName}:`, error.message || error);
    }
  };

  const listenSettingDoc = (docId, callback) => {
    try {
      firebaseDb.collection('settings').doc(String(docId)).onSnapshot(snapshot => {
        if (!snapshot.exists) return;
        callback(snapshot.data());
      }, error => {
        console.warn(`Firebase realtime snapshot failed for settings/${docId}:`, error.message || error);
      });
    } catch (error) {
      console.warn(`Firebase realtime listen failed for settings/${docId}:`, error.message || error);
    }
  };

  listenCollection('products', rows => {
    state.products = normalizeCollectionFromDb('products', rows);
    renderProducts();
    if (window.location.hash.startsWith('#category/')) handleHashChange();
  });

  listenCollection('categories', rows => {
    state.categories = normalizeCollectionFromDb('categories', rows);
    renderCategories();
    populateCategorySelect();
  });

  listenCollection('coupons', rows => {
    state.coupons = normalizeCollectionFromDb('coupons', rows);
    renderCoupons(adminCouponSearch);
  });

  listenCollection('orders', rows => {
    state.orders = normalizeCollectionFromDb('orders', rows);
    renderOrders(adminOrderSearch);
    orderCount.textContent = state.orders.length;
    adminOrderBadge.textContent = state.orders.length;
  });

  listenSettingDoc('social', data => {
    if (!data) return;
    state.social = data;
    updateSocialLinksDisplay();
  });

  listenSettingDoc('shipping_rates', data => {
    if (!data || !data.rates) return;
    state.shippingRates = { ...state.shippingRates, ...data.rates };
    populateGovernorateOptions();
  });

  listenSettingDoc('review_images', data => {
    if (!data || !data.images) return;
    state.reviewImages = data.images;
    renderReviewImages();
    renderReviewImagesPreview();
  });
}

function handleRealtimeProducts(eventType, newRow, oldRow) {
  if (!newRow && !oldRow) return;
  const item = mapProductFromDb(newRow || oldRow);
  if (eventType === 'INSERT') {
    state.products.unshift(item);
  } else if (eventType === 'UPDATE') {
    state.products = state.products.map(product => product.id === item.id ? item : product);
  } else if (eventType === 'DELETE') {
    state.products = state.products.filter(product => product.id !== item.id);
  }
  renderProducts();
  renderLatestProducts();
  renderDiscountedProducts();
  renderPickedProducts();
  if (window.location.hash.startsWith('#category/')) {
    handleHashChange();
  }
  if (window.location.hash.startsWith('#product?id=')) {
    handleHashChange();
  }
}

function handleRealtimeCategories(eventType, newRow, oldRow) {
  if (!newRow && !oldRow) return;
  const item = { id: (newRow || oldRow).id, name: (newRow || oldRow).name, img: (newRow || oldRow).img };
  if (eventType === 'INSERT') {
    state.categories.unshift(item);
  } else if (eventType === 'UPDATE') {
    state.categories = state.categories.map(category => category.id === item.id ? item : category);
  } else if (eventType === 'DELETE') {
    state.categories = state.categories.filter(category => category.id !== item.id);
  }
  renderCategories();
  populateCategorySelect();
}

function handleRealtimeCoupons(eventType, newRow, oldRow) {
  if (!newRow && !oldRow) return;
  const item = mapCouponFromDb(newRow || oldRow);
  if (eventType === 'INSERT') {
    state.coupons.unshift(item);
  } else if (eventType === 'UPDATE') {
    state.coupons = state.coupons.map(coupon => coupon.id === item.id ? item : coupon);
  } else if (eventType === 'DELETE') {
    state.coupons = state.coupons.filter(coupon => coupon.id !== item.id);
  }
  renderCoupons(adminCouponSearch);
}

function handleRealtimeOrders(eventType, newRow, oldRow) {
  if (!newRow && !oldRow) return;
  const item = mapOrderFromDb(newRow || oldRow);
  if (eventType === 'INSERT') {
    state.orders.unshift(item);
  } else if (eventType === 'UPDATE') {
    state.orders = state.orders.map(order => order.id === item.id ? item : order);
  } else if (eventType === 'DELETE') {
    state.orders = state.orders.filter(order => order.id !== item.id);
  }
  renderOrders(adminOrderSearch);
  orderCount.textContent = state.orders.length;
  adminOrderBadge.textContent = state.orders.length;
}

function handleRealtimeSettings(eventType, newRow, oldRow) {
  const row = newRow || oldRow;
  if (!row || (!row.key && !row.id)) return;  
  
  const rowKey = row.key || row.id;

  let settingsData;
  if (row.data !== undefined) {
    settingsData = parseSettingsValue(row.data);
  } else if (row.value !== undefined) {
    settingsData = parseSettingsValue(row.value);
  } else {
    return; // No valid settings data
  }

  if (rowKey === 'social') {
    state.social = settingsData || state.social;
    updateSocialLinksDisplay();
  }

  if (rowKey === 'shipping_rates') {
    state.shippingRates = settingsData?.rates || settingsData || state.shippingRates;
    populateGovernorateOptions();
  }

  if (rowKey === 'review_images') {
    state.reviewImages = settingsData?.images || settingsData || state.reviewImages;
    renderReviewImages();
    renderReviewImagesPreview();
  }

  if (rowKey === 'slider_images') {
    const images = settingsData?.images || settingsData || [];
    state.sliderImages = (Array.isArray(images) ? images : []).map(normalizeSliderImage).filter(Boolean);
    renderSliderImages();
    renderHomeSlider();
  }
}

function getStorageKey(collectionName, docId) {
  if (collectionName === 'settings') {
    return `farfasha_${docId}`;
  }
  return `farfasha_${collectionName}`;
}

function mapProductFromDb(product) {
  if (!product) return null;
  return {
    id: product.id,
    name: product.name,
    price: Number(product.price),
    originalPrice: product.original_price != null ? Number(product.original_price) : undefined,
    discount: product.discount != null ? Number(product.discount) : undefined,
    desc: product.description || '',
    img: product.img || '',
    gallery: Array.isArray(product.gallery) ? product.gallery : [],
    category: product.category || 'أخرى',
    available: product.available !== false
  };
}

function mapProductToDb(product) {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    original_price: product.originalPrice || null,
    discount: product.discount || null,
    description: product.desc || '',
    img: product.img || null,
    gallery: Array.isArray(product.gallery) ? product.gallery : [],
    category: product.category || null,
    available: product.available !== false
  };
}

function mapOrderFromDb(order) {
  if (!order) return null;
  const rawDate = order.created_at || order.date || null;
  return {
    id: order.id,
    orderNumber: order.order_number,
    customer: order.customer,
    phone: order.phone,
    governorate: order.governorate,
    address: order.address,
    payment: order.payment,
    notes: order.notes,
    coupon: order.coupon,
    couponDiscount: Number(order.coupon_discount) || 0,
    shippingCost: Number(order.shipping_cost) || 0,
    items: Array.isArray(order.items) ? order.items : [],
    total: Number(order.total) || 0,
    date: order.created_at ? new Date(order.created_at).toLocaleString('ar-EG') : order.date,
    createdAt: rawDate,
    status: order.status || 'new',
    user_id: order.user_id || order.userId || order.userID || null,
    user_email: order.user_email || order.userEmail || order.email || ''
  };
}

function mapOrderToDb(order) {
  const row = {
    order_number: order.orderNumber,
    customer: order.customer,
    phone: order.phone,
    governorate: order.governorate,
    address: order.address,
    payment: order.payment,
    notes: order.notes,
    coupon: order.coupon,
    coupon_discount: order.couponDiscount || 0,
    shipping_cost: order.shippingCost || 0,
    total: order.total || 0,
    items: Array.isArray(order.items) ? order.items : [],
    status: order.status || 'new',
    user_id: order.user_id || null,
    user_email: order.user_email || ''
  };
  // only include `id` when it's a positive DB-assigned id
  if (typeof order.id === 'number' && order.id > 0) {
    row.id = order.id;
  }
  return row;
}

function mapCouponFromDb(coupon) {
  if (!coupon) return null;
  return {
    id: coupon.id,
    code: coupon.code,
    type: coupon.type,
    value: Number(coupon.value),
    start: coupon.start,
    end: coupon.end_date || coupon.end,
    active: coupon.active
  };
}

function mapCouponToDb(coupon) {
  return {
    id: coupon.id,
    code: coupon.code,
    type: coupon.type,
    value: coupon.value,
    start: coupon.start,
    end_date: coupon.end,
    active: coupon.active
  };
}

function normalizeCollectionFromDb(collectionName, rows) {
  if (!Array.isArray(rows)) return [];
  switch (collectionName) {
    case 'products':
      return rows.map(mapProductFromDb).filter(Boolean);
    case 'orders':
      return rows.map(mapOrderFromDb).filter(Boolean);
    case 'coupons':
      return rows.map(mapCouponFromDb).filter(Boolean);
    case 'categories':
      return rows.map(row => ({ id: row.id, name: row.name, img: row.img }));
    default:
      return rows;
  }
}

function mapCollectionToDb(collectionName, items) {
  if (!Array.isArray(items)) return [];
  switch (collectionName) {
    case 'products':
      return items.map(mapProductToDb);
    case 'orders':
      return items.map(mapOrderToDb);
    case 'coupons':
      return items.map(mapCouponToDb);
    case 'categories':
      return items.map(item => {
        const row = { name: item.name, img: item.img };
        if (typeof item.id === 'number' && item.id > 0) {
          row.id = item.id;
        }
        return row;
      });
    default:
      return items;
  }
}

async function saveToFirestore(collectionName, docId, data) {
  if (collectionName !== 'settings') return false;

  if (firebaseEnabled && firebaseDb) {
    try {
      await firebaseDb.collection(collectionName).doc(String(docId)).set(data, { merge: true });
      return true;
    } catch (error) {
      firebaseEnabled = false;
      console.warn('Firebase saveToFirestore failed:', error.message);
    }
  } else {
    console.warn('Skipping Firebase saveToFirestore: Firebase not enabled');
  }

  if (!supabaseClient) {
    await initSupabaseClient();
  }
  if (!supabaseClient) {
    console.error('Supabase client is not initialized for saveToFirestore');
    return false;
  }

  const fetchExistingSettingsRow = async () => {
    try {
      const response = await supabaseClient
        .from('settings')
        .select('*')
        .eq('key', docId);
      if (response?.error) {
        if (response.error.code === 'PGRST116' || response.error.details?.includes('No rows')) {
          return null;
        }
        throw response.error;
      }
      if (!response?.data) return null;
      return Array.isArray(response.data) ? response.data[0] || null : response.data;
    } catch (error) {
      console.warn('Error fetching existing settings row:', error.message || error);
      return null;
    }
  };

  const buildPayload = (fieldName, existingRow) => {
    const payload = { key: docId };
    if (fieldName === 'data' || fieldName === 'value') {
      payload[fieldName] = data;
    } else if (fieldName === 'rates') {
      payload.rates = data.rates || data;
    } else {
      payload[fieldName] = data;
    }

    if (existingRow?.id) {
      payload.id = existingRow.id;
    }
    return payload;
  };

  const savePayload = async (payload) => {
    try {
      const response = await supabaseClient
        .from('settings')
        .upsert(payload, { onConflict: 'key' })
        .select();
      if (response?.error) throw response.error;
      return true;
    } catch (error) {
      if (error.message?.includes('HTTP error! status: 400') || error.message?.includes('column')) {
        return false;
      }
      console.warn('Error saving settings to Supabase via upsert:', error.message || error);
      return false;
    }
  };

  const existingRow = await fetchExistingSettingsRow();
  const preferredField = existingRow?.data !== undefined ? 'data' : existingRow?.value !== undefined ? 'value' : existingRow?.rates !== undefined ? 'rates' : settingsField;
  const alternateField = preferredField === 'data' ? 'value' : preferredField === 'value' ? 'data' : 'rates';

  if (await savePayload(buildPayload(preferredField, existingRow))) {
    settingsField = preferredField;
    return true;
  }

  if (preferredField !== alternateField && await savePayload(buildPayload(alternateField, existingRow))) {
    settingsField = alternateField;
    return true;
  }

  if (existingRow?.id) {
    try {
      const payload = buildPayload(preferredField, existingRow);
      const response = await supabaseClient
        .from('settings')
        .update(payload)
        .eq('id', existingRow.id);
      if (!response?.error) {
        return true;
      }
    } catch (error) {
      console.warn('Error updating settings row by id:', error.message || error);
    }
  }

  try {
    const payload = { key: docId, value: data };
    await directSupabaseRequest(`settings?on_conflict=key`, 'POST', payload, { Prefer: 'return=representation' });
    return true;
  } catch (error) {
    console.warn('Final REST fallback failed for settings save:', error.message || error);
  }

  console.warn('Error saving settings to Supabase: failed to save using both data/value/rates and fallback paths');
  return false;
}

// Persist cart locally per-user (or per-browser for guests) to avoid leaking cart
function saveCartState() {
  try {
    const user = window.currentAuthUser || null;
    const key = user && user.id ? `farfashaCart_${user.id}` : 'farfashaCart_guest';
    localStorage.setItem(key, JSON.stringify({ items: state.cart || [] }));
    return true;
  } catch (e) {
    console.warn('saveCartState failed', e?.message || e);
    return false;
  }
}

function loadCartState() {
  try {
    const user = window.currentAuthUser || null;
    const key = user && user.id ? `farfashaCart_${user.id}` : 'farfashaCart_guest';
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.items)) return parsed;
    return null;
  } catch (e) {
    console.warn('loadCartState failed', e?.message || e);
    return null;
  }
}

async function loadFromFirestore(collectionName, docId) {
  if (collectionName !== 'settings') return null;

  if (firebaseEnabled && firebaseDb) {
    try {
      const docRef = firebaseDb.collection(collectionName).doc(String(docId));
      const snapshot = await docRef.get();
      if (!snapshot.exists) return null;
      return snapshot.data();
    } catch (error) {
      firebaseEnabled = false;
      console.warn('Firebase loadFromFirestore failed:', error.message);
    }
  } else {
    console.warn(`Skipping Firebase load for settings/${docId}: Firebase not enabled`);
  }

  if (!supabaseClient) {
    console.error('Supabase client is not initialized for loadFromFirestore');
    return null;
  }
  try {
    const result = await supabaseClient
      .from('settings')
      .select('*')
      .eq('key', docId);

    if (result?.error) {
      const error = result.error;
      if (error.code === 'PGRST116' || error.details?.includes('No rows') || error.message?.includes('HTTP error! status: 400')) {
        console.warn(`Settings table not available or misconfigured for ${docId}, continuing without`);
        return null;
      }
      console.error('Error loading settings from Supabase:', error);
      return null;
    }

    let data = null;
    if (Array.isArray(result?.data)) {
      data = result.data[0] || null;
    } else {
      data = result?.data || null;
    }

    if (!data) return null;
    if (data.data !== undefined) {
      settingsField = 'data';
      return parseSettingsValue(data.data);
    }
    if (data.value !== undefined) {
      settingsField = 'value';
      return parseSettingsValue(data.value);
    }
    return data;
  } catch (error) {
    // If any exception, just return null
    console.warn('Exception loading settings, continuing without:', error.message);
    return null;
  }
}

async function directSupabaseRequest(path, method = 'GET', body = null, extraHeaders = {}) {
  const headers = {
    apikey: SUPABASE_PUBLIC_KEY,
    Authorization: `Bearer ${SUPABASE_PUBLIC_KEY}`,
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Prefer: 'return=representation',
    ...extraHeaders
  };

  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Supabase request failed: ${response.status} ${response.statusText} ${text}`);
  }
  return text ? JSON.parse(text) : null;
}

function splitPayloadByKeySet(payload) {
  const rows = Array.isArray(payload) ? payload : [payload];
  const groups = new Map();
  rows.forEach(row => {
    const keySet = Object.keys(row).sort().join(',');
    if (!groups.has(keySet)) {
      groups.set(keySet, []);
    }
    groups.get(keySet).push(row);
  });
  return Array.from(groups.values());
}

async function loadSocialSettingsRow() {
  if (firebaseEnabled && firebaseDb) {
    try {
      const snapshot = await firebaseDb.collection('settings').doc('social').get();
      if (snapshot.exists) {
        return { key: 'social', ...snapshot.data() };
      }
    } catch (error) {
      firebaseEnabled = false;
      console.warn('Firebase loadSocialSettingsRow failed:', error.message);
    }
  } else {
    console.warn('Skipping Firebase loadSocialSettingsRow: Firebase not enabled');
  }

  if (!supabaseClient) return null;

  try {
    const data = await directSupabaseRequest('settings?select=key,id,value&key=eq.social', 'GET');
    if (Array.isArray(data) && data.length > 0) {
      return data[0];
    }
  } catch (error) {
    console.warn(`Unable to load social settings row:`, error.message);
  }

  return null;
}

// --- Auth helpers exposed for pages (signup / login) ---
function showMessageElement(element, text, ok = false) {
  if (!element) return;
  element.style.display = 'block';
  element.style.color = ok ? '#0b6623' : '#ff6b6b';
  element.textContent = text;
}

async function directSupabaseAuthRequest(path, payload = {}, method = 'POST') {
  const url = `${SUPABASE_URL}/auth/v1/${path}`;
  const headers = {
    apikey: SUPABASE_PUBLIC_KEY,
    Authorization: `Bearer ${SUPABASE_PUBLIC_KEY}`,
    'Content-Type': 'application/json'
  };
  try {
    const response = await fetch(url, {
      method,
      headers,
      body: JSON.stringify(payload)
    });
    const text = await response.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch (e) { data = text; }
    if (!response.ok) {
      console.error('directSupabaseAuthRequest failed', { url, status: response.status, body: data });
      return { data: null, error: data || new Error(`Auth request failed ${response.status}`) };
    }
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

async function authSignUp({ name, phone, email, password }) {
  if (!supabaseClient) await initSupabaseClient();
  if (supabaseClient && supabaseClient.auth && typeof supabaseClient.auth.signUp === 'function') {
    return supabaseClient.auth.signUp({ email, password, options: { data: { full_name: name, phone } } });
  }

  console.info('Supabase auth client unavailable, using REST fallback for signup');
  return directSupabaseAuthRequest('signup', {
    email,
    password,
    options: {
      data: { full_name: name, phone }
    }
  });
}

async function authSignIn({ email, password }) {
  if (!supabaseClient) await initSupabaseClient();
  if (supabaseClient && supabaseClient.auth && typeof supabaseClient.auth.signInWithPassword === 'function') {
    return supabaseClient.auth.signInWithPassword({ email, password });
  }

  console.info('Supabase auth client unavailable, using REST fallback for signin');
  return directSupabaseAuthRequest('token?grant_type=password', { email, password });
}

async function upsertProfileRow(userId, fullName, phone, email) {
  if (!userId) {
    return { data: null, error: new Error('Missing user id for profile creation') };
  }
  const timestamp = new Date().toISOString();
  const candidates = [
    { user_id: userId, full_name: fullName, phone, email, created_at: timestamp },
    { id: userId, full_name: fullName, phone, email, created_at: timestamp }
  ];
  if (!supabaseClient) await initSupabaseClient();

  if (supabaseClient && typeof supabaseClient.from === 'function') {
    for (const profile of candidates) {
      try {
        const result = await supabaseClient.from('profiles').insert(profile).select().single();
        if (result && result.error) {
          console.warn('profiles insert returned error', result.error, profile);
          continue;
        }
        return { data: result.data || result, error: null };
      } catch (error) {
        console.warn('profiles insert failed via client', error?.message || error, profile);
      }
    }
  }

  for (const profile of candidates) {
    try {
      const res = await directSupabaseRequest('profiles', 'POST', profile);
      return { data: res, error: null };
    } catch (error) {
      console.error('profiles insert via REST failed', error?.message || error, profile);
      // continue to next candidate
    }
  }

  return { data: null, error: new Error('Failed to insert profile using any candidate key') };
}

function resolveUserIdFromAuthResult(data) {
  if (!data) return null;
  if (data.user?.id) return data.user.id;
  if (data.id) return data.id;
  if (data.user_id) return data.user_id;
  if (data.session?.user?.id) return data.session.user.id;
  if (data.data?.user?.id) return data.data.user.id;
  return null;
}

// Wire auth forms on register/login page to the functions above
async function initAuthPage() {
  try {
    await initSupabaseClient();
  } catch (e) {
    console.warn('initAuthPage: supabase init error', e.message);
  }

  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');
  const panelLogin = document.getElementById('panel-login');
  const panelRegister = document.getElementById('panel-register');
  function switchTab(to) {
    if (to === 'login') {
      tabLogin.classList.add('active'); tabRegister.classList.remove('active');
      panelLogin.classList.add('active'); panelRegister.classList.remove('active');
    } else {
      tabRegister.classList.add('active'); tabLogin.classList.remove('active');
      panelRegister.classList.add('active'); panelLogin.classList.remove('active');
    }
  }
  if (tabLogin && tabRegister) {
    tabLogin.addEventListener('click', () => switchTab('login'));
    tabRegister.addEventListener('click', () => switchTab('register'));
  }
  if (location.hash === '#login' || location.search.includes('tab=login')) switchTab('login');

  const registerForm = document.getElementById('register-form');
  const regMsg = document.getElementById('reg-msg');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (regMsg) regMsg.style.display = 'none';
      const name = document.getElementById('reg-name').value.trim();
      const phone = document.getElementById('reg-phone').value.trim();
      const email = document.getElementById('reg-email').value.trim();
      const password = document.getElementById('reg-password').value;
      const confirm = document.getElementById('reg-confirm').value;
      if (!name || !phone || !email || !password) return showMessageElement(regMsg, 'من فضلك أكمل جميع الحقول.');
      if (password !== confirm) return showMessageElement(regMsg, 'كلمتا المرور غير متطابقتين.');
      try {
        const { data, error } = await authSignUp({ name, phone, email, password });
        if (error) {
          console.error('Signup failed', error);
          return showMessageElement(regMsg, error.message || 'خطأ أثناء التسجيل.');
        }
        const userId = resolveUserIdFromAuthResult(data);
        if (!userId) {
          console.warn('Unable to resolve user id from signup result', data);
        } else {
          const profileResult = await upsertProfileRow(userId, name, phone, email);
          if (profileResult.error) {
            console.warn('Failed to create profile for user', userId, profileResult.error);
          } else {
            console.log('Profile row created or updated', profileResult.data);
          }
        }
        showMessageElement(regMsg, '✅ تم إنشاء الحساب. جاري التحويل.', true);
        setTimeout(() => window.location.href = 'index.html', 1400);
      } catch (err) {
        showMessageElement(regMsg, err.message || 'خطأ غير متوقع.');
      }
    });
  }

  const loginForm = document.getElementById('login-form');
  const loginMsg = document.getElementById('login-msg');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (loginMsg) loginMsg.style.display = 'none';
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;
      if (!email || !password) return showMessageElement(loginMsg, 'من فضلك املأ البريد و كلمة المرور.');
      try {
        const { error } = await authSignIn({ email, password });
        if (error) return showMessageElement(loginMsg, error.message || 'فشل تسجيل الدخول.');
        showMessageElement(loginMsg, '✅ تم تسجيل الدخول. جاري التوجيه...', true);
        setTimeout(() => window.location.href = 'index.html', 900);
      } catch (err) {
        showMessageElement(loginMsg, err.message || 'فشل تسجيل الدخول.');
      }
    });
  }
}

// Expose explicitly to avoid issues when script execution order differs
try {
  window.initAuthPage = initAuthPage;
} catch (e) {
  console.warn('Unable to attach initAuthPage to window', e?.message || e);
}

// expose to window
window.initAuthPage = initAuthPage;
window.authSignUp = authSignUp;
window.authSignIn = authSignIn;

async function loadSocialSettings() {
  const row = await loadSocialSettingsRow();
  if (!row) return null;
  if (row.data !== undefined) return row.data;
  if (row.value !== undefined) return row.value;
  const { key, id, ...rest } = row;
  return rest;
}

async function saveSocialSettings(social) {
  if (firebaseEnabled && firebaseDb) {
    try {
      await firebaseDb.collection('settings').doc('social').set({ value: social }, { merge: true });
      return true;
    } catch (error) {
      firebaseEnabled = false;
      console.warn('Firebase saveSocialSettings failed:', error.message);
    }
  } else {
    console.warn('Skipping Firebase saveSocialSettings: Firebase not enabled');
  }

  if (!supabaseClient) {
    console.error('Supabase client is not initialized for saveSocialSettings');
    return false;
  }

  const existing = await loadSocialSettingsRow();
  const payload = { value: social };

  try {
    if (existing) {
      await directSupabaseRequest('settings?key=eq.social', 'PATCH', payload);
      return true;
    }

    await directSupabaseRequest('settings', 'POST', { key: 'social', value: social });
    return true;
  } catch (error) {
    console.warn('Unable to save social settings via PATCH/POST:', error.message);
  }

  return false;
}

async function loadCollectionFromFirestore(collectionName, options = {}) {
  const selectColumns = options.select || '*';
  if (firebaseEnabled && firebaseDb) {
    try {
      console.log(`Attempting to load ${collectionName} from Firebase...`);
      const snapshot = await firebaseDb.collection(collectionName).get();
      const rows = [];
      snapshot.forEach(doc => rows.push(doc.data()));
      if (rows.length > 0) {
        return normalizeCollectionFromDb(collectionName, rows);
      }
      console.warn(`Firebase returned no rows for ${collectionName}, falling back to Supabase.`);
    } catch (error) {
      firebaseEnabled = false;
      console.warn('Firebase loadCollectionFromFirestore failed:', error.message);
    }
  } else {
    console.warn(`Skipping Firebase load for ${collectionName}: Firebase not enabled`);
  }

  if (!supabaseClient) {
    await initSupabaseClient();
  }
  if (!supabaseClient) {
    console.error('Supabase client is not initialized for loadCollectionFromFirestore');
    return [];
  }

  try {
    console.log(`Attempting to load ${collectionName} from Supabase...`);
    const isDescending = collectionName === 'products'; // Newest products first
    const query = supabaseClient
      .from(collectionName)
      .select(selectColumns);

    const queryWithOrder = typeof query.order === 'function'
      ? query.order('id', { ascending: !isDescending })
      : query;

    const result = await queryWithOrder;
    const data = result?.data ?? result;
    const error = result?.error || null;

    if (error) {
      console.error(`Error loading ${collectionName} from Supabase:`, error);
      throw error;
    }

    if (!Array.isArray(data)) {
      console.warn(`Supabase returned unexpected data for ${collectionName}, using REST fallback.`);
      const fallbackData = await directSupabaseRequest(`${collectionName}?select=*`, 'GET');
      return normalizeCollectionFromDb(collectionName, Array.isArray(fallbackData) ? fallbackData : []);
    }

    if (data.length === 0) {
      console.warn(`No rows returned for ${collectionName} from Supabase; trying direct REST fallback.`);
      const fallbackData = await directSupabaseRequest(`${collectionName}?select=*`, 'GET');
      return normalizeCollectionFromDb(collectionName, Array.isArray(fallbackData) ? fallbackData : []);
    }

    console.log(`Loaded ${data.length} rows for ${collectionName} from Supabase.`);
    return normalizeCollectionFromDb(collectionName, data);
  } catch (error) {
    console.error(`Exception loading ${collectionName} from Supabase:`, error);
    try {
      const fallbackData = await directSupabaseRequest(`${collectionName}?select=*`, 'GET');
      console.log(`Loaded ${Array.isArray(fallbackData) ? fallbackData.length : 0} rows for ${collectionName} from Supabase REST fallback.`);
      return normalizeCollectionFromDb(collectionName, Array.isArray(fallbackData) ? fallbackData : []);
    } catch (fallbackError) {
      console.error(`Supabase REST fallback failed for ${collectionName}:`, fallbackError);
      return [];
    }
  }
}

// Load a limited product preview (only necessary columns) to speed initial rendering
async function loadProductsPreview(limit = 200) {
  if (!supabaseClient) await initSupabaseClient();
  if (!supabaseClient) return [];
  try {
    const cols = 'id,name,price,img,category,available,discount,original_price';
    const query = supabaseClient.from('products').select(cols).order('id', { ascending: false }).limit(limit);
    const result = await query;
    const data = result?.data ?? result;
    if (!Array.isArray(data)) return [];
    const products = normalizeCollectionFromDb('products', data);
    console.log('loadProductsPreview loaded', products.length, 'products');
    return products;
  } catch (err) {
    console.warn('loadProductsPreview failed, falling back to REST/collection load:', err?.message || err);
    try {
      const restData = await directSupabaseRequest('products?select=id,name,price,img,category,available,discount,original_price', 'GET');
      if (Array.isArray(restData)) {
        console.log('loadProductsPreview REST fallback loaded', restData.length, 'products');
        return normalizeCollectionFromDb('products', restData);
      }
    } catch (restError) {
      console.warn('loadProductsPreview REST fallback failed:', restError?.message || restError);
    }
    return await loadCollectionFromFirestore('products');
  }
}

async function loadCategoriesPreview() {
  if (!supabaseClient) await initSupabaseClient();
  if (!supabaseClient) return [];
  try {
    const result = await supabaseClient.from('categories').select('id,name,img');
    const data = result?.data ?? result;
    if (Array.isArray(data)) {
      console.log('loadCategoriesPreview loaded', data.length, 'categories');
      return normalizeCollectionFromDb('categories', data);
    }
  } catch (err) {
    console.warn('loadCategoriesPreview failed, falling back to REST:', err?.message || err);
  }
  try {
    const restData = await directSupabaseRequest('categories?select=id,name,img', 'GET');
    if (Array.isArray(restData)) {
      console.log('loadCategoriesPreview REST fallback loaded', restData.length, 'categories');
      return normalizeCollectionFromDb('categories', restData);
    }
  } catch (restError) {
    console.warn('loadCategoriesPreview REST fallback failed:', restError?.message || restError);
  }
  return [];
}

async function loadAllProducts() {
  if (!supabaseClient) await initSupabaseClient();
  if (!supabaseClient) return [];
  try {
    const result = await supabaseClient.from('products').select('*').order('id', { ascending: false });
    const data = result?.data ?? result;
    if (!Array.isArray(data)) return [];
    const products = normalizeCollectionFromDb('products', data);
    console.log('loadAllProducts loaded', products.length, 'products');
    return products;
  } catch (err) {
    console.warn('loadAllProducts failed, falling back to REST/collection load:', err?.message || err);
    try {
      const restData = await directSupabaseRequest('products?select=*', 'GET');
      if (Array.isArray(restData)) {
        console.log('loadAllProducts REST fallback loaded', restData.length, 'products');
        return normalizeCollectionFromDb('products', restData);
      }
    } catch (restError) {
      console.warn('loadAllProducts REST fallback failed:', restError?.message || restError);
    }
    return await loadCollectionFromFirestore('products');
  }
}

// Load orders filtered for current authenticated user (by id or email). Returns [] if no user.
async function loadOrdersForCurrentUser() {
  if (!window.currentAuthUser) return [];
  const user = window.currentAuthUser;
  const email = (user.email || '').toLowerCase().trim();
  const userId = user.id || null;
  const columns = 'id,order_number,customer,phone,governorate,address,payment,notes,coupon,coupon_discount,shipping_cost,items,total,created_at,status,user_id,user_email,date';

  const buildOrderQuery = (filter) => {
    let path = `orders?select=${columns}`;
    if (filter) path += `&${filter}`;
    path += '&order=id.desc&limit=500';
    return path;
  };

  if (!supabaseClient) await initSupabaseClient();
  if (!supabaseClient) return [];

  try {
    let data = null;
    if (userId || email) {
      const encodedEmail = encodeURIComponent(email);
      const queries = [];
      if (userId && email) {
        const orQuery = `or=(user_id.eq.${userId},user_email.eq.${encodedEmail})`;
        queries.push(orQuery);
      }
      if (userId) {
        queries.push(`user_id=eq.${userId}`);
      }
      if (email) {
        queries.push(`user_email=eq.${encodedEmail}`);
      }

      for (const filterQuery of queries) {
        try {
          const path = buildOrderQuery(filterQuery);
          data = await directSupabaseRequest(path, 'GET');
          if (Array.isArray(data) && data.length > 0) {
            return normalizeCollectionFromDb('orders', data);
          }
        } catch (queryError) {
          console.warn('loadOrdersForCurrentUser query failed:', queryError?.message || queryError);
        }
      }
    }

    console.warn('loadOrdersForCurrentUser: user-specific query returned 0 rows or failed, using full orders fallback');
    const allOrders = await loadCollectionFromFirestore('orders');
    if (!Array.isArray(allOrders) || allOrders.length === 0) {
      return [];
    }

    const filtered = allOrders.filter(order => {
      const orderUserId = order.user_id || null;
      const orderEmail = String(order.user_email || '').toLowerCase().trim();
      const orderEmailFallback = String(order.customer || '').toLowerCase().trim();
      if (userId && orderUserId && String(userId) === String(orderUserId)) return true;
      if (email && orderEmail && email === orderEmail) return true;
      if (email && orderEmailFallback.includes(email)) return true;
      return false;
    });
    return filtered;
  } catch (err) {
    console.warn('loadOrdersForCurrentUser failed, returning no orders:', err?.message || err);
    return [];
  }
}

async function refreshOrdersForCurrentUser() {
  if (!window.currentAuthUser) return [];
  const orders = await loadOrdersForCurrentUser();
  if (Array.isArray(orders)) {
    state.orders = orders;
    normalizeOrderNumbers();
    renderOrders();
    renderUserOrders();
    orderCount.textContent = state.orders.length;
    adminOrderBadge.textContent = state.orders.length;
  }
  return orders;
}

async function saveCollectionToFirestore(collectionName, items) {
  if (!Array.isArray(items) || items.length === 0) return;
  if (firebaseEnabled && firebaseDb) {
    try {
      const payload = mapCollectionToDb(collectionName, items);
      const batch = firebaseDb.batch();
      payload.forEach(item => {
        const docRef = firebaseDb.collection(collectionName).doc(String(item.id));
        batch.set(docRef, item, { merge: true });
      });
      await batch.commit();
      console.log(`Successfully saved ${collectionName} to Firebase`);
      // Also attempt to persist to Supabase so the Postgres tables stay in sync.
      try {
        if (!supabaseClient) await initSupabaseClient();
        if (supabaseClient && typeof supabaseClient.from === 'function') {
          const payload = mapCollectionToDb(collectionName, items);
          const upsertOp = supabaseClient.from(collectionName).upsert(payload, { onConflict: 'id' });
          if (typeof upsertOp.select === 'function') {
            await upsertOp.select();
          } else if (typeof upsertOp.then === 'function') {
            await new Promise((resolve, reject) => upsertOp.then(resolve, reject).catch(reject));
          }
          console.log(`Also saved ${collectionName} to Supabase after Firebase commit`);
        } else {
          console.warn('Supabase client unavailable; skipped syncing Firebase -> Supabase');
        }
      } catch (err) {
        console.warn('Failed to sync Firebase -> Supabase for', collectionName, err?.message || err);
      }
    } catch (error) {
      firebaseEnabled = false;
      console.warn('Firebase saveCollectionToFirestore failed:', error.message);
    }
  } else {
    console.warn(`Skipping Firebase saveCollectionToFirestore for ${collectionName}: Firebase not enabled`);
  }
  if (!supabaseClient) {
    await initSupabaseClient();
  }
  if (!supabaseClient) {
    console.error('Supabase client is not initialized for saveCollectionToFirestore');
    return;
  }
  try {
    console.log(`Falling back to Supabase for ${collectionName}`);
    let payload = mapCollectionToDb(collectionName, items);

    // Sanitize client-generated IDs for orders: many client IDs are Date.now() timestamps
    // which collide with DB primary keys. Treat very large positive numbers as local IDs
    // and remove them so the DB can assign an ID.
    if (collectionName === 'orders') {
      payload = payload.map(row => {
        const copy = { ...row };
        if (typeof copy.id === 'number' && copy.id > 1e11) {
          delete copy.id;
        }
        return copy;
      });
    }

    let result;
    let saveError = null;

    if (supabaseClient && typeof supabaseClient.from === 'function') {
      try {
        const upsertOp = supabaseClient
          .from(collectionName)
          .upsert(payload, { onConflict: 'id' });

        if (typeof upsertOp.select === 'function') {
          result = await upsertOp.select();
        } else if (typeof upsertOp.then === 'function') {
          result = await new Promise((resolve, reject) => upsertOp.then(resolve, reject).catch(reject));
        } else {
          result = await upsertOp;
        }

        saveError = result?.error || null;
        if (!saveError) {
          console.log(`Successfully saved ${collectionName} to Supabase`);
          if (collectionName === 'categories') {
            try {
              state.categories = await loadCollectionFromFirestore('categories');
              renderCategories();
              renderCategoryPreview();
              populateCategorySelect();
            } catch (reloadError) {
              console.warn('Failed to reload categories after saving:', reloadError?.message || reloadError);
            }
          }
          return;
        }
      } catch (error) {
        saveError = error;
        console.warn(`Supabase client upsert failed for ${collectionName}, trying REST fallback:`, error?.message || error);
      }
    }

    try {
      const payloadGroups = splitPayloadByKeySet(payload);
      for (const group of payloadGroups) {
        // For REST fallback, ensure we don't send large client-generated ids that will
        // conflict with Postgres primary key. Detect and remove them for orders.
        if (collectionName === 'orders') {
          for (const r of group) {
            if (typeof r.id === 'number' && r.id > 1e11) delete r.id;
          }
        }
        const groupHasId = group.length > 0 && Object.prototype.hasOwnProperty.call(group[0], 'id');
        const url = groupHasId ? `${collectionName}?on_conflict=id` : collectionName;
        try {
          const restResult = await directSupabaseRequest(
            url,
            'POST',
            group,
            groupHasId ? { Prefer: 'return=representation,resolution=merge-duplicates' } : undefined
          );
          console.log(`Successfully saved ${collectionName} to Supabase via REST fallback`, restResult);
        } catch (groupError) {
          const message = String(groupError.message || '');
          if (collectionName === 'orders' && (message.includes("Could not find the 'user_email' column") || message.includes("Could not find the 'user_id' column") || message.includes('column "user_email"') || message.includes('column "user_id"'))) {
            console.error('Supabase orders table is missing required user_id/user_email columns. Without these columns, orders cannot be matched to users across devices.');
            throw new Error('Orders save failed because orders.user_id or orders.user_email column is missing in Supabase schema.');
          }
          throw groupError;
        }
      }
      if (collectionName === 'categories') {
        try {
          state.categories = await loadCollectionFromFirestore('categories');
          renderCategories();
          renderCategoryPreview();
          populateCategorySelect();
        } catch (reloadError) {
          console.warn('Failed to reload categories after saving:', reloadError?.message || reloadError);
        }
      }
      return;
    } catch (restError) {
      console.error(`Error saving ${collectionName} to Supabase via REST fallback:`, restError);
      if (saveError) {
        console.error(`Original Supabase client error:`, saveError);
      }
    }
  } catch (error) {
    console.error(`Error saving ${collectionName} to Supabase:`, error);
  }
}

// Delete a single item from remote stores (Firebase + Supabase/REST fallback)
async function deleteRemoteItem(collectionName, id) {
  if (!id) return;
  // Firebase delete
  if (firebaseEnabled && firebaseDb) {
    try {
      const docRef = firebaseDb.collection(collectionName).doc(String(id));
      await docRef.delete();
      console.log(`Deleted ${collectionName}/${id} from Firebase`);
    } catch (err) {
      console.warn(`Firebase delete failed for ${collectionName}/${id}:`, err?.message || err);
    }
  }

  // Supabase client delete (or REST fallback)
  try {
    if (!supabaseClient) await initSupabaseClient();
  } catch (e) {
    // initSupabaseClient may fail silently; continue to REST fallback
  }

  if (supabaseClient && typeof supabaseClient.from === 'function') {
    const collection = supabaseClient.from(collectionName);
    if (collection && typeof collection.delete === 'function') {
      try {
        const del = await collection.delete().eq('id', id);
        if (del.error) {
          console.warn(`Supabase delete returned error for ${collectionName}/${id}:`, del.error);
        } else {
          console.log(`Deleted ${collectionName}/${id} from Supabase`);
        }
      } catch (err) {
        console.warn(`Supabase delete failed for ${collectionName}/${id}:`, err?.message || err);
      }
    } else {
      // Supabase client does not support delete() in this runtime, use REST fallback.
      try {
        await directSupabaseRequest(`${collectionName}?id=eq.${encodeURIComponent(id)}`, 'DELETE');
        console.log(`Deleted ${collectionName}/${id} via Supabase REST fallback`);
      } catch (err) {
        console.warn(`REST fallback delete failed for ${collectionName}/${id}:`, err?.message || err);
      }
    }
  } else {
    // REST fallback: DELETE /rest/v1/{collection}?id=eq.{id}
    try {
      await directSupabaseRequest(`${collectionName}?id=eq.${encodeURIComponent(id)}`, 'DELETE');
      console.log(`Deleted ${collectionName}/${id} via Supabase REST fallback`);
    } catch (err) {
      console.warn(`REST fallback delete failed for ${collectionName}/${id}:`, err?.message || err);
    }
  }
}

function setSection(sectionKey) {
  Object.values(sections).forEach(sec => sec.classList.add('hidden'));
  sections[sectionKey].classList.remove('hidden');
}

function updateNavActive(hash) {
  navLinks.forEach(link => {
    link.classList.toggle('active', link.dataset.link === hash);
  });
}

function handleHashChange() {
  const hash = window.location.hash.replace('#', '') || 'home';
  if (hash === 'admin' && !state.admin.authenticated) {
    setSection('admin');
    return;
  }
  if (hash.startsWith('category/')) {
    const categoryName = decodeURIComponent(hash.split('/')[1] || '');
    if (!categoryName) {
      window.location.hash = '#home';
      return;
    }
    renderCategoryPage(categoryName);
    setSection('category');
    updateNavActive('');
    return;
  }
  if (hash.startsWith('product?id=')) {
    const productId = parseInt(hash.split('?id=')[1]);
    if (!productId || !state.products.find(p => p.id === productId)) {
      window.location.hash = '#products';
      return;
    }
    renderProductDetail(productId);
    setSection('product-detail');
    updateNavActive('');
    return;
  }
  if (!sections[hash]) {
    window.location.hash = '#home';
    return;
  }
  setSection(hash);
  updateNavActive(hash);
  if (hash === 'checkout') buildSummary();
}

function formatPrice(value) {
  return `${value.toLocaleString('en-US')} EGP`;
}

function getNextOrderNumber() {
  const existingNumbers = state.orders
    .map(order => Number(order.orderNumber))
    .filter(num => !Number.isNaN(num));
  return existingNumbers.length ? Math.max(...existingNumbers) + 1 : 1000;
}

function generateOrderNumber() {
  // Prefer a persistent counter in localStorage to avoid duplicate client-side numbers
  try {
    const nextFromState = getNextOrderNumber();
    const stored = Number(localStorage.getItem('nextOrderNumber')) || 0;
    // pick the highest candidate to avoid collisions, but never below 1000
    const candidateFromTime = Math.floor(Date.now() / 1000) % 1000000000;
    const candidate = Math.max(nextFromState, stored, candidateFromTime, 1000);
    // store the following number for next time
    localStorage.setItem('nextOrderNumber', String(candidate + 1));
    return candidate;
  } catch (e) {
    // if localStorage is not available, fall back to previous logic
    const next = getNextOrderNumber();
    if (next > 1000) return next;
    const candidate = Math.floor(Date.now() / 1000) % 1000000000;
    return Math.max(next, candidate, 1000);
  }
}

function normalizeOrderNumbers() {
  const orderNumbers = state.orders
    .map(order => Number(order.orderNumber))
    .filter(num => !Number.isNaN(num));
  let nextNumber = orderNumbers.length ? Math.max(...orderNumbers) + 1 : 1000;

  if (!orderNumbers.length) {
    state.orders = [...state.orders].reverse().map(order => {
      const currentValue = Number(order.orderNumber);
      if (!Number.isNaN(currentValue)) return { ...order, orderNumber: currentValue };
      return { ...order, orderNumber: nextNumber++ };
    }).reverse();
    try { localStorage.setItem('nextOrderNumber', String(nextNumber)); } catch (e) {}
    return;
  }

  state.orders = state.orders.map(order => {
    const existingValue = Number(order.orderNumber);
    if (!Number.isNaN(existingValue)) {
      return { ...order, orderNumber: existingValue };
    }
    const updatedOrder = { ...order, orderNumber: nextNumber };
    nextNumber++;
    return updatedOrder;
  });
  try { localStorage.setItem('nextOrderNumber', String(nextNumber)); } catch (e) {}
}

function getProductCardFooter(product, stopPropagation = false) {
  const isAvailable = product.available !== false;
  if (!isAvailable) {
    return `<span class="unavailable-tag">غير متوفر الآن</span>`;
  }
  const priceDisplay = product.discount ? `${formatPrice(product.price)} <del style="color: var(--text-muted); font-size: 0.9em;">${formatPrice(product.originalPrice)}</del>` : formatPrice(product.price);
  const clickCode = stopPropagation ? 'event.stopPropagation(); ' : '';
  return `<span class="price-tag">${priceDisplay}</span><button class="btn" onclick="${clickCode}addToCart(${product.id})">أضف للسلة</button>`;
}

function renderProducts() {
  if (!productGrid) return;
  productGrid.innerHTML = state.products.map(product => {
    const cardFooter = getProductCardFooter(product, true);
    return `
    <article class="product-card" onclick="window.location.hash='#product?id=${product.id}'">
      <img src="${product.img}" alt="${product.name}" loading="lazy">
      <div class="product-body">
        <h3>${product.name}</h3>
        <p class="product-category">${product.category}</p>
        <div class="product-meta">
          ${cardFooter}
        </div>
      </div>
    </article>
  `}).join('');
  renderLatestProducts();
  renderDiscountedProducts();
  renderCategories();
  renderPickedProducts();
}

function renderLatestProducts() {
  if (!latestProductsGrid) return;
  const availableProducts = state.products.filter(product => product.available !== false);
  const latest = availableProducts.slice(0, 8);
  latestProductsGrid.innerHTML = latest.map(product => {
    const cardFooter = getProductCardFooter(product, true);
    return `
    <article class="product-card" onclick="window.location.hash='#product?id=${product.id}'">
      <img src="${product.img}" alt="${product.name}" loading="lazy">
      <div class="product-body">
        <h3>${product.name}</h3>
        <p class="product-category">${product.category}</p>
        <div class="product-meta">
          ${cardFooter}
        </div>
      </div>
    </article>
  `}).join('');
}

function renderPickedProducts() {
  if (!pickedProductsGrid) return;
  const availableProducts = state.products.filter(product => product.available !== false);
  const shuffled = [...availableProducts].sort(() => Math.random() - 0.5);
  const picked = shuffled.slice(0, 4);
  pickedProductsGrid.innerHTML = picked.map(product => {
    const cardFooter = getProductCardFooter(product, true);
    return `
    <article class="product-card" onclick="window.location.hash='#product?id=${product.id}'">
      <img src="${product.img}" alt="${product.name}" loading="lazy">
      <div class="product-body">
        <h3>${product.name}</h3>
        <p class="product-category">${product.category}</p>
        <div class="product-meta">
          ${cardFooter}
        </div>
      </div>
    </article>
  `}).join('');
}

function renderCategories() {
  if (!categorySlider) return;
  categorySlider.innerHTML = state.categories.length ? `
    <div class="categories-gallery">
      ${state.categories.map(category => `
        <div class="category-item" onclick="window.location.hash='#category/${encodeURIComponent(category.name)}'">
          <div class="gallery-thumb category-thumb">
            <img src="${category.img}" alt="${category.name}" loading="lazy">
          </div>
          <h4>${category.name}</h4>
        </div>
      `).join('')}
    </div>
  ` : '<p class="card-detail" style="grid-column: 1 / -1; text-align:center;">لم تتم إضافة فئات بعد.</p>';
}

function renderCategoryPage(categoryName) {
  if (!categoryPageTitle || !categoryPageDescription || !categoryProductsGrid) return;
  const categoryProducts = state.products.filter(product => product.category === categoryName && product.available !== false);
  categoryPageTitle.textContent = categoryName;
  categoryPageDescription.textContent = `كل المنتجات الموجودة في فئة ${categoryName}.`;
  categoryProductsGrid.innerHTML = categoryProducts.length ? categoryProducts.map(product => {
    const cardFooter = getProductCardFooter(product, true);
    return `
      <article class="product-card" onclick="window.location.hash='#product?id=${product.id}'">
        <img src="${product.img}" alt="${product.name}" loading="lazy">
        <div class="product-body">
          <h3>${product.name}</h3>
          <p class="product-category">${product.category}</p>
          <div class="product-meta">
            ${cardFooter}
          </div>
        </div>
      </article>
    `;
  }).join('') : '<p class="card-detail" style="grid-column: 1 / -1; text-align:center;">لا توجد منتجات في هذه الفئة بعد.</p>';
}

function renderProductDetail(productId) {
  const product = state.products.find(p => p.id === productId);
  if (!product) return;

  const productDetailTitle = document.getElementById('product-detail-title');
  const productDetailCategory = document.getElementById('product-detail-category');
  const productDetailContent = document.getElementById('product-detail-content');
  if (!productDetailContent || !productDetailTitle || !productDetailCategory) return;

  productDetailTitle.textContent = product.name;
  productDetailCategory.textContent = product.category;

  const priceDisplay = product.discount ? `${formatPrice(product.price)} <del style="color: var(--text-muted); font-size: 0.9em;">${formatPrice(product.originalPrice)}</del>` : formatPrice(product.price);
  const isAvailable = product.available !== false;
  const productPriceSection = isAvailable ? `<span class="price-tag">${priceDisplay}</span>` : `<span class="unavailable-tag unavailable-detail">غير متوفر الآن</span>`;
  const productQuantitySection = isAvailable ? `
        <div class="quantity-controls">
          <button class="quantity-btn" onclick="updateQuantity(-1)">-</button>
          <span id="product-quantity">1</span>
          <button class="quantity-btn" onclick="updateQuantity(1)">+</button>
        </div>
        <div class="product-actions">
          <button class="btn" onclick="addToCartFromDetail(${product.id})">أضف للسلة</button>
          <button class="secondary-btn" onclick="buyNow(${product.id})">اشتري الآن</button>
        </div>
      ` : '';

  const galleryImages = product.gallery && product.gallery.length ? product.gallery : [product.img];
  // prepare selected options state for this detail view
  window.currentDetailSelectedOptions = [];

  productDetailContent.innerHTML = `
    <div class="product-detail-main">
      <div class="product-detail-images">
        <div class="product-main-image">
          <img id="main-product-image" src="${galleryImages[0]}" alt="${product.name}">
        </div>
        <div class="product-gallery">
          ${galleryImages.map((img, index) => `
            <div class="gallery-thumb" onclick="changeMainImage('${img}')">
              <img src="${img}" alt="صورة ${index + 1}">
            </div>
          `).join('')}
        </div>
        ${Array.isArray(product.options) && product.options.length ? `
          <div class="product-options" id="product-options-${product.id}">
            ${product.options.map(opt => `
              <div class="product-option" data-option="${escapeHtml(opt)}" onclick="toggleDetailOption('${escapeJs(opt)}', ${product.id})">
                <span class="option-dot"></span>
                <span class="option-label">${escapeHtml(opt)}</span>
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>
      <div class="product-detail-info">
        <h3>${product.name}</h3>
        <p class="product-category">${product.category}</p>
        <div class="product-price">
          ${productPriceSection}
        </div>
        ${productQuantitySection}
        <div class="product-description">
          <h4>وصف المنتج</h4>
          <p>${product.desc}</p>
        </div>
      </div>
    </div>
  `;
}

function escapeHtml(str) {
  if (!str && str !== 0) return '';
  return String(str).replace(/[&<>\"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[s]);
}

function escapeJs(str) {
  if (!str && str !== 0) return '';
  return String(str).replace(/\\/g,'\\\\').replace(/'/g, "\\'");
}

function toggleDetailOption(option, productId) {
  const sel = window.currentDetailSelectedOptions || [];
  const idx = sel.indexOf(option);
  if (idx === -1) sel.push(option);
  else sel.splice(idx,1);
  window.currentDetailSelectedOptions = sel;
  // update UI active class
  const container = document.getElementById(`product-options-${productId}`);
  if (!container) return;
  Array.from(container.querySelectorAll('.product-option')).forEach(el => {
    const opt = el.getAttribute('data-option');
    if (sel.indexOf(opt) !== -1) el.classList.add('active'); else el.classList.remove('active');
  });
}

function changeMainImage(src) {
  document.getElementById('main-product-image').src = src;
}

function updateQuantity(delta) {
  const quantityEl = document.getElementById('product-quantity');
  let quantity = parseInt(quantityEl.textContent) + delta;
  if (quantity < 1) quantity = 1;
  quantityEl.textContent = quantity;
}

function addToCartFromDetail(productId) {
  const quantity = parseInt(document.getElementById('product-quantity').textContent);
  const product = state.products.find(p => p.id === productId);
  if (!product || product.available === false) {
    alert('المنتج غير متوفر الآن');
    return;
  }
  const selectedOptions = window.currentDetailSelectedOptions ? [...window.currentDetailSelectedOptions] : [];
  for (let i = 0; i < quantity; i++) {
    addToCart(productId, selectedOptions);
  }
  alert(`✅ تم إضافة ${quantity} من ${product.name} للسلة` + (selectedOptions.length ? `\nالخيار/الخيارات: ${selectedOptions.join(', ')}` : ''));
}

function buyNow(productId) {
  addToCartFromDetail(productId);
  window.location.hash = '#checkout';
}

function renderCategoryPreview() {
  const preview = document.getElementById('category-preview-list');
  if (!preview) return;
  preview.innerHTML = state.categories.length ? state.categories.map(category => `
    <article class="admin-card category-admin-card">
      <div class="admin-body">
        <div class="category-thumb category-thumb-small">
          <img src="${category.img}" alt="${category.name}" loading="lazy">
        </div>
        <h3>${category.name}</h3>
        <div class="summary-row" style="margin-top: 16px; gap: 8px; flex-wrap: wrap;">
          <button class="secondary-btn" type="button" onclick="editCategory(${category.id})">تعديل</button>
          <button class="secondary-btn" type="button" onclick="deleteCategory(${category.id})">حذف</button>
        </div>
      </div>
    </article>
  `).join('') : '<p class="card-detail" style="grid-column: 1 / -1; text-align:center;">لم تتم إضافة فئات بعد.</p>';
}

function resetCategoryForm() {
  categoryEditId = null;
  document.getElementById('category-form-title').textContent = 'إضافة فئة جديدة';
  document.getElementById('category-submit-btn').textContent = 'إضافة فئة';
  document.getElementById('category-name').value = '';
  document.getElementById('category-img-input').value = '';
}

async function saveCategories() {
  try {
    await saveCollectionToFirestore('categories', state.categories);
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      alert('حجم البيانات كبير جداً. جاري حفظ الفئات بدون الصور لتوفير المساحة.');
      const categoriesWithoutImages = state.categories.map(cat => ({ ...cat, img: null }));
      await saveCollectionToFirestore('categories', categoriesWithoutImages);
    } else {
      console.error('خطأ أثناء حفظ الفئات:', e);
      throw e;
    }
  }
}

async function addOrUpdateCategory(event) {
  event.preventDefault();
  const name = document.getElementById('category-name').value.trim();
  const fileInput = document.getElementById('category-img-input');
  const file = fileInput.files[0];
  if (!name) return;

  const applyCategoryUpdate = async (imageData) => {
    if (categoryEditId) {
      const category = state.categories.find(item => item.id === categoryEditId);
      if (!category) return;
      category.name = name;
      if (imageData) category.img = imageData;
      await saveCategories();
      renderCategories();
      renderCategoryPreview();
      resetCategoryForm();
      alert('تم تحديث الفئة بنجاح!');
      return;
    }

    if (!imageData) {
      imageData = 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=400&q=80';
    }

    state.categories.unshift({ id: -Date.now(), name, img: imageData });
    await saveCategories();
    renderCategories();
    renderCategoryPreview();
    resetCategoryForm();
    alert('تم إضافة الفئة بنجاح!');
  };

  if (file) {
    await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = async () => {
          try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const maxWidth = 200;
            const maxHeight = 200;
            let { width, height } = img;

            if (width > height) {
              if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
              }
            } else {
              if (height > maxHeight) {
                width = (width * maxHeight) / height;
                height = maxHeight;
              }
            }

            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            const compressedData = canvas.toDataURL('image/jpeg', 0.7);
            await applyCategoryUpdate(compressedData);
            resolve();
          } catch (error) {
            reject(error);
          }
        };
        img.onerror = reject;
        img.src = reader.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  } else {
    await applyCategoryUpdate(null);
  }
}

function editCategory(id) {
  const category = state.categories.find(item => item.id === id);
  if (!category) return;
  categoryEditId = id;
  document.getElementById('category-form-title').textContent = 'تعديل الفئة';
  document.getElementById('category-submit-btn').textContent = 'تحديث الفئة';
  document.getElementById('category-name').value = category.name;
}

async function deleteCategory(id) {
  const category = state.categories.find(item => item.id === id);
  if (!category) return;
  if (!confirm(`متأكد إنك عايز تحذف الفئة ${category.name}?`)) return;
  // Remove locally first so the UI updates immediately.
  state.categories = state.categories.filter(item => item.id !== id);
  // Delete the removed category from remote storage before re-saving the remaining list.
  try {
    await deleteRemoteItem('categories', id);
  } catch (err) {
    console.warn('deleteCategory: remote deletion failed', err?.message || err);
  }
  // Persist the current categories list.
  await saveCategories();
  renderCategories();
  renderCategoryPreview();
}

function populateCategorySelect() {
  const select = document.getElementById('new-category');
  if (!select) return;
  select.innerHTML = '<option value="">اختر الفئة</option>';
  state.categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category.name;
    option.textContent = category.name;
    select.appendChild(option);
  });
}

function previewMainImage(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    mainImageData = reader.result;
    const preview = document.getElementById('main-image-preview');
    preview.innerHTML = `
      <img src="${mainImageData}" alt="الصورة الرئيسية">
      <button type="button" class="delete-btn" onclick="removeMainImage()">×</button>
    `;
  };
  reader.readAsDataURL(file);
}

function removeMainImage() {
  mainImageData = null;
  document.getElementById('new-main-image').value = '';
  document.getElementById('main-image-preview').innerHTML = '';
}

function previewGalleryImages(event) {
  const files = Array.from(event.target.files);
  galleryImagesData = [];
  const preview = document.getElementById('gallery-images-preview');
  preview.innerHTML = '';

  files.forEach((file, index) => {
    const reader = new FileReader();
    reader.onload = () => {
      galleryImagesData.push(reader.result);
      const item = document.createElement('div');
      item.className = 'image-item';
      item.innerHTML = `
        <img src="${reader.result}" alt="صورة المعرض ${index + 1}">
        <button type="button" class="delete-btn" onclick="removeGalleryImage(${index})">×</button>
      `;
      preview.appendChild(item);
    };
    reader.readAsDataURL(file);
  });
}

function removeGalleryImage(index) {
  galleryImagesData.splice(index, 1);
  const preview = document.getElementById('gallery-images-preview');
  preview.innerHTML = '';
  galleryImagesData.forEach((imgData, i) => {
    const item = document.createElement('div');
    item.className = 'image-item';
    item.innerHTML = `
      <img src="${imgData}" alt="صورة المعرض ${i + 1}">
      <button type="button" class="delete-btn" onclick="removeGalleryImage(${i})">×</button>
    `;
    preview.appendChild(item);
  });
  // Update file input to reflect removed images
  const input = document.getElementById('new-gallery-images');
  const dt = new DataTransfer();
  // Since we can't easily map back to original files, we'll just clear the input
  input.value = '';
}

function renderReviewImages() {
  if (!reviewImagesGrid) return;
  const reviews = [...state.reviewImages].sort(() => Math.random() - 0.5).slice(0, 4);
  reviewImagesGrid.innerHTML = reviews.length ? reviews.map(image => `
    <article class="review-card">
      <img src="${image}" alt="صورة رأي عميل" loading="lazy">
    </article>
  `).join('') : '<p class="card-detail" style="grid-column: 1 / -1; text-align:center;">لم يتم إضافة صور بعد.</p>';
}

function renderReviewImagesPreview() {
  if (!reviewImagesPreview) return;
  reviewImagesPreview.innerHTML = state.reviewImages.length ? state.reviewImages.map((image, index) => `
    <article class="review-card review-card-preview">
      <img src="${image}" alt="صورة رأي عميل" loading="lazy">
      <button type="button" class="review-delete-btn" onclick="deleteReviewImage(${index})">حذف</button>
    </article>
  `).join('') : '<p class="card-detail" style="grid-column: 1 / -1; text-align:center;">لم يتم إضافة صور بعد.</p>';
}

function deleteReviewImage(index) {
  state.reviewImages.splice(index, 1);
  saveToFirestore('settings', 'review_images', { images: state.reviewImages });
  renderReviewImages();
  renderReviewImagesPreview();
}

function addReviewImage(event) {
  event.preventDefault();
  const input = document.getElementById('review-image-input');
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    state.reviewImages.unshift(reader.result);
    saveToFirestore('settings', 'review_images', { images: state.reviewImages });
    renderReviewImages();
    renderReviewImagesPreview();
    input.value = '';
    alert('تم إضافة صورة رأي العميل بنجاح!');
  };
  reader.readAsDataURL(file);
}

function previewSliderImages(event) {
  const files = Array.from(event.target.files || []);
  if (!files.length) return;
  const preview = sliderImagesPreview;
  if (!preview) return;

  files.forEach((file) => {
    const reader = new FileReader();
    reader.onload = () => {
      state.sliderImages.unshift({ src: reader.result, selected: true });
      saveSliderImages();
      renderSliderImages();
    };
    reader.readAsDataURL(file);
  });
  event.target.value = '';
}

function renderSliderImages() {
  if (!sliderImagesPreview) return;
  const normalizedImages = state.sliderImages.map(normalizeSliderImage).filter(Boolean);
  state.sliderImages = normalizedImages;
  let html = '';
  // Add-card for uploading
  html += `<article class="slider-image-add" onclick="openSliderImagePicker()" role="button" aria-label="أضف صورة للسلايدر"><div class="slider-add-inner">+</div></article>`;
  if (normalizedImages.length) {
    html += normalizedImages.map((image, index) => `
      <article class="slider-image-card ${image.selected ? 'selected' : ''}">
        <button type="button" class="slider-image-select ${image.selected ? 'active' : ''}" onclick="toggleSliderImageSelection(${index})" aria-label="اختيار الصورة"></button>
        <button type="button" class="slider-image-delete" onclick="removeSliderImage(${index})" aria-label="حذف الصورة">×</button>
        <img src="${image.src}" alt="صورة السلايدر ${index + 1}" loading="lazy">
      </article>
    `).join('');
  } else {
    html += `<p class="card-detail" style="grid-column: 1 / -1; text-align:center;">لم تتم إضافة صور للسلايدر بعد.</p>`;
  }
  sliderImagesPreview.innerHTML = html;
  renderHomeSlider();
}

function openSliderImagePicker() {
  const input = document.getElementById('slider-image-input');
  if (input) input.click();
}

function normalizeSliderImage(image) {
  if (!image) return null;
  if (typeof image === 'string') {
    return { src: image, selected: true };
  }
  return {
    src: image.src || '',
    selected: Boolean(image.selected)
  };
}

function renderHomeSlider() {
  const slider = document.getElementById('home-slider');
  if (!slider) return;
  const normalizedImages = state.sliderImages.map(normalizeSliderImage).filter(Boolean);
  let selectedImages = normalizedImages.filter(img => img.selected === true);
  if (!selectedImages.length) {
    selectedImages = normalizedImages;
  }

  if (!selectedImages.length) {
    slider.innerHTML = `<div class="home-slider-empty">لم يتم اختيار صور للسلايدر بعد. اختر الصور المميزة بعلامة الصح في لوحة التحكم.</div>`;
    if (homeSliderTimer) {
      clearInterval(homeSliderTimer);
      homeSliderTimer = null;
    }
    return;
  }

  homeSliderIndex = Number.isFinite(homeSliderIndex) ? homeSliderIndex : 0;
  homeSliderIndex = homeSliderIndex % selectedImages.length;
  if (homeSliderIndex < 0) homeSliderIndex = 0;

  slider.innerHTML = selectedImages.map((image, index) => `
    <div class="home-slide${index === homeSliderIndex ? ' active' : ''}">
      <img src="${image.src}" alt="صورة سلايدر ${index + 1}">
    </div>
  `).join('');

  const activeSlide = slider.querySelector('.home-slide.active');
  if (!activeSlide) {
    const firstSlide = slider.querySelector('.home-slide');
    if (firstSlide) firstSlide.classList.add('active');
    homeSliderIndex = 0;
  }

  startHomeSliderAutoPlay(selectedImages.length);
}

function startHomeSliderAutoPlay(slideCount) {
  if (homeSliderTimer) {
    clearInterval(homeSliderTimer);
  }
  if (slideCount < 2) return;
  homeSliderTimer = setInterval(() => {
    homeSliderIndex = (homeSliderIndex + 1) % slideCount;
    const slides = document.querySelectorAll('#home-slider .home-slide');
    slides.forEach((slide, index) => slide.classList.toggle('active', index === homeSliderIndex));
  }, 4200);
}

function removeSliderImage(index) {
  state.sliderImages.splice(index, 1);
  saveSliderImages();
  renderSliderImages();
}

function toggleSliderImageSelection(index) {
  let image = state.sliderImages[index];
  if (!image) return;
  if (typeof image === 'string') {
    image = { src: image, selected: true };
    state.sliderImages[index] = image;
  } else if (image.selected !== undefined) {
    image.selected = !image.selected;
  } else {
    image.selected = true;
  }
  saveSliderImages();
  renderSliderImages();
}

async function saveSliderImages() {
  const saved = await saveToFirestore('settings', 'slider_images', { images: state.sliderImages });
  if (!saved) {
    console.warn('Failed to persist slider images to remote settings; changes may not appear on other devices.');
  }
}

function renderDiscountedProducts() {
  if (!discountedProductsGrid) return;
  const discounted = state.products.filter(product => product.discount && product.available !== false);
  discountedProductsGrid.innerHTML = discounted.length ? discounted.map(product => {
    const cardFooter = getProductCardFooter(product, true);
    return `
    <article class="product-card" onclick="window.location.hash='#product?id=${product.id}'">
      <img src="${product.img}" alt="${product.name}" loading="lazy">
      <div class="product-body">
        <h3>${product.name}</h3>
        <p class="product-category">${product.category}</p>
        <div class="product-meta">
          ${cardFooter}
        </div>
      </div>
    </article>
  `}).join('') : '<p class="card-detail" style="grid-column: 1 / -1; text-align: center;">مفيش عروض دلوقتي، شوف تاني لاحقًا.</p>';
}

function renderCart() {
  if (!cartTableBody) return;
  cartTableBody.innerHTML = state.cart.length ? state.cart.map(item => `
    <tr>
      <td><img src="${item.img}" alt="${item.name}"></td>
      <td>
        ${item.name}
        ${Array.isArray(item.options) && item.options.length ? `<div class="cart-item-options">${item.options.map(o=>`<span>${escapeHtml(o)}</span>`).join(' • ')}</div>` : ''}
      </td>
      <td>${formatPrice(item.price)}</td>
      <td>
        <div class="quantity-controls cart-quantity-controls">
          <button class="quantity-btn" type="button" onclick="updateCartQuantity(${item.id}, -1)">-</button>
          <span>${item.quantity}</span>
          <button class="quantity-btn" type="button" onclick="updateCartQuantity(${item.id}, 1)">+</button>
        </div>
      </td>
      <td>${formatPrice(item.price * item.quantity)}</td>
      <td><button class="secondary-btn" onclick="removeFromCart(${item.id})">إزالة</button></td>
    </tr>
  `).join('') : '<tr><td colspan="6" style="padding: 24px; color: var(--text-muted); text-align:center">السلة فاضية دلوقتي. ضيف منتجات أكتر.</td></tr>';
  const total = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const quantityCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  cartTotal.textContent = formatPrice(total);
  if (cartCount) cartCount.textContent = quantityCount;
  if (bottomCartCount) bottomCartCount.textContent = quantityCount;
}

function updateCartQuantity(productId, delta) {
  const item = state.cart.find(i => i.id === productId);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity < 1) {
    state.cart = state.cart.filter(i => i.id !== productId);
  }
  saveCartState();
  renderCart();
}

function addToCart(productId, options = []) {
  const product = state.products.find(p => p.id === productId);
  if (!product) return;
  if (product.available === false) {
    alert('المنتج غير متوفر الآن');
    return;
  }
  // try to find identical cart line (same product id and same options)
  const existing = state.cart.find(item => item.id === productId && JSON.stringify(item.options || []) === JSON.stringify(options || []));
  if (existing) existing.quantity += 1;
  else state.cart.push({ id: product.id, name: product.name, price: product.price, img: product.img, options: options || [], quantity: 1 });
  saveCartState();
  renderCart();
  alert('✅ المنتج اتضاف للسلة');
}

function removeFromCart(productId) {
  state.cart = state.cart.filter(item => item.id !== productId);
  saveCartState();
  renderCart();
}

function populateGovernorateOptions() {
  const select = document.getElementById('checkout-governorate');
  if (!select) return;
  const current = select.value;
  select.innerHTML = Object.keys(state.shippingRates).map(gov => `
    <option value="${gov}">${gov}</option>
  `).join('');
  if (current && state.shippingRates[current]) select.value = current;
}

function buildSummary() {
  populateGovernorateOptions();
  try { prefillCheckoutFields(); } catch (e) {}
  const totalProducts = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  // remove diagnostic logs from production
  try {
  } catch (e) { }
  if (!state.cart.length) {
    orderSummary.innerHTML = '<p class="card-detail">مفيش منتجات في السلة. روح صفحة المنتجات و اضيف حاجات حلوة.</p>';
    return;
  }
  const selectedGov = document.getElementById('checkout-governorate')?.value || Object.keys(state.shippingRates)[0];
  const delivery = state.shippingRates[selectedGov] || 0;
  const couponCode = document.querySelector('input[name="coupon"]')?.value.trim() || '';
  const coupon = couponCode ? findValidCoupon(couponCode) : null;
  const discount = coupon ? getCouponDiscount(totalProducts, coupon) : 0;
  const grandTotal = totalProducts + delivery - discount;
  orderSummary.innerHTML = `
    <div class="summary-box">
      <h3>ملخص الطلب</h3>
      ${state.cart.map(item => `
        <div class="summary-row">
          <span>${item.quantity}x ${item.name}</span>
          <strong>${formatPrice(item.price * item.quantity)}</strong>
        </div>
      `).join('')}
      <div class="summary-row" style="border-top:1px solid rgba(255,255,255,.08); padding-top:12px; margin-top:16px;">
        <span>قيمة التوصيل (${selectedGov})</span>
        <strong>${formatPrice(delivery)}</strong>
      </div>
      ${discount > 0 ? `
        <div class="summary-row" style="padding-top:12px;">
          <span>خصم كوبون${coupon.type === 'percent' ? ` (${coupon.value}%)` : ''}</span>
          <strong>-${formatPrice(discount)}</strong>
        </div>
      ` : couponCode ? `
        <div class="summary-row" style="padding-top:12px; color:#ffd700;">
          <span>الكوبون غير صالح أو منتهي</span>
          <strong></strong>
        </div>
      ` : ''}
      <div class="summary-row" style="border-top:1px solid rgba(255,255,255,.08); padding-top:12px; margin-top:16px; font-size:1.05rem;">
        <span>المجموع الكلي</span>
        <strong>${formatPrice(grandTotal)}</strong>
      </div>
    </div>
  `;
}

  // Prefill email field if user is logged in
  try {
    const emailInput = document.querySelector('input[name="email"]');
    const authUser = window.currentAuthUser || null;
    if (emailInput && authUser && authUser.email) {
      emailInput.value = authUser.email;
    }
  } catch (e) {
    console.warn('buildSummary prefill email failed', e?.message || e);
  }

async function submitOrder(event) {
  event.preventDefault();
  // debug log removed for cleaner console
  try { } catch (e) {}
  if (!state.cart.length) {
    alert('لازم يكون في منتجات بالسلة قبل ما تكمل الطلب');
    window.location.hash = '#products';
    return;
  }
  const formData = new FormData(event.target);
  const selectedGov = formData.get('governorate') || Object.keys(state.shippingRates)[0];
  const shippingCost = state.shippingRates[selectedGov] || 0;
  const baseTotal = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const couponCode = formData.get('coupon')?.trim() || '';
  const coupon = couponCode ? findValidCoupon(couponCode) : null;
  const couponDiscount = coupon ? getCouponDiscount(baseTotal, coupon) : 0;
  const authUser = window.currentAuthUser || null;
  // prefer explicit email field, fallback to authenticated user email
  const formEmail = (formData.get('email') || '').trim();
  const resolvedEmail = formEmail || authUser?.email || '';
  const orderCustomer = authUser?.fullName || formData.get('name') || resolvedEmail.split('@')[0] || 'مستخدم';
  const orderPhone = (formData.get('phone') || authUser?.phone || '').trim();
  const now = new Date();
  const order = {
     // use a temporary negative id on client to avoid colliding with DB bigserial ids
     id: -Date.now(),
    orderNumber: generateOrderNumber(),
    customer: orderCustomer,
    phone: orderPhone,
    governorate: selectedGov,
    address: formData.get('address'),
    payment: formData.get('payment'),
    notes: formData.get('notes'),
    coupon: couponCode,
    couponDiscount,
    shippingCost,
    items: state.cart.map(item => ({ id: item.id, name: item.name, qty: item.quantity, price: item.price, img: item.img, options: item.options || [] })),
    total: baseTotal + shippingCost - couponDiscount,
    date: now.toLocaleString('ar-EG'),
    createdAt: now.toISOString(),
    status: 'new',
    user_id: authUser?.id || null,
    user_email: resolvedEmail
  };
  state.orders.unshift(order);
  saveCollectionToFirestore('orders', [order]);
  state.cart = [];
  saveCartState();
  renderCart();
  event.target.reset();
  confirmMessage.classList.remove('hidden');
  renderOrders();
  renderUserOrders();
  orderCount.textContent = state.orders.length;
  adminOrderBadge.textContent = state.orders.length;
  window.location.hash = '#home';
}

function renderOrders(search = '') {
  if (!ordersList) return;
  adminOrderSearch = search.toLowerCase().trim();
  const filtered = state.orders.filter(order => {
    const term = `${order.customer} ${order.orderNumber} ${order.id} ${order.phone}`.toLowerCase();
    return term.includes(adminOrderSearch);
  });

  const sortedOrders = [...filtered].sort((a, b) => {
    const aDate = new Date(a.createdAt || a.created_at || a.date || '');
    const bDate = new Date(b.createdAt || b.created_at || b.date || '');
    if (!Number.isNaN(aDate.getTime()) && !Number.isNaN(bDate.getTime())) {
      return bDate - aDate;
    }
    return (b.id || 0) - (a.id || 0);
  });

  ordersList.innerHTML = sortedOrders.length ? sortedOrders.map(order => {
    const status = order.status || 'new';
    const statusClass = `status-${status}`;
    const governorate = order.governorate || 'غير محدد';
    const notesText = order.notes ? order.notes : 'لا توجد ملاحظات';
    return `
    <article class="order-card ${statusClass}" id="order-card-${order.id}">
      <div class="order-body">
        <div class="order-top-row">
          <div class="order-header-info">
            <h3>طلب #${order.orderNumber}</h3>
            <p>العميل: ${order.customer}</p>
            <p class="order-phone">${order.phone}</p>
            <p class="order-region">المحافظة: ${governorate}</p>
            <p class="order-address">العنوان: ${order.address || 'غير محدد'}</p>
          </div>
          <div class="order-status-actions">
            <button class="status-btn status-accept ${status === 'accepted' ? 'active' : ''}" onclick="setOrderStatus(${order.id}, 'accepted')">قبول الطلب</button>
            <button class="status-btn status-ship ${status === 'shipped' ? 'active' : ''}" onclick="setOrderStatus(${order.id}, 'shipped')">شحن الطلب</button>
            <button class="status-btn status-delivered ${status === 'delivered' ? 'active' : ''}" onclick="setOrderStatus(${order.id}, 'delivered')">تم التسليم</button>
            <button class="status-btn status-cancel ${status === 'cancelled' ? 'active' : ''}" onclick="setOrderStatus(${order.id}, 'cancelled')">الغاء</button>
          </div>
        </div>
        <p class="order-meta-row">زمن الطلب: ${order.date}</p>
        <p class="order-meta-row">الدفع: ${order.payment}</p>
        ${order.coupon ? `<p class="order-meta-row">كوبون: ${order.coupon} - خصم ${formatPrice(order.couponDiscount || 0)}</p>` : ''}
        <p class="order-notes">${notesText}</p>
        <div class="product-meta">
          <span class="price-tag">
            <span class="price-main">${formatPrice(order.total)}</span>
            ${order.coupon ? `<span class="price-discount">خصم ${formatPrice(order.couponDiscount || 0)}</span>` : ''}
            <span class="price-shipping">شحن ${formatPrice(order.shippingCost || 0)}</span>
          </span>
          <button class="secondary-btn" onclick="toggleOrderDetails(${order.id})">عرض التفاصيل</button>
        </div>
        <div class="order-details hidden" id="order-detail-${order.id}">
          <div class="order-detail-head">
            <span>الصورة</span>
            <span>الاسم</span>
            <span>السعر</span>
            <span>الكمية</span>
            <span>الإجمالي</span>
          </div>
          ${order.items.map(item => `
            <div class="order-detail-row">
              <div class="detail-image">
                <img src="${item.img || 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80'}" alt="${item.name}">
              </div>
              <span class="detail-name">${item.name}${Array.isArray(item.options) && item.options.length ? `<div class="cart-item-options">${item.options.map(o=>escapeHtml(o)).join(' • ')}</div>` : ''}</span>
              <span class="detail-cell">${item.price.toLocaleString()}</span>
              <span class="detail-cell">${item.qty}</span>
              <span class="detail-cell">${(item.price * item.qty).toLocaleString()}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </article>
  `;
  }).join('') : '<div class="alert">مفيش طلبات لحد دلوقتي. الطلبات اللي يبعتهالنا هتبان هنا.</div>';
}

function findValidCoupon(code) {
  const normalizedCode = code.trim().toUpperCase();
  const now = new Date();
  return state.coupons.find(coupon => {
    if (!coupon.active) return false;
    if (coupon.code.toUpperCase() !== normalizedCode) return false;
    const startDate = new Date(coupon.start);
    const endDate = new Date(coupon.end);
    return now >= startDate && now <= endDate;
  }) || null;
}

function getCouponDiscount(baseTotal, coupon) {
  if (!coupon) return 0;
  if (coupon.type === 'percent') {
    return Math.min(Math.max(baseTotal * (coupon.value / 100), 0), baseTotal);
  }
  return Math.min(Math.max(coupon.value, 0), baseTotal);
}

function resetCouponForm() {
  couponEditId = null;
  document.getElementById('coupon-code').value = '';
  document.getElementById('coupon-type').value = 'percent';
  document.getElementById('coupon-value').value = '';
  document.getElementById('coupon-start').value = '';
  document.getElementById('coupon-end').value = '';
  document.getElementById('coupon-active').checked = true;
  document.getElementById('coupon-id').value = '';
  const submitBtn = document.querySelector('#coupon-form button[type="submit"]');
  if (submitBtn) submitBtn.textContent = 'حفظ الكوبون';
}

function editCoupon(couponId) {
  const coupon = state.coupons.find(item => item.id === couponId);
  if (!coupon) return;
  couponEditId = couponId;
  document.getElementById('coupon-code').value = coupon.code;
  document.getElementById('coupon-type').value = coupon.type;
  document.getElementById('coupon-value').value = coupon.value;
  document.getElementById('coupon-start').value = coupon.start;
  document.getElementById('coupon-end').value = coupon.end;
  document.getElementById('coupon-active').checked = Boolean(coupon.active);
  document.getElementById('coupon-id').value = coupon.id;
  const submitBtn = document.querySelector('#coupon-form button[type="submit"]');
  if (submitBtn) submitBtn.textContent = 'تحديث الكوبون';
}

async function saveCoupon(event) {
  event.preventDefault();
  const codeInput = document.getElementById('coupon-code');
  const typeInput = document.getElementById('coupon-type');
  const valueInput = document.getElementById('coupon-value');
  const startInput = document.getElementById('coupon-start');
  const endInput = document.getElementById('coupon-end');
  const activeInput = document.getElementById('coupon-active');

  const code = codeInput.value.trim().toUpperCase();
  const type = typeInput.value;
  const value = Number(valueInput.value);
  const start = startInput.value;
  const end = endInput.value;
  const active = activeInput.checked;

  if (!code || !type || !start || !end || Number.isNaN(value) || value < 0) {
    alert('من فضلك اكمل بيانات الكوبون بشكل صحيح.');
    return;
  }

  if (new Date(end) < new Date(start)) {
    alert('تاريخ النهاية لا يمكن أن يكون قبل بداية الكوبون.');
    return;
  }

  const existingCoupon = state.coupons.find(coupon => coupon.code.toUpperCase() === code && coupon.id !== couponEditId);
  if (existingCoupon) {
    alert('الكود ده مستخدم بالفعل لكوبون آخر.');
    return;
  }

  if (couponEditId) {
    const coupon = state.coupons.find(item => item.id === couponEditId);
    if (!coupon) return;
    coupon.code = code;
    coupon.type = type;
    coupon.value = value;
    coupon.start = start;
    coupon.end = end;
    coupon.active = active;
  } else {
    state.coupons.unshift({
      id: Date.now(),
      code,
      type,
      value,
      start,
      end,
      active
    });
  }

  saveCollectionToFirestore('coupons', state.coupons);
  resetCouponForm();
  }
function toggleCouponActive(couponId) {
  const coupon = state.coupons.find(item => item.id === couponId);
  if (!coupon) return;
  coupon.active = !coupon.active;
  saveCollectionToFirestore('coupons', state.coupons);
  renderCoupons(adminCouponSearch);
}

function renderCoupons(search = '') {
  adminCouponSearch = search.toLowerCase().trim();
  const filtered = state.coupons.filter(coupon => coupon.code.toLowerCase().includes(adminCouponSearch));
  const couponsTable = document.getElementById('admin-coupons-table');
  if (!couponsTable) return;
  couponsTable.innerHTML = filtered.length ? filtered.map(coupon => {
    const typeLabel = coupon.type === 'percent' ? 'نسبة مئوية' : 'ثابتة';
    const valueLabel = coupon.type === 'percent' ? `${coupon.value}%` : `${formatPrice(coupon.value)}`;
    return `
      <tr>
        <td>${coupon.code}</td>
        <td>${typeLabel}</td>
        <td>${valueLabel}</td>
        <td>${coupon.start}</td>
        <td>${coupon.end}</td>
        <td>${coupon.active ? 'نشط' : 'معطل'}</td>
        <td class="table-actions">
          <button class="secondary-btn" onclick="editCoupon(${coupon.id})">تعديل</button>
          <button class="secondary-btn" onclick="toggleCouponActive(${coupon.id})">${coupon.active ? 'تعطيل' : 'تفعيل'}</button>
        </td>
      </tr>
    `;
  }).join('') : '<tr><td colspan="7">لا يوجد كوبونات حالياً.</td></tr>';
}

function setOrderStatus(orderId, status) {
  const order = state.orders.find(o => o.id === orderId);
  if (!order) return;
  order.status = status;
  saveCollectionToFirestore('orders', state.orders);
  renderOrders(adminOrderSearch);
  renderUserOrders();
}

function renderAdminProducts(search = '', page = 1) {
  if (!adminProductsTable) return;
  adminProductSearch = search.toLowerCase().trim();
  adminProductPage = page;
  const filtered = state.products.filter(product => {
    const term = `${product.name} ${product.category}`.toLowerCase();
    return term.includes(adminProductSearch);
  });

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageProducts = filtered.slice(start, end);

  adminProductsTable.innerHTML = pageProducts.length ? pageProducts.map(product => {
    const priceDisplay = formatPrice(product.price);
    const discountDisplay = product.discount ? `${formatPrice(product.price)} <del style="color: var(--text-muted); font-size: 0.9em;">${formatPrice(product.originalPrice)}</del>` : '—';
    const availabilityLabel = product.available !== false ? '<span class="status-chip available">متوفر</span>' : '<span class="status-chip unavailable">غير متوفر</span>';
    return `
      <tr>
        <td data-label="صورة"><img src="${product.img}" alt="${product.name}"></td>
        <td data-label="اسم المنتج">${product.name}</td>
        <td data-label="الفئة">${product.category}</td>
        <td data-label="التوفر">${availabilityLabel}</td>
        <td data-label="السعر">${priceDisplay}</td>
        <td data-label="سعر التخفيض">${discountDisplay}</td>
        <td data-label="تحكم">
          <div class="admin-action-buttons">
            <button class="secondary-btn" onclick="editProduct(${product.id})">تعديل</button>
            <button class="secondary-btn" onclick="deleteProduct(${product.id})">حذف</button>
          </div>
        </td>
      </tr>
    `;
  }).join('') : `
      <tr>
        <td colspan="7" style="padding: 24px; color: var(--text-muted); text-align:center">لا توجد منتجات تطابق البحث.</td>
      </tr>
    `;

  // Render pagination
  const paginationEl = document.getElementById('admin-pagination');
  if (!paginationEl) return;
  paginationEl.innerHTML = '';
  if (totalPages > 1) {
    if (page > 1) {
      paginationEl.innerHTML += '<button class="secondary-btn" onclick="renderAdminProducts(\'' + adminProductSearch + '\', ' + (page - 1) + ')">السابق</button>';
    }
    for (let i = 1; i <= totalPages; i++) {
      if (i === page) {
        paginationEl.innerHTML += '<span class="current-page">' + i + '</span>';
      } else {
        paginationEl.innerHTML += '<button class="secondary-btn page-btn" onclick="renderAdminProducts(\'' + adminProductSearch + '\', ' + i + ')">' + i + '</button>';
      }
    }
    if (page < totalPages) {
      paginationEl.innerHTML += '<button class="secondary-btn" onclick="renderAdminProducts(\'' + adminProductSearch + '\', ' + (page + 1) + ')">التالي</button>';
    }
  }
}

function editProduct(id) {
  const product = state.products.find(p => p.id === id);
  if (!product) return;
  editProductId = id;
  document.getElementById('new-name').value = product.name;
  document.getElementById('new-price').value = product.price;
  document.getElementById('new-original-price').value = product.originalPrice || '';
  document.getElementById('new-category').value = product.category;
  document.getElementById('new-desc').value = product.desc;
  document.getElementById('new-available').checked = product.available !== false;
  mainImageData = product.img;
  galleryImagesData = [...(product.gallery || [])];
  document.getElementById('main-image-preview').innerHTML = `
      <img src="${product.img}" alt="الصورة الرئيسية">
      <button type="button" class="delete-btn" onclick="removeMainImage()">×</button>
    `;
  document.getElementById('gallery-images-preview').innerHTML = galleryImagesData.map((imgData, index) => `
      <div class="image-item">
        <img src="${imgData}" alt="صورة المعرض ${index + 1}">
        <button type="button" class="delete-btn" onclick="removeGalleryImage(${index})">×</button>
      </div>
    `).join('');
  document.querySelector('#add-product-form button[type="submit"]').textContent = 'تحديث المنتج';
  
  // استعادة الخيارات المحفوظة
  if (product.options && product.options.length > 0) {
    categoryOptionsContainer.innerHTML = '';
    product.options.forEach(optionValue => {
      const row = createCategoryOptionRow(optionValue);
      categoryOptionsContainer.appendChild(row);
    });
    // تأكد من أن الموديل مُغلق بحيث لا يحجب واجهة الملء
    categoryOptionsPanel.classList.add('hidden');
    categoryOptionsPanel.setAttribute('aria-hidden', 'true');
    categoryOptionsToggle.setAttribute('aria-expanded', 'false');
  }
}

function resetProductForm() {
  editProductId = null;
  addProductForm.reset();
  document.getElementById('main-image-preview').innerHTML = '';
  document.getElementById('gallery-images-preview').innerHTML = '';
  document.getElementById('new-available').checked = true;
  document.querySelector('#add-product-form button[type="submit"]').textContent = 'حفظ المنتج';
  mainImageData = null;
  galleryImagesData = [];
  
  // إعادة تعيين حقول الخيارات
  categoryOptionsContainer.innerHTML = `
    <div class="category-option-row">
      <input class="category-option-input" type="text" placeholder="خيار جديد">
      <button type="button" class="remove-option-btn" title="إزالة">✕</button>
    </div>
  `;
  const removeBtn = categoryOptionsContainer.querySelector('.remove-option-btn');
  if (removeBtn) {
    removeBtn.addEventListener('click', function() {
      this.parentElement.remove();
    });
  }
  categoryOptionsPanel.classList.add('hidden');
  categoryOptionsPanel.setAttribute('aria-hidden', 'true');
  categoryOptionsToggle.setAttribute('aria-expanded', 'false');
}

function deleteProduct(id) {
  const product = state.products.find(p => p.id === id);
  if (!product) return;
  if (confirm(`متأكد إنك عايز تحذف ${product.name}?`)) {
    state.products = state.products.filter(p => p.id !== id);
    state.cart = state.cart.filter(item => item.id !== id);
    saveCollectionToFirestore('products', state.products);
    renderProducts();
    renderCart();
    renderAdminProducts(adminProductSearch, adminProductPage);
  }
}

function toggleOrderDetails(id) {
  const details = document.getElementById(`order-detail-${id}`);
  if (details) details.classList.toggle('hidden');
}

function loginAdmin(event) {
  event.preventDefault();
  const password = document.getElementById('admin-password').value.trim();
  if (password === 'farfasha123') {
    state.admin.authenticated = true;
    adminGreeting.textContent = `أهلاً ${state.admin.name}`;
    loginPanel.classList.add('hidden');
    adminPanel.classList.remove('hidden');
    adminError.textContent = '';
    setSection('admin');
    const activeAdminTab = document.querySelector('.tab-btn.active');
    if (activeAdminTab) {
      switchAdminTab({ currentTarget: activeAdminTab });
    }
  } else {
    adminError.textContent = 'كلمة المرور غلط. جرب تاني.';
  }
}

function addNewProduct(event) {
  event.preventDefault();
  const name = document.getElementById('new-name').value.trim();
  const price = Number(document.getElementById('new-price').value);
  const originalPrice = Number(document.getElementById('new-original-price').value) || null;
  const category = document.getElementById('new-category').value;
  // gather dynamic category options (if any)
  const optionInputs = document.querySelectorAll('.category-option-input');
  const categoryOptions = optionInputs ? Array.from(optionInputs).map(i => i.value.trim()).filter(Boolean) : [];
  const desc = document.getElementById('new-desc').value.trim();
  const available = document.getElementById('new-available').checked;
  if (!name || !price || !category || !desc) return;

  const productData = {
    id: editProductId || Date.now(),
    name,
    price,
    desc,
    category,
    img: mainImageData || 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80',
    gallery: [...galleryImagesData],
    available
  };

  if (categoryOptions.length) {
    productData.options = categoryOptions;
  }

  if (originalPrice) {
    productData.originalPrice = originalPrice;
    productData.discount = Math.round(((originalPrice - price) / originalPrice) * 100);
  } else {
    delete productData.originalPrice;
    delete productData.discount;
  }

  if (editProductId) {
    state.products = state.products.map(item => item.id === editProductId ? productData : item);
    alert('تم تحديث المنتج بنجاح!');
  } else {
    state.products.unshift(productData);
    alert('تم إضافة المنتج بنجاح!');
  }

  saveCollectionToFirestore('products', state.products);
  resetProductForm();
  renderProducts();
  renderAdminProducts(adminProductSearch, adminProductPage);
}

async function updateSocialLinks(event) {
  event.preventDefault();
  const telegram = document.getElementById('telegram-url').value.trim() || '#';
  const whatsapp = document.getElementById('whatsapp-url').value.trim() || '#';
  const facebook = document.getElementById('facebook-url').value.trim() || '#';
  state.social.telegram = telegram;
  state.social.whatsapp = whatsapp;
  state.social.facebook = facebook;
  try {
    const saved = await saveSocialSettings(state.social);
    if (!saved) {
      alert('حدث خطأ في حفظ الروابط على Supabase، لكن العرض سيُحدَّث محلياً.');
    } else {
      alert('تم حفظ الروابط بنجاح!');
    }
    updateSocialLinksDisplay();
    fillSocialForm(); // Re-fill the form with saved values instead of resetting
  } catch (error) {
    console.error('خطأ في حفظ الروابط:', error);
    alert('حدث خطأ في حفظ الروابط. جرب تاني.');
  }
}

function updateSocialLinksDisplay() {
  const telegramLink = document.getElementById('telegram-link');
  const whatsappLink = document.getElementById('whatsapp-link');
  const facebookLink = document.getElementById('facebook-link');

  const setLink = (element, url) => {
    const href = url && url !== '#' ? url : '#';
    element.href = href;
    element.style.pointerEvents = href === '#' ? 'none' : 'auto';
    if (href === '#') {
      element.target = '_self';
      element.removeAttribute('rel');
      element.setAttribute('aria-disabled', 'true');
    } else {
      element.target = '_blank';
      element.rel = 'noopener noreferrer';
      element.removeAttribute('aria-disabled');
    }
  };

  setLink(telegramLink, state.social.telegram);
  setLink(whatsappLink, state.social.whatsapp);
  setLink(facebookLink, state.social.facebook);
}

function switchAdminTab(event) {
  const target = event.currentTarget.dataset.tab;
  adminTabButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === target));
  document.querySelectorAll('.admin-tab-panel').forEach(panel => panel.classList.toggle('hidden', panel.dataset.tab !== target));
  // Only render or keep the review images preview when reviews tab is active
  try {
    if (typeof reviewImagesPreview !== 'undefined' && reviewImagesPreview) {
      if (target === 'reviews') {
        renderReviewImagesPreview();
      } else {
        // clear preview when leaving reviews tab to avoid showing it across other tabs
        reviewImagesPreview.innerHTML = '';
      }
    }
  } catch (e) {
    console.error('Error updating review preview on tab switch', e);
  }
  if (target === 'social') {
    fillSocialForm();
  }
  if (target === 'categories') {
    resetCategoryForm();
    renderCategoryPreview();
  }
  if (target === 'products') {
    resetProductForm();
    populateCategorySelect();
    renderAdminProducts(adminProductSearch, 1);
  }
  if (target === 'orders') {
    // Always refresh the full orders list for the admin panel
    // so the admin view imports all saved orders from the database.
    (async () => {
      try {
        const fullOrders = await loadCollectionFromFirestore('orders');
        if (Array.isArray(fullOrders)) {
          state.orders = fullOrders;
          normalizeOrderNumbers();
          if (orderCount) orderCount.textContent = state.orders.length;
          if (adminOrderBadge) adminOrderBadge.textContent = state.orders.length;
        }
      } catch (err) {
        console.warn('Failed to load full orders for admin tab:', err?.message || err);
      }
      renderOrders(adminOrderSearch);
    })();
  }
  if (target === 'shipping') {
    renderShippingRates();
  }
  if (target === 'coupons') {
    resetCouponForm();
    renderCoupons(adminCouponSearch);
  }
}

function fillSocialForm() {
  document.getElementById('telegram-url').value = state.social.telegram !== '#' ? state.social.telegram : '';
  document.getElementById('whatsapp-url').value = state.social.whatsapp !== '#' ? state.social.whatsapp : '';
  document.getElementById('facebook-url').value = state.social.facebook !== '#' ? state.social.facebook : '';
}

async function loadRemoteData() {
  if (!navigator.onLine) {
    console.warn('Navigator reports offline — attempting remote data load anyway (some devices mis-report network).');
  }

  // Skip Firebase initialization entirely in the current build.
  await initSupabaseClient();

  const categoriesPromise = loadCategoriesPreview();
  const productsPreviewPromise = loadProductsPreview(200);
  const productsFullPromise = Promise.resolve([]);
  const couponsPromise = loadCollectionFromFirestore('coupons', { select: 'id,code,type,value,start,end,active' });
  const ordersPromise = (state.admin && state.admin.authenticated) ? loadCollectionFromFirestore('orders') : loadOrdersForCurrentUser();
  const socialPromise = loadSocialSettings();
  const cartPromise = Promise.resolve(loadCartState());
  const reviewImagesPromise = loadFromFirestore('settings', 'review_images');
  const sliderImagesPromise = loadFromFirestore('settings', 'slider_images');
  const shippingRatesPromise = loadFromFirestore('settings', 'shipping_rates');

  categoriesPromise.then(savedCategoriesResult => {
    if (Array.isArray(savedCategoriesResult) && savedCategoriesResult.length > 0) {
      state.categories = savedCategoriesResult;
      renderCategories();
      populateCategorySelect();
    }
  }).catch(err => {
    console.warn('Failed to load categories:', err?.message || err);
  });

  productsPreviewPromise.then(savedProductsResult => {
    if (Array.isArray(savedProductsResult) && savedProductsResult.length > 0) {
      state.products = savedProductsResult;
      state.products.forEach(product => {
        if (!product.category) product.category = 'أخرى';
        if (!product.gallery) product.gallery = [];
        if (product.available === undefined) product.available = true;
      });
      renderProducts();
      const activeAdminTab = document.querySelector('.tab-btn.active');
      if (adminPanel && !adminPanel.classList.contains('hidden') && activeAdminTab?.dataset.tab === 'products') {
        renderAdminProducts(adminProductSearch, adminProductPage);
      }
    }
  }).catch(err => {
    console.warn('Failed to load product preview:', err?.message || err);
  });

  // Defer full product load until after initial UI appears.
  setTimeout(async () => {
    try {
      const fullProductsResult = await loadAllProducts();
      if (Array.isArray(fullProductsResult) && fullProductsResult.length > 0) {
        const shouldUpdate = !Array.isArray(state.products)
          || fullProductsResult.length !== state.products.length
          || fullProductsResult.some((product, index) => !state.products[index] || product.id !== state.products[index].id);
        if (shouldUpdate) {
          state.products = fullProductsResult;
          state.products.forEach(product => {
            if (!product.category) product.category = 'أخرى';
            if (!product.gallery) product.gallery = [];
            if (product.available === undefined) product.available = true;
          });
          renderProducts();
        }
      }
    } catch (err) {
      console.warn('Deferred full product load failed:', err?.message || err);
    }
  }, 1200);

  productsFullPromise.then(fullProductsResult => {
    if (Array.isArray(fullProductsResult) && fullProductsResult.length > 0) {
      const shouldUpdate = !Array.isArray(state.products)
        || fullProductsResult.length !== state.products.length
        || fullProductsResult.some((product, index) => !state.products[index] || product.id !== state.products[index].id);
      if (shouldUpdate) {
        state.products = fullProductsResult;
        state.products.forEach(product => {
          if (!product.category) product.category = 'أخرى';
          if (!product.gallery) product.gallery = [];
          if (product.available === undefined) product.available = true;
        });
        renderProducts();
        const activeAdminTab = document.querySelector('.tab-btn.active');
        if (adminPanel && !adminPanel.classList.contains('hidden') && activeAdminTab?.dataset.tab === 'products') {
          renderAdminProducts(adminProductSearch, adminProductPage);
        }
      }
    }
  }).catch(err => {
    console.warn('Failed to load all products:', err?.message || err);
  });

  ordersPromise.then(savedOrdersResult => {
    if (Array.isArray(savedOrdersResult) && savedOrdersResult.length > 0) {
      state.orders = savedOrdersResult;
      normalizeOrderNumbers();
      renderOrders();
      if (window.currentAuthUser) {
        renderUserOrders();
      }
      orderCount.textContent = state.orders.length;
      adminOrderBadge.textContent = state.orders.length;
    }
  }).catch(err => {
    console.warn('Failed to load orders:', err?.message || err);
  });

  socialPromise.then(savedSocialResult => {
    if (savedSocialResult) {
      state.social = savedSocialResult;
      updateSocialLinksDisplay();
    }
  }).catch(err => {
    console.warn('Failed to load social settings:', err?.message || err);
  });

  cartPromise.then(savedCartResult => {
    if (savedCartResult) {
      state.cart = savedCartResult.items || [];
      renderCart();
    }
  }).catch(err => {
    console.warn('Failed to load cart:', err?.message || err);
  });

  reviewImagesPromise.then(savedReviewImagesResult => {
    if (savedReviewImagesResult) {
      state.reviewImages = savedReviewImagesResult.images || [];
      renderReviewImages();
      renderReviewImagesPreview();
    }
  }).catch(err => {
    console.warn('Failed to load review images:', err?.message || err);
  });

  sliderImagesPromise.then(savedSliderImagesResult => {
    if (!savedSliderImagesResult) return;
    let loadedImages = [];
    if (Array.isArray(savedSliderImagesResult.images)) {
      loadedImages = savedSliderImagesResult.images;
    } else if (savedSliderImagesResult.value !== undefined) {
      loadedImages = parseSettingsValue(savedSliderImagesResult.value)?.images || [];
    } else if (savedSliderImagesResult.data !== undefined) {
      loadedImages = parseSettingsValue(savedSliderImagesResult.data)?.images || [];
    } else if (Array.isArray(savedSliderImagesResult)) {
      loadedImages = savedSliderImagesResult;
    }
    state.sliderImages = (loadedImages || []).map(normalizeSliderImage).filter(Boolean);
    renderSliderImages();
  }).catch(err => {
    console.warn('Failed to load slider images:', err?.message || err);
  });

  shippingRatesPromise.then(savedShippingRatesResult => {
    if (savedShippingRatesResult) {
      const rates = savedShippingRatesResult.rates || savedShippingRatesResult.data?.rates || savedShippingRatesResult.value?.rates || savedShippingRatesResult;
      if (rates && typeof rates === 'object') {
        state.shippingRates = { ...state.shippingRates, ...rates };
        populateGovernorateOptions();
        renderShippingRates();
      }
    }
  }).catch(err => {
    console.warn('Failed to load shipping rates:', err?.message || err);
  });

  couponsPromise.then(savedCouponsResult => {
    if (Array.isArray(savedCouponsResult) && savedCouponsResult.length > 0) {
      state.coupons = savedCouponsResult;
    }
  }).catch(err => {
    console.warn('Failed to load coupons:', err?.message || err);
  });

  Promise.allSettled([
    categoriesPromise,
    productsPreviewPromise,
    productsFullPromise,
    couponsPromise,
    ordersPromise,
    socialPromise,
    cartPromise,
    reviewImagesPromise,
    sliderImagesPromise,
    shippingRatesPromise
  ]).then(() => {
    initRealtimeSubscriptions();
    console.log('Remote data loading finished');
  });
}

window.addEventListener('hashchange', handleHashChange);
window.addEventListener('DOMContentLoaded', () => {
  try {
    renderProducts();
    renderCart();
    renderReviewImages();
    renderReviewImagesPreview();
    renderSliderImages();
    renderOrders();
    renderCategories();
    populateCategorySelect();
    orderCount.textContent = state.orders.length;
    adminOrderBadge.textContent = state.orders.length;
    updateSocialLinksDisplay();
    restoreAuthState();
    if (!window.location.hash) window.location.hash = '#home';
    restoreTheme();
    handleHashChange();
    loadRemoteData();
  } catch (err) {
    console.error('Error during DOMContentLoaded initialization:', err?.message || err);
  }
});

window.addEventListener('online', () => {
  console.log('Network online, retrying remote data load');
  loadRemoteData();
});

function renderShippingRates() {
  const list = document.getElementById('shipping-rates-list');
  list.innerHTML = Object.keys(state.shippingRates).map(gov => `
    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
      <label style="flex: 1;">${gov}</label>
      <input type="number" value="${state.shippingRates[gov]}" data-gov="${gov}" style="width: 100px;" min="0" step="1">
    </div>
  `).join('');
}

function addNewGovernorate() {
  const newGov = prompt('أدخل اسم المحافظة الجديدة:');
  if (newGov && !state.shippingRates[newGov]) {
    state.shippingRates[newGov] = 0;
    renderShippingRates();
  } else if (newGov) {
    alert('المحافظة موجودة بالفعل.');
  }
}

async function saveShippingRates() {
  const inputs = document.querySelectorAll('#shipping-rates-list input');
  inputs.forEach(input => {
    const gov = input.dataset.gov;
    const price = parseFloat(input.value) || 0;
    state.shippingRates[gov] = price;
  });
  const saved = await saveToFirestore('settings', 'shipping_rates', { rates: state.shippingRates });
  if (!saved) {
    alert('حدث خطأ أثناء حفظ أسعار الشحن. جرب مرة أخرى.');
    return;
  }
  alert('تم حفظ أسعار الشحن بنجاح!');
}

window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.submitOrder = submitOrder;
window.loginAdmin = loginAdmin;
window.addNewProduct = addNewProduct;
window.deleteProduct = deleteProduct;
window.toggleOrderDetails = toggleOrderDetails;
window.switchAdminTab = switchAdminTab;
window.updateSocialLinks = updateSocialLinks;
window.addReviewImage = addReviewImage;
window.deleteReviewImage = deleteReviewImage;
window.previewSliderImages = previewSliderImages;
window.toggleSliderImageSelection = toggleSliderImageSelection;
window.removeSliderImage = removeSliderImage;
window.openSliderImagePicker = openSliderImagePicker;
window.addOrUpdateCategory = addOrUpdateCategory;
window.editCategory = editCategory;
window.deleteCategory = deleteCategory;
window.previewMainImage = previewMainImage;
window.removeMainImage = removeMainImage;
window.previewGalleryImages = previewGalleryImages;
window.removeGalleryImage = removeGalleryImage;
window.changeMainImage = changeMainImage;
window.updateQuantity = updateQuantity;
window.updateCartQuantity = updateCartQuantity;
window.addToCartFromDetail = addToCartFromDetail;
window.buyNow = buyNow;
window.renderShippingRates = renderShippingRates;
window.addNewGovernorate = addNewGovernorate;
window.saveShippingRates = saveShippingRates;

const bindCategoryForm = () => {
  const categoryForm = document.getElementById('category-form');
  if (categoryForm && !categoryForm.dataset.bound) {
    categoryForm.addEventListener('submit', addOrUpdateCategory);
    categoryForm.dataset.bound = 'true';
  }
};

const THEME_STORAGE_KEY = 'farfashaTheme';
const themeToggleBtn = document.getElementById('theme-toggle-btn');

function applyTheme(theme) {
  const darkMode = theme === 'dark';
  document.body.classList.toggle('theme-dark', darkMode);
  document.body.classList.toggle('theme-light', !darkMode);
  if (themeToggleBtn) {
    themeToggleBtn.textContent = darkMode ? '☀️ الوضع النهاري' : '🌙 الوضع الليلي';
  }
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}

function toggleTheme(e) {
  if (e) e.preventDefault();
  const isDark = document.body.classList.contains('theme-dark');
  applyTheme(isDark ? 'light' : 'dark');
}

function restoreTheme() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(savedTheme === 'dark' || (!savedTheme && prefersDark) ? 'dark' : 'light');
}

if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', toggleTheme);
  themeToggleBtn.textContent = '🌙 الوضع الليلي';
}

window.addEventListener('DOMContentLoaded', bindCategoryForm);
bindCategoryForm();
window.switchAuthTab = switchAuthTab;
window.switchProfileTab = switchProfileTab;
window.loginUser = loginUser;
window.registerUser = registerUser;
window.logoutUser = logoutUser;
window.saveUserProfile = saveUserProfile;

function showAuthMessage(text, success = false) {
  const message = document.getElementById('auth-message');
  if (!message) return;
  message.textContent = text;
  message.classList.remove('hidden');
  message.style.color = success ? '#0b6623' : '#d7263d';
}

function hideAuthMessage() {
  const message = document.getElementById('auth-message');
  if (!message) return;
  message.classList.add('hidden');
}

function persistAuthUser(user) {
  window.currentAuthUser = user;
  if (user) {
    localStorage.setItem('farfashaAuthUser', JSON.stringify(user));
  } else {
    localStorage.removeItem('farfashaAuthUser');
  }
  // Prefill checkout fields if visible/available
  try {
    prefillCheckoutFields();
  } catch (e) {
    console.warn('persistAuthUser prefill failed', e?.message || e);
  }
}

function prefillCheckoutFields() {
  try {
    const authUser = window.currentAuthUser || null;
    if (!authUser) return;
    const nameInput = document.querySelector('input[name="name"]');
    const emailInput = document.querySelector('input[name="email"]');
    const phoneInput = document.querySelector('input[name="phone"]');
    if (nameInput && authUser.fullName) nameInput.value = authUser.fullName;
    if (emailInput && authUser.email) emailInput.value = authUser.email;
    if (phoneInput && authUser.phone) phoneInput.value = authUser.phone;
  } catch (err) {
    console.warn('prefillCheckoutFields error', err?.message || err);
  }
}

function prefillCheckoutEmail() {
  try {
    const emailInput = document.querySelector('input[name="email"]');
    const authUser = window.currentAuthUser || null;
    if (emailInput && authUser && authUser.email) {
      emailInput.value = authUser.email;
    }
  } catch (err) {
    console.warn('prefillCheckoutEmail error', err?.message || err);
  }
}

function restoreAuthState() {
  const raw = localStorage.getItem('farfashaAuthUser');
  if (!raw) {
    showAuthContent(false);
    return;
  }
  try {
    const user = JSON.parse(raw);
    console.log('restoreAuthState user:', user);
    if (user && user.email) {
      window.currentAuthUser = user;
      showAuthContent(true, user);
      try { prefillCheckoutFields(); } catch (e) {}
      // After restoring auth, ensure we load latest orders for the current user from the server
      (async () => {
        try {
          console.log('restoreAuthState: loading user orders from server for user', user.id);
          const remoteOrders = await loadOrdersForCurrentUser();
          if (Array.isArray(remoteOrders)) {
            state.orders = remoteOrders;
            normalizeOrderNumbers();
            renderOrders();
            renderUserOrders();
            orderCount.textContent = state.orders.length;
            adminOrderBadge.textContent = state.orders.length;
            console.log('restoreAuthState: loaded user orders count', state.orders.length);
          }
        } catch (err) {
          console.warn('restoreAuthState: failed to load user orders', err?.message || err);
        }
      })();
      return;
    }
  } catch (err) {
    console.warn('Failed to parse stored auth user', err?.message || err);
  }
  showAuthContent(false);
}

function showAuthContent(isLoggedIn, user) {
  const authTabs = document.querySelector('.auth-tabs');
  const authPanels = document.querySelectorAll('.auth-panel');
  const profilePanel = document.getElementById('auth-profile-panel');
  const authTitle = document.getElementById('auth-title');
  const authSubtitle = document.getElementById('auth-subtitle');

  if (isLoggedIn && user) {
    authTabs?.classList.add('hidden');
    authPanels.forEach(panel => panel.classList.add('hidden'));
    profilePanel?.classList.remove('hidden');
    if (authTitle) authTitle.textContent = 'حسابي الشخصي';
    if (authSubtitle) authSubtitle.textContent = 'أهلاً بك، يمكنك متابعة حسابك من هنا.';
    const avatar = document.getElementById('profile-avatar');
    const nameEl = document.getElementById('profile-name');
    const emailEl = document.getElementById('profile-email');
    const noteEl = document.getElementById('profile-note');
    if (avatar) avatar.textContent = user.fullName ? user.fullName.trim().slice(0, 1).toUpperCase() : user.email.slice(0, 1).toUpperCase();
    if (nameEl) nameEl.textContent = user.fullName || 'المستخدم';
    if (emailEl) emailEl.textContent = user.email || '';
    if (noteEl) noteEl.textContent = 'يمكنك تعديل بياناتك الشخصية وحفظها هنا.';
    const profileFullName = document.getElementById('profile-fullname');
    const profileEmailInput = document.getElementById('profile-email-input');
    const profilePhone = document.getElementById('profile-phone');
    const profileMsg = document.getElementById('profile-message');
    if (profileFullName) profileFullName.value = user.fullName || '';
    if (profileEmailInput) profileEmailInput.value = user.email || '';
    if (profilePhone) profilePhone.value = user.phone || '';
    if (profileMsg) profileMsg.classList.add('hidden');
    switchProfileTab('info');
    renderUserOrders();
  } else {
    authTabs?.classList.remove('hidden');
    authPanels.forEach(panel => panel.classList.toggle('active', panel.dataset.auth === 'login'));
    // Ensure profile panel and its tabs are fully hidden and reset when logged out
    if (profilePanel) {
      profilePanel.classList.add('hidden');
      // hide internal profile panels and reset tabs
      document.querySelectorAll('.profile-panel').forEach(p => {
        p.classList.add('hidden');
        p.classList.remove('active');
      });
      document.querySelectorAll('.profile-tab').forEach(t => t.classList.remove('active'));
    }
    const loginTab = document.querySelector('.auth-tab[data-auth="login"]');
    const registerTab = document.querySelector('.auth-tab[data-auth="register"]');
    if (loginTab) loginTab.classList.add('active');
    if (registerTab) registerTab.classList.remove('active');
    if (authTitle) authTitle.textContent = 'تسجيل الدخول';
    if (authSubtitle) authSubtitle.textContent = 'ادخل بياناتك للوصول إلى حسابك';
  }
}

async function loadUserProfile(userId) {
  if (!userId) return null;
  if (!supabaseClient) await initSupabaseClient();
  if (!supabaseClient || typeof supabaseClient.from !== 'function') return null;

  try {
    const result = await supabaseClient.from('profiles').select('*').eq('user_id', userId).single();
    if (result?.data) return result.data;
    if (result?.error) {
      console.warn('Unable to load profile by user_id', result.error);
    }
  } catch (error) {
    console.warn('loadUserProfile by user_id failed', error?.message || error);
  }
  try {
    const result = await supabaseClient.from('profiles').select('*').eq('id', userId).single();
    if (result?.data) return result.data;
  } catch (error) {
    console.warn('loadUserProfile by id failed', error?.message || error);
  }
  return null;
}

function switchAuthTab(tab) {
  document.querySelectorAll('.auth-tab').forEach(button => {
    button.classList.toggle('active', button.dataset.auth === tab);
  });
  document.querySelectorAll('.auth-panel').forEach(panel => {
    panel.classList.toggle('active', panel.dataset.auth === tab);
  });
  hideAuthMessage();
}

function switchProfileTab(tab) {
  document.querySelectorAll('.profile-tab').forEach(button => {
    button.classList.toggle('active', button.dataset.tab === tab);
  });
  document.querySelectorAll('.profile-panel').forEach(panel => {
    panel.classList.toggle('hidden', panel.dataset.panel !== tab);
    panel.classList.toggle('active', panel.dataset.panel === tab);
  });
  const profileMsg = document.getElementById('profile-message');
  if (profileMsg) profileMsg.classList.add('hidden');
  if (tab === 'orders') {
    renderUserOrders();
  }
}

function renderUserOrders() {
  if (!userOrdersList) return;
  const user = window.currentAuthUser || {};
  const currentId = user.id || null;
  const currentEmail = String(user.email || '').toLowerCase().trim();
  const currentPhone = String(user.phone || '').replace(/\D/g, '');
  let matchingOrders = state.orders.filter(order => {
    const orderUserId = order.user_id || null;
    const orderEmail = String(order.user_email || '').toLowerCase().trim();
    const orderEmailFallback = String(order.customer || '').toLowerCase().trim();
    const orderPhone = String(order.phone || '').replace(/\D/g, '');
    if (currentId && orderUserId && String(currentId) === String(orderUserId)) return true;
    if (currentEmail && orderEmail && currentEmail === orderEmail) return true;
    if (currentEmail && orderEmailFallback.includes(currentEmail)) return true;
    if (currentPhone && orderPhone && currentPhone === orderPhone) return true;
    return false;
  });
  matchingOrders = matchingOrders.sort((a, b) => {
    const aDate = a.createdAt ? new Date(a.createdAt) : new Date(a.date || 0);
    const bDate = b.createdAt ? new Date(b.createdAt) : new Date(b.date || 0);
    return bDate - aDate;
  });
  // renderUserOrders: assemble matching orders for the current user
  if (!matchingOrders.length) {
    userOrdersList.innerHTML = '<div class="alert">لا توجد طلبات حالياً. ستظهر طلباتك هنا بعد الإتمام.</div>';
    return;
  }
  userOrdersList.innerHTML = matchingOrders.map(order => {
    const detailsText = order.notes ? order.notes : 'لا توجد ملاحظات';
    const status = (order.status || 'new');
    const statusClass = `status-${status}`;
    const statusLevelMap = { new: 0, accepted: 1, shipped: 2, delivered: 3 };
    const level = status === 'cancelled' ? 0 : statusLevelMap[status] || 0;
    return `
      <article class="order-card ${statusClass}" id="user-order-card-${order.id}">
        <div class="order-body">
          <div class="order-top-row">
            <div class="order-header-info">
              <div class="order-progress" aria-hidden="true">
                <div class="labels">
                  <span>قبول الطلب</span>
                  <span>شحن الطلب</span>
                  <span>تسليم الطلب</span>
                </div>
                <div class="track">
                  <div class="step ${level >= 1 ? 'active' : ''}" data-step="accepted"></div>
                  <div class="line ${level >= 2 ? 'active' : ''}"></div>
                  <div class="step ${level >= 2 ? 'active' : ''}" data-step="shipped"></div>
                  <div class="line ${level >= 3 ? 'active' : ''}"></div>
                  <div class="step ${level >= 3 ? 'active' : ''}" data-step="delivered"></div>
                  <div class="final-icon" title="موقع الطلب">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M21 10c0 6-9 13-9 13S3 16 3 10a9 9 0 1 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                </div>
              </div>
              <h3>طلب #${order.orderNumber}</h3>
              ${status === 'cancelled' ? '<span class="order-badge order-badge-cancelled">ملغى</span>' : ''}
              <p class="order-meta-row">تاريخ الطلب: ${order.date || 'غير معروف'}</p>
            </div>
            <div class="order-meta-row">
              <span class="price-tag">${formatPrice(order.total || 0)}</span>
            </div>
          </div>
          <p class="order-notes">${detailsText}</p>
          <div class="order-details" id="order-detail-${order.id}">
            <div class="order-detail-head">
              <span>الصورة</span>
              <span>الاسم</span>
              <span>السعر</span>
              <span>الكمية</span>
              <span>الإجمالي</span>
            </div>
            ${order.items.map(item => `
              <div class="order-detail-row">
                <div class="detail-image"><img src="${item.img || 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80'}" alt="${item.name}" class="order-item-image"></div>
                <span class="detail-name">${item.name}${Array.isArray(item.options) && item.options.length ? `<div class="cart-item-options">${item.options.map(o=>escapeHtml(o)).join(' • ')}</div>` : ''}</span>
                <span class="detail-cell">${formatPrice(item.price || 0)}</span>
                <span class="detail-cell">${item.qty}</span>
                <span class="detail-cell">${formatPrice((item.price || 0) * item.qty)}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </article>
    `;
  }).join('');
}

async function loginUser(event) {
  event.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value.trim();
  if (!email || !password) {
    showAuthMessage('من فضلك املأ جميع الحقول.');
    return;
  }

  try {
    const { data, error } = await authSignIn({ email, password });
    if (error) {
      showAuthMessage(error.message || 'فشل تسجيل الدخول. تحقق من البيانات وحاول مرة أخرى.');
      return;
    }
    const userId = resolveUserIdFromAuthResult(data);
    const profile = await loadUserProfile(userId);
    const currentUser = {
      id: userId || null,
      email,
      fullName: profile?.full_name || profile?.fullName || email.split('@')[0],
      phone: profile?.phone || ''
    };
    persistAuthUser(currentUser);
    showAuthMessage('✅ تم تسجيل الدخول بنجاح.', true);
    showAuthContent(true, currentUser);
    await refreshOrdersForCurrentUser();
  } catch (err) {
    showAuthMessage(err.message || 'حدث خطأ أثناء تسجيل الدخول.');
  }
}

async function saveUserProfile(event) {
  event.preventDefault();
  const user = window.currentAuthUser;
  if (!user || !user.id) {
    showProfileMessage('لم يتم العثور على بيانات المستخدم. الرجاء تسجيل الدخول مرة أخرى.');
    return;
  }
  const fullName = document.getElementById('profile-fullname')?.value.trim();
  const phone = document.getElementById('profile-phone')?.value.trim();
  if (!fullName) {
    showProfileMessage('يرجى إدخال الاسم الكامل.');
    return;
  }
  try {
    const profileResult = await upsertProfileRow(user.id, fullName, phone, user.email);
    if (profileResult?.error) {
      console.warn('Failed to save profile', profileResult.error);
      showProfileMessage('حدث خطأ أثناء حفظ البيانات. حاول لاحقًا.');
      return;
    }
    const updatedUser = {
      ...user,
      fullName,
      phone
    };
    persistAuthUser(updatedUser);
    showProfileMessage('✅ تم حفظ بيانات الحساب بنجاح.', true);
    showAuthContent(true, updatedUser);
  } catch (error) {
    console.error('saveUserProfile failed', error);
    showProfileMessage('حدث خطأ أثناء حفظ البيانات. حاول مرة أخرى.');
  }
}

function showProfileMessage(text, success = false) {
  const profileMsg = document.getElementById('profile-message');
  if (!profileMsg) return;
  profileMsg.textContent = text;
  profileMsg.classList.remove('hidden');
  profileMsg.style.color = success ? '#0b6623' : '#d7263d';
}

async function registerUser(event) {
  event.preventDefault();
  const name = document.getElementById('register-name').value.trim();
  const email = document.getElementById('register-email').value.trim();
  const phone = document.getElementById('register-phone').value.trim();
  const password = document.getElementById('register-password').value.trim();
  const confirmPassword = document.getElementById('register-confirm-password').value.trim();

  if (!name || !email || !phone || !password || !confirmPassword) {
    showAuthMessage('من فضلك املأ جميع الحقول.');
    return;
  }
  if (password !== confirmPassword) {
    showAuthMessage('كلمتا المرور غير متطابقتين.');
    return;
  }

  try {
    const { data, error } = await authSignUp({ name, phone, email, password });
    if (error) {
      showAuthMessage(error.message || 'خطأ أثناء التسجيل. حاول مجدداً.');
      return;
    }
    const userId = resolveUserIdFromAuthResult(data);
    if (userId) {
      const profileResult = await upsertProfileRow(userId, name, phone, email);
      if (profileResult?.error) {
        console.warn('Failed to create profile row after signup', profileResult.error);
      }
    }
    showAuthMessage('✅ تم إنشاء الحساب. يمكنك الآن تسجيل الدخول.', true);
    switchAuthTab('login');
    const loginEmail = document.getElementById('login-email');
    const loginPassword = document.getElementById('login-password');
    if (loginEmail) loginEmail.value = email;
    if (loginPassword) loginPassword.value = '';
  } catch (err) {
    showAuthMessage(err.message || 'حدث خطأ غير متوقع أثناء التسجيل.');
  }
}

function logoutUser() {
  persistAuthUser(null);
  // explicitly reset UI pieces for auth/profile
  showAuthContent(false);
  hideAuthMessage();
  // clear profile form fields
  try {
    const pf = document.getElementById('profile-fullname'); if (pf) pf.value = '';
    const pe = document.getElementById('profile-email-input'); if (pe) pe.value = '';
    const pp = document.getElementById('profile-phone'); if (pp) pp.value = '';
  } catch (e) { /* ignore */ }
  window.location.hash = '#auth';
}
