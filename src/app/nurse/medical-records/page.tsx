"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PageLayout } from "@/components/layout/PageLayout"
import { useNavigation } from "@/hooks/useNavigation"
import { useAuth } from "@/contexts/AuthContext"
import { backendCore } from "@/declarations/backendCore"
import { Search, FileText, UserIcon, Activity } from "lucide-react"
import Link from "next/link"
import { MedicalRecord } from "@/declarations/backendCore/backendCore.did"

export default function NurseAssignedRecords() {
  const { user } = useAuth()
  const { navigationItems, activeItemId, handleNavigationClick } = useNavigation({
    currentPage: "assigned-records"
  })

  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAssignedRecords = async () => {
      if (!user) return

      try {
        setLoading(true)
        // Fetch nurse's assigned records
        const assignmentsResult = await backendCore.getMedicalRecordsByStaff(user.user_id)

        setRecords(assignmentsResult)
      } catch (err) {
        setError('Failed to fetch assigned records')
        console.error('Error fetching assigned records:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAssignedRecords()
  }, [user])

  const filteredRecords = records.filter(
    (record) =>
      record.record_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.patient_id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (!user) {
    return null
  }

  if (loading) {
    return (
      <PageLayout
        navigationItems={navigationItems}
        activeItemId={activeItemId}
        onNavigationClick={handleNavigationClick}
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading assigned records...</div>
        </div>
      </PageLayout>
    )
  }

  if (error) {
    return (
      <PageLayout
        navigationItems={navigationItems}
        activeItemId={activeItemId}
        onNavigationClick={handleNavigationClick}
      >
        <div className="flex justify-center items-center h-64">
          <div className="text-red-600">Error: {error}</div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout
      navigationItems={navigationItems}
      activeItemId={activeItemId}
      onNavigationClick={handleNavigationClick}
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Assigned Records</h1>
            <p className="text-gray-600 mt-1">Manage your assigned patient records</p>
          </div>
          <Badge variant="outline" className="text-sm">
            {filteredRecords.length} Active Records
          </Badge>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search records or patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Link href="/nurse/add-event">
            <Button>
              <Activity className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </Link>
        </div>

        <div className="grid gap-4">
          {filteredRecords.map((record) => (
            <Card key={record.record_id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Record #{record.record_id}
                  </CardTitle>
                  <Badge variant={record.is_active ? "default" : "secondary"}>
                    {record.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Patient:</span>
                    <span>{record.patient_id}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <div className="text-xs text-muted-foreground">
                    Hash: {record.current_snapshot_hash.substring(0, 16)}...
                  </div>
                  <div className="space-x-2">
                    <Link href={`/nurse/medical-records/${record.record_id}`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                    <Link href={`/nurse/add-event?record_id=${record.record_id}`}>
                      <Button size="sm">
                        Add Event
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredRecords.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Assigned Records</h3>
              <p className="text-muted-foreground">
                {searchTerm ? "No records match your search criteria." : "You have no assigned medical records."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </PageLayout>
  )
}