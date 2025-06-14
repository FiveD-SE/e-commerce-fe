'use client'

import type { PaymentWithIncludes } from '@/types/prisma'

interface PaymentFormProps {
   initialData: PaymentWithIncludes | null
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

export const PaymentForm: React.FC<PaymentFormProps> = ({ initialData }) => {
   if (!initialData) return <div>No payment data.</div>

   return (
      <div className="block space-y-6 w-full">
         <div className="space-y-4">
            <div className="text-lg font-semibold mb-2">Payment Info</div>
            <div className="flex flex-col gap-3">
               <ReadonlyField label="Payment Number" value={`#${initialData.number}`} />
               <ReadonlyField label="Status" value={initialData.status} />
               <ReadonlyField label="Payable" value={`$${initialData.payable}`} />
               <ReadonlyField label="Successful" value={initialData.isSuccessful ? 'Yes' : 'No'} />
               <ReadonlyField label="Provider" value={initialData.provider?.title || '-'} />
               <ReadonlyField label="Created At" value={new Date(initialData.createdAt).toLocaleString()} />
               <ReadonlyField label="Updated At" value={new Date(initialData.updatedAt).toLocaleString()} />
            </div>
         </div>
      </div>
   )
}
