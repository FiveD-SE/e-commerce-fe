'use client'

import { useEffect, useState } from 'react'
import { Heading } from '@/components/native/heading'
import { DataTable } from '@/components/ui/data-table'

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
            const res = await fetch('/api/payments', {
                method: 'GET',
                cache: 'no-store',
            })
            const json = await res.json()
            setPayments(Array.isArray(json) ? json : [])
        }
        fetchPayments()
    }, [])

    return (
        <>
            <Heading title="Payments" description="Your payment history." />
            <DataTable columns={columns} data={payments} />
        </>
    )
}
