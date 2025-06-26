'use client'

import { useEffect, useState } from 'react'
import { CartContextProvider, useCartContext } from '@/state/Cart'
import { useAuthenticated } from '@/hooks/useAuthentication'
import { Heading } from '@/components/native/heading'
import { Receipt } from './components/receipt'
import { Item } from './components/item'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import Loading from '@/app/loading'

const mockPaymentMethods = [
   { id: 'cod', label: 'Cash on Delivery' },
   { id: 'bank', label: 'Bank Transfer' },
]

function CheckoutContent() {
   const { cart, refreshCart, clearCart } = useCartContext()
   const { authenticated } = useAuthenticated()
   const [addresses, setAddresses] = useState([])
   const [selectedAddress, setSelectedAddress] = useState(null)
   const [paymentMethod, setPaymentMethod] = useState('cod')
   const router = useRouter()
   const [loading, setLoading] = useState(false)

   useEffect(() => {
      async function fetchAddresses() {
         const res = await fetch('/api/addresses', { cache: 'no-store' })
         const json = await res.json()
         setAddresses(json)
         if (json.length > 0) setSelectedAddress(json[0].id)
      }
      if (authenticated) fetchAddresses()
   }, [authenticated])

   async function handlePlaceOrder() {
      try {
         setLoading(true)
         // 1. Tạo order trước
         const orderRes = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
               addressId: selectedAddress,
               discountCode: 'TECHFEST25',
            }),
         })
         if (!orderRes.ok) {
            console.log(orderRes)
            toast.error('Failed to create order')
            return
         }
         const order = await orderRes.json()
         // 2. Không cần gọi tiếp /api/payments nữa!
         toast.success('Order placed and payment successful!')
         clearCart()
         router.push('/profile/payments')
      } catch (err) {
         toast.error('Order failed!')
      } finally {
         setLoading(false)
      }
   }

   if (loading) {
      return <Loading />
   }

   return (
      <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
         <div className="md:col-span-1 space-y-4">
            <Heading title="Checkout" description="Confirm your order and payment." />
            <h2 className="font-semibold mb-2">Select delivery address</h2>
            {addresses.length === 0 ? (
               <div>You don't have any addresses yet. <a href="/profile/addresses/new" className="underline">Add a new address</a></div>
            ) : (
               <Select value={selectedAddress || ''} onValueChange={setSelectedAddress}>
                  <SelectTrigger className="w-full">
                     <SelectValue placeholder="Select delivery address" />
                  </SelectTrigger>
                  <SelectContent>
                     {addresses.map(addr => (
                        <SelectItem key={addr.id} value={addr.id}>
                           {addr.address}, {addr.city} ({addr.phone})
                        </SelectItem>
                     ))}
                  </SelectContent>
               </Select>
            )}
            <h2 className="font-semibold mb-2">Select payment method</h2>
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
            <h2 className="font-semibold mb-2">Order items</h2>
            {cart?.items?.length > 0 ? (
               <ul className="space-y-2">
                  {cart.items.map((cartItem, index) => (
                     <Item cartItem={cartItem} key={index} />
                  ))}
               </ul>
            ) : (
               <div>Your cart is empty.</div>
            )}
         </div>
         <div className="md:col-span-1 space-y-4" />
         <div className="md:col-span-1 flex flex-col justify-between h-full min-h-[400px]">
            <div className="flex-1" />
            <div>
               <Receipt handlePlaceOrder={handlePlaceOrder} />
            </div>
         </div>
      </div>
   )
}

export default function CheckoutPage() {
   return (
      <CartContextProvider>
         <CheckoutContent />
      </CartContextProvider>
   )
}
