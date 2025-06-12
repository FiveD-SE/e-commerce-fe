import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(req: Request, { params }: { params: { bannerId: string } }) {
   try {
      if (!params.bannerId) {
         return new NextResponse('Banner id is required', { status: 400 })
      }
      const banner = await prisma.banner.findUnique({
         where: { id: params.bannerId },
      })
      return NextResponse.json(banner)
   } catch (error) {
      console.error('[BANNER_GET]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}

export async function PATCH(req: Request, { params }: { params: { bannerId: string } }) {
   try {
      if (!params.bannerId) {
         return new NextResponse('Banner id is required', { status: 400 })
      }
      const body = await req.json()
      const { label, image } = body
      if (!label && !image) {
         return new NextResponse('At least one field (label or image) is required', { status: 400 })
      }
      const updatedBanner = await prisma.banner.update({
         where: { id: params.bannerId },
         data: { ...(label && { label }), ...(image && { image }) },
      })
      return NextResponse.json(updatedBanner)
   } catch (error) {
      console.error('[BANNER_PATCH]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}

export async function DELETE(req: Request, { params }: { params: { bannerId: string } }) {
   try {
      if (!params.bannerId) {
         return new NextResponse('Banner id is required', { status: 400 })
      }
      const deletedBanner = await prisma.banner.delete({
         where: { id: params.bannerId },
      })
      return NextResponse.json(deletedBanner)
   } catch (error) {
      console.error('[BANNER_DELETE]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
} 