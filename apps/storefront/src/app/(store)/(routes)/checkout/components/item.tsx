'use client'

import { Badge } from '@/components/ui/badge'
import {
    Card,
    CardContent,
    CardHeader,
} from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'

export const Item = ({ cartItem }) => {
    const { product } = cartItem

    function Price() {
        if (product?.discount > 0) {
            const price = product?.price - product?.discount
            const percentage = (product?.discount / product?.price) * 100
            return (
                <div className="flex gap-2 items-center">
                    <Badge className="flex gap-4" variant="destructive">
                        <div className="line-through">${product?.price}</div>
                        <div>%{percentage.toFixed(2)}</div>
                    </Badge>
                    <h2 className="">${price.toFixed(2)}</h2>
                </div>
            )
        }

        return <h2>${product?.price}</h2>
    }
    return (
        <Card>
            <CardHeader className="p-0 md:hidden">
                <div className="relative h-48 w-3/5 mx-auto">
                    <Link href={`/products/${product?.id}`}>
                        <Image
                            className="rounded-t-lg"
                            src={product?.images[0]}
                            alt="product image"
                            fill
                            sizes="(min-width: 1000px) 30vw, 50vw"
                            style={{ objectFit: 'contain' }}
                        />
                    </Link>
                </div>
            </CardHeader>
            <CardContent className="grid grid-cols-6 gap-4 p-3">
                <div className="relative w-full col-span-1 hidden md:inline-flex" style={{ minHeight: '160px' }}>
                    <Link href={`/products/${product?.id}`}>
                        <Image
                            className="rounded-lg"
                            src={product?.images[0]}
                            alt="item image"
                            fill
                            style={{ objectFit: 'contain' }}
                        />
                    </Link>
                </div>
                <div className="col-span-4 block space-y-2">
                    <Link href={`/products/${product?.id}`}>
                        <h2>{product?.title}</h2>
                    </Link>
                    <p className="text-xs text-muted-foreground text-justify">
                        {product?.description}
                    </p>
                    <Price />
                </div>
            </CardContent>
        </Card>
    )
}
