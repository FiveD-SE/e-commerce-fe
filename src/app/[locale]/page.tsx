"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, Menu, Heart, ChevronRight, SlidersHorizontal, Star, Github, CreditCard } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("all")

  const rooms = [
    { id: 1, name: "All search", value: "all" },
    { id: 2, name: "Room 1", value: "room-1" },
    { id: 3, name: "Room 2", value: "room-2" },
    { id: 4, name: "Room 3", value: "room-3" },
    { id: 5, name: "Room 4", value: "room-4" },
    { id: 6, name: "Room 5", value: "room-5" },
    { id: 7, name: "Room 6", value: "room-6" },
    { id: 8, name: "Room 7", value: "room-7" },
    { id: 9, name: "Room 8", value: "room-8" },
    { id: 10, name: "Room 9", value: "room-9" },
    { id: 11, name: "Room 10", value: "room-10" },
    { id: 12, name: "Room 11", value: "room-11" },
  ]

  const listings = [
    {
      id: 1,
      location: "Groveland, California",
      area: "Yosemite National Park",
      dates: "Oct 23 - 28",
      price: 289,
      rating: 4.91,
      isSuperhost: true,
    },
    {
      id: 2,
      location: "Groveland, California",
      area: "Yosemite National Park",
      dates: "Oct 23 - 28",
      price: 289,
      rating: 4.91,
      isSuperhost: true,
    },
    {
      id: 3,
      location: "Mammoth Lakes, California",
      area: "Mammoth Mountain",
      dates: "Nov 5 - 10",
      price: 325,
      rating: 4.87,
      isSuperhost: true,
    },
    {
      id: 4,
      location: "South Lake Tahoe, California",
      area: "Lake Tahoe",
      dates: "Dec 12 - 18",
      price: 420,
      rating: 4.95,
      isSuperhost: true,
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-1">
            <div className="h-8 w-8 rounded-full bg-primary"></div>
            <span className="text-lg font-semibold">
              brand<span className="text-primary">name</span>
            </span>
          </Link>

          <div className="flex items-center gap-2 rounded-full border px-2 py-1 shadow-sm">
            <Button variant="ghost" className="text-sm font-normal">
              Any week
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button variant="ghost" className="text-sm font-normal">
              Add guests
            </Button>
            <Button size="icon" className="rounded-full bg-primary text-primary-foreground">
              <Search className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Menu className="h-5 w-5" />
            </Button>
            <div className="relative">
              <Avatar>
                <AvatarImage src="/placeholder-user.jpg" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                1
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Room Categories */}
      <div className="border-b">
        <div className="container relative flex items-center px-4">
          <div className="flex-1 overflow-x-auto py-4 scrollbar-hide">
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="h-auto bg-transparent p-0">
                {rooms.map((room) => (
                  <TabsTrigger
                    key={room.id}
                    value={room.value}
                    className="flex flex-col items-center gap-1 rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-foreground"
                  >
                    <div className="grid h-6 w-6 place-items-center">
                      <div className="h-5 w-5 rounded-md border"></div>
                    </div>
                    <span className="text-xs">{room.name}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          <div className="absolute right-4 flex items-center gap-2 bg-background pl-4">
            <Button size="icon" variant="ghost" className="rounded-full">
              <ChevronRight className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="sm" className="gap-2 rounded-lg">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Listings */}
      <main className="container flex-1 px-4 py-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {listings.map((listing) => (
            <div key={listing.id} className="group relative flex flex-col">
              <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
                <Image
                  src="/placeholder.svg?height=400&width=400"
                  alt={listing.location}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-3 top-3 h-8 w-8 rounded-full bg-background/60 backdrop-blur-sm"
                >
                  <Heart className="h-4 w-4" />
                </Button>
                {listing.isSuperhost && (
                  <Badge
                    className="absolute left-3 top-3 bg-background/80 text-foreground backdrop-blur-sm"
                    variant="outline"
                  >
                    Superhost
                  </Badge>
                )}
                <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-1.5 w-1.5 rounded-full bg-background"></div>
                  ))}
                </div>
              </div>
              <div className="mt-3 flex flex-col">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{listing.location}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-foreground" />
                    <span className="text-sm">{listing.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{listing.area}</p>
                <p className="text-sm text-muted-foreground">{listing.dates}</p>
                <p className="mt-1">
                  <span className="font-medium">${listing.price}</span> <span className="text-sm">night</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container flex items-center justify-between px-4">
          <div className="flex items-center gap-4 text-sm">
            <span>© 2024 brandname, Inc.</span>
            <Separator orientation="vertical" className="h-4" />
            <Link href="/terms" className="hover:underline">
              Terms
            </Link>
            <Separator orientation="vertical" className="h-4" />
            <Link href="/privacy" className="hover:underline">
              Privacy
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Github className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <CreditCard className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}

