'use client'

import { useEffect, useState } from 'react'
import { Heading } from '@/components/native/heading'
import { DataTable } from '@/components/ui/data-table'
import { Card, CardContent } from '@/components/ui/card'

const columns = [
    { accessorKey: 'number', header: 'Payment Number' },
    { accessorKey: 'status', header: 'Status' },
    { accessorKey: 'payable', header: 'Payable' },
    { accessorKey: 'isSuccessful', header: 'Successful', cell: ({ cell }) => cell.getValue() ? 'Yes' : 'No' },
    { accessorKey: 'createdAt', header: 'Created At' },
]

export default function PaymentsPage() {
    const [payments, setPayments] = useState([])
    useEffect(() => {
        async function fetchPayments() {
            // Thay bằng API thật khi có
            const res = await fetch('/api/payments', { cache: 'no-store' })
            const json = await res.json()
            setPayments(Array.isArray(json) ? json : [])
        }
        fetchPayments()
    }, [])

    return (
        <div className="my-6 block space-y-4 max-w-4xl mx-auto">
            <Heading title="Payments" description="Lịch sử thanh toán của bạn." />
            <Card>
                <CardContent>
                    <DataTable columns={columns} data={payments} />
                </CardContent>
            </Card>
        </div>
    )
}
