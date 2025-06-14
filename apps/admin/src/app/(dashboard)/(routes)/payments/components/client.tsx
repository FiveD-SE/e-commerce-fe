'use client'

import { DataTable } from '@/components/ui/data-table'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { useState } from 'react'

import { PaymentColumn, columns } from './columns'
import { SearchInput, SortBy } from './options'

interface PaymentClientProps {
   data: PaymentColumn[]
}

export const PaymentClient: React.FC<PaymentClientProps> = ({ data }) => {
   const [searchKey, setSearchKey] = useState('')

   return (
      <div className="block space-y-4 my-6">
         <Heading
            title={`Payments (${data.length})`}
            description="Manage payments for your store"
         />
         <Separator />
         <div className="grid grid-cols-2 items-center gap-2">
            <SortBy initialData={'latest'} />
            <SearchInput searchKey={searchKey} setSearchKey={setSearchKey} />
         </div>
         <DataTable columns={columns} data={data} />
      </div>
   )
}
