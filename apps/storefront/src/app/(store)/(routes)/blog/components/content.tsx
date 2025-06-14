'use client'

import { Separator } from "@/components/ui/separator"
import MDXComponents from "@/components/native/mdx/MDXComponents"
import { MDXRemote } from "next-mdx-remote"
import { format } from "date-fns"

export function Content({ blog, mdx }) {
    const { title, updatedAt } = blog

    return (
        <div className="rounded-lg bg-white p-6 text-justify text-neutral-900 dark:bg-neutral-800 dark:text-neutral-200 md:col-span-3">
            <h1 className="mb-1 text-3xl font-medium">{title}</h1>
            <p className="my-2 text-sm font-medium text-neutral-400">
                Last Updated {format(new Date(updatedAt), 'MMMM dd, yyyy')}
            </p>
            <Separator />
            <MDXRemote lazy {...mdx} components={MDXComponents} />
        </div>
    )
}   