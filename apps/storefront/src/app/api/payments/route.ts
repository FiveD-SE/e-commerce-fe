import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      const payments = await prisma.payment.findMany({
         where: { userId },
         include: {
            provider: true,
            order: true,
         },
         orderBy: { createdAt: 'desc' },
      })

      return NextResponse.json(payments)
   } catch (error) {
      console.error('[PAYMENTS_GET]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
} 