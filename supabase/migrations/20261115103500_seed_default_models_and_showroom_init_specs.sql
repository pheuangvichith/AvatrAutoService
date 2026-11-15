-- Seed canonical AVATR vehicle catalog models, purge leftover E2E/test rows,
-- and upgrade get_showroom_initial_data() with full model specs and throttled last_login tracking.
BEGIN;

-- 1. Idempotently upsert canonical AVATR showroom models
INSERT INTO public.vehicle_models (
  id,
  name,
  brand,
  subtitle,
  tagline,
  category,
  price_starting_usd,
  price_starting_lak,
  range_cltc,
  acceleration,
  battery_capacity,
  battery_supplier,
  charging_speed,
  smart_driving,
  powertrain,
  colors,
  features,
  gallery,
  description,
  hero_image,
  is_custom,
  updated_at
)
VALUES
  (
    'avatr-12',
    'AVATR 12',
    'AVATR',
    'Future Luxury Grand Coupé',
    'ອະນາຄົດແຫ່ງຍົນລະກຳໄຟຟ້າຊັ້ນສູງ | ຄວາມຫຼູຫຼາແບບ Pure Minimal',
    'Grand Coupé',
    46800,
    1029600000,
    '700 km',
    '3.9s (0-100 km/h)',
    '94.5 kWh',
    'CATL CTP Ternary Lithium',
    '800V High-Voltage Silicon Carbide (30-80% in 15min)',
    'Huawei Qiankun ADS 3.0 + HarmonyOS Cockpit',
    'Dual-Motor AWD (578 hp)',
    '[{"name":"Obsidian Black","hex":"#0a0a0b","previewClass":"bg-zinc-950 border border-zinc-700"},{"name":"Ceramic White","hex":"#f4f4f5","previewClass":"bg-zinc-100 border border-zinc-300"},{"name":"Liquid Titanium","hex":"#71717a","previewClass":"bg-zinc-500 border border-zinc-400"},{"name":"Midnight Charcoal","hex":"#18181b","previewClass":"bg-zinc-900 border border-zinc-700"}]'::jsonb,
    '["35.4-inch 4K Panoramic Halo Screen across the dash","Electronic Digital Rearview Mirrors with Rain-Fog Filter","Huawei ADS 3.0 with 3 Lidar sensors & 300m range","Zero-Gravity Front Luxury Lounge Seats with 8-point massage","7.1.4 Meridian-grade 27-speaker immersive acoustic suite","Smart Electric Retractable Spoiler & Frameless Gullwing-inspired Doors"]'::jsonb,
    '["https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    'AVATR 12 ເປັນລົດ Grand Coupé ໄຟຟ້າລະດັບ Flagship ທີ່ປະສານງານອອກແບບລ້ຳຍຸກ ໂດຍ Munich Design Center ຮ່ວມກັບເຕັກໂນໂລຊີ AI ອັດສະລິຍະຈາກ Huawei ແລະ ແບັດເຕີຣີມາດຕະຖານໂລກຈາກ CATL. ມາພ້ອມໜ້າຈໍ 35.4 ນິ້ວ 4K Remote Panoramic Display, ແວ່ນເບິ່ງຫຼັງດິຈິຕອນ HD, ແລະ ລະບົບຊ່ວງລ່າງຖົງລົມອັດສະລິຍະ.',
    'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
    FALSE,
    now()
  ),
  (
    'avatr-11',
    'AVATR 11',
    'AVATR',
    'Smart Emotional Luxury SUV',
    'SUV Coupé ໄຟຟ້າອັດສະລິຍະ | ພະລັງຂັບເຄື່ອນທີ່ໄຮ້ຂີດຈຳກັດ',
    'Luxury SUV Coupé',
    43900,
    965800000,
    '730 km',
    '3.98s (0-100 km/h)',
    '116 kWh',
    'CATL High-Energy Density Battery',
    '750V / 240kW Ultra-Fast Charging (200km in 10min)',
    'Huawei Triple-LiDAR Autonomous Driving System',
    'Dual-Motor AWD (425 kW / 578 ps)',
    '[{"name":"Gloss Onyx Black","hex":"#09090b","previewClass":"bg-black border border-zinc-700"},{"name":"Alpine Pearl White","hex":"#fafafa","previewClass":"bg-zinc-200 border border-zinc-400"},{"name":"Monochrome Silver","hex":"#52525b","previewClass":"bg-zinc-600 border border-zinc-500"}]'::jsonb,
    '["Iconic Emotion Vortex Ambient Intelligent Console","Triple Ultra-long range LiDAR sensors embedded seamlessly","Active Speed-sensing Aerodynamic Rear Spoiler","Antibacterial Nappa Leather & Alcantara Roof Lining","800V Architecture with Instant Supercharging Capability","Autonomous Valet Parking (AVP) & Remote Summon via App"]'::jsonb,
    '["https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    'AVATR 11 ມອບປະສົບການຂັບຂີ່ SUV Coupé ທີ່ໂດດເດັ່ນດ້ວຍຮູບຊົງ Aerodynamic ທີ່ໜັກແໜ້ນ ແລະ ໂຄ້ງມົນຄືຍານອະວະກາດ. ໂດດເດັ່ນດ້ວຍ "Vortex" Center Emotion Console ທີ່ຕອບສະໜອງຕໍ່ອາລົມຜູ້ຂັບຂີ່ ແລະ ລະບົບຊ່ວຍຂັບອັດຕະໂນມັດເຕັມຮູບແບບ.',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    FALSE,
    now()
  ),
  (
    'avatr-07',
    'AVATR 07',
    'AVATR',
    'Intelligent Urban Luxury Crossover',
    'ຍົນລະກຳອັດສະລິຍະສຳລັບຄົນລຸ້ນໃໝ່ | Smart City EV',
    'Smart Urban SUV',
    36500,
    803000000,
    '650 km / EREV 1150 km',
    '4.9s (0-100 km/h)',
    '82 kWh',
    'CATL Shenxing Ultra-Recharge Battery',
    '4C Supercharge (30-80% in 10 minutes)',
    'Huawei ADS 3.0 End-to-End Smart Pilot',
    'Dual-Motor AWD / EREV Super Hybrid',
    '[{"name":"Obsidian Jet","hex":"#000000","previewClass":"bg-black border border-zinc-700"},{"name":"Pure Chalk White","hex":"#ffffff","previewClass":"bg-white border border-zinc-400"},{"name":"Carbon Graphite","hex":"#27272a","previewClass":"bg-zinc-800 border border-zinc-600"}]'::jsonb,
    '["Dual Options: 100% Pure Electric or Super Hybrid EREV (1150km)","Next-Gen HarmonyOS 4.0 Cockpit with Instant Voice Assistant","Ultra-compact Aerodynamic Drag Coefficient (0.268 Cd)","CATL Shenxing 4C Battery - 10-minute fast charging","Surround 360 Sensing with Huawei 192-line LiDAR","High-grade Acoustic Glass & Active Road Noise Cancellation"]'::jsonb,
    '["https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    'AVATR 07 ລຸ້ນໃໝ່ຫຼ້າສຸດ ເໝາະສຳລັບການນຳໃຊ້ໃນຕົວເມືອງ ແລະ ເດີນທາງໄກໃນລາວ. ສະເໜີທັງລຸ້ນ Pure EV ແລະ Range Extender (EREV) ທີ່ສາມາດຂັບຂີ່ໄດ້ໄກກວ່າ 1,150 ກິໂລແມັດ ພ້ອມແບັດເຕີຣີ CATL Shenxing ທີ່ສາກໄວທີ່ສຸດ.',
    'https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?auto=format&fit=crop&w=1200&q=80',
    FALSE,
    now()
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  brand = EXCLUDED.brand,
  subtitle = EXCLUDED.subtitle,
  tagline = EXCLUDED.tagline,
  category = EXCLUDED.category,
  price_starting_usd = EXCLUDED.price_starting_usd,
  price_starting_lak = EXCLUDED.price_starting_lak,
  range_cltc = EXCLUDED.range_cltc,
  acceleration = EXCLUDED.acceleration,
  battery_capacity = EXCLUDED.battery_capacity,
  battery_supplier = EXCLUDED.battery_supplier,
  charging_speed = EXCLUDED.charging_speed,
  smart_driving = EXCLUDED.smart_driving,
  powertrain = EXCLUDED.powertrain,
  colors = EXCLUDED.colors,
  features = EXCLUDED.features,
  gallery = EXCLUDED.gallery,
  description = EXCLUDED.description,
  hero_image = EXCLUDED.hero_image,
  is_custom = EXCLUDED.is_custom,
  updated_at = EXCLUDED.updated_at;

-- 2. Delete temporary test models if unreferenced
DELETE FROM public.vehicle_models
WHERE id IN ('avatr-07-ultra-performance-7713', 'avatr-avatr-07-ultra-performance-7713')
  AND NOT EXISTS (SELECT 1 FROM public.vehicles WHERE model_id = vehicle_models.id)
  AND NOT EXISTS (SELECT 1 FROM public.customers WHERE interested_model_id = vehicle_models.id);

-- 3. Purge the 2 E2E test rows from bill_void_logs
DELETE FROM public.bill_void_logs
WHERE reason IN ('E2E revert test', 'E2E void sale rollback check');

-- 4. Soft-archive the suspended test account test01@gmail.com
UPDATE public.staff_profiles
SET status = 'archived',
    archived_at = COALESCE(archived_at, now()),
    updated_at = now()
WHERE email = 'test01@gmail.com' AND status = 'suspended';

-- 5. Upgrade get_showroom_initial_data() to return full model specs and record last_login
CREATE OR REPLACE FUNCTION public.get_showroom_initial_data()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog, pg_temp
AS $fn$
DECLARE
  v_models jsonb;
  v_vehicles jsonb;
  v_customers jsonb;
  v_roles jsonb;
  v_settings jsonb;
BEGIN
  IF NOT public.is_active_staff() THEN
    RAISE EXCEPTION 'Access denied. Active staff credentials required.';
  END IF;

  UPDATE public.staff_profiles
  SET last_login = now()
  WHERE id = (SELECT auth.uid())
    AND (last_login IS NULL OR last_login < now() - interval '5 minutes');

  SELECT COALESCE(jsonb_agg(m), '[]'::jsonb) INTO v_models
  FROM (
    SELECT id, name, brand, subtitle, tagline, category, price_starting_usd, price_starting_lak,
           range_cltc, acceleration, battery_capacity, battery_supplier, charging_speed,
           smart_driving, powertrain,
           CASE WHEN length(hero_image) > 2000 THEN NULL ELSE hero_image END AS hero_image,
           gallery, is_custom, colors, features, description, created_at
    FROM public.vehicle_models
    ORDER BY created_at ASC
  ) m;

  SELECT COALESCE(jsonb_agg(v), '[]'::jsonb) INTO v_vehicles
  FROM (SELECT * FROM public.vehicles ORDER BY created_at DESC) v;

  SELECT COALESCE(jsonb_agg(c), '[]'::jsonb) INTO v_customers
  FROM (SELECT * FROM public.customers ORDER BY created_at DESC) c;

  SELECT COALESCE(jsonb_agg(r), '[]'::jsonb) INTO v_roles
  FROM (SELECT * FROM public.staff_roles WHERE is_active = TRUE ORDER BY sort_order ASC) r;

  SELECT to_jsonb(s) INTO v_settings
  FROM (SELECT * FROM public.dealership_settings LIMIT 1) s;

  RETURN jsonb_build_object(
    'models', v_models,
    'vehicles', v_vehicles,
    'customers', v_customers,
    'roles', v_roles,
    'settings', COALESCE(v_settings, '{}'::jsonb)
  );
END;
$fn$;

REVOKE ALL ON FUNCTION public.get_showroom_initial_data() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_showroom_initial_data() TO authenticated;

COMMIT;
