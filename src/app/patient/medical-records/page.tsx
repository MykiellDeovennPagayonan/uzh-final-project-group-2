/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useState, useEffect } from "react"
import { Calendar, User, FileText, Shield, Eye, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageLayout } from "@/components/layout/PageLayout"
import { useNavigation } from "@/hooks/useNavigation"
import { useAuth } from "@/contexts/AuthContext"
import { backendCore } from "@/declarations/backendCore"
import Link from "next/link"

export default function PatientMedicalRecords() {
  const { user } = useAuth()
  const { navigationItems, activeItemId, handleNavigationClick } = useNavigation({ 
    currentPage: "medical-records" 
  })
  
  const [medicalRecords, setMedicalRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMedicalRecords = async () => {
      if (!user) return
      
      try {
        setLoading(true)
        const result = await backendCore.getMedicalRecordsByPatientId(user.user_id)
        setMedicalRecords(result)
      } catch (err) {
        setError('Failed to fetch medical records')
        console.error('Error fetching medical records:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMedicalRecords()
  }, [user])

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
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-600">Loading medical records...</div>
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
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Medical Records</h1>
            <p className="text-gray-600 mt-1">View your complete medical history</p>
          </div>
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
            <Shield className="h-4 w-4 mr-1" />
            Blockchain Secured
          </Badge>
        </div>

        {/* Records List */}
        <div className="space-y-4">
          {medicalRecords.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No medical records found</h3>
                <p className="text-gray-500">Your medical records will appear here once created</p>
              </CardContent>
            </Card>
          ) : (
            medicalRecords.map((record) => (
              <Card key={record.record_id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-gray-900">Record ID: {record.record_id}</h3>
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                            <Shield className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Clinic: {record.clinic_id}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>Created: {new Date(Number(record.created_at) / 1000000).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>Updated: {new Date(Number(record.last_updated) / 1000000).toLocaleDateString()}</span>
                          </div>
                          <Badge variant="outline" className={record.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                            {record.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link href={`/patient/medical-records/${record.record_id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </Link>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </PageLayout>
  )
}