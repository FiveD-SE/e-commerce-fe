import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    const userId = req.headers.get('X-USER-ID')
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    const codes = await prisma.discountCode.findMany({
      orderBy: { startDate: 'desc' },
    })
    return NextResponse.json(codes)
  } catch (error) {
    console.error('[CODES_GET]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const userId = req.headers.get('X-USER-ID')
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    const body = await req.json()
    const { code, percent, maxDiscountAmount, startDate, endDate, stock, description } = body
    if (!code || !percent || !maxDiscountAmount || !startDate || !endDate || !stock) {
      return new NextResponse('Missing required fields', { status: 400 })
    }
    const newCode = await prisma.discountCode.create({
      data: {
        code,
        percent,
        maxDiscountAmount,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        stock,
        description,
      },
    })
    return NextResponse.json(newCode)
  } catch (error) {
    console.error('[CODES_POST]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
