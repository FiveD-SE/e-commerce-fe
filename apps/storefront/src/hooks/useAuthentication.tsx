'use client'

import { validateBoolean } from '@/lib/utils'
import { useEffect, useState } from 'react'

export function useAuthenticated() {
   const [authenticated, setAuthenticated] = useState(null)

   useEffect(() => {
      try {
         if (typeof window !== 'undefined' && window.localStorage) {
            const cookies = document.cookie.split(';')
            const loggedInCookieStr = cookies.find((cookie) => cookie.trim().startsWith('logged-in='))
            const loggedInCookie =
               loggedInCookieStr ? loggedInCookieStr.split('=')[1] === 'true' : false

            setAuthenticated(loggedInCookie)
         }
      } catch (error) {
         console.error({ error })
      }
   }, [])

   return { authenticated: validateBoolean(authenticated, true) }
}
