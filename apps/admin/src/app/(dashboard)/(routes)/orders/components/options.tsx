'use client'

import { Input } from '@/components/ui/input'
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select'
import { isVariableValid } from '@/lib/utils'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'

export function SortBy({ initialData }) {
   const router = useRouter()
   const pathname = usePathname()
   const searchParams = useSearchParams()

   const [paid, setPaid] = React.useState('all')

   useEffect(() => {
      if (isVariableValid(initialData)) {
         const paidParam = searchParams.get('isPaid')
         if (paidParam === 'true' || paidParam === 'false') setPaid(paidParam)
         else setPaid('all')
      }
   }, [initialData, searchParams])

   function handlePaidChange(newPaid) {
      const current = new URLSearchParams(Array.from(searchParams.entries()))
      if (newPaid === 'all') {
         current.delete('isPaid')
         setPaid('all')
      } else {
         current.set('isPaid', newPaid)
         setPaid(newPaid)
      }
      const search = current.toString()
      const query = search ? `?${search}` : ''
      router.replace(`${pathname}${query}`, { scroll: false })
   }

   return (
      <div className="flex gap-2 w-full">
         <Select value={paid} onValueChange={handlePaidChange}>
            <SelectTrigger className="w-full">
               <SelectValue placeholder="Paid/Unpaid" />
            </SelectTrigger>
            <SelectContent>
               <SelectItem value="all">All</SelectItem>
               <SelectItem value="true">Paid</SelectItem>
               <SelectItem value="false">Unpaid</SelectItem>
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