'use client'

import { Separator } from '@/components/native/separator'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { isVariableValid } from '@/lib/utils'
import { useCartContext } from '@/state/Cart'

export function Receipt({ handlePlaceOrder, discountInfo }: { handlePlaceOrder: () => void, discountInfo?: any }) {
   const { loading, cart } = useCartContext()

   function calculatePayableCost() {
      let totalAmount = 0,
         discountAmount = 0

      if (isVariableValid(cart?.items)) {
         for (const item of cart?.items) {
            totalAmount += item?.count * item?.product?.price
            discountAmount += item?.count * item?.product?.discount
         }
      }

      // Áp dụng discount code nếu có
      let codeDiscount = 0
      if (discountInfo && discountInfo.percent) {
         codeDiscount = Math.min(
            (totalAmount - discountAmount) * (discountInfo.percent / 100),
            discountInfo.maxDiscountAmount || Infinity
         )
      }

      const afterDiscount = totalAmount - discountAmount - codeDiscount
      const taxAmount = afterDiscount * 0.09
      const payableAmount = afterDiscount + taxAmount

      return {
         totalAmount: totalAmount.toFixed(2),
         discountAmount: discountAmount.toFixed(2),
         codeDiscount: codeDiscount.toFixed(2),
         afterDiscount: afterDiscount.toFixed(2),
         taxAmount: taxAmount.toFixed(2),
         payableAmount: payableAmount.toFixed(2),
      }
   }

   const cost = calculatePayableCost()

   return (
      <Card className={loading && 'animate-pulse'}>
         <CardHeader className="p-4 pb-0">
            <h2 className="font-bold tracking-tight">Receipt</h2>
         </CardHeader>
         <CardContent className="p-4 text-sm">
            <div className="block space-y-[1vh]">
               <div className="flex justify-between">
                  <p>Total Amount</p>
                  <h3>${cost.totalAmount}</h3>
               </div>
               <div className="flex justify-between">
                  <p>Discount Amount</p>
                  <h3>${cost.discountAmount}</h3>
               </div>
               {discountInfo && discountInfo.percent > 0 && (
                  <div className="flex justify-between">
                     <p>Discount by code</p>
                     <h3 className="text-green-600">-${cost.codeDiscount}</h3>
                  </div>
               )}
               <div className="flex justify-between">
                  <p>Tax Amount</p>
                  <h3>${cost.taxAmount}</h3>
               </div>
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between">
               <p>Payable Amount</p>
               <h3>${cost.payableAmount}</h3>
            </div>
         </CardContent>
         <Separator />
         <div className="w-full flex justify-end">
            <Button
               disabled={
                  !isVariableValid(cart?.items) || cart['items'].length === 0
               }
               onClick={handlePlaceOrder}
            >
               Place Order
            </Button>
         </div>
      </Card>
   )
}
