"use client"
import { useState, useCallback } from "react"
import type React from "react"
import { useRouter } from "next/navigation"
import { FileText, Users, Plus, Activity, Database } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { userRoleToString } from "@/contexts/AuthContext"

interface NavigationItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  href?: string
  onClick?: () => void
  disabled?: boolean
}

interface UseNavigationProps {
  currentPage?: string
}

export function useNavigation({ currentPage }: UseNavigationProps) {
  const router = useRouter()
  const { user } = useAuth()
  const [activeItemId, setActiveItemId] = useState(currentPage || "medical-records")

  const userRole = user ? userRoleToString(user.role) : null

  const getNavigationItems = useCallback((): NavigationItem[] => {
    if (!userRole) return []

    switch (userRole) {
      case "Patient":
        return [
          {
            id: "medical-records",
            label: "My Medical Records",
            icon: FileText,
            href: "/patient/medical-records",
          },
        ]

      case "Nurse":
        return [
          {
            id: "assigned-records",
            label: "Assigned Records",
            icon: Users,
            href: "/nurse/assigned-records",
          },
          {
            id: "add-event",
            label: "Add Medical Event",
            icon: Plus,
            href: "/nurse/add-event",
          },
        ]

      case "Doctor":
        return [
          {
            id: "patient-records",
            label: "Patient Records",
            icon: Users,
            href: "/doctor/patient-records",
          },
          {
            id: "add-event",
            label: "Add Medical Event",
            icon: Plus,
            href: "/doctor/add-event",
          },
        ]

      case "HIMSP":
        return [
          {
            id: "all-records",
            label: "All Records",
            icon: Database,
            href: "/himsp/all-records",
          },
          {
            id: "system-analytics",
            label: "System Analytics",
            icon: Activity,
            href: "/himsp/system-analytics",
          },
        ]

      default:
        return []
    }
  }, [userRole])

  const handleNavigationClick = useCallback(
    (itemId: string) => {
      const items = getNavigationItems()
      const item = items.find((i) => i.id === itemId)

      if (item?.href) {
        router.push(item.href)
      }

      setActiveItemId(itemId)
    },
    [router, getNavigationItems],
  )

  return {
    navigationItems: getNavigationItems(),
    activeItemId,
    handleNavigationClick,
    setActiveItemId,
  }
}