'use client'

import { useEffect, useState } from 'react'
import { CartContextProvider, useCartContext } from '@/state/Cart'
import { useAuthenticated } from '@/hooks/useAuthentication'
import { Heading } from '@/components/native/heading'
import { Receipt } from '../cart/components/receipt'

const mockPaymentMethods = [
   { id: 'cod', label: 'Cash on Delivery' },
   { id: 'bank', label: 'Bank Transfer' },
]

export default function CheckoutPage() {
   const { cart } = useCartContext()
   const { authenticated } = useAuthenticated()
   const [addresses, setAddresses] = useState([])
   const [selectedAddress, setSelectedAddress] = useState(null)
   const [paymentMethod, setPaymentMethod] = useState('cod')

   useEffect(() => {
      async function fetchAddresses() {
         const res = await fetch('/api/addresses', { cache: 'no-store' })
         const json = await res.json()
         setAddresses(json)
         if (json.length > 0) setSelectedAddress(json[0].id)
      }
      if (authenticated) fetchAddresses()
   }, [authenticated])

   function handlePlaceOrder() {
      alert('Đặt hàng thành công! (Mock)')
   }

   return (
      <CartContextProvider>
         <Heading title="Checkout" description="Xác nhận đơn hàng và thanh toán." />
         <h2 className="font-semibold mb-2">Chọn địa chỉ giao hàng</h2>
         {addresses.length === 0 ? (
            <div>Bạn chưa có địa chỉ nào. <a href="/profile/addresses/new" className="underline">Thêm địa chỉ mới</a></div>
         ) : (
            <select
               className="border rounded p-2"
               value={selectedAddress || ''}
               onChange={e => setSelectedAddress(e.target.value)}
            >
               {addresses.map(addr => (
                  <option key={addr.id} value={addr.id}>
                     {addr.address}, {addr.city} ({addr.phone})
                  </option>
               ))}
            </select>
         )}
         <h2 className="font-semibold mb-2">Chọn phương thức thanh toán</h2>
         <div className="flex gap-4">
            {mockPaymentMethods.map(method => (
               <label key={method.id} className="flex items-center gap-2">
                  <input
                     type="radio"
                     name="paymentMethod"
                     value={method.id}
                     checked={paymentMethod === method.id}
                     onChange={() => setPaymentMethod(method.id)}
                  />
                  {method.label}
               </label>
            ))}
         </div>
         <h2 className="font-semibold mb-2">Sản phẩm trong đơn hàng</h2>
         {cart?.items?.length > 0 ? (
            <ul className="space-y-2">
               {cart.items.map((item, idx) => (
                  <li key={idx} className="flex justify-between border-b pb-1">
                     <span>{item.product.title} x {item.count}</span>
                     <span>${(item.product.price * item.count).toFixed(2)}</span>
                  </li>
               ))}
            </ul>
         ) : (
            <div>Giỏ hàng trống.</div>
         )}
         <Receipt />
      </CartContextProvider>
   )
}
