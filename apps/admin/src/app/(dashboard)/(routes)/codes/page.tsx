import prisma from '@/lib/prisma'
import { format } from 'date-fns'
import { CodesClient, CodeColumn } from './components/table'
import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default async function CodesPage() {
    const codes = await prisma.discountCode.findMany({
        orderBy: {
            createdAt: 'desc',
        },
    })

    const formattedCodes: CodeColumn[] = codes.map((item) => ({
        id: item.id,
        code: item.code,
        percent: item.percent,
        stock: item.stock,
        maxDiscountAmount: item.maxDiscountAmount,
        startDate: format(item.startDate, 'yyyy-MM-dd'),
        endDate: format(item.endDate, 'yyyy-MM-dd'),
    }))

    return (
        <div className="block space-y-4 my-6">
            <div className="flex items-center justify-between">
                <Heading
                    title={`Codes (${codes.length})`}
                    description="Manage discount codes for your store"
                />
                <Link href="/codes/new">
                    <Button>
                        <Plus className="mr-2 h-4" /> Add New
                    </Button>
                </Link>
            </div>
            <Separator />
            <CodesClient data={formattedCodes} />
        </div>
    )
}
