import { useMemo, useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { buildOrder, setOrder, detectNewEnergy, PROVINCES } from '../../utils/mock'
import './index.scss'

const LETTERS = 'ABCDEFGHJKLMNPQRSTUVWXYZ'.split('') // 车牌无 I / O
const DIGITS = '0123456789'.split('')
const MAX = 8

export default function Index() {
  const [chars, setChars] = useState<string[]>([]) // 已输入字符
  const [active, setActive] = useState(0)           // 当前光标槽位
  const plate = chars.join('')
  const isNewEnergy = useMemo(() => detectNewEnergy(plate), [plate])
  const canConfirm = chars.length >= 7

  // 每个槽位对应的键盘：0 省份 / 1 字母 / 其余 字母+数字
  const mode: 'province' | 'letter' | 'alnum' =
    active === 0 ? 'province' : active === 1 ? 'letter' : 'alnum'

  const press = (v: string) => {
    const next = chars.slice(0, active)
    next[active] = v
    const trimmed = next.slice(0, MAX)
    setChars(trimmed)
    setActive(Math.min(trimmed.length, MAX - 1))
  }

  const del = () => {
    if (chars.length === 0) return
    const idx = active < chars.length ? chars.length - 1 : active - 1
    const next = chars.slice(0, Math.max(idx, 0))
    setChars(next)
    setActive(Math.max(next.length ? next.length : 0, 0) === 0 && next.length === 0 ? 0 : next.length)
  }

  const clearAll = () => {
    setChars([])
    setActive(0)
  }

  const confirm = () => {
    if (!canConfirm) {
      Taro.showToast({ title: '请输入完整车牌号', icon: 'none' })
      return
    }
    const order = buildOrder(plate)
    setOrder(order)
    Taro.navigateTo({ url: '/pages/payment/index' })
  }

  // 8 个槽位（第 8 位为新能源位）
  const slots = Array.from({ length: MAX }, (_, i) => chars[i] || '')

  const keys: string[] =
    mode === 'province'
      ? PROVINCES
      : mode === 'letter'
        ? LETTERS
        : [...DIGITS, ...LETTERS]

  return (
    <View className='page page--home'>
      {/* 背景纹理层 */}
      <View className='bg-grid' />
      <View className='bg-glow' />

      {/* 顶部品牌 */}
      <View className='brand'>
        <View className='brand-mark'>
          <Text className='brand-p'>泊</Text>
          <View className='brand-lines'>
            <View className='ln' />
            <View className='ln' />
            <View className='ln' />
          </View>
        </View>
        <View className='brand-txt'>
          <Text className='brand-title'>泊车票</Text>
          <Text className='brand-sub'>SMART PARKING · 扫码即缴</Text>
        </View>
        <View className='brand-badge'>
          <Text className='badge-dot' />
          <Text className='badge-t'>在线</Text>
        </View>
      </View>

      <View className='headline'>
        <Text className='headline-idx'>01 / 输入车牌</Text>
        <Text className='headline-big'>请输入您的车牌号</Text>
        <Text className='headline-hint'>确认后为您匹配停车订单</Text>
      </View>

      {/* 车牌显示 */}
      <View className={`plate ${isNewEnergy ? 'plate--green' : 'plate--blue'}`}>
        <View className='plate-screw plate-screw--l' />
        <View className='plate-screw plate-screw--r' />
        <View className='plate-slots'>
          {slots.map((c, i) => {
            const isActive = i === active
            const isTail = i === MAX - 1
            return (
              <View
                key={i}
                className={`slot ${isActive ? 'slot--on' : ''} ${isTail && !c ? 'slot--ne' : ''}`}
                onClick={() => setActive(i)}
              >
                {i === 1 && <View className='slot-dot' />}
                <Text className='slot-ch'>{c || (isTail ? '' : '')}</Text>
                {isTail && !c && <Text className='slot-ne'>新能源</Text>}
                {isActive && !c && <View className='slot-caret' />}
              </View>
            )
          })}
        </View>
        <Text className='plate-strip'>{isNewEnergy ? '新能源汽车' : '中华人民共和国'}</Text>
      </View>

      {/* 自定义车牌键盘 */}
      <View className='keyboard'>
        <View className='kb-head'>
          <Text className='kb-mode'>
            {mode === 'province' ? '选择省份简称' : mode === 'letter' ? '选择字母' : '字母 / 数字'}
          </Text>
          <Text className='kb-clear' onClick={clearAll}>清空</Text>
        </View>
        <View className='kb-keys'>
          {keys.map((k) => (
            <View key={k} className={`key ${mode === 'province' ? 'key--sm' : ''}`} onClick={() => press(k)}>
              <Text className='key-t'>{k}</Text>
            </View>
          ))}
          <View className='key key--del' onClick={del}>
            <Text className='key-t'>⌫</Text>
          </View>
        </View>
      </View>

      {/* 确定按钮 */}
      <View className='footer'>
        <View
          className={`confirm ${canConfirm ? 'confirm--on' : 'confirm--off'}`}
          onClick={confirm}
        >
          <Text className='confirm-t'>确 定</Text>
          <Text className='confirm-arrow'>→</Text>
        </View>
      </View>
    </View>
  )
}
