'use client'

import { GraphData } from '@/actions/get-graph-revenue'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

interface OverviewProps {
   data: GraphData[]
}

export const Overview: React.FC<OverviewProps> = ({ data }) => {
   const width = window.innerWidth * 0.762

   return (
      <ResponsiveContainer width="100%" height={350}>
         <BarChart width={width} height={350} data={data}>
            <XAxis
               dataKey="name"
               stroke="#888888"
               fontSize={12}
               tickLine={false}
               axisLine={false}
            />
            <YAxis
               stroke="#888888"
               fontSize={12}
               tickLine={false}
               axisLine={false}
               tickFormatter={(value) => `$${value}`}
            />
            <Bar dataKey="value" fill="#3498db" radius={[4, 4, 0, 0]} />
         </BarChart>
      </ResponsiveContainer>
   )
}
