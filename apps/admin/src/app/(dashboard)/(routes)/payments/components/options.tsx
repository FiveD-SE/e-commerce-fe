'use client'

import { Input } from '@/components/ui/input'
import { isVariableValid } from '@/lib/utils'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select'

export function SortBy({ initialData }) {
   const router = useRouter()
   const pathname = usePathname()
   const searchParams = useSearchParams()

   const [success, setSuccess] = React.useState('all')

   useEffect(() => {
      if (isVariableValid(initialData)) {
         const successParam = searchParams.get('isSuccessful')
         if (successParam === 'true' || successParam === 'false') setSuccess(successParam)
         else setSuccess('all')
      }
   }, [initialData, searchParams])

   function handleSuccessChange(newSuccess) {
      const current = new URLSearchParams(Array.from(searchParams.entries()))
      if (newSuccess === 'all') {
         current.delete('isSuccessful')
         setSuccess('all')
      } else {
         current.set('isSuccessful', newSuccess)
         setSuccess(newSuccess)
      }
      const search = current.toString()
      const query = search ? `?${search}` : ''
      router.replace(`${pathname}${query}`, { scroll: false })
   }

   return (
      <div className="flex gap-2 w-full">
         <Select value={success} onValueChange={handleSuccessChange}>
            <SelectTrigger className="w-full">
               <SelectValue placeholder="Successful/Unsuccessful" />
            </SelectTrigger>
            <SelectContent>
               <SelectItem value="all">All</SelectItem>
               <SelectItem value="true">Successful</SelectItem>
               <SelectItem value="false">Unsuccessful</SelectItem>
            </SelectContent>
         </Select>
      </div>
   )
}

export function SearchInput({ searchKey, setSearchKey }: { searchKey: string, setSearchKey: (value: string) => void }) {
   const router = useRouter()
   const pathname = usePathname()
   const searchParams = useSearchParams()

   useEffect(() => {
      const searchParam = searchParams.get('search')
      if (searchParam) setSearchKey(searchParam)
   }, [searchParams])

   function handleSearchChange(newSearch) {
      const current = new URLSearchParams(Array.from(searchParams.entries()))
      if (newSearch === '') {
         current.delete('search')
         setSearchKey('')
      } else {
         current.set('search', newSearch)
         setSearchKey(newSearch)
      }

      const search = current.toString()
      const query = search ? `?${search}` : ''
      router.replace(`${pathname}${query}`, { scroll: false })
   }

   return (
      <div className="flex gap-2 w-full h-10">
         <Input
            placeholder="Search"
            value={searchKey}
            onChange={(event) => handleSearchChange(event.target.value)}
         />
      </div>
   )
}