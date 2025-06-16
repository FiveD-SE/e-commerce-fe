'use client'

import { useAuthenticated } from '@/hooks/useAuthentication'
import { isVariableValid } from '@/lib/utils'
import { useUserContext } from '@/state/User'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { WishlistGrid } from './components/grid'
import { CartContextProvider } from '@/state/Cart'
import { Heading } from '@/components/native/heading'

// import { WishlistGrid } from './components/grid'

export default function User({ }) {
   const { authenticated } = useAuthenticated()
   const { user, loading } = useUserContext()

   const [items, setItems] = useState(null)
   const router = useRouter()

   useEffect(() => {
      if (!loading && !isVariableValid(user)) router.push('/')
   }, [user, loading, router])

   useEffect(() => {
      async function getWishlist() {
         try {
            const response = await fetch(`/api/wishlist`, {
               method: 'GET',
               headers: {
                  'Content-Type': 'application/json',
               },
               cache: 'no-store',
            })

            const json = await response.json()

            setItems(Array.isArray(json) ? json : json?.wishlist?.items)
         } catch (error) {
            console.error({ error })
         }
      }

      if (authenticated) getWishlist()
   }, [authenticated])

   return (
      <CartContextProvider>
         <Heading
            title="Wishlist"
            description="Below is a list of products you have in your wishlist."
         />
         <WishlistGrid items={items} />
      </CartContextProvider>
   )
}
