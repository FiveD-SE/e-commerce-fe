'use client'

import { Button } from '@/components/ui/button'
import {
   Command,
   CommandEmpty,
   CommandGroup,
   CommandInput,
   CommandItem,
} from '@/components/ui/command'
import { Label } from '@/components/ui/label'
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from '@/components/ui/popover'
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { cn, isVariableValid } from '@/lib/utils'
import { slugify } from '@packages/slugify/src'
import { Check, ChevronsUpDown } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export function SortBy({ initialData }) {
   const router = useRouter()
   const pathname = usePathname()
   const searchParams = useSearchParams()

   const [value, setValue] = useState('featured')

   useEffect(() => {
      if (isVariableValid(initialData)) setValue(initialData)
   }, [initialData])

   return (
      <Select
         onValueChange={(currentValue) => {
            const current = new URLSearchParams(
               searchParams ? Array.from(searchParams.entries()) : []
            )

            if (currentValue === value) {
               current.delete('sort')
               setValue('')
            } else {
               current.set('sort', currentValue)
               setValue(currentValue)
            }

            const search = current.toString()
            const query = search ? `?${search}` : ''

            router.replace(`${pathname}${query}`, {
               scroll: false,
            })
         }}
      >
         <SelectTrigger className="w-full">
            <SelectValue placeholder="Sort By" />
         </SelectTrigger>
         <SelectContent>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="most_expensive">Most Expensive</SelectItem>
            <SelectItem value="least_expensive">Least Expensive</SelectItem>
         </SelectContent>
      </Select>
   )
}

export function CategoriesCombobox({ categories, initialCategory }) {
   const router = useRouter()
   const pathname = usePathname()
   const searchParams = useSearchParams()

   const [open, setOpen] = useState(false)
   const [value, setValue] = useState('')

   function getCategoryTitle() {
      for (const category of categories) {
         if (slugify(category.title) === slugify(value)) return category.title
      }
   }

   useEffect(() => {
      setValue(initialCategory)
   }, [initialCategory])

   const handleSelect = (currentValue) => {
      const current = new URLSearchParams()

      // Copy existing params safely
      if (searchParams) {
         for (const [key, value] of searchParams.entries()) {
            current.set(key, value)
         }
      }

      if (currentValue === value) {
         current.delete('category')
         setValue('')
      } else {
         current.set('category', currentValue)
         setValue(currentValue)
      }

      const search = current.toString()
      const query = search ? `?${search}` : ''

      router.replace(`${pathname}${query}`, {
         scroll: false,
      })

      setOpen(false)
   }

   return (
      <Popover open={open} onOpenChange={setOpen}>
         <PopoverTrigger asChild>
            <Button
               variant="outline"
               role="combobox"
               aria-expanded={open}
               className="w-full justify-between"
            >
               {value ? getCategoryTitle() : 'Select category...'}
               <ChevronsUpDown className="ml-2 h-4 shrink-0 opacity-50" />
            </Button>
         </PopoverTrigger>
         <PopoverContent className="w-full p-0">
            <Command>
               <CommandInput placeholder="Search category..." />
               <CommandEmpty>No category found.</CommandEmpty>
               <CommandGroup>
                  {categories?.map((category) => (
                     <CommandItem
                        key={category.title}
                        value={category.title}
                        onSelect={handleSelect}
                     >
                        <Check
                           className={cn(
                              'mr-2 h-4 w-4',
                              value === category.title
                                 ? 'opacity-100'
                                 : 'opacity-0'
                           )}
                        />
                        {category.title}
                     </CommandItem>
                  ))}
               </CommandGroup>
            </Command>
         </PopoverContent>
      </Popover>
   )
}

export function BrandCombobox({ brands, initialBrand }) {
   const router = useRouter()
   const pathname = usePathname()
   const searchParams = useSearchParams()

   const [open, setOpen] = useState(false)
   const [value, setValue] = useState('')

   function getBrandTitle() {
      for (const brand of brands) {
         if (slugify(brand.title) === slugify(value)) return brand.title
      }
   }

   useEffect(() => {
      setValue(initialBrand)
   }, [initialBrand])

   const handleSelect = (currentValue) => {
      const current = new URLSearchParams()

      // Copy existing params safely
      if (searchParams) {
         for (const [key, value] of searchParams.entries()) {
            current.set(key, value)
         }
      }

      if (currentValue === value) {
         current.delete('brand')
         setValue('')
      } else {
         current.set('brand', currentValue)
         setValue(currentValue)
      }

      const search = current.toString()
      const query = search ? `?${search}` : ''

      router.replace(`${pathname}${query}`, {
         scroll: false,
      })

      setOpen(false)
   }

   return (
      <Popover open={open} onOpenChange={setOpen}>
         <PopoverTrigger asChild>
            <Button
               variant="outline"
               role="combobox"
               aria-expanded={open}
               className="w-full justify-between"
            >
               {value ? getBrandTitle() : 'Select brand...'}
               <ChevronsUpDown className="ml-2 h-4 shrink-0 opacity-50" />
            </Button>
         </PopoverTrigger>
         <PopoverContent className="w-full p-0">
            <Command>
               <CommandInput placeholder="Search brand..." />
               <CommandEmpty>No brand found.</CommandEmpty>
               <CommandGroup>
                  {brands?.map((brand) => (
                     <CommandItem
                        key={brand.title}
                        value={brand.title}
                        onSelect={handleSelect}
                     >
                        <Check
                           className={cn(
                              'mr-2 h-4',
                              value === brand.title
                                 ? 'opacity-100'
                                 : 'opacity-0'
                           )}
                        />
                        {brand.title}
                     </CommandItem>
                  ))}
               </CommandGroup>
            </Command>
         </PopoverContent>
      </Popover>
   )
}

export function AvailableToggle({ initialData }) {
   const router = useRouter()
   const pathname = usePathname()
   const searchParams = useSearchParams()
   const [value, setValue] = useState(false)

   useEffect(() => {
      setValue(initialData === 'true' ? true : false)
   }, [initialData])

   const handleChange = (currentValue) => {
      const current = new URLSearchParams()

      // Copy existing params safely
      if (searchParams) {
         for (const [key, value] of searchParams.entries()) {
            current.set(key, value)
         }
      }

      current.set(
         'isAvailable',
         currentValue === true ? 'true' : 'false'
      )
      setValue(currentValue)

      const search = current.toString()
      const query = search ? `?${search}` : ''

      router.replace(`${pathname}${query}`, {
         scroll: false,
      })
   }

   return (
      <div className="flex w-full border rounded-md items-center h-9 px-3 text-sm">
         <div className="mx-auto flex gap-2 items-center">
            <Switch
               checked={value}
               onCheckedChange={handleChange}
               id="available"
            />
            <Label htmlFor="available" className="text-sm">Only Available</Label>
         </div>
      </div>
   )
}
