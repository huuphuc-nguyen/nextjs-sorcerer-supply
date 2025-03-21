import React from 'react'
import Img from 'next/image'

interface TempOrder {
    id: number,
    imageSrc: string,
    name: string,
    price: number,
    quantity: number
}

interface OrderCardProps {
    order: TempOrder
}

const OrderCard = ({order} : OrderCardProps) => {
  return (
    <div className='w-full rounded-md bg-white '>
      <Img 
        src={order.imageSrc}
        alt={order.name} 
        height={20}
        width={20}
        className=' object-cover rounded-md' />
    </div>
  )
}

export default OrderCard
