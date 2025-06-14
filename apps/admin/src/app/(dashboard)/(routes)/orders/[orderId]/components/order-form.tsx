'use client'

import { CardContent } from '@/components/ui/card'
import type { OrderWithIncludes } from '@/types/prisma'
import Image from 'next/image'
import Link from 'next/link'

interface OrderFormProps {
   initialData: OrderWithIncludes | null
}

function ReadonlyField({ label, value }: { label: string; value: React.ReactNode }) {
   return (
      <div className="space-y-1 w-full">
         <div className="text-sm font-medium mb-1">{label}</div>
         <div className="flex items-center h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground">
            {value}
         </div>
      </div>
   )
}

export const OrderForm: React.FC<OrderFormProps> = ({ initialData }) => {
   if (!initialData) return <div>No order data.</div>

   return (
      <div className="block space-y-6 w-full">
         {/* Order Items */}
         <div className="space-y-4">
            <div className="text-lg font-semibold mb-2">Order Items</div>
            {initialData.orderItems.map((item, index) => (
               <CardContent className="grid grid-cols-6 gap-4 p-3" key={index}>
                  <div className="relative h-60 w-full col-span-2 hidden md:inline-flex">
                     <Link href={`/products/${item.product.id}`}>
                        <Image
                           className="rounded-lg"
                           src={item.product.images[0]}
                           alt="item image"
                           fill
                           style={{ objectFit: 'cover' }}
                        />
                     </Link>
                  </div>
                  <div className="col-span-4 block space-y-2">
                     <Link href={`/products/${item.product.id}`}>
                        <h2 className="font-semibold text-lg">{item.product.title}</h2>
                     </Link>
                     <p className="text-xs text-muted-foreground text-justify">
                        <span className="font-medium">Price:</span> ${item.product.price}
                     </p>
                     <p className="text-xs text-muted-foreground text-justify">
                        <span className="font-medium">Brand:</span> {item.product.brand?.title}
                     </p>
                     <p className="text-xs text-muted-foreground text-justify">
                        <span className="font-medium">Categories:</span> {item.product.categories.map(c => c.title).join(', ')}
                     </p>
                  </div>
               </CardContent>
            ))}
         </div>

         {/* Order Info */}
         <div className="space-y-4">
            <div className="text-lg font-semibold mb-2">Order Info</div>
            <div className="flex flex-col gap-3">
               <ReadonlyField label="Order Number" value={`#${initialData.number}`} />
               <ReadonlyField label="Status" value={initialData.status} />
               <ReadonlyField label="Created At" value={new Date(initialData.createdAt).toLocaleString()} />
               <ReadonlyField label="Updated At" value={new Date(initialData.updatedAt).toLocaleString()} />
               <ReadonlyField label="Shipping" value={`$${initialData.shipping}`} />
               <ReadonlyField label="Discount" value={`$${initialData.discount}`} />
               <ReadonlyField label="Tax" value={`$${initialData.tax}`} />
               <ReadonlyField label="Total" value={`$${initialData.total}`} />
               <ReadonlyField label="Payable" value={`$${initialData.payable}`} />
               <ReadonlyField label="Paid" value={initialData.isPaid ? 'Yes' : 'No'} />
               <ReadonlyField label="Completed" value={initialData.isCompleted ? 'Yes' : 'No'} />
            </div>
         </div>

         {/* Payments */}
         {initialData.payments && initialData.payments.length > 0 && (
            <div className="space-y-4 mt-6">
               <div className="text-lg font-semibold mb-2">Payments</div>
               <div className="flex flex-col gap-4">
                  {initialData.payments.map((payment, idx) => (
                     <div key={payment.id} className="border rounded p-3 flex flex-col gap-2">
                        <ReadonlyField label="Payment Number" value={`#${payment.number}`} />
                        <ReadonlyField label="Status" value={payment.status} />
                        <ReadonlyField label="Payable" value={`$${payment.payable}`} />
                        <ReadonlyField label="Successful" value={payment.isSuccessful ? 'Yes' : 'No'} />
                        <ReadonlyField label="Provider" value={payment.provider?.title || '-'} />
                        <ReadonlyField label="Created At" value={new Date(payment.createdAt).toLocaleString()} />
                     </div>
                  ))}
               </div>
            </div>
         )}
      </div>
   )
}