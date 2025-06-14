'use client'

import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { EditIcon } from 'lucide-react'
import Link from 'next/link'

export type CodeColumn = {
    id: string
    code: string
    percent: number
    stock: number
    maxDiscountAmount: number
    startDate: string
    endDate: string
}

export const columns: ColumnDef<CodeColumn>[] = [
    {
        accessorKey: 'code',
        header: 'Code',
    },
    {
        accessorKey: 'percent',
        header: 'Percent (%)',
    },
    {
        accessorKey: 'stock',
        header: 'Stock',
    },
    {
        accessorKey: 'maxDiscountAmount',
        header: 'Max Discount',
    },
    {
        accessorKey: 'startDate',
        header: 'Start Date',
    },
    {
        accessorKey: 'endDate',
        header: 'End Date',
    },
    {
        id: 'actions',
        cell: ({ row }) => (
            <Link href={`/codes/${row.original.id}`}>
                <Button size="icon" variant="outline">
                    <EditIcon className="h-4" />
                </Button>
            </Link>
        ),
    },
]

interface CodesClientProps {
    data: CodeColumn[]
}

export const CodesClient: React.FC<CodesClientProps> = ({ data }) => {
    return <DataTable columns={columns} data={data} />
} 