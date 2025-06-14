import prisma from '@/lib/prisma'
import { serialize } from 'next-mdx-remote/serialize'
import Image from 'next/image'
import Link from 'next/link'
import { Content } from '../components/content'
import rehypeUnwrapImages from 'rehype-unwrap-images'

export default async function Blog({ params }: { params: { slug: string } }) {
   const blog = await prisma.blog.findUnique({
      where: {
         slug: params.slug,
      },
      include: { author: true },
   })

   const recommendations = await prisma.blog.findMany({
      include: { author: true },
      take: 3,
   })

   const mdx = await serialize(blog.content, {
      mdxOptions: {
         rehypePlugins: [rehypeUnwrapImages],
      },
   })

   return (
      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
         <Content blog={blog} mdx={mdx} />
         <Recomendations recommendations={recommendations} />
      </div>
   )
}

function Recomendations({ recommendations }) {
   return (
      <div className="col-span-1">
         {recommendations.map((rec, index) => {
            const { slug, author, createdAt, updatedAt, title, image } = rec

            return (
               <div key={index} className="mb-4 w-full">
                  <Link href={`/blog/${slug}`}>
                     <div className="w-full rounded-lg border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
                        <div className="relative h-40 w-full">
                           <Image
                              className="rounded-t-lg"
                              src={image}
                              alt="Blog Post Cover"
                              fill
                              sizes="(min-width: 1000px) 30vw, 50vw"
                              style={{ objectFit: 'cover' }}
                           />
                        </div>
                        <div className="p-5">
                           <div className="w-full">
                              <h5 className="mb-3 text-justify font-medium tracking-tight text-neutral-900 dark:text-white">
                                 {title}
                              </h5>
                              <p className="block text-sm text-neutral-700 dark:text-neutral-400">
                                 <span>{author?.name}, Date</span>
                              </p>
                           </div>
                        </div>
                     </div>
                  </Link>
               </div>
            )
         })}
      </div>
   )
}
