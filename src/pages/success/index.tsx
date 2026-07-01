import { View, Text } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { useState } from 'react'
import { getOrder, buildOrder, ParkingOrder } from '../../utils/mock'
import './index.scss'

export default function Success() {
  const [order, setOrderState] = useState<ParkingOrder | null>(null)

  useLoad(() => {
    setOrderState(getOrder() || buildOrder('浙A·88888'))
  })

  const payable = order ? Math.max(order.amount - order.discount, 0) : 0

  const goHome = () => {
    Taro.reLaunch({ url: '/pages/index/index' })
  }

  return (
    <View className='page page--done'>
      <View className='confetti'>
        {Array.from({ length: 14 }).map((_, i) => (
          <View key={i} className={`bit bit-${i % 7}`} />
        ))}
      </View>

      {/* 成功印章 */}
      <View className='seal'>
        <View className='seal-ring seal-ring--1' />
        <View className='seal-ring seal-ring--2' />
        <View className='seal-core'>
          <View className='tick'>
            <View className='tick-short' />
            <View className='tick-long' />
          </View>
        </View>
      </View>

      <Text className='title'>缴费成功</Text>
      <Text className='subtitle'>道闸已抬起，祝您一路顺风</Text>

      <View className='amount'>
        <Text className='amount-cur'>¥</Text>
        <Text className='amount-num'>{payable.toFixed(2)}</Text>
      </View>

      {/* 小票 */}
      <View className='receipt'>
        <View className='r-row'>
          <Text className='r-k'>车牌号</Text>
          <Text className='r-v r-v--mono'>{order?.plate || '—'}</Text>
        </View>
        <View className='r-row'>
          <Text className='r-k'>停车场</Text>
          <Text className='r-v'>{order?.lotName || '—'}</Text>
        </View>
        <View className='r-row'>
          <Text className='r-k'>停车时长</Text>
          <Text className='r-v'>{order?.durationText || '—'}</Text>
        </View>
        <View className='r-row'>
          <Text className='r-k'>支付方式</Text>
          <Text className='r-v'>微信支付</Text>
        </View>
        <View className='r-dash' />
        <View className='r-row'>
          <Text className='r-k'>订单号</Text>
          <Text className='r-v r-v--mono r-v--faint'>{order?.orderNo || '—'}</Text>
        </View>
      </View>

      <View className='gate-hint'>
        <View className='gate-arm' />
        <Text className='gate-t'>限时 15 分钟内离场</Text>
      </View>

      <View className='home-btn' onClick={goHome}>
        <Text className='home-t'>返回首页</Text>
      </View>
    </View>
  )
}
