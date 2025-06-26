import prisma from '@/lib/prisma'

export interface GraphData {
   name: string
   value: number
}

export const getGraphRevenue = async (): Promise<GraphData[]> => {
   const paidOrders = await prisma.order.findMany({
      where: {
         isPaid: true,
      },
      include: {
         orderItems: {
            include: {
               product: { include: { categories: true } },
            },
         },
      },
   })

   const monthlyRevenue: { [key: number]: number } = {}

   // Grouping the orders by month and summing the revenue
   for (const order of paidOrders) {
      const month = order.createdAt.getMonth() // 0 for Jan, 1 for Feb, ...

      // Adding the revenue for this order to the respective month
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + order.payable
   }

   // Converting the grouped data into the format expected by the graph
   const graphData: GraphData[] = [
      { name: 'Jan', value: 0 },
      { name: 'Feb', value: 0 },
      { name: 'Mar', value: 0 },
      { name: 'Apr', value: 0 },
      { name: 'May', value: 0 },
      { name: 'Jun', value: 0 },
      { name: 'Jul', value: 0 },
      { name: 'Aug', value: 0 },
      { name: 'Sep', value: 0 },
      { name: 'Oct', value: 0 },
      { name: 'Nov', value: 0 },
      { name: 'Dec', value: 0 },
   ]

   // Filling in the revenue data
   for (const month in monthlyRevenue) {
      graphData[parseInt(month)].value = monthlyRevenue[parseInt(month)]
   }

   return graphData
}
