"use client"
import { Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type React from "react"

interface NavigationItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  href?: string
  onClick?: () => void
  disabled?: boolean
}

interface TopNavigationProps {
  user: {
    name: string
    role: string
    initials: string
  }
  onLogout: () => void
  navigationItems?: NavigationItem[]
  onNavigationClick?: (itemId: string) => void
  activeItemId?: string
}

export function TopNavigation({
  user,
  onLogout,
  navigationItems = [],
  onNavigationClick,
  activeItemId,
}: TopNavigationProps) {
  const handleLogout = async () => {
    try {
      await onLogout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const handleNavigationClick = (item: NavigationItem) => {
    if (item.disabled) return

    if (item.onClick) {
      item.onClick()
    } else if (onNavigationClick) {
      onNavigationClick(item.id)
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* App Name */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">MedChain EMR</span>
        </div>

        {/* Center Navigation for Patient */}
        {navigationItems.length > 0 && (
          <div className="flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = activeItemId === item.id

              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  className={isActive ? "bg-blue-600 hover:bg-blue-700 text-white" : "text-gray-700 hover:bg-blue-50"}
                  onClick={() => handleNavigationClick(item)}
                  disabled={item.disabled}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Button>
              )
            })}
          </div>
        )}

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-3 hover:bg-gray-50">
              <Avatar>
                <AvatarFallback className="bg-blue-600 text-white">{user.initials}</AvatarFallback>
              </Avatar>
              <div className="text-sm text-left">
                <p className="font-medium">{user.name}</p>
                <p className="text-gray-500">{user.role}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}