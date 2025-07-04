import config from '@/config/site'
import { Metadata } from 'next'
import Link from 'next/link'

import { UserAuthForm } from '../login/components/user-auth-form'

export const metadata: Metadata = {
   title: 'Authentication',
   description: 'Authentication forms built using the components.',
}

export default function AuthenticationPage() {
   return (
      <div className="container relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
         <div className="relative hidden bg-zinc-900 h-full flex-col bg-muted p-10 dark:border-r lg:flex text-white">
            <Link
               href="/"
               className="relative z-20 flex items-center text-lg font-medium text-white"
            >
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 h-6 w-6 text-white"
               >
                  <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
               </svg>
               {config.name}
            </Link>
            <div className="relative z-20 mt-auto">
               <blockquote className="space-y-2">
                  <p className="text-lg">
                     &ldquo;This library has saved me countless hours of work
                     and helped me deliver stunning designs to my clients faster
                     than ever before.&rdquo;
                  </p>
                  <footer className="text-sm">Sofia Davis</footer>
               </blockquote>
            </div>
         </div>
         <div className="p-8">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
               <div className="flex flex-col space-y-2 text-center">
                  <h1 className="text-2xl font-semibold tracking-tight">
                     Login
                  </h1>
                  <p className="text-sm text-muted-foreground">
                     Enter your email below to create or login your account.
                  </p>
               </div>
               <UserAuthForm />
               <p className="px-8 text-center text-sm text-muted-foreground">
                  By clicking continue, you agree to our{' '}
                  <Link
                     href="/terms"
                     className="underline underline-offset-4 hover:text-primary"
                  >
                     Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link
                     href="/privacy"
                     className="underline underline-offset-4 hover:text-primary"
                  >
                     Privacy Policy
                  </Link>
                  .
               </p>
            </div>
         </div>
      </div>
   )
}
