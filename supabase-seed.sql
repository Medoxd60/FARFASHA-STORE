-- Supabase seed data for FARFASHA store
-- شغّل هذا الملف في SQL Editor الخاص بـ Supabase.
-- إذا الجداول موجودة، فلن ينشأها مرة أخرى.

CREATE TABLE IF NOT EXISTS categories (
  id bigserial primary key,
  name text not null,
  img text,
  created_at timestamptz default now()
);

CREATE TABLE IF NOT EXISTS products (
  id bigserial primary key,
  name text not null,
  price numeric not null,
  original_price numeric,
  discount int,
  description text,
  img text,
  gallery jsonb default '[]',
  category text,
  available boolean default true,
  created_at timestamptz default now()
);

CREATE TABLE IF NOT EXISTS coupons (
  id bigserial primary key,
  code text unique not null,
  type text not null,
  value numeric not null,
  start date not null,
  end_date date not null,
  active boolean default true,
  created_at timestamptz default now()
);

CREATE TABLE IF NOT EXISTS orders (
  id bigserial primary key,
  order_number int unique,
  customer text not null,
  phone text not null,
  governorate text,
  address text,
  payment text,
  notes text,
  coupon text,
  coupon_discount numeric,
  shipping_cost numeric,
  total numeric,
  items jsonb not null,
  created_at timestamptz default now(),
  status text default 'new'
);

CREATE TABLE IF NOT EXISTS settings (
  id bigserial primary key,
  key text unique not null,
  value jsonb not null,
  updated_at timestamptz default now()
);

-- Categories
INSERT INTO categories (id, name, img)
VALUES
  (1, 'أزياء', 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80'),
  (2, 'إلكترونيات', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80'),
  (3, 'إكسسوارات', 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=400&q=80')
ON CONFLICT (id) DO NOTHING;

-- Products
INSERT INTO products (id, name, price, original_price, discount, description, img, gallery, category, available)
VALUES
  (1, 'شنطة فانشوشة ستايل', 229, 299, 23, 'شنطة يدوية بتصميم عصري و خامة قوية للأيام المثالية.', 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80"]', 'إكسسوارات', true),
  (2, 'جزمة فرفشة رياضية', 399, 499, 20, 'جزمة خفيفة ومرنة مناسبة لكل يوم وخروجاتك بسرعة.', 'https://images.unsplash.com/photo-1519741491655-8c4689e2d8a5?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1519741491655-8c4689e2d8a5?auto=format&fit=crop&w=800&q=80"]', 'أزياء', true),
  (3, 'ساعة ذكية فرفاشة', 799, 999, 20, 'متابعة النشاط الرياضي، الإشعارات، وستايل مميز.', 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=800&q=80"]', 'إلكترونيات', true),
  (4, 'طقم مجوهرات شبابية', 189, NULL, NULL, 'سلسلة و إسورة بتفاصيل ملفتة و تصميم يناسب كل الأذواق.', 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80"]', 'إكسسوارات', true),
  (5, 'نظارة شمسية فاخرة', 249, NULL, NULL, 'إطار أنيق وعدسات مضادة للأشعة لستايل صيفي ممتاز.', 'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1495567720989-cebdbdd97913?auto=format&fit=crop&w=800&q=80"]', 'إكسسوارات', true),
  (6, 'موبايل سيلفر فرفاشة', 2899, NULL, NULL, 'هاتف حديث مع كاميرا مميزة وشاشة سينمائية.', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80"]', 'إلكترونيات', true)
ON CONFLICT (id) DO NOTHING;

-- Coupons
INSERT INTO coupons (id, code, type, value, start, end_date, active)
VALUES
  (1, 'FARFASHA10', 'percentage', 10, '2024-01-01', '2024-12-31', true),
  (2, 'SUMMER15', 'percentage', 15, '2024-06-01', '2024-08-31', true),
  (3, 'WELCOME25', 'amount', 25, '2024-01-01', '2024-12-31', true)
ON CONFLICT (id) DO NOTHING;

-- Settings
INSERT INTO settings (key, value)
VALUES
  ('social', '{"telegram":"#","whatsapp":"#","facebook":"#"}'),
  ('shipping_rates', '{"القاهرة":0,"الإسكندرية":50,"الجيزة":20,"القليوبية":30,"بورسعيد":60,"السويس":55,"دمياط":65,"الدقهلية":40,"الشرقية":45,"الإسماعيلية":50,"البحيرة":70,"كفر الشيخ":75,"الغربية":35,"المنوفية":40,"بني سويف":80,"الفيوم":85,"المنيا":90,"أسيوط":95,"سوهاج":100,"قنا":105,"الأقصر":110,"أسوان":115,"البحر الأحمر":120,"الوادي الجديد":125,"مطروح":130,"شمال سيناء":135,"جنوب سيناء":140}'),
  ('review_images', '{"images":["https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=700&q=80","https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=700&q=80","https://images.unsplash.com/photo-1495567720989-cebdbdd97913?auto=format&fit=crop&w=700&q=80"]}')
ON CONFLICT (key) DO NOTHING;

