import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import prisma from '@/lib/prisma'

import { PaymentForm } from './components/payment-form'
import { PaymentWithIncludes } from '@/types/prisma'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import Link from 'next/link'

export default async function PaymentPage({
   params,
}: {
   params: { paymentId: string }
}) {
   const payment = await prisma.payment.findUnique({
      where: {
         id: params.paymentId,
      },
      include: {
         provider: true,
         user: true,
      },
   })

   function UserCard() {
      return (
         <Card className="my-4 p-2 bg-muted-foreground/5">
            <CardContent>
               <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-2">
                     <AccordionTrigger>
                        <div className="block">
                           <h2 className="text-lg font-bold tracking-wider text-left">
                              USER
                           </h2>
                           <p className="text-sm font-light text-foreground/70">
                              User in this payment.
                           </p>
                        </div>
                     </AccordionTrigger>
                     <AccordionContent>
                        <div className="block space-y-4">
                           <div className="grid w-full items-center">
                              <h3>Name</h3>
                              <p className="text-muted-foreground">
                                 {payment?.user?.name}
                              </p>
                           </div>
                           <div className="grid w-full items-center">
                              <h3>Email</h3>
                              <p className="text-muted-foreground">
                                 {payment?.user?.email}
                              </p>
                           </div>
                           <div className="grid w-full items-center">
                              <h3>Phone</h3>
                              <p className="text-muted-foreground">
                                 {payment?.user?.phone}
                              </p>
                           </div>
                        </div>
                     </AccordionContent>
                  </AccordionItem>
               </Accordion>
            </CardContent>
            <CardFooter>
               <Link
                  href={`/users/${payment?.user?.id}`}
                  className="text-sm underline text-muted-foreground transition-colors hover:text-primary"
               >
                  Visit this user's profile.
               </Link>
            </CardFooter>
         </Card>
      )
   }

   function PaymentCardInfo() {
      return (
         <Card className="my-4 p-2">
            <CardContent>
               <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-2">
                     <AccordionTrigger>
                        <div className="block">
                           <h2 className="text-lg font-bold tracking-wider text-left">
                              VIEW PAYMENT
                           </h2>
                           <p className="text-sm font-light text-foreground/70">
                              Payment details information.
                           </p>
                        </div>
                     </AccordionTrigger>
                     <AccordionContent>
                        <PaymentForm initialData={payment as PaymentWithIncludes} />
                     </AccordionContent>
                  </AccordionItem>
               </Accordion>
            </CardContent>
         </Card>
      )
   }

   return (
      <div className="block space-y-4 my-6">
         <Heading
            title="Payment Data"
            description="Payment details and data about the user."
         />
         <Separator />
         <UserCard />
         <PaymentCardInfo />
      </div>
   )
}
