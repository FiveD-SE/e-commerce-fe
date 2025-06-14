import prisma from '@/lib/prisma'
import { format } from 'date-fns'

import { OrderClient } from './components/client'
import type { OrderColumn } from './components/columns'

export default async function OrdersPage({ searchParams }) {
   const { sort, isPaid, search, page = 1 } = searchParams ?? null

   const orderBy = getOrderBy(sort)

   const where: any = {}
   if (isPaid === 'true') where.isPaid = true
   if (isPaid === 'false') where.isPaid = false
   if (search) {
      const numberFilter = isNaN(Number(search)) ? undefined : Number(search)
      where.OR = [
         numberFilter ? { number: numberFilter } : undefined,
         {
            createdAt: {
               equals: isNaN(Date.parse(search)) ? undefined : new Date(search),
            },
         },
         isNaN(Number(search)) ? undefined : { payable: Number(search) },
      ].filter(Boolean)
   }

   const orders = await prisma.order.findMany({
      where,
      include: {
         orderItems: {
            include: {
               product: true,
            },
         },
      },
      skip: (page - 1) * 12,
      take: 12,
      orderBy,
   })

   const formattedOrders: OrderColumn[] = orders.map((order) => ({
      id: order.id,
      number: `Order #${order.number}`,
      date: order.createdAt.toUTCString(),
      payable: '$' + order.payable.toString(),
      isPaid: order.isPaid,
      createdAt: format(order.createdAt, 'MMMM do, yyyy'),
   }))

   return (
      <div className="block space-y-4 my-6">
         <OrderClient data={formattedOrders} />
      </div>
   )
}

function getOrderBy(sort) {
   let orderBy

   switch (sort) {
      case 'highest_payable':
         orderBy = {
            payable: 'desc',
         }
         break
      case 'lowest_payable':
         orderBy = {
            payable: 'asc',
         }
         break

      default:
         orderBy = {
            createdAt: 'desc',
         }
         break
   }

   return orderBy
}
