import config from '@/config/site'
import Mail from '@/emails/verify'
import prisma from '@/lib/prisma'
import { generateSerial } from '@/lib/serial'
import { getErrorResponse } from '@/lib/utils'
import { sendMail } from '@packages/mail/src'
import { isEmailValid } from '@packages/regex/src'
import { render } from '@react-email/render'
import { NextRequest, NextResponse } from 'next/server'
import { ZodError } from 'zod'

export async function POST(req: NextRequest) {
   try {
      const OTP = generateSerial({})

      const { email } = await req.json()

      if (!isEmailValid(email)) {
         return getErrorResponse(400, 'Incorrect Email')
      }

      // Kiểm tra email đã tồn tại trong bảng owner chưa
      const owner = await prisma.owner.findUnique({ where: { email } })
      if (!owner) {
         return getErrorResponse(404, 'Email not found')
      }

      await prisma.owner.update({
         where: { email },
         data: { OTP },
      })

      await sendMail({
         name: config.name,
         to: email,
         subject: 'Verify your email.',
         html: await render(Mail({ code: OTP, name: config.name })),
      })

      return new NextResponse(
         JSON.stringify({
            status: 'success',
            email,
         }),
         {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
         }
      )
   } catch (error) {
      console.error(error)
      if (error instanceof ZodError) {
         return getErrorResponse(400, 'failed validations', error)
      }

      return getErrorResponse(500, error.message)
   }
}
