import ConsCard from '@/components/native/mdx/ConsCard'
import ProsCard from '@/components/native/mdx/ProsCard'
import Step from '@/components/native/mdx/Step'
import Image from 'next/image'

function MDXImage({ alt, src }) {
   return (
      <Image
         alt={alt}
         className="mx-auto rounded-lg"
         src={src}
         width={400}
         height={200}
         style={{
            objectFit: 'cover',
            width: '100%',
            height: 'auto',
            margin: '16px auto',
         }}
      />
   )
}

function Callout(props) {
   return (
      <div className="my-8 flex rounded-lg bg-neutral-200 p-4 dark:bg-neutral-800">
         <div className="mr-4 flex w-4 items-center">{props.emoji}</div>
         <div className="callout w-full">{props.children}</div>
      </div>
   )
}

function Header({ title }) {
   return <>HEY</>
}

const MDXComponents = {
   MDXImage,
   Callout,
   ConsCard,
   ProsCard,
   Step,
   Header,
}

export default MDXComponents
