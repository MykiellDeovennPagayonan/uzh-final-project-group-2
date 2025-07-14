"use client"
import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { userRoleToString } from "@/contexts/AuthContext"

export function useRouteProtection() {
  const { user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!user) {
      router.push("/")
      return
    }

    const userRole = userRoleToString(user.role).toLowerCase()
    
    const roleRoutes = {
      patient: ["/patient"],
      nurse: ["/nurse"],
      doctor: ["/doctor"],
      himsp: ["/himsp"]
    }

    const allowedPaths = roleRoutes[userRole as keyof typeof roleRoutes]
    const isAllowedRoute = allowedPaths?.some(path => pathname.startsWith(path))

    if (!isAllowedRoute) {
      const defaultRoutes = {
        patient: "/patient/medical-records",
        nurse: "/nurse/medical-records", 
        doctor: "/doctor/medical-records",
        himsp: "/himsp/medical-records"
      }
      
      const defaultRoute = defaultRoutes[userRole as keyof typeof defaultRoutes]
      if (defaultRoute) {
        router.push(defaultRoute)
        return
      }
    }
  }, [user, pathname, router])

  return { user, isAuthenticated: !!user }
}