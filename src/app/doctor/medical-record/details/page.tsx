"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { PageLayout } from "@/components/layout/PageLayout"
import { useNavigation } from "@/hooks/useNavigation"
import { useAuth } from "@/contexts/AuthContext"
import { FileText, Calendar, UserIcon, Activity, Hash, Edit, Plus, Trash2, Shield } from "lucide-react"
import { backendCore } from "@/declarations/backendCore"
import Link from "next/link"
import { MedicalEvent, MedicalRecord, FileAttachment } from "@/declarations/backendCore/backendCore.did"

export default function DoctorRecordDetails() {
  const params = useParams()
  const recordId = params.recordId as string
  const { user } = useAuth()
  const { navigationItems, activeItemId, handleNavigationClick } = useNavigation({
    currentPage: "patient-records"
  })

  const [record, setRecord] = useState<MedicalRecord | null>(null)
  const [events, setEvents] = useState<MedicalEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Helper to extract variant keys
  const getKey = (obj: Record<string, null>) => Object.keys(obj)[0]

  useEffect(() => {
    const fetchRecordDetails = async () => {
      if (!user || !recordId) return

      try {
        setLoading(true)
        const [recordResult, eventsResult] = await Promise.all([
          backendCore.getMedicalRecordById(recordId),
          backendCore.getMedicalEventsByRecordId(recordId)
        ])

        if (recordResult[0]) setRecord(recordResult[0])
        
        const sortedEvents = eventsResult.sort((a: MedicalEvent, b: MedicalEvent) => Number(b.timestamp) - Number(a.timestamp))
        setEvents(sortedEvents)
      } catch (err) {
        setError('Failed to fetch record details')
        console.error('Error fetching record details:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchRecordDetails()
  }, [user, recordId])

  const formatDate = (timestamp: bigint | number) => {
    return new Date(Number(timestamp) / 1000000).toLocaleString()
  }

  const formatFileSize = (bytes: number) => {
    const sizes = ["Bytes", "KB", "MB", "GB"]
    if (bytes === 0) return "0 Bytes"
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i]
  }

  // Doctor can create these event types
  const doctorEventTypes = ["diagnosis", "prescription", "treatment_plan", "consultation_notes"]

  const canEditEvent = (event: MedicalEvent) => {
    return event.created_by_id === user?.user_id || 
           doctorEventTypes.includes(event.event_type)
  }

  const getEventActionVariant = (action: string) => {
    switch (action) {
      case 'Create': return 'default'
      case 'Update': return 'secondary'
      case 'Delete': return 'destructive'
      case 'Append': return 'outline'
      default: return 'outline'
    }
  }

  const getEventStatusVariant = (status: string) => {
    switch (status) {
      case 'Verified': return 'default'
      case 'Pending': return 'secondary'
      case 'Batched': return 'outline'
      case 'Failed': return 'destructive'
      default: return 'outline'
    }
  }

  if (!user) return null

  if (loading) {
    return (
      <PageLayout navigationItems={navigationItems} activeItemId={activeItemId} onNavigationClick={handleNavigationClick}>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading record details...</div>
        </div>
      </PageLayout>
    )
  }

  if (error || !record) {
    return (
      <PageLayout navigationItems={navigationItems} activeItemId={activeItemId} onNavigationClick={handleNavigationClick}>
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold mb-2">Record Not Found</h2>
          <p className="text-muted-foreground">The requested medical record could not be found.</p>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout navigationItems={navigationItems} activeItemId={activeItemId} onNavigationClick={handleNavigationClick}>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Medical Record Details</h1>
            <p className="text-gray-600 mt-1">Record #{record.record_id}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Link href={`/doctor/add-event?record_id=${record.record_id}`}>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </Link>
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
              <Shield className="h-4 w-4 mr-1" />
              Blockchain Secured
            </Badge>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Record Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Patient ID</label>
                <p className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4" />
                  {record.patient_id}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Clinic ID</label>
                <p>{record.clinic_id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Created</label>
                <p className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {formatDate(record.created_at)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                <p className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {formatDate(record.last_updated)}
                </p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Current Hash</label>
              <p className="flex items-center gap-2 font-mono text-sm">
                <Hash className="h-4 w-4" />
                {record.current_snapshot_hash}
              </p>
            </div>
            <div>
              <Badge variant={record.is_active ? "default" : "secondary"}>
                {record.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Medical Events ({events.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {events.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Medical Events</h3>
                  <p className="text-muted-foreground">No medical events have been recorded for this patient yet.</p>
                </div>
              ) : (
                events.map((event, index) => {
                  const actionKey = getKey(event.action)
                  const statusKey = getKey(event.status)
                  
                  return (
                    <div key={event.id}>
                      <div className="flex justify-between items-start">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline">{event.event_type}</Badge>
                            <Badge variant={getEventActionVariant(actionKey)}>
                              {actionKey}
                            </Badge>
                            <Badge variant={getEventStatusVariant(statusKey)}>
                              {statusKey}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {formatDate(event.timestamp)}
                            </span>
                            
                            {canEditEvent(event) && (
                              <div className="flex gap-1 ml-auto">
                                <Link href={`/doctor/edit-event/${event.id}`}>
                                  <Button size="sm" variant="ghost" className="text-muted-foreground">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </Link>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </div>

                          <div className="text-sm">
                            <strong>Data:</strong> {event.data}
                          </div>

                          {event.reference_event_id && (
                            <div className="text-sm">
                              <strong>References Event:</strong> {event.reference_event_id}
                            </div>
                          )}

                          {event.attachments.length > 0 && (
                            <div className="space-y-2">
                              <strong className="text-sm">Attachments:</strong>
                              {event.attachments.map((attachment: FileAttachment) => (
                                <div
                                  key={attachment.file_id}
                                  className="flex items-center justify-between bg-muted p-2 rounded"
                                >
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    <span className="text-sm">{attachment.file_name}</span>
                                    <span className="text-xs text-muted-foreground">
                                      ({formatFileSize(Number(attachment.file_size))})
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="text-xs text-muted-foreground">
                            Created by: {event.created_by_id} | Hash: {event.event_hash}
                            {event.batch_id && ` | Batch: ${event.batch_id}`}
                          </div>
                        </div>
                      </div>
                      {index < events.length - 1 && <Separator className="mt-4" />}
                    </div>
                  )
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  )
}