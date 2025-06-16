import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = req.headers.get('X-USER-ID')

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!params.userId) {
      return new NextResponse('User id is required', { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: {
        id: params.userId,
      },
      include: {
        orders: {
          include: {
            orderItems: {
              include: {
                product: true,
              },
            },
          },
        },
        addresses: true,
        payments: true,
      },
    })

    if (!user) {
      return new NextResponse('User not found', { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.log('[USER_GET]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = req.headers.get('X-USER-ID')

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!params.userId) {
      return new NextResponse('User id is required', { status: 400 })
    }

    const body = await req.json()
    const {
      name,
      email,
      phone,
      birthday,
      isBanned,
      isEmailVerified,
      isPhoneVerified,
      isEmailSubscribed,
      isPhoneSubscribed,
    } = body

    const user = await prisma.user.update({
      where: {
        id: params.userId,
      },
      data: {
        name,
        email,
        phone,
        birthday,
        isBanned,
        isEmailVerified,
        isPhoneVerified,
        isEmailSubscribed,
        isPhoneSubscribed,
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.log('[USER_PATCH]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = req.headers.get('X-USER-ID')

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!params.userId) {
      return new NextResponse('User id is required', { status: 400 })
    }

    const user = await prisma.user.delete({
      where: {
        id: params.userId,
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.log('[USER_DELETE]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
} 