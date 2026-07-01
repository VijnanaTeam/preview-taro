/* ============================================================
   Mock data layer — everything here is fake, front-end only.
   A tiny in-memory "order" is generated from a plate number so
   the payment + success pages can show consistent figures.
   ============================================================ */

export interface ParkingOrder {
  plate: string          // 车牌号
  isNewEnergy: boolean   // 新能源绿牌
  lotName: string        // 停车场名称
  lotCode: string        // 泊位编号
  gate: string           // 入口
  entryTime: string      // 入场时间
  leaveTime: string      // 出场时间
  durationText: string   // 停车时长（可读）
  durationMins: number   // 停车时长（分钟）
  amount: number         // 应缴金额（元）
  discount: number       // 已减免（元）
  orderNo: string        // 订单号
}

const LOTS = [
  { name: '星海广场地下停车场', gate: 'B2 · 西入口' },
  { name: '滨江天街立体车库', gate: 'P3 · 南入口' },
  { name: '中央公园智慧泊车场', gate: 'A1 · 东入口' },
  { name: '云顶商务中心停车楼', gate: 'L4 · 北入口' }
]

/** Deterministic pseudo-random from a string seed (no Date/Math.random reliance). */
function seedFrom(str: string): number {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0)
}

function pad(n: number): string {
  return n < 10 ? '0' + n : '' + n
}

function fmtClock(totalMins: number): string {
  // anchor an entry time and add duration for a tidy mocked out-time
  const startH = 13, startM = 24
  const endTotal = startH * 60 + startM + totalMins
  const h = Math.floor(endTotal / 60) % 24
  const m = endTotal % 60
  return `${pad(h)}:${pad(m)}`
}

/** Detect Chinese green (new-energy) plate: 8 chars incl. province. */
export function detectNewEnergy(plate: string): boolean {
  const body = plate.replace(/[·\s]/g, '')
  return body.length >= 8
}

export function buildOrder(rawPlate: string): ParkingOrder {
  const plate = rawPlate.trim().toUpperCase()
  const seed = seedFrom(plate || 'DEFAULT')

  const lot = LOTS[seed % LOTS.length]
  const isNewEnergy = detectNewEnergy(plate)

  // duration 35 ~ 215 mins
  const durationMins = 35 + (seed % 181)
  const h = Math.floor(durationMins / 60)
  const m = durationMins % 60
  const durationText = h > 0 ? `${h} 小时 ${m} 分` : `${m} 分钟`

  // fee: ¥6 base + ¥2 / 30min, capped, minus a small mock discount
  const raw = 6 + Math.ceil(durationMins / 30) * 2
  const amount = Math.min(raw, 48)
  const discount = isNewEnergy ? 2 : (seed % 3 === 0 ? 1 : 0)

  const lotCode = `${String.fromCharCode(65 + (seed % 6))}-${pad((seed >> 3) % 60)}`
  const orderNo = `PK${(seed % 900000 + 100000)}${pad(durationMins % 100)}`

  return {
    plate,
    isNewEnergy,
    lotName: lot.name,
    lotCode,
    gate: lot.gate,
    entryTime: '13:24',
    leaveTime: fmtClock(durationMins),
    durationText,
    durationMins,
    amount,
    discount,
    orderNo
  }
}

/* --- ultra-light cross-page store (front-end mock only) --- */
let CURRENT: ParkingOrder | null = null

export function setOrder(o: ParkingOrder) {
  CURRENT = o
}

export function getOrder(): ParkingOrder | null {
  return CURRENT
}

export const PROVINCES = [
  '京', '沪', '粤', '浙', '苏', '津', '冀', '晋', '蒙', '辽',
  '吉', '黑', '皖', '闽', '赣', '鲁', '豫', '鄂', '湘', '桂',
  '琼', '渝', '川', '贵', '云', '藏', '陕', '甘', '青', '宁', '新'
]
