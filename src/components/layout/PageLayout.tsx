"use client"
import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { TopNavigation } from "./TopNavigation"
import { LeftSidebar } from "./LeftSidebar"
import { useAuth } from "@/contexts/AuthContext"
import { userRoleToString } from "@/contexts/AuthContext"
import type React from "react"

interface NavigationItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  href?: string
  onClick?: () => void
  disabled?: boolean
}

interface PageLayoutProps {
  children: React.ReactNode
  navigationItems: NavigationItem[]
  activeItemId?: string
  onNavigationClick?: (itemId: string) => void
  className?: string
}

export function PageLayout({
  children,
  navigationItems,
  activeItemId,
  onNavigationClick,
  className,
}: PageLayoutProps) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  // Authentication and route protection
  useEffect(() => {
    // If not authenticated, redirect to home
    if (!user) {
      router.push("/")
      return
    }

    const userRole = userRoleToString(user.role).toLowerCase()
    
    // Define allowed routes for each role
    const roleRoutes = {
      patient: ["/patient"],
      nurse: ["/nurse"],
      doctor: ["/doctor"],
      himsp: ["/himsp"]
    }

    // Check if current path matches user's role
    const allowedPaths = roleRoutes[userRole as keyof typeof roleRoutes]
    const isAllowedRoute = allowedPaths?.some(path => pathname.startsWith(path))

    // If user is in wrong route, redirect to their role's default route
    if (!isAllowedRoute) {
      const defaultRoutes = {
        patient: "/patient/medical-records",
        nurse: "/nurse/assigned-records", 
        doctor: "/doctor/patient-records",
        himsp: "/himsp/all-records"
      }
      
      const defaultRoute = defaultRoutes[userRole as keyof typeof defaultRoutes]
      if (defaultRoute) {
        router.push(defaultRoute)
        return
      }
    }
  }, [user, pathname, router])

  // Don't render anything if user is not authenticated or being redirected
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-gray-600">Redirecting to login...</div>
      </div>
    )
  }

  const getUserInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const userForNav = {
    name: user.name,
    role: userRoleToString(user.role),
    initials: getUserInitials(user.name),
  }

  const userRole = userRoleToString(user.role)
  const showSidebar = userRole !== "Patient" && navigationItems.length > 1

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <TopNavigation
        user={userForNav}
        onLogout={logout}
        navigationItems={showSidebar ? [] : navigationItems}
        onNavigationClick={onNavigationClick}
        activeItemId={activeItemId}
      />

      <div className="flex">
        {showSidebar && (
          <LeftSidebar 
            navigationItems={navigationItems} 
            activeItemId={activeItemId} 
            onItemClick={onNavigationClick} 
          />
        )}

        <main className={`flex-1 p-6 ${className}`}>{children}</main>
      </div>
    </div>
  )
}