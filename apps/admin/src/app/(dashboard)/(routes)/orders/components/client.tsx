'use client'

import { DataTable } from '@/components/ui/data-table'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'

import { OrderColumn, columns } from './columns'
import { SortBy, SearchInput } from './options'
import { useState } from 'react'

interface OrderClientProps {
    data: OrderColumn[]
}

export const OrderClient: React.FC<OrderClientProps> = ({ data }) => {
    const [searchKey, setSearchKey] = useState('')
    return (
        <div className="block space-y-4 my-6">
            <Heading
                title={`Orders (${data.length})`}
                description="Manage orders for your store"
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
