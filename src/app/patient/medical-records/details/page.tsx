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
import { backendCore } from "@/declarations/backendCore"
import { FileText,
  // Download,
  Calendar, Activity, Hash, Shield, ArrowLeft } from "lucide-react"
import { MedicalEvent, MedicalRecord,
  // FileAttachment
} from "@/declarations/backendCore/backendCore.did"
import Link from "next/link"


// type EMRError = {
//   NotFound: string
// } | {
//   Unauthorized: null
// } | {
//   InvalidData: string
// } | {
//   SystemError: string
// }

// type Result<T> = {
//   Ok: T
// } | {
//   Err: EMRError
// }

export default function PatientRecordDetails() {
  const params = useParams()
  const recordId = params.recordId as string
  const { user } = useAuth()
  const { navigationItems, activeItemId, handleNavigationClick } = useNavigation({
    currentPage: "medical-records"
  })

  const [record, setRecord] = useState<MedicalRecord | null>(null)
  const [events, setEvents] = useState<MedicalEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecordDetails = async () => {
      if (!user || !recordId) return

      try {
        setLoading(true)
        setError(null)

        // Fetch record details
        const recordResult: [] | [MedicalRecord] = await backendCore.getMedicalRecordById(recordId)

        if (recordResult.length === 1) {
          setRecord(recordResult[0])

          // Fetch events for this record
          const eventsResult: MedicalEvent[] = await backendCore.getMedicalEventsByRecordId(recordId)

          const sortedEvents = eventsResult.sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
          setEvents(sortedEvents)
        }
      } catch (err) {
        setError('Failed to fetch record details')
        console.error('Error fetching record details:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchRecordDetails()
  }, [user, recordId])

  const formatIcpTime = (icpTime: bigint) => {
    return new Date(Number(icpTime) / 1000000).toLocaleString()
  }

  const formatFileSize = (bytes: bigint) => {
    const bytesNum = Number(bytes)
    const sizes = ["Bytes", "KB", "MB", "GB"]
    if (bytesNum === 0) return "0 Bytes"
    const i = Math.floor(Math.log(bytesNum) / Math.log(1024))
    return Math.round((bytesNum / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i]
  }

  const getActionString = (action: MedicalEvent['action']) => {
    if ('Create' in action) return 'Create'
    if ('Update' in action) return 'Update'
    if ('Delete' in action) return 'Delete'
    if ('Append' in action) return 'Append'
    return 'Unknown'
  }

  const getStatusString = (status: MedicalEvent['status']) => {
    if ('Pending' in status) return 'Pending'
    if ('Batched' in status) return 'Batched'
    if ('Verified' in status) return 'Verified'
    if ('Failed' in status) return 'Failed'
    return 'Unknown'
  }

  // const handleDownloadFile = async (attachment: FileAttachment) => {
  //   try {
  //     console.log('Downloading file:', attachment.file_name)

  //     // Create a blob from the encrypted data and download
  //     const blob = new Blob([attachment.encrypted_data], { type: 'application/octet-stream' })
  //     const url = URL.createObjectURL(blob)
  //     const a = document.createElement('a')
  //     a.href = url
  //     a.download = attachment.file_name
  //     document.body.appendChild(a)
  //     a.click()
  //     document.body.removeChild(a)
  //     URL.revokeObjectURL(url)
  //   } catch (err) {
  //     console.error('Error downloading file:', err)
  //   }
  // }

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
          <div className="text-gray-600">Loading record details...</div>
        </div>
      </PageLayout>
    )
  }

  if (error || !record) {
    return (
      <PageLayout
        navigationItems={navigationItems}
        activeItemId={activeItemId}
        onNavigationClick={handleNavigationClick}
      >
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold mb-2">Record Not Found</h2>
          <p className="text-gray-500 mb-4">{error || "The requested medical record could not be found."}</p>
          <Link href="/patient/medical-records">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Records
            </Button>
          </Link>
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
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Link href="/patient/medical-records">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Records
                </Button>
              </Link>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Medical Record Details</h1>
            <p className="text-gray-600 mt-1">Record #{record.record_id}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className={record.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
              {record.is_active ? "Active" : "Inactive"}
            </Badge>
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
              <Shield className="h-4 w-4 mr-1" />
              Blockchain Secured
            </Badge>
          </div>
        </div>

        {/* Record Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Record Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Created</label>
                <p className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4" />
                  {formatIcpTime(record.created_at)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Last Updated</label>
                <p className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4" />
                  {formatIcpTime(record.last_updated)}
                </p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Current Hash</label>
              <p className="flex items-center gap-2 font-mono text-sm mt-1 break-all">
                <Hash className="h-4 w-4 flex-shrink-0" />
                {record.current_snapshot_hash}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Clinic</label>
              <p className="mt-1">{record.clinic_id}</p>
            </div>
          </CardContent>
        </Card>

        {/* Medical Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Medical Events ({events.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {events.length === 0 ? (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Events Found</h3>
                <p className="text-gray-500">No medical events have been recorded for this record yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {events.map((event, index) => (
                  <div key={event.id}>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline">{event.event_type}</Badge>
                        <Badge variant="outline">{getActionString(event.action)}</Badge>
                        <Badge variant={getStatusString(event.status) === "Verified" ? "default" : "secondary"}>
                          {getStatusString(event.status)}
                        </Badge>
                        <span className="text-sm text-gray-500">{formatIcpTime(event.timestamp)}</span>
                      </div>

                      <div className="text-sm">
                        <strong>Data:</strong> {event.data}
                      </div>

                      {event.attachments.length > 0 && (
                        <div className="space-y-2">
                          <strong className="text-sm">Attachments:</strong>
                          {event.attachments.map((attachment) => (
                            <div
                              key={attachment.file_id}
                              className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                            >
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                <span className="text-sm">{attachment.file_name}</span>
                                <span className="text-xs text-gray-500">
                                  ({formatFileSize(attachment.file_size)})
                                </span>
                              </div>
                              {/* <Button size="sm" variant="outline" onClick={() => handleDownloadFile(attachment)}>
                                <Download className="h-4 w-4 mr-1" />
                                Download
                              </Button> */}
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="text-xs text-gray-400 font-mono">
                        Hash: {event.event_hash}
                      </div>
                    </div>
                    {index < events.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  )
}