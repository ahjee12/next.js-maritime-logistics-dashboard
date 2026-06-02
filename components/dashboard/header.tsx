"use client"

import { useState } from "react"
import { Anchor, Bell, Settings, User, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function DashboardHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { label: "Dashboard", href: "#", active: true },
    { label: "Vessels", href: "#", active: false },
    { label: "Schedules", href: "#", active: false },
    { label: "Reports", href: "#", active: false },
  ]

  return (
    <header className="sticky top-0 z-40 bg-primary text-primary-foreground">
      <div className="flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6">
        {/* Mobile Menu Button */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10 mr-2"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 bg-primary border-r-0 p-0">
            <SheetHeader className="p-4 border-b border-primary-foreground/10">
              <SheetTitle className="flex items-center gap-3 text-primary-foreground">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-accent">
                  <Anchor className="h-5 w-5 text-accent-foreground" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-lg font-semibold tracking-tight">OceanLink</span>
                  <span className="text-xs text-primary-foreground/70 -mt-0.5">Logistics Platform</span>
                </div>
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col p-4 gap-1">
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  variant="ghost"
                  className={`justify-start text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10 ${
                    item.active ? "bg-primary-foreground/10 text-primary-foreground" : ""
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Button>
              ))}
            </nav>
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-primary-foreground/10">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-accent text-accent-foreground text-sm font-medium">
                    JD
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-primary-foreground">John Doe</span>
                  <span className="text-xs text-primary-foreground/70">john.doe@oceanlink.com</span>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-accent">
            <Anchor className="h-4 w-4 sm:h-5 sm:w-5 text-accent-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-semibold tracking-tight">OceanLink</span>
            <span className="text-[10px] sm:text-xs text-primary-foreground/70 -mt-0.5 hidden sm:block">Logistics Platform</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Button
              key={item.label}
              variant="ghost"
              className={`text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10 ${
                item.active ? "bg-primary-foreground/10 text-primary-foreground" : ""
              }`}
            >
              {item.label}
            </Button>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10 relative h-9 w-9"
          >
            <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
            <span className="sr-only">Notifications</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10 hidden sm:flex h-9 w-9"
          >
            <Settings className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 sm:h-9 sm:w-9 rounded-full hover:bg-primary-foreground/10">
                <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
                  <AvatarFallback className="bg-accent text-accent-foreground text-xs sm:text-sm font-medium">
                    JD
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">John Doe</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    john.doe@oceanlink.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
