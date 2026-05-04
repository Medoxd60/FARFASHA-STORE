const sections = {
  home: document.getElementById('section-home'),
  products: document.getElementById('section-products'),
  category: document.getElementById('section-category'),
  'product-detail': document.getElementById('section-product-detail'),
  cart: document.getElementById('section-cart'),
  checkout: document.getElementById('section-checkout'),
  admin: document.getElementById('section-admin'),
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

let state = {
  products: [
    { id: 1, name: 'شنطة فانشوشة ستايل', price: 229, originalPrice: 299, discount: 23, desc: 'شنطة يدوية بتصميم عصري و خامة قوية للأيام المثالية.', img: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80', category: 'إكسسوارات', gallery: [], available: true },
    { id: 2, name: 'جزمة فرفشة رياضية', price: 399, originalPrice: 499, discount: 20, desc: 'جزمة خفيفة ومرنة مناسبة لكل يوم وخروجاتك بسرعة.', img: 'https://images.unsplash.com/photo-1519741491655-8c4689e2d8a5?auto=format&fit=crop&w=800&q=80', category: 'أزياء', gallery: [], available: true },
    { id: 3, name: 'ساعة ذكية فرفاشة', price: 799, originalPrice: 999, discount: 20, desc: 'متابعة النشاط الرياضي، الإشعارات، وستايل مميز.', img: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=800&q=80', category: 'إلكترونيات', gallery: [], available: true },
    { id: 4, name: 'طقم مجوهرات شبابية', price: 189, desc: 'سلسلة و إسورة بتفاصيل ملفتة و تصميم يناسب كل الأذواق.', img: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80', category: 'إكسسوارات', gallery: [], available: true },
    { id: 5, name: 'نظارة شمسية فاخرة', price: 249, desc: 'إطار أنيق وعدسات مضادة للأشعة لستايل صيفي ممتاز.', img: 'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?auto=format&fit=crop&w=800&q=80', category: 'إكسسوارات', gallery: [], available: true },
    { id: 6, name: 'موبايل سيلفر فرفاشة', price: 2899, desc: 'هاتف حديث مع كاميرا مميزة وشاشة سينمائية.', img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', category: 'إلكترونيات', gallery: [], available: true },
  ],
  cart: [],
  orders: [],
  social: {
    telegram: '#',
    whatsapp: '#',
    facebook: '#'
  },
  reviewImages: [],
  categories: [
    { id: 1, name: 'أزياء', img: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80' },
    { id: 2, name: 'إلكترونيات', img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80' },
    { id: 3, name: 'إكسسوارات', img: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=400&q=80' }
  ],
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

const SUPABASE_URL = 'https://spvrkohlqflsyjiexcvo.supabase.co';
const SUPABASE_PUBLIC_KEY = 'sb_publishable_hFZTx_2ZRGoWv93qFMnuRw_G_WNueVe';
let supabaseClient = null;

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
      select: (columns = '*') => ({
        eq: (column, value) => ({
          single: async () => {
            const data = await this.request(`${table}?${column}=eq.${encodeURIComponent(value)}&select=${columns}`);
            return { data: data[0] || null, error: null };
          }
        }),
        order: (column, { ascending = true } = {}) => {
          const query = async () => {
            const orderParam = ascending ? `${column}.asc` : `${column}.desc`;
            const data = await this.request(`${table}?select=${columns}&order=${orderParam}`);
            return { data, error: null };
          };
          return {
            then: (resolve, reject) => query().then(resolve, reject),
            catch: (reject) => query().catch(reject)
          };
        }
      }),
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
          select: () => ({
            single: async () => {
              const result = await execute();
              return { data: Array.isArray(result.data) ? result.data[0] || null : result.data, error: null };
            }
          }),
          then: (resolve, reject) => execute().then(resolve, reject),
          catch: (reject) => execute().catch(reject)
        };
      }
    };
  }
}

async function initSupabaseClient() {
  if (window.supabase && typeof window.supabase.createClient === 'function') {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
    return;
  }

  // Use our simple client as fallback
  supabaseClient = new SimpleSupabaseClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
  console.log('Using simple Supabase client fallback');
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
    status: order.status || 'new'
  };
}

function mapOrderToDb(order) {
  return {
    id: order.id,
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
    status: order.status || 'new'
  };
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
      return items.map(item => ({ id: item.id, name: item.name, img: item.img }));
    default:
      return items;
  }
}

async function saveToFirestore(collectionName, docId, data) {
  if (collectionName !== 'settings') return;
  try {
    const { error } = await supabaseClient
      .from('settings')
      .upsert({ id: docId, data: data });
    if (error) throw error;
  } catch (error) {
    console.error('Error saving settings to Supabase:', error);
  }
}

async function loadFromFirestore(collectionName, docId) {
  if (collectionName !== 'settings') return null;
  if (!supabaseClient) {
    console.error('Supabase client is not initialized for loadFromFirestore');
    return null;
  }
  try {
    const { data, error } = await supabaseClient
      .from('settings')
      .select('data')
      .eq('id', docId)
      .single();
    if (error) {
      if (error.code === 'PGRST116' || error.details?.includes('No rows')) {
        return null;
      }
      console.error('Error loading settings from Supabase:', error);
      return null;
    }
    return data?.data || null;
  } catch (error) {
    console.error('Error loading settings from Supabase:', error);
    return null;
  }
}

async function loadCollectionFromFirestore(collectionName) {
  if (!supabaseClient) {
    console.error('Supabase client is not initialized for loadCollectionFromFirestore');
    return [];
  }
  try {
    console.log(`Attempting to load ${collectionName} from Supabase...`);
    const { data, error } = await supabaseClient
      .from(collectionName)
      .select('*')
      .order('id', { ascending: true });
    if (error) {
      console.error(`Error loading ${collectionName} from Supabase:`, error);
      return [];
    }
    console.log(`Raw data from ${collectionName}:`, data);
    return normalizeCollectionFromDb(collectionName, data || []);
  } catch (error) {
    console.error(`Exception loading ${collectionName} from Supabase:`, error);
    return [];
  }
}

async function saveCollectionToFirestore(collectionName, items) {
  if (!Array.isArray(items) || items.length === 0) return;
  if (!supabaseClient) {
    console.error('Supabase client is not initialized for saveCollectionToFirestore');
    return;
  }
  try {
    const payload = mapCollectionToDb(collectionName, items);
    const { data, error } = await supabaseClient
      .from(collectionName)
      .upsert(payload, { onConflict: 'id' })
      .select()
      .single();
    if (error) {
      console.error(`Error saving ${collectionName} to Supabase:`, error);
    } else {
      console.log(`Successfully saved ${collectionName} to Supabase`);
    }
  } catch (error) {
    console.error(`Error saving ${collectionName} to Supabase:`, error);
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
  renderAdminProducts(adminProductSearch, adminProductPage);
  renderLatestProducts();
  renderDiscountedProducts();
  renderCategories();
  renderPickedProducts();
}

function renderLatestProducts() {
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
  const availableProducts = state.products.filter(product => product.available !== false);
  const shuffled = [...availableProducts].sort(() => Math.random() - 0.5);
  const picked = shuffled.slice(0, 4);
  pickedProductsGrid.innerHTML = picked.map(product => {
    const cardFooter = getProductCardFooter(product, false);
    return `
    <article class="product-card">
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
  categorySlider.innerHTML = state.categories.length ? state.categories.map(category => `
    <article class="category-card" onclick="window.location.hash='#category/${encodeURIComponent(category.name)}'">
      <div class="category-thumb">
        <img src="${category.img}" alt="${category.name}" loading="lazy">
      </div>
      <h4>${category.name}</h4>
    </article>
  `).join('') : '<p class="card-detail" style="grid-column: 1 / -1; text-align:center;">لم تتم إضافة فئات بعد.</p>';
}

function renderCategoryPage(categoryName) {
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
  for (let i = 0; i < quantity; i++) {
    addToCart(productId);
  }
  alert(`✅ تم إضافة ${quantity} من ${product.name} للسلة`);
}

function buyNow(productId) {
  addToCartFromDetail(productId);
  window.location.hash = '#checkout';
}

function renderCategoryPreview() {
  const preview = document.getElementById('category-preview-list');
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
    saveCollectionToFirestore('categories', state.categories);
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      alert('حجم البيانات كبير جداً. جاري حفظ الفئات بدون الصور لتوفير المساحة.');
      const categoriesWithoutImages = state.categories.map(cat => ({ ...cat, img: null }));
      saveCollectionToFirestore('categories', categoriesWithoutImages);
    } else {
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

  const applyCategoryUpdate = (imageData) => {
    if (categoryEditId) {
      const category = state.categories.find(item => item.id === categoryEditId);
      if (!category) return;
      category.name = name;
      if (imageData) category.img = imageData;
      saveCategories();
      renderCategories();
      renderCategoryPreview();
      resetCategoryForm();
      alert('تم تحديث الفئة بنجاح!');
      return;
    }

    if (!imageData) {
      alert('من فضلك اختر صورة أو أيقونة للفئة');
      return;
    }

    state.categories.unshift({ id: Date.now(), name, img: imageData });
    saveCategories();
    renderCategories();
    renderCategoryPreview();
    resetCategoryForm();
    alert('تم إضافة الفئة بنجاح!');
  };

  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
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
        applyCategoryUpdate(compressedData);
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  } else {
    applyCategoryUpdate(null);
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
  state.categories = state.categories.filter(item => item.id !== id);
  await saveCategories();
  renderCategories();
  renderCategoryPreview();
}

function populateCategorySelect() {
  const select = document.getElementById('new-category');
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
  const reviews = [...state.reviewImages].sort(() => Math.random() - 0.5).slice(0, 4);
  reviewImagesGrid.innerHTML = reviews.length ? reviews.map(image => `
    <article class="review-card">
      <img src="${image}" alt="صورة رأي عميل" loading="lazy">
    </article>
  `).join('') : '<p class="card-detail" style="grid-column: 1 / -1; text-align:center;">لم يتم إضافة صور بعد.</p>';
}

function renderReviewImagesPreview() {
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

function renderDiscountedProducts() {
  const discounted = state.products.filter(product => product.discount && product.available !== false);
  discountedProductsGrid.innerHTML = discounted.length ? discounted.map(product => {
    const cardFooter = getProductCardFooter(product, false);
    return `
    <article class="product-card">
      <img src="${product.img}" alt="${product.name}" loading="lazy">
      <div class="product-body">
        <h3>${product.name}</h3>
        <p>${product.desc}</p>
        <div class="product-meta">
          ${cardFooter}
        </div>
      </div>
    </article>
  `}).join('') : '<p class="card-detail" style="grid-column: 1 / -1; text-align: center;">مفيش عروض دلوقتي، شوف تاني لاحقًا.</p>';
}

function renderCart() {
  cartTableBody.innerHTML = state.cart.length ? state.cart.map(item => `
    <tr>
      <td><img src="${item.img}" alt="${item.name}"></td>
      <td>${item.name}</td>
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
  cartTotal.textContent = formatPrice(total);
  cartCount.textContent = state.cart.reduce((sum, item) => sum + item.quantity, 0);
}

function updateCartQuantity(productId, delta) {
  const item = state.cart.find(i => i.id === productId);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity < 1) {
    state.cart = state.cart.filter(i => i.id !== productId);
  }
  saveToFirestore('settings', 'cart', { items: state.cart });
  renderCart();
}

function addToCart(productId) {
  const product = state.products.find(p => p.id === productId);
  if (!product) return;
  if (product.available === false) {
    alert('المنتج غير متوفر الآن');
    return;
  }
  const existing = state.cart.find(item => item.id === productId);
  if (existing) existing.quantity += 1;
  else state.cart.push({ ...product, quantity: 1 });
  saveToFirestore('settings', 'cart', { items: state.cart });
  renderCart();
  alert('✅ المنتج اتضاف للسلة');
}

function removeFromCart(productId) {
  state.cart = state.cart.filter(item => item.id !== productId);
  saveToFirestore('settings', 'cart', { items: state.cart });
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
  const totalProducts = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
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

async function submitOrder(event) {
  event.preventDefault();
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
  const order = {
    id: Date.now(),
    orderNumber: getNextOrderNumber(),
    customer: formData.get('name'),
    phone: formData.get('phone'),
    governorate: selectedGov,
    address: formData.get('address'),
    payment: formData.get('payment'),
    notes: formData.get('notes'),
    coupon: couponCode,
    couponDiscount,
    shippingCost,
    items: state.cart.map(item => ({ id: item.id, name: item.name, qty: item.quantity, price: item.price, img: item.img })),
    total: baseTotal + shippingCost - couponDiscount,
    date: new Date().toLocaleString('ar-EG'),
    status: 'new'
  };
  state.orders.unshift(order);
  saveCollectionToFirestore('orders', state.orders);
  state.cart = [];
  saveToFirestore('settings', 'cart', { items: state.cart });
  renderCart();
  event.target.reset();
  confirmMessage.classList.remove('hidden');
  renderOrders();
  orderCount.textContent = state.orders.length;
  adminOrderBadge.textContent = state.orders.length;
  window.location.hash = '#home';
}

function renderOrders(search = '') {
  adminOrderSearch = search.toLowerCase().trim();
  const filtered = state.orders.filter(order => {
    const term = `${order.customer} ${order.orderNumber} ${order.id} ${order.phone}`.toLowerCase();
    return term.includes(adminOrderSearch);
  });

  ordersList.innerHTML = filtered.length ? filtered.map(order => {
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
          <span class="price-tag">${formatPrice(order.total)}</span>
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
              <span class="detail-name">${item.name}</span>
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
  renderCoupons(adminCouponSearch);
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
}

function renderAdminProducts(search = '', page = 1) {
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
    await saveToFirestore('settings', 'social', state.social);
    updateSocialLinksDisplay();
    event.target.reset();
    alert('تم حفظ الروابط بنجاح!');
  } catch (error) {
    console.error('خطأ في حفظ الروابط:', error);
    alert('حدث خطأ في حفظ الروابط. جرب تاني.');
  }
}

function updateSocialLinksDisplay() {
  document.getElementById('telegram-link').href = state.social.telegram;
  document.getElementById('whatsapp-link').href = state.social.whatsapp;
  document.getElementById('facebook-link').href = state.social.facebook;
}

function switchAdminTab(event) {
  const target = event.currentTarget.dataset.tab;
  adminTabButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === target));
  document.querySelectorAll('.admin-tab-panel').forEach(panel => panel.classList.toggle('hidden', panel.dataset.tab !== target));
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
    renderOrders(adminOrderSearch);
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

function initCategorySliderDrag() {
  if (!categorySlider) return;
  let isDragging = false;
  let startX;
  let scrollLeft;

  categorySlider.addEventListener('mousedown', (event) => {
    isDragging = true;
    categorySlider.classList.add('dragging');
    startX = event.pageX - categorySlider.offsetLeft;
    scrollLeft = categorySlider.scrollLeft;
  });

  categorySlider.addEventListener('mouseleave', () => {
    isDragging = false;
    categorySlider.classList.remove('dragging');
  });

  categorySlider.addEventListener('mouseup', () => {
    isDragging = false;
    categorySlider.classList.remove('dragging');
  });

  categorySlider.addEventListener('mousemove', (event) => {
    if (!isDragging) return;
    event.preventDefault();
    const x = event.pageX - categorySlider.offsetLeft;
    const walk = (x - startX) * 3.0;
    categorySlider.scrollLeft = scrollLeft - walk;
  });

  categorySlider.addEventListener('touchstart', (event) => {
    isDragging = true;
    categorySlider.classList.add('dragging');
    startX = event.touches[0].pageX - categorySlider.offsetLeft;
    scrollLeft = categorySlider.scrollLeft;
  }, { passive: true });

  categorySlider.addEventListener('touchmove', (event) => {
    if (!isDragging) return;
    const x = event.touches[0].pageX - categorySlider.offsetLeft;
    const walk = (x - startX) * 5.0;
    categorySlider.scrollLeft = scrollLeft - walk;
  }, { passive: true });

  categorySlider.addEventListener('touchend', () => {
    isDragging = false;
    categorySlider.classList.remove('dragging');
  });
}

window.addEventListener('hashchange', handleHashChange);
window.addEventListener('DOMContentLoaded', async () => {
  await initSupabaseClient();
  console.log('Supabase client initialized, loading data...');

  const savedSocial = await loadFromFirestore('settings', 'social');
  console.log('Loaded social settings:', savedSocial);
  if (savedSocial) {
    state.social = savedSocial;
  }

  const savedProducts = await loadCollectionFromFirestore('products');
  console.log('Loaded products from Supabase:', savedProducts.length, 'products');
  if (savedProducts.length > 0) {
    state.products = savedProducts;
    state.products.forEach(product => {
      if (!product.category) product.category = 'أخرى';
      if (!product.gallery) product.gallery = [];
      if (product.available === undefined) product.available = true;
    });
  }

  const savedOrders = await loadCollectionFromFirestore('orders');
  console.log('Loaded orders from Supabase:', savedOrders.length, 'orders');
  if (savedOrders.length > 0) {
    state.orders = savedOrders;
    normalizeOrderNumbers();
    saveCollectionToFirestore('orders', state.orders);
  }

  const savedCart = await loadFromFirestore('settings', 'cart');
  console.log('Loaded cart from Supabase:', savedCart);
  if (savedCart) {
    state.cart = savedCart.items || [];
  }

  const savedReviewImages = await loadFromFirestore('settings', 'review_images');
  console.log('Loaded review images from Supabase:', savedReviewImages);
  if (savedReviewImages) {
    state.reviewImages = savedReviewImages.images || [];
  }

  const savedCategories = await loadCollectionFromFirestore('categories');
  console.log('Loaded categories from Supabase:', savedCategories.length, 'categories');
  if (savedCategories.length > 0) {
    state.categories = savedCategories;
  }

  const savedShippingRates = await loadFromFirestore('settings', 'shipping_rates');
  console.log('Loaded shipping rates from Supabase:', savedShippingRates);
  if (savedShippingRates) {
    state.shippingRates = { ...state.shippingRates, ...savedShippingRates.rates };
  }

  const savedCoupons = await loadCollectionFromFirestore('coupons');
  console.log('Loaded coupons from Supabase:', savedCoupons.length, 'coupons');
  if (savedCoupons.length > 0) {
    state.coupons = savedCoupons;
  }

  console.log('Data loading complete, rendering products...');
  renderProducts();
  renderCart();
  renderReviewImages();
  renderReviewImagesPreview();
  renderOrders();
  initCategorySliderDrag();
  populateCategorySelect();
  orderCount.textContent = state.orders.length;
  adminOrderBadge.textContent = state.orders.length;
  updateSocialLinksDisplay();
  if (!window.location.hash) window.location.hash = '#home';
  handleHashChange();
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

function saveShippingRates() {
  const inputs = document.querySelectorAll('#shipping-rates-list input');
  inputs.forEach(input => {
    const gov = input.dataset.gov;
    const price = parseFloat(input.value) || 0;
    state.shippingRates[gov] = price;
  });
  saveToFirestore('settings', 'shipping_rates', { rates: state.shippingRates });
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
