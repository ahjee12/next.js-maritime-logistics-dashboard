"use client"

import { useState } from "react"
import {
  Anchor,
  LayoutDashboard,
  Ship,
  Settings,
  Bell,
  LogOut,
  ChevronLeft,
  Menu,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useNavigation, type PageType } from "@/lib/navigation-context"

const navItems: { id: PageType; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "vessels", label: "Vessel Schedule", icon: Ship },
  { id: "settings", label: "Settings", icon: Settings },
]

interface AppSidebarProps {
  children: React.ReactNode
}

export function AppSidebar({ children }: AppSidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { currentPage, setCurrentPage } = useNavigation()

  const handleNavigation = (page: PageType) => {
    setCurrentPage(page)
    setMobileOpen(false)
  }

  // Desktop Sidebar
  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className={cn(
      "flex flex-col h-full bg-primary text-primary-foreground",
      !isMobile && "transition-all duration-300",
      !isMobile && (collapsed ? "w-[72px]" : "w-64")
    )}>
      {/* Logo */}
      <div className={cn(
        "flex items-center h-16 px-4 border-b border-primary-foreground/10",
        collapsed && !isMobile && "justify-center px-2"
      )}>
        <div className={cn(
          "flex items-center gap-3",
          collapsed && !isMobile && "gap-0"
        )}>
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent shrink-0">
            <Anchor className="h-5 w-5 text-accent-foreground" />
          </div>
          {(!collapsed || isMobile) && (
            <div className="flex flex-col">
              <span className="text-lg font-semibold tracking-tight">SINOKOR</span>
              <span className="text-xs text-primary-foreground/70 -mt-0.5">Logistics Platform</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <TooltipProvider delayDuration={0}>
          {navItems.map((item) => {
            const isActive = currentPage === item.id
            const Icon = item.icon

            const navButton = (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => handleNavigation(item.id)}
                className={cn(
                  "w-full justify-start gap-3 h-11 text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10",
                  isActive && "bg-primary-foreground/15 text-primary-foreground font-medium",
                  collapsed && !isMobile && "justify-center px-0"
                )}
              >
                <Icon className={cn("h-5 w-5 shrink-0", collapsed && !isMobile && "h-5 w-5")} />
                {(!collapsed || isMobile) && <span>{item.label}</span>}
              </Button>
            )

            if (collapsed && !isMobile) {
              return (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>{navButton}</TooltipTrigger>
                  <TooltipContent side="right" className="font-medium">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              )
            }

            return navButton
          })}
        </TooltipProvider>
      </nav>

      {/* Collapse Toggle (Desktop Only) */}
      {!isMobile && (
        <div className="p-3 border-t border-primary-foreground/10">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "w-full justify-start gap-3 h-9 text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10",
              collapsed && "justify-center px-0"
            )}
          >
            <ChevronLeft className={cn(
              "h-4 w-4 shrink-0 transition-transform duration-300",
              collapsed && "rotate-180"
            )} />
            {!collapsed && <span className="text-sm">Collapse</span>}
          </Button>
        </div>
      )}

      {/* User Section */}
      <div className={cn(
        "p-3 border-t border-primary-foreground/10",
        collapsed && !isMobile && "px-2"
      )}>
        <div className={cn(
          "flex items-center gap-3 p-2 rounded-lg hover:bg-primary-foreground/5 cursor-pointer",
          collapsed && !isMobile && "justify-center p-1"
        )}>
          <Avatar className="h-9 w-9 shrink-0">
            <AvatarFallback className="bg-accent text-accent-foreground text-sm font-medium">
              JD
            </AvatarFallback>
          </Avatar>
          {(!collapsed || isMobile) && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">John Doe</p>
              <p className="text-xs text-primary-foreground/70 truncate">Admin</p>
            </div>
          )}
        </div>
        {(!collapsed || isMobile) && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-3 h-9 mt-2 text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
          >
            <LogOut className="h-4 w-4" />
            <span className="text-sm">Sign Out</span>
          </Button>
        )}
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Header & Content */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between h-14 px-4 bg-primary text-primary-foreground border-b border-primary-foreground/10">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0 border-r-0 bg-primary">
              <SheetHeader className="sr-only">
                <SheetTitle>Navigation Menu</SheetTitle>
                <SheetDescription>Main navigation for SINOKOR Logistics Platform</SheetDescription>
              </SheetHeader>
              <SidebarContent isMobile />
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent">
              <Anchor className="h-4 w-4 text-accent-foreground" />
            </div>
            <span className="text-base font-semibold">SINOKOR</span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10 relative h-9 w-9"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
              <span className="sr-only">Notifications</span>
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-accent text-accent-foreground text-xs font-medium">
                JD
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
