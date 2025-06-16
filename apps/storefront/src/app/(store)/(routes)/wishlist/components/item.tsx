"use client"

import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { getCountInCart } from '@/lib/cart'
import { useAuthenticated } from '@/hooks/useAuthentication'
import { useCartContext } from '@/state/Cart'
import { getLocalCart } from '@/lib/cart'
import { Badge } from '@/components/ui/badge'
import CartButton from '@/app/(store)/(routes)/products/[productId]/components/cart_button'

export const WishlistItem = ({ item }) => {
    const [fetchingCart, setFetchingCart] = useState(false)
    const [removing, setRemoving] = useState(false)
    const { authenticated } = useAuthenticated()
    const { cart, dispatchCart } = useCartContext()

    async function getProduct() {
        try {
            const response = await fetch(`/api/product`, {
                method: 'POST',
                body: JSON.stringify({ productId: item.id }),
                cache: 'no-store',
                headers: {
                    'Content-Type': 'application/json-string',
                },
            })

            return await response.json()
        } catch (error) {
            console.error({ error })
        }
    }

    async function onAddToCart() {
        try {
            setFetchingCart(true)

            if (authenticated) {
                const response = await fetch(`/api/cart`, {
                    method: 'POST',
                    body: JSON.stringify({
                        productId: item.id,
                        count:
                            getCountInCart({ cartItems: cart?.items, productId: item.id }) + 1,
                    }),
                    cache: 'no-store',
                    headers: {
                        'Content-Type': 'application/json-string',
                    },
                })

                const json = await response.json()

                dispatchCart(json)
            }

            const localCart = getLocalCart() as any

            if (
                !authenticated &&
                getCountInCart({ cartItems: cart?.items, productId: item.id }) > 0
            ) {
                for (let i = 0; i < localCart.items.length; i++) {
                    if (localCart.items[i].productId === item.id) {
                        localCart.items[i].count = localCart.items[i].count + 1
                    }
                }

                dispatchCart(localCart)
            }

            if (
                !authenticated &&
                getCountInCart({ cartItems: cart?.items, productId: item.id }) < 1
            ) {
                localCart.items.push({
                    productId: item.id,
                    product: await getProduct(),
                    count: 1,
                })

                dispatchCart(localCart)
            }

            setFetchingCart(false)
        } catch (error) {
            console.error({ error })
        }
    }

    // Remove from wishlist handler
    const onRemoveFromWishlist = async () => {
        setRemoving(true)
        await fetch('/api/wishlist', {
            method: 'DELETE',
            body: JSON.stringify({ productId: item.id }),
            headers: { 'Content-Type': 'application/json' },
        })
        setRemoving(false)
    }

    return (
        <Card className="flex flex-col">
            <div className="relative w-full h-60">
                <Link href={`/products/${item.id}`}>
                    <Image
                        className="rounded-t-lg object-cover"
                        src={item.images[0]}
                        alt="product image"
                        fill
                        sizes="(min-width: 1000px) 30vw, 50vw"
                        style={{ objectFit: 'cover' }}
                    />
                </Link>
            </div>
            <CardContent className="flex flex-col gap-2 p-5">
                <Link href={`/products/${item.id}`}>
                    <h2 className="font-semibold text-lg">{item.title}</h2>
                </Link>
                <p className="text-xs text-muted-foreground text-justify">
                    {item.description}
                </p>
                <div>
                    {item.discount > 0 ? (
                        <span>
                            <span className="line-through mr-2">${item.price}</span>
                            <span className="text-red-500">
                                ${(item.price - item.discount).toFixed(2)}
                            </span>
                        </span>
                    ) : (
                        <span>${item.price}</span>
                    )}
                </div>
                <div className="flex gap-2 mt-2">
                    <CartButton product={item} />
                    <Button
                        onClick={onRemoveFromWishlist}
                        disabled={removing}
                        variant="outline"
                    >
                        {removing ? 'Removing...' : 'Remove'}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
