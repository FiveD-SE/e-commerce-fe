import config from '@/config/site'
import Mail from '@/emails/order_notification_owner'
import prisma from '@/lib/prisma'
import { sendMail } from '@packages/mail/src'
import { render } from '@react-email/render'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      const orders = await prisma.order.findMany({
         where: {
            userId,
         },
         include: {
            address: true,
            payments: true,
            refund: true,
            orderItems: true,
         },
      })

      return NextResponse.json(orders)
   } catch (error) {
      console.error('[ORDERS_GET]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}

export async function POST(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      const { addressId, discountCode } = await req.json()

      if (discountCode) {
         await prisma.discountCode.findUniqueOrThrow({
            where: {
               code: discountCode,
               stock: {
                  gte: 1,
               },
            },
         })
      }

      const cart = await prisma.cart.findUniqueOrThrow({
         where: {
            userId,
         },
         include: {
            items: {
               include: {
                  product: true,
               },
            },
         },
      })

      const { tax, total, discount, payable } = await calculateCosts({ cart, discountCode })

      const order = await prisma.order.create({
         data: {
            user: {
               connect: {
                  id: userId,
               },
            },
            status: 'Processing',
            total,
            tax,
            payable,
            discount,
            shipping: 0,
            address: {
               connect: { id: addressId },
            },
            orderItems: {
               create: cart?.items.map((orderItem) => ({
                  count: orderItem.count,
                  price: orderItem.product.price,
                  discount: orderItem.product.discount,
                  product: {
                     connect: {
                        id: orderItem.productId,
                     },
                  },
               })),
            },
         },
      })

      enum PaymentStatus {
         Processing = 'Processing',
         Paid = 'Paid',
         Failed = 'Failed',
         Denied = 'Denied',
      }

      const provider = await prisma.paymentProvider.findFirst({ where: { isActive: true } })
      if (provider) {
         await prisma.payment.create({
            data: {
               status: PaymentStatus.Processing,
               isSuccessful: false,
               payable: order.payable,
               refId: order.id.toString(),
               user: { connect: { id: userId } },
               order: { connect: { id: order.id } },
               provider: { connect: { id: provider.id } },
            },
         })
      }

      const owners = await prisma.owner.findMany()

      await prisma.notification.create({
         data: {
            userId: userId,
            content: `Order #${order.number} was created with a value of $${payable}.`,
         },
      })

      for (const owner of owners) {
         await sendMail({
            name: config.name,
            to: owner.email,
            subject: 'An order was created.',
            html: await render(
               Mail({
                  id: order.id,
                  payable: payable.toFixed(2),
                  orderNum: order.number.toString(),
               })
            ),
         })
      }

      return NextResponse.json(order)
   } catch (error) {
      console.error('[ORDER_POST]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}

async function calculateCosts({ cart, discountCode }) {
   let total = 0,
      discount = 0

   for (const item of cart?.items) {
      total += item?.count * item?.product?.price
      discount += item?.count * item?.product?.discount
   }

   let codeDiscount = 0
   if (discountCode) {
      const discountInfo = await prisma.discountCode.findFirst({
         where: {
            code: discountCode,
            stock: { gte: 1 },
            startDate: { lte: new Date() },
            endDate: { gte: new Date() },
         },
      })
      if (discountInfo && discountInfo.percent) {
         codeDiscount = Math.min(
            (total - discount) * (discountInfo.percent / 100),
            discountInfo.maxDiscountAmount || Infinity
         )
      }
   }

   const afterDiscount = total - discount - codeDiscount
   const tax = afterDiscount * 0.09
   const payable = afterDiscount + tax

   return {
      total: parseFloat(total.toFixed(2)),
      discount: parseFloat(discount.toFixed(2)),
      afterDiscount: parseFloat(afterDiscount.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      payable: parseFloat(payable.toFixed(2)),
   }
}
