import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const code = searchParams.get('code')
    if (!code) {
      return new NextResponse('Code is required', { status: 400 })
    }
    const now = new Date()
    const discount = await prisma.discountCode.findFirst({
      where: {
        code,
        stock: { gte: 1 },
        startDate: { lte: now },
        endDate: { gte: now },
      },
    })
    if (!discount) {
      return new NextResponse('Discount code not found or expired', { status: 404 })
    }
    return NextResponse.json(discount)
  } catch (error) {
    console.error('[CODES_VALIDATE]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}