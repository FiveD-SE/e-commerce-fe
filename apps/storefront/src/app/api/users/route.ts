import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const userId = req.headers.get('X-USER-ID')

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const users = await prisma.user.findMany({
      include: {
        orders: true,
        addresses: true,
        payments: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(users)
  } catch (error) {
    console.log('[USERS_GET]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
} 