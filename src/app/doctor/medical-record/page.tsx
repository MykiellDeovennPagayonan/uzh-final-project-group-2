"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PageLayout } from "@/components/layout/PageLayout"
import { useNavigation } from "@/hooks/useNavigation"
import { useAuth } from "@/contexts/AuthContext"
import { Search, FileText, Calendar, UserIcon, Activity, Filter } from "lucide-react"
import { backendCore } from "@/declarations/backendCore"
import Link from "next/link"
import { MedicalRecord } from "@/declarations/backendCore/backendCore.did"

export default function DoctorPatientRecords() {
  const { user } = useAuth()
  const { navigationItems, activeItemId, handleNavigationClick } = useNavigation({ 
    currentPage: "patient-records" 
  })
  
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecords = async () => {
      if (!user) return
      
      try {
        setLoading(true)
        // Doctor can access records from their clinic
        const result = await backendCore.getMedicalRecordsByClinicId(user.clinic_id)
        setRecords(result)
      } catch (err) {
        setError('Failed to fetch patient records')
        console.error('Error fetching records:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchRecords()
  }, [user])

  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      record.record_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.patient_id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && record.is_active) ||
      (statusFilter === "inactive" && !record.is_active)

    return matchesSearch && matchesStatus
  })

  const formatDate = (timestamp: bigint | number) => {
    return new Date(Number(timestamp) / 1000000).toLocaleDateString()
  }

  const getStatusCounts = () => {
    const active = records.filter((r) => r.is_active).length
    const inactive = records.filter((r) => !r.is_active).length
    return { active, inactive, total: records.length }
  }

  const statusCounts = getStatusCounts()

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
          <div className="text-lg">Loading patient records...</div>
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
            <h1 className="text-3xl font-bold text-gray-900">Patient Records</h1>
            <p className="text-gray-600 mt-1">View and manage patient medical records</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm">
              {statusCounts.total} Total
            </Badge>
            <Badge variant="default" className="text-sm">
              {statusCounts.active} Active
            </Badge>
            <Badge variant="secondary" className="text-sm">
              {statusCounts.inactive} Inactive
            </Badge>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search records or patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={statusFilter} onValueChange={(value: "all" | "active" | "inactive") => setStatusFilter(value)}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Records</SelectItem>
              <SelectItem value="active">Active Only</SelectItem>
              <SelectItem value="inactive">Inactive Only</SelectItem>
            </SelectContent>
          </Select>
          <Link href="/doctor/add-event">
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
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Created:</span>
                    <span>{formatDate(record.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Updated:</span>
                    <span>{formatDate(record.last_updated)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <div className="text-xs text-muted-foreground">
                    Hash: {record.current_snapshot_hash.substring(0, 16)}...
                  </div>
                  <div className="space-x-2">
                    <Link href={`/doctor/record/${record.record_id}`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                    <Link href={`/doctor/add-event?record_id=${record.record_id}`}>
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
              <h3 className="text-lg font-medium mb-2">No Records Found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== "all"
                  ? "No records match your search criteria."
                  : "No patient records available."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </PageLayout>
  )
}