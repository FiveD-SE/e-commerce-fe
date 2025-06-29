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
import { Input } from '@/components/ui/input'

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
   const [discountCode, setDiscountCode] = useState('')
   const [discountStatus, setDiscountStatus] = useState<'idle' | 'valid' | 'invalid' | 'checking'>('idle')
   const router = useRouter()
   const [loading, setLoading] = useState(false)
   const [discountInfo, setDiscountInfo] = useState(null);

   useEffect(() => {
      async function fetchAddresses() {
         const res = await fetch('/api/addresses', { cache: 'no-store' })
         const json = await res.json()
         setAddresses(json)
         if (json.length > 0) setSelectedAddress(json[0].id)
      }
      if (authenticated) fetchAddresses()
   }, [authenticated])

   async function validateDiscountCode() {
      if (!discountCode) return
      setDiscountStatus('checking')
      try {
         const res = await fetch(`/api/codes/validate?code=${encodeURIComponent(discountCode)}`)
         const json = await res.json()
         if (res.ok) {
            setDiscountStatus('valid')
            setDiscountInfo(json)
         } else {
            setDiscountStatus('invalid')
         }
      } catch {
         setDiscountStatus('invalid')
      }
   }

   async function handlePlaceOrder() {
      try {
         setLoading(true)

         const orderRes = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
               addressId: selectedAddress,
               discountCode: discountCode || '',
            }),
         })

         if (!orderRes.ok) {
            console.log(orderRes)
            toast.error('Failed to create order')
            return
         }

         if (authenticated) {
            await fetch('/api/cart/clear', { method: 'POST' })
         }

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
      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-3">
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
            <div>
               <label className="font-semibold mb-2 block">Discount code</label>
               <div className="flex gap-2">
                  <Input
                     value={discountCode}
                     onChange={e => { setDiscountCode(e.target.value); setDiscountStatus('idle') }}
                     placeholder="Enter discount code"
                     className="w-full"
                  />
                  <button
                     type="button"
                     className="px-4 py-2 rounded bg-white text-black"
                     onClick={validateDiscountCode}
                     disabled={!discountCode || discountStatus === 'checking'}
                  >
                     {discountStatus === 'checking' ? 'Checking...' : 'Apply'}
                  </button>
               </div>
               {discountStatus === 'valid' && <div className="text-green-600 text-sm mt-1">Discount code applied!</div>}
               {discountStatus === 'invalid' && <div className="text-red-600 text-sm mt-1">Invalid or expired code.</div>}
            </div>
         </div>
         <div className="md:col-span-1 flex flex-col justify-between h-full min-h-[400px]">
            <div className="flex-1" />
            <Receipt handlePlaceOrder={handlePlaceOrder} discountInfo={discountInfo} />
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
