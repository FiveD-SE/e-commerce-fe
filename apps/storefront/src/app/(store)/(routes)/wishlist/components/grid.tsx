"use client"

import { Card, CardContent } from '@/components/ui/card'
import { isVariableValid } from '@/lib/utils'
import { WishlistItem } from './item'
import { Skeleton } from './skeleton'

export const WishlistGrid = ({ items }) => {
    if (!isVariableValid(items)) {
        return (
            <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                {[...Array(5)].map((_, index) => (
                    <Skeleton key={index} />
                ))}
            </div>
        )
    }

    if (items.length === 0) {
        return (
            <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                    <Card>
                        <CardContent className="p-4">
                            <p>Your Wishlist is empty...</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            {items.map((item, index) => (
                <WishlistItem item={item} key={item.id || index} />
            ))}
        </div>
    )
}
