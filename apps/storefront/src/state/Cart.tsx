import { clearLocalCart, getLocalCart, writeLocalCart } from '@/lib/cart'
import { isVariableValid } from '@/lib/utils'
import { useUserContext } from '@/state/User'
import React, { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext({
   cart: null,
   loading: true,
   refreshCart: () => { },
   dispatchCart: (object) => { },
   clearCart: () => { },
})

export const useCartContext = () => {
   return useContext(CartContext)
}

export const CartContextProvider = ({ children }) => {
   const { refreshUser, user } = useUserContext()

   const [cart, setCart] = useState(null)
   const [loading, setLoading] = useState(true)

   const dispatchCart = async (cart) => {
      setCart(cart)
      writeLocalCart(cart)
   }

   const refreshCart = async () => {
      setLoading(true)

      if (isVariableValid(user)) {
         setCart(user?.cart)
         writeLocalCart(user?.cart)
      }
      if (!isVariableValid(user)) setCart(getLocalCart())

      setLoading(false)
   }

   const clearCart = () => {
      setCart({ items: [] })
      clearLocalCart()
   }

   useEffect(() => {
      if (isVariableValid(user)) {
         setCart(user?.cart)
         writeLocalCart(user?.cart)
      }
      if (!isVariableValid(getLocalCart())) clearLocalCart()
      if (!isVariableValid(user)) setCart(getLocalCart())

      setLoading(false)
   }, [user])

   return (
      <CartContext.Provider
         value={{ cart, loading, refreshCart, dispatchCart, clearCart }}
      >
         {children}
      </CartContext.Provider>
   )
}
