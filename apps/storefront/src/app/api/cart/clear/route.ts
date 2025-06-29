import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')
      if (!userId) return new NextResponse('Unauthorized', { status: 401 })

      await prisma.cartItem.deleteMany({
         where: { cartId: userId },
      })

      return NextResponse.json({ success: true })
   } catch (error) {
      console.error('[CART_CLEAR]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}