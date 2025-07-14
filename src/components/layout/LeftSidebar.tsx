"use client"
import { Button } from "@/components/ui/button"
import type React from "react"

import { cn } from "@/lib/utils"

interface NavigationItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  href?: string
  onClick?: () => void
  badge?: string | number
  disabled?: boolean
}

interface LeftSidebarProps {
  navigationItems: NavigationItem[]
  activeItemId?: string
  onItemClick?: (itemId: string) => void
  className?: string
}

export function LeftSidebar({ navigationItems, activeItemId, onItemClick, className }: LeftSidebarProps) {
  const handleItemClick = (item: NavigationItem) => {
    if (item.disabled) return

    if (item.onClick) {
      item.onClick()
    } else if (onItemClick) {
      onItemClick(item.id)
    }
  }

  return (
    <aside className={cn("w-64 bg-white border-r border-gray-200 min-h-screen", className)}>
      <nav className="p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = activeItemId === item.id

          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              className={cn(
                "w-full justify-start",
                isActive ? "bg-blue-600 hover:bg-blue-700 text-white" : "text-gray-700 hover:bg-blue-50",
                item.disabled && "opacity-50 cursor-not-allowed",
              )}
              onClick={() => handleItemClick(item)}
              disabled={item.disabled}
            >
              <Icon className="h-4 w-4 mr-3" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span
                  className={cn(
                    "ml-auto text-xs px-2 py-1 rounded-full",
                    isActive ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700",
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Button>
          )
        })}
      </nav>
    </aside>
  )
}
