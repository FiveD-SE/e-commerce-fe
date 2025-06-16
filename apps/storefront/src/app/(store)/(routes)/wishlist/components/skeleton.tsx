"use client"

import { ImageSkeleton } from '@/components/native/icons'

export function Skeleton() {
    return (
        <div className="animate-pulse rounded-lg border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800 mb-4">
            <div className="relative h-full w-full">
                <div className="flex h-40 w-full items-center justify-center rounded bg-neutral-300 dark:bg-neutral-700 ">
                    <ImageSkeleton />
                </div>
            </div>
            <div className="p-10">
                <div className="w-full" />
            </div>
        </div>
    )
}
