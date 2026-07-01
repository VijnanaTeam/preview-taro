import { useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { getOrder, buildOrder, ParkingOrder } from '../../utils/mock'
import './index.scss'

const METHODS = [
  { key: 'wechat', name: '微信支付', desc: '推荐 · 零钱/银行卡', mark: '微' },
  { key: 'balance', name: '停车账户余额', desc: '可用 ¥128.50', mark: '泊' }
]

export default function Payment() {
  const [order, setOrderState] = useState<ParkingOrder | null>(null)
  const [method, setMethod] = useState('wechat')
  const [paying, setPaying] = useState(false)

  useLoad(() => {
    // 兜底：若无缓存订单则用示例车牌生成一份 mock
    setOrderState(getOrder() || buildOrder('浙A·88888'))
  })

  if (!order) return <View className='page page--pay' />

  const payable = Math.max(order.amount - order.discount, 0)

  const pay = () => {
    if (paying) return
    setPaying(true)
    Taro.showLoading({ title: '正在支付…', mask: true })
    setTimeout(() => {
      Taro.hideLoading()
      setPaying(false)
      Taro.redirectTo({ url: '/pages/success/index' })
    }, 900)
  }

  return (
    <View className='page page--pay'>
      <View className='bg-glow' />

      <View className='headline'>
        <Text className='h-idx'>02 / 确认订单</Text>
        <Text className='h-big'>停车缴费</Text>
      </View>

      {/* 车牌小徽标 */}
      <View className={`plate-chip ${order.isNewEnergy ? 'chip--green' : 'chip--blue'}`}>
        <Text className='chip-plate'>{order.plate}</Text>
        <Text className='chip-tag'>{order.isNewEnergy ? '新能源' : '燃油车'}</Text>
      </View>

      {/* 票据主卡 */}
      <View className='ticket'>
        <View className='ticket-top'>
          <View className='lot'>
            <Text className='lot-name'>{order.lotName}</Text>
            <Text className='lot-gate'>{order.gate} · 泊位 {order.lotCode}</Text>
          </View>
          <View className='live'>
            <View className='live-dot' />
            <Text className='live-t'>计时中</Text>
          </View>
        </View>

        {/* 时间轴 */}
        <View className='timeline'>
          <View className='tl-node'>
            <Text className='tl-time'>{order.entryTime}</Text>
            <Text className='tl-label'>入场</Text>
          </View>
          <View className='tl-track'>
            <View className='tl-fill' />
            <View className='tl-badge'>
              <Text className='tl-badge-t'>{order.durationText}</Text>
            </View>
          </View>
          <View className='tl-node tl-node--end'>
            <Text className='tl-time'>{order.leaveTime}</Text>
            <Text className='tl-label'>出场</Text>
          </View>
        </View>

        {/* 撕票齿孔 */}
        <View className='perf'>
          <View className='perf-notch perf-notch--l' />
          <View className='perf-line' />
          <View className='perf-notch perf-notch--r' />
        </View>

        {/* 费用明细 */}
        <View className='breakdown'>
          <View className='bd-row'>
            <Text className='bd-k'>停车费</Text>
            <Text className='bd-v'>¥ {order.amount.toFixed(2)}</Text>
          </View>
          <View className='bd-row'>
            <Text className='bd-k'>优惠减免</Text>
            <Text className='bd-v bd-v--cut'>- ¥ {order.discount.toFixed(2)}</Text>
          </View>
          <View className='bd-row bd-row--total'>
            <Text className='bd-k'>应付金额</Text>
            <View className='bd-amount'>
              <Text className='bd-cur'>¥</Text>
              <Text className='bd-big'>{payable.toFixed(2)}</Text>
            </View>
          </View>
          <Text className='bd-order'>订单号 {order.orderNo}</Text>
        </View>
      </View>

      {/* 支付方式 */}
      <View className='methods'>
        {METHODS.map((m) => (
          <View
            key={m.key}
            className={`method ${method === m.key ? 'method--on' : ''}`}
            onClick={() => setMethod(m.key)}
          >
            <View className={`m-mark m-mark--${m.key}`}>
              <Text className='m-mark-t'>{m.mark}</Text>
            </View>
            <View className='m-txt'>
              <Text className='m-name'>{m.name}</Text>
              <Text className='m-desc'>{m.desc}</Text>
            </View>
            <View className={`m-radio ${method === m.key ? 'm-radio--on' : ''}`}>
              {method === m.key && <View className='m-radio-dot' />}
            </View>
          </View>
        ))}
      </View>

      {/* 支付栏 */}
      <View className='paybar'>
        <View className='paybar-sum'>
          <Text className='paybar-label'>合计</Text>
          <Text className='paybar-cur'>¥</Text>
          <Text className='paybar-amt'>{payable.toFixed(2)}</Text>
        </View>
        <View className={`paybtn ${paying ? 'paybtn--busy' : ''}`} onClick={pay}>
          <Text className='paybtn-t'>{paying ? '支付中' : '确认缴费'}</Text>
        </View>
      </View>
    </View>
  )
}
