-- Banovani — Seed Data
-- Run AFTER 001_initial_schema.sql and 002_rls_policies.sql

-- ─── Categories ──────────────────────────────────────────────────────────────
insert into categories (name, slug, sort_order, is_active) values
  ('Dresses',      'dresses',      1, true),
  ('Tops',         'tops',         2, true),
  ('Sets',         'sets',         3, true),
  ('Pants',        'pants',        4, true),
  ('Skirts',       'skirts',       5, true),
  ('Accessories',  'accessories',  6, true),
  ('New Arrivals', 'new-arrivals', 7, true),
  ('Sale',         'sale',         8, true)
on conflict (slug) do nothing;

-- ─── Settings ────────────────────────────────────────────────────────────────
insert into settings (key, value) values
  ('delivery_fee_tbilisi',          '5'),
  ('delivery_fee_regional',         '10'),
  ('free_delivery_threshold',       '150'),
  ('low_stock_threshold',           '3'),
  ('instagram_url',                 '"https://www.instagram.com/banovaniofficial/"'),
  ('whatsapp_url',                  '"https://wa.me/995000000000"'),
  ('whatsapp_number',               '"+995000000000"'),
  ('contact_email',                 '"hello@banovani.ge"'),
  ('store_name',                    '"Banovani"'),
  ('currency',                      '"GEL"'),
  ('currency_symbol',               '"₾"'),
  ('delivery_estimate_tbilisi',     '"1-2 business days"'),
  ('delivery_estimate_regional',    '"2-4 business days"'),
  ('return_policy_days',            '14'),
  ('return_policy_text',            '"Items can be exchanged within 14 days of delivery. Items must be unworn, unwashed, and with original tags attached. Contact us via Instagram or WhatsApp to start a return."'),
  ('delivery_policy_text',          '"We deliver to all regions of Georgia. Tbilisi deliveries: 1-2 business days. Regional deliveries: 2-4 business days. Free delivery on orders over ₾150."'),
  ('order_confirmation_message',    '"Thank you for your order. Banovani will contact you soon to confirm the details."'),
  ('order_confirmation_message_ka', '"მადლობა შეკვეთისთვის. Banovani მალე დაგიკავშირდებათ დეტალების დასადასტურებლად."'),
  ('size_guide',                    '{"XS":{"chest":"80-84","waist":"60-64","hips":"88-92"},"S":{"chest":"84-88","waist":"64-68","hips":"92-96"},"M":{"chest":"88-92","waist":"68-72","hips":"96-100"},"L":{"chest":"92-96","waist":"72-76","hips":"100-104"},"XL":{"chest":"96-100","waist":"76-80","hips":"104-108"},"XXL":{"chest":"100-106","waist":"80-86","hips":"108-114"}}')
on conflict (key) do nothing;
