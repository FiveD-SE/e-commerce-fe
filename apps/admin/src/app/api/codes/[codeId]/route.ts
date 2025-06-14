import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(req: Request, { params }: { params: { codeId: string } }) {
  try {
    const userId = req.headers.get('X-USER-ID')
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    if (!params.codeId) {
      return new NextResponse('Code id is required', { status: 400 })
    }
    const code = await prisma.discountCode.findUnique({
      where: { id: params.codeId },
    })
    return NextResponse.json(code)
  } catch (error) {
    console.error('[CODE_GET]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { codeId: string } }) {
  try {
    const userId = req.headers.get('X-USER-ID')
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    if (!params.codeId) {
      return new NextResponse('Code id is required', { status: 400 })
    }
    const body = await req.json()
    const { code, percent, maxDiscountAmount, startDate, endDate, stock, description } = body
    if (!code && !percent && !maxDiscountAmount && !startDate && !endDate && !stock && !description) {
      return new NextResponse('At least one field is required', { status: 400 })
    }
    const updatedCode = await prisma.discountCode.update({
      where: { id: params.codeId },
      data: {
        ...(code && { code }),
        ...(percent && { percent }),
        ...(maxDiscountAmount && { maxDiscountAmount }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: new Date(endDate) }),
        ...(stock && { stock }),
        ...(description && { description }),
      },
    })
    return NextResponse.json(updatedCode)
  } catch (error) {
    console.error('[CODE_PATCH]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { codeId: string } }) {
  try {
    const userId = req.headers.get('X-USER-ID')
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    if (!params.codeId) {
      return new NextResponse('Code id is required', { status: 400 })
    }
    const deletedCode = await prisma.discountCode.delete({
      where: { id: params.codeId },
    })
    return NextResponse.json(deletedCode)
  } catch (error) {
    console.error('[CODE_DELETE]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
