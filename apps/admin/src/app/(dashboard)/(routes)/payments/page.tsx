import prisma from '@/lib/prisma'
import { format } from 'date-fns'

import { PaymentClient } from './components/client'
import type { PaymentColumn } from './components/columns'

export default async function PaymentsPage({ searchParams }) {
   const { isSuccessful, search, page = 1 } = searchParams ?? {}

   const where: any = {}
   if (isSuccessful === 'true') where.isSuccessful = true
   if (isSuccessful === 'false') where.isSuccessful = false

   if (search) {
      const numberFilter = isNaN(Number(search)) ? undefined : Number(search)
      where.OR = [
         numberFilter ? { number: numberFilter } : undefined,
         {
            createdAt: {
               equals: isNaN(Date.parse(search)) ? undefined : new Date(search),
            },
         },
      ].filter(Boolean)
   }

   const payments = await prisma.payment.findMany({
      where,
      include: {
         provider: true,
         user: true,
         order: true,
      },
      skip: (page - 1) * 12,
      take: 12,
   })

   const formattedPayments: PaymentColumn[] = payments.map((payment) => ({
      id: payment.id,
      number: 'Payment #' + payment.number.toString(),
      status: payment.status,
      date: payment.createdAt.toUTCString(),
      payable: '$' + payment.payable.toString(),
      isSuccessful: payment.isSuccessful,
      createdAt: format(payment.createdAt, 'MMMM do, yyyy'),
   }))

   return <PaymentClient data={formattedPayments} />
}