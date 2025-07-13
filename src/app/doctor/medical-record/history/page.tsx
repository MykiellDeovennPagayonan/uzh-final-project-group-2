"use client"
import { useState } from "react"
import {
  Search,
  Bell,
  Users,
  FileText,
  Database,
  Filter,
  Shield,
  User,
  Stethoscope,
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle,
  Hash,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export default function DoctorMedicalRecords() {
  const [searchQuery, setSearchQuery] = useState("")
  const [eventTypeFilter, setEventTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  // Mock data based on backend MedicalRecord and MedicalEvent types
  const selectedRecord = {
    record_id: "rec_002",
    patient_id: "usr_002",
    patient_name: "Michael Chen", // From User.name
    clinic_id: "clinic_001",
    created_at: "2024-01-12T14:20:00Z",
    last_updated: "2024-01-15T11:15:00Z",
    is_active: true,
    current_snapshot_hash: "0x4d5e6f7890abcdef1234567890abcdef12345678",
  }

  const medicalEvents = [
    {
      id: "evt_001",
      record_id: "rec_002",
      timestamp: "2024-01-15T10:30:00Z",
      event_type: "vital_signs",
      action: "Create" as const,
      data: "encrypted_vital_signs_data",
      reference_event_id: null,
      attachments: [],
      created_by_id: "usr_doc_001",
      created_by_name: "Dr. Amanda Wilson",
      event_hash: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12",
      batch_id: "batch_001",
      status: "Verified" as const,
    },
    {
      id: "evt_002",
      record_id: "rec_002",
      timestamp: "2024-01-15T11:45:00Z",
      event_type: "diagnosis",
      action: "Create" as const,
      data: "encrypted_diagnosis_data",
      reference_event_id: null,
      attachments: [
        {
          file_id: "file_001",
          file_name: "lab_results.pdf",
          file_type: "document",
          file_size: 245000,
          upload_date: "2024-01-15T11:45:00Z",
        },
      ],
      created_by_id: "usr_doc_001",
      created_by_name: "Dr. Amanda Wilson",
      event_hash: "0x2b3c4d5e6f7890abcdef1234567890abcdef1234",
      batch_id: "batch_001",
      status: "Verified" as const,
    },
    {
      id: "evt_003",
      record_id: "rec_002",
      timestamp: "2024-01-14T09:15:00Z",
      event_type: "prescription",
      action: "Create" as const,
      data: "encrypted_prescription_data",
      reference_event_id: null,
      attachments: [],
      created_by_id: "usr_doc_002",
      created_by_name: "Dr. James Park",
      event_hash: "0x3c4d5e6f7890abcdef1234567890abcdef123456",
      batch_id: null,
      status: "Pending" as const,
    },
    {
      id: "evt_004",
      record_id: "rec_002",
      timestamp: "2024-01-13T14:30:00Z",
      event_type: "vital_signs",
      action: "Update" as const,
      data: "encrypted_updated_vital_signs",
      reference_event_id: "evt_001",
      attachments: [],
      created_by_id: "usr_nurse_001",
      created_by_name: "Nurse Sarah",
      event_hash: "0x4d5e6f7890abcdef1234567890abcdef12345678",
      batch_id: "batch_002",
      status: "Batched" as const,
    },
  ]

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case "vital_signs":
        return <Stethoscope className="h-5 w-5 text-red-600" />
      case "diagnosis":
        return <FileText className="h-5 w-5 text-blue-600" />
      case "prescription":
        return <FileText className="h-5 w-5 text-purple-600" />
      default:
        return <FileText className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Verified":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-300">
            <CheckCircle className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        )
      case "Batched":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-300">
            <Database className="h-3 w-3 mr-1" />
            Batched
          </Badge>
        )
      case "Pending":
        return (
          <Badge className="bg-orange-100 text-orange-800 border-orange-300">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      case "Failed":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-300">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getActionBadge = (action: string) => {
    switch (action) {
      case "Create":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700">
            Create
          </Badge>
        )
      case "Update":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            Update
          </Badge>
        )
      case "Delete":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700">
            Delete
          </Badge>
        )
      case "Append":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700">
            Append
          </Badge>
        )
      default:
        return <Badge variant="outline">{action}</Badge>
    }
  }

  const filteredEvents = medicalEvents.filter((event) => {
    const matchesType = eventTypeFilter === "all" || event.event_type === eventTypeFilter
    const matchesStatus = statusFilter === "all" || event.status === statusFilter
    const matchesSearch =
      event.event_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.created_by_name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesStatus && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">MedChain Clinic</span>
            </div>
            <div className="relative w-96">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search medical events..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                3
              </span>
            </Button>
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarFallback>AW</AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <p className="font-medium">Dr. Amanda Wilson</p>
                <p className="text-gray-500">Doctor</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <nav className="p-4 space-y-2">
            <Button variant="ghost" className="w-full justify-start text-gray-700 hover:bg-blue-50">
              <FileText className="h-4 w-4 mr-3" />
              Dashboard
            </Button>
            <Button variant="default" className="w-full justify-start bg-blue-600 hover:bg-blue-700">
              <Users className="h-4 w-4 mr-3" />
              Medical Records
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-700 hover:bg-blue-50">
              <Database className="h-4 w-4 mr-3" />
              Batches
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 space-y-6">
          {/* Patient Record Header */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-blue-900">{selectedRecord.patient_name}</h1>
                    <p className="text-blue-700">Patient ID: {selectedRecord.patient_id}</p>
                    <p className="text-sm text-blue-600">Record ID: {selectedRecord.record_id}</p>
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <Badge className={selectedRecord.is_active ? "bg-green-600" : "bg-gray-600"}>
                    {selectedRecord.is_active ? "Active" : "Inactive"}
                  </Badge>
                  <div className="text-sm text-blue-700">
                    <p>Created: {new Date(selectedRecord.created_at).toLocaleDateString()}</p>
                    <p>Updated: {new Date(selectedRecord.last_updated).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Hash className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-800">Current Snapshot Hash:</span>
                  <code className="text-xs bg-white px-2 py-1 rounded font-mono">
                    {selectedRecord.current_snapshot_hash}
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="h-5 w-5 mr-2 text-gray-600" />
                Filter Medical Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="event-type">Event Type</Label>
                  <Select onValueChange={setEventTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All types</SelectItem>
                      <SelectItem value="vital_signs">Vital Signs</SelectItem>
                      <SelectItem value="diagnosis">Diagnosis</SelectItem>
                      <SelectItem value="prescription">Prescription</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All statuses</SelectItem>
                      <SelectItem value="Verified">Verified</SelectItem>
                      <SelectItem value="Batched">Batched</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>&nbsp;</Label>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <FileText className="h-4 w-4 mr-2" />
                    Add New Event
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Medical Events Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Stethoscope className="h-5 w-5 mr-2 text-blue-600" />
                Medical Events Timeline
              </CardTitle>
              <CardDescription>Complete chronological record of medical events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center">
                        {getEventIcon(event.event_type)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-semibold text-gray-900 capitalize">
                            {event.event_type.replace("_", " ")}
                          </h3>
                          {getActionBadge(event.action)}
                          {event.attachments.length > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {event.attachments.length} file{event.attachments.length > 1 ? "s" : ""}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(event.status)}
                          {event.batch_id && (
                            <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                              <Database className="h-3 w-3 mr-1" />
                              {event.batch_id}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="text-sm text-gray-600 mb-2">
                        <p>Created by: {event.created_by_name}</p>
                        {event.reference_event_id && <p>References: {event.reference_event_id}</p>}
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{new Date(event.timestamp).toLocaleString()}</span>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono bg-gray-200 px-2 py-1 rounded">
                            Hash: {event.event_hash.substring(0, 10)}...
                          </span>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredEvents.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Events Found</h3>
                  <p className="text-gray-600">Try adjusting your filters to see more medical events.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
