import test from 'node:test';
import assert from 'node:assert/strict';
import { parseStockCsv } from '../src/utils/stockCsvImport';
import { parseBookingCsv } from '../src/utils/bookingCsvImport';
import { parseSalesCsv, normalizeVin, parseLaoAddress } from '../src/utils/salesCsvImport';
import type { VehicleModel } from '../src/types';

const MODELS: VehicleModel[] = [
  {
    id: 'avatr-12',
    name: 'AVATR 12',
    brand: 'AVATR',
    subTitle: 'Grand Coupé',
    tagline: 'Future Coupé',
    category: 'Sedan',
    priceStartingUSD: 46800,
    priceStartingLAK: 1029600000,
    rangeCLTC: '650 km',
    acceleration: '3.9s',
    colors: [],
    features: [],
    description: '',
    heroImage: '',
  },
  {
    id: 'avatr-11',
    name: 'AVATR 11',
    brand: 'AVATR',
    subTitle: 'SUV Coupé',
    tagline: 'Luxury SUV',
    category: 'SUV',
    priceStartingUSD: 43900,
    priceStartingLAK: 965800000,
    rangeCLTC: '650 km',
    acceleration: '3.9s',
    colors: [],
    features: [],
    description: '',
    heroImage: '',
  },
  {
    id: 'avatr-07',
    name: 'AVATR 07',
    brand: 'AVATR',
    subTitle: 'SUV',
    tagline: 'Future SUV',
    category: 'SUV',
    priceStartingUSD: 42900,
    priceStartingLAK: 943800000,
    rangeCLTC: '650 km',
    acceleration: '3.9s',
    colors: [],
    features: [],
    description: '',
    heroImage: '',
  },
  {
    id: 'avatr-06t',
    name: 'AVATR 06T',
    brand: 'AVATR',
    subTitle: 'Tourer',
    tagline: 'Shooting Brake',
    category: 'Wagon',
    priceStartingUSD: 43500,
    priceStartingLAK: 957000000,
    rangeCLTC: '650 km',
    acceleration: '3.9s',
    colors: [],
    features: [],
    description: '',
    heroImage: '',
  },
  {
    id: 'zero-price-model',
    name: 'AVATR Zero',
    brand: 'AVATR',
    subTitle: 'Test',
    tagline: 'Test',
    category: 'SUV',
    priceStartingUSD: 0,
    priceStartingLAK: 0,
    rangeCLTC: '650 km',
    acceleration: '3.9s',
    colors: [],
    features: [],
    description: '',
    heroImage: '',
  },
];

test('parseStockCsv resolves catalog price when positive', () => {
  const csv = [
    'Model,VIN,Color',
    'AVATR 07 Pro,LL889900112233445,White',
  ].join('\n');
  const parsed = parseStockCsv(csv, 'stock.csv', MODELS, new Set(), new Set());
  assert.equal(parsed.rows.length, 1);
  assert.equal(parsed.rows[0].state, 'new');
  assert.equal(parsed.rows[0].item?.priceUSD, 42900);
});

test('parseStockCsv rejects row with price_missing when model catalog price is 0 and no CSV unit price is supplied', () => {
  const csv = [
    'Model,VIN,Color',
    'AVATR Zero Edition,LL889900112233446,Black',
  ].join('\n');
  const parsed = parseStockCsv(csv, 'stock.csv', MODELS, new Set(), new Set());
  assert.equal(parsed.rows.length, 1);
  assert.equal(parsed.rows[0].state, 'invalid');
  assert.ok(parsed.rows[0].problems.includes('price_missing'));
  assert.equal(parsed.rows[0].item, undefined);
});

test('parseStockCsv accepts valid CSV Unit Price column when catalog price is 0', () => {
  const csv = [
    'Model,VIN,Unit Price,Color',
    'AVATR Zero Edition,LL889900112233447,48500,Silver',
  ].join('\n');
  const parsed = parseStockCsv(csv, 'stock.csv', MODELS, new Set(), new Set());
  assert.equal(parsed.rows.length, 1);
  assert.equal(parsed.rows[0].state, 'new');
  assert.equal(parsed.rows[0].item?.priceUSD, 48500);
});

test('parseStockCsv handles shifted AT VIN, RWD-in-AWD, AWD-in-RWD, section batch, company reservation, and summary rows', () => {
  const csv = [
    'ເດືອນ4 ທີ່ຍັງຄ້າສະຕ໋ອກ 20-30/04/2026,,,,,,,',
    'No.,Model,1,VIN No,Front Motor No.,Rear Motor No.,Exterior Color,Interior Color,Remark',
    '5,AVATR 12-G AWD Lv3 Jordan version,1,AT,LS6EKG0Y0VA980029,2102312SCR10SC100299,210260026910SB100238,210260026910SB100238,Liquid Caramel',
    'ເດືອນ5 ທີ່ຍັງຄ້າສະຕ໋ອກ 27/05/2026,,,,,,,,',
    '1,AVATR 07 Elite EV Edition,1,LS6J3E1E9TK504132,THMAC002966,White,Full Caramel Luxe,,',
    'No.,Model,,VIN No,Rear Motor No.,Exterior Color,Interior Color,,',
    'ເດືອນ6 ທີ່ຍັງຄ້າສະຕ໋ອກ20/06/26,,,,,,,,',
    '1,AVATR 11-G 116kWh AWD 4-Seat,1,LS6D3G0Y4TA600096,2102312SCR10SC100402,210260026910T2100118,Matte White,NAPPA red,',
    '2,AVATR 06T Elite Dual-Motor EV Edition,1,LS6EME473TA600422,TKKAA014014,Glossy White,Kalypso red,ບໍລິສັດ ເອັສວີ ອໍໂຕໂມບິວ (ປາກເຊ),',
    ',AVATR 12,,10,,,,,',
  ].join('\n');

  const parsed = parseStockCsv(csv, 'Stock Available.csv', MODELS, new Set(), new Set());
  assert.equal(parsed.rows.length, 4);

  const [r1, r2, r3, r4] = parsed.rows;
  assert.equal(r1.vin, 'LS6EKG0Y0VA980029');
  assert.equal(r1.item?.frontMotorNumber, '2102312SCR10SC100299');
  assert.equal(r1.item?.rearMotorNumber, '210260026910SB100238');
  assert.equal(r1.item?.color, 'Liquid Caramel');
  assert.equal(r1.item?.incomingBatch, 'ເດືອນ4 ທີ່ຍັງຄ້າສະຕ໋ອກ 20-30/04/2026');

  assert.equal(r2.item?.frontMotorNumber, undefined);
  assert.equal(r2.item?.rearMotorNumber, 'THMAC002966');
  assert.equal(r2.item?.color, 'White');
  assert.equal(r2.item?.interiorColor, 'Full Caramel Luxe');
  assert.equal(r2.item?.incomingBatch, 'ເດືອນ5 ທີ່ຍັງຄ້າສະຕ໋ອກ 27/05/2026');

  assert.equal(r3.item?.frontMotorNumber, '2102312SCR10SC100402');
  assert.equal(r3.item?.rearMotorNumber, '210260026910T2100118');
  assert.equal(r3.item?.color, 'Matte White');
  assert.equal(r3.item?.interiorColor, 'NAPPA red');

  assert.equal(r4.item?.model, 'AVATR 06T');
  assert.equal(r4.item?.status, 'reserved');
  assert.equal(r4.item?.reservedForCustomer, 'ບໍລິສັດ ເອັສວີ ອໍໂຕໂມບິວ (ປາກເຊ)');
});

test('parseBookingCsv handles multi-car fleet bookings, missing-phone bookings, duplicate no-phone rows, and $57,000 AVATR 11 inference', () => {
  const csv = [
    'ວັນເດືອນປີ,ຊື່ລູກຄ້າ,ເບີໂທ,ປະເພດລົດ,ມູນຄ່າລວມ,ມັດຈຳ',
    '27/06/2026,ບໍລິສັດ ເອັສວີ ອໍໂຕໂມບິວ (ປາກເຊ),020 55733999,AVATR 12-G 94.5 kWh AWD Lv3,61600,18480',
    '27/07/2026,ບໍລິສັດ ເອັສວີ ອໍໂຕໂມບິວ (ປາກເຊ),020 55733999,AVATR 06T Elite Dual-Motor EV Edition,43500,18480',
    '24/10/2026,ນາງ ພອນວິໄລ ລັດຈະນົງ,,,57000,2000',
    '24/10/2026,ນ. ພອນວິໄລ ລັດຈະນົງ,,,57000,2000',
  ].join('\n');

  const parsed = parseBookingCsv(csv, 'bookings.csv', MODELS, new Set(), new Set());
  assert.equal(parsed.rows.length, 4);
  assert.deepEqual(parsed.rows.map(r => r.state), ['new', 'new', 'new', 'duplicate']);
  assert.equal(parsed.rows[2].lead?.phone, '-');
  assert.equal(parsed.rows[2].lead?.interestedModel, 'AVATR 11');
  assert.ok(parsed.rows[2].problems.includes('phone_missing'));
});

test('parseSalesCsv normalizes Avatr VIN typos, skips signature footer, and merges fleet & no-phone bookings', () => {
  assert.equal(normalizeVin('LS6J3EIE3TK504787'), 'LS6J3E1E3TK504787');
  assert.equal(normalizeVin('LS6JE1E5TK500434'), 'LS6J3E1E5TK500434');

  const bookingsCsv = [
    'ວັນເດືອນປີ,ຊື່ລູກຄ້າ,ເບີໂທ,ປະເພດລົດ,ມູນຄ່າລວມ,ມັດຈຳ',
    '03/05/2026,ນ. ມະໄລ ເຈືອງຕະວະລາດ,,AVATR 07 Elite EV Edition,44900,1000',
    '27/06/2026,ບໍລິສັດ ເອັສວີ ອໍໂຕໂມບິວ (ປາກເຊ),020 55733999,AVATR 12-G 94.5 kWh AWD Lv3,61600,18480',
  ].join('\n');
  const leads = parseBookingCsv(bookingsCsv, 'b.csv', MODELS, new Set(), new Set()).rows.map(r => r.lead!);

  const salesCsv = [
    'ວ.ດ.ປ,ລາຍຊື່ລູກຄ້າ,ເບີໂທລູກຄ້າ,ລຸ້ນລົດ,ເລກຖັງ,ລາຄາລົດ',
    '05/05/2026,ບໍລິສັດ ເອັສວີ ອໍໂຕໂມບິວ (ປາກເຊ),020 55733999,AVATR 11-G 4 Seats,LS6D3G0Y3TA600056,58600',
    '19/05/2026,ນາງ ມະໄລ ເຈືອງຕະວະລາດ,020 56375832,AVATR 07 Elite EV Edition,LS6J3E1E4TK502661,44400',
    '27/06/2026,ບໍລິສັດ ເອັສວີ ອໍໂຕໂມບິວ (ປາກເຊ),020 55733999,AVATR 12-G 94.5 kWh AWD Lv3,LS6EKG0Y1TA600404,61600',
    '09/03/2026,ນາງ ດວງມະນີ ສີວົງສາ,020 54834368,AVATR 07 Elite EV Edition,LS6JE1E5TK500434,41400',
    '20/10/2026,ທ່ານ ສິດທິໄຊ ຣຸຈິລະວິໂລດ,020 54642954,AVATR 07 Elite EV Edition,LS6J3EIE3TK504787,42400',
    ',ເຊັນຜູ້ຈັດການ,,,,',
  ].join('\n');

  const claimed = new Set<string>();
  const parsed = parseSalesCsv(salesCsv, 's.csv', MODELS, leads, new Set(), new Set(), claimed);
  assert.equal(parsed.rows.length, 5);
  assert.deepEqual(parsed.rows.map(r => r.state), ['new', 'merge', 'merge', 'new', 'new']);
  assert.equal(parsed.rows[1].lead?.phone, '020 56375832');
  assert.equal(parsed.rows[2].lead?.interestedModel, 'AVATR 12');
  assert.equal(parsed.rows[3].vin, 'LS6J3E1E5TK500434');
  assert.equal(parsed.rows[4].vin, 'LS6J3E1E3TK504787');
});

test('parseLaoAddress, parseBookingCsv, and parseSalesCsv capture unlabeled address & payment columns', () => {
  assert.deepEqual(
    parseLaoAddress('ບ້ານ ໜອງພະຍາ ເມືອງໄຊທານີ ແຂວງ ນະຄອນຫຼວງວຽງຈັນ'),
    { village: 'ໜອງພະຍາ', district: 'ໄຊທານີ', province: 'ນະຄອນຫຼວງວຽງຈັນ' },
  );
  assert.deepEqual(
    parseLaoAddress('ບ້ານ ທ່າໄຮ ເມືອງ ນະຄອນປາກເຊ ແຂວງ ຈຳປາສັກ'),
    { village: 'ທ່າໄຮ', district: 'ນະຄອນປາກເຊ', province: 'ຈຳປາສັກ' },
  );

  const bookingsCsv = [
    'ວັນເດືອນປີ,ຊື່ລູກຄ້າ,ເບີໂທ,,ປະເພດລົດ,ມູນຄ່າລວມ,ມັດຈຳ,ໝາຍເຫດ',
    '05/10/2026,ທ່ານ ນາງ ນວນຈັນ ທຳມະວົງສາ,020 7894 2444,ບ້ານ ໜອງພະຍາ ເມືອງໄຊທານີ ແຂວງ ນະຄອນຫຼວງວຽງຈັນ,AVATR 07 Elite EV Edition,43900,2000,ນັດຮັບລົດວັນທີ 16',
  ].join('\n');
  const bParsed = parseBookingCsv(bookingsCsv, 'b.csv', MODELS, new Set(), new Set());
  assert.equal(bParsed.rows[0].lead?.village, 'ໜອງພະຍາ');
  assert.equal(bParsed.rows[0].lead?.district, 'ໄຊທານີ');
  assert.equal(bParsed.rows[0].lead?.province, 'ນະຄອນຫຼວງວຽງຈັນ');
  assert.equal(bParsed.rows[0].lead?.bookingNote, 'ນັດຮັບລົດວັນທີ 16');

  const salesCsv = [
    'ວ.ດ.ປ,ລາຍຊື່ລູກຄ້າ,,ເບີໂທລູກຄ້າ,ລຸ້ນລົດ,ເລກຖັງ,ລາຄາລົດ,ຫມາຍເຫດ,IPhone,',
    '01/09/2026,ນາງ ນິພາພອນ ພັນທະວົງ,"ບ້ານ ຄຳຮຸ່ງ, ເມືອງ ໄຊທານີ, ແຂວງ ນະຄອນຫຼວງວຽງຈັນ",020 56789782,AVATR 07 Elite EV Edition,LS6J3E1E0TK504732,43000,Adapter CCS2,,ຜ່ອນ MJBL',
    '04/09/2026,ທ່ານ ນາງ ອາພາພອນ ວິລະພັດທະນາ,ບ້ານ ປາກທ້າງ ເມືອງ ສີໂຄດຕະບອງ ແຂວງ ນະຄອນຫຼວງວຽງຈັນ,020 55624429,AVATR 07 Elite EV Edition,LS6J3E1E5TK504791,42900,Adapter CCS2,,ສົດ',
  ].join('\n');
  const sParsed = parseSalesCsv(salesCsv, 's.csv', MODELS, [], new Set(), new Set(), new Set());
  assert.equal(sParsed.rows.length, 2);
  assert.equal(sParsed.rows[0].lead?.village, 'ຄຳຮຸ່ງ');
  assert.equal(sParsed.rows[0].lead?.paymentType, 'installment');
  assert.equal(sParsed.rows[0].lead?.financeCompany, 'MJBL');
  assert.equal(sParsed.rows[1].lead?.district, 'ສີໂຄດຕະບອງ');
  assert.equal(sParsed.rows[1].lead?.paymentType, 'cash');
});
