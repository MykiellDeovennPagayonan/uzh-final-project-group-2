"use client"
import { useState } from "react"
import { Search, Bell, Users, FileText, Database, Shield, User, Save, X, Upload, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

export default function DoctorCreateEvent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRecord, setSelectedRecord] = useState("")
  const [eventType, setEventType] = useState("")
  const [eventAction, setEventAction] = useState("")
  const [eventData, setEventData] = useState("")
  const [referenceEventId, setReferenceEventId] = useState("")
  const [attachments, setAttachments] = useState<
    Array<{
      file_name: string
      file_type: string
      file_size: number
    }>
  >([])

  // Mock data based on backend types
  const availableRecords = [
    {
      record_id: "rec_001",
      patient_id: "usr_001",
      patient_name: "Sarah Johnson",
      is_active: true,
    },
    {
      record_id: "rec_002",
      patient_id: "usr_002",
      patient_name: "Michael Chen",
      is_active: true,
    },
    {
      record_id: "rec_003",
      patient_id: "usr_003",
      patient_name: "Emily Rodriguez",
      is_active: true,
    },
  ]

  const eventTypes = [
    "vital_signs",
    "diagnosis",
    "prescription",
    "lab_results",
    "imaging",
    "procedure",
    "consultation",
    "discharge_summary",
  ]

  const eventActions = [
    { value: "Create", label: "Create - Original data entry" },
    { value: "Update", label: "Update - Modification of existing data" },
    { value: "Delete", label: "Delete - Soft delete (mark as inactive)" },
    { value: "Append", label: "Append - Add additional info to existing record" },
  ]

  const handleSaveEvent = () => {
    if (!selectedRecord || !eventType || !eventAction || !eventData) {
      toast.error("Please fill in all required fields")
      return
    }

    // Here would be the actual API call to create MedicalEvent
    toast(`${eventType.replace("_", " ")} event created successfully`)
  }

  const addAttachment = () => {
    // Mock file upload
    const newAttachment = {
      file_name: `document_${attachments.length + 1}.pdf`,
      file_type: "document",
      file_size: Math.floor(Math.random() * 1000000) + 100000,
    }
    setAttachments([...attachments, newAttachment])
  }

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index))
  }

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
                placeholder="Search patients by name or ID..."
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
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create Medical Event</h1>
              <p className="text-gray-600">Add a new medical event to a patient&apos;s record</p>
            </div>
          </div>

          {/* Medical Record Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Select Medical Record
              </CardTitle>
              <CardDescription>Choose the patient record to add this event to</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="record-select">Medical Record</Label>
                <Select onValueChange={setSelectedRecord}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a medical record..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRecords.map((record) => (
                      <SelectItem key={record.record_id} value={record.record_id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{record.patient_name}</span>
                          <span className="text-sm text-gray-500 ml-4">
                            {record.record_id} • {record.patient_id}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedRecord && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-blue-600">Selected</Badge>
                    <span className="font-medium">
                      {availableRecords.find((r) => r.record_id === selectedRecord)?.patient_name}
                    </span>
                    <span className="text-sm text-gray-600">({selectedRecord})</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Event Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-green-600" />
                Event Details
              </CardTitle>
              <CardDescription>Specify the type and action for this medical event</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="event-type">Event Type</Label>
                  <Select onValueChange={setEventType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select event type..." />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="event-action">Event Action</Label>
                  <Select onValueChange={setEventAction}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select action..." />
                    </SelectTrigger>
                    <SelectContent>
                      {eventActions.map((action) => (
                        <SelectItem key={action.value} value={action.value}>
                          {action.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {eventAction === "Update" && (
                <div className="space-y-2">
                  <Label htmlFor="reference-event">Reference Event ID (for updates)</Label>
                  <Input
                    id="reference-event"
                    placeholder="evt_001"
                    value={referenceEventId}
                    onChange={(e) => setReferenceEventId(e.target.value)}
                  />
                  <p className="text-sm text-gray-500">Enter the ID of the original event you&apos;re updating</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="event-data">Medical Data</Label>
                <Textarea
                  id="event-data"
                  placeholder="Enter the medical data (will be encrypted before storage)..."
                  rows={6}
                  value={eventData}
                  onChange={(e) => setEventData(e.target.value)}
                />
                <p className="text-sm text-gray-500">
                  This data will be encrypted before being stored on the blockchain
                </p>
              </div>
            </CardContent>
          </Card>

          {/* File Attachments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Upload className="h-5 w-5 mr-2 text-purple-600" />
                  File Attachments
                </div>
                <Button onClick={addAttachment} size="sm" className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add File
                </Button>
              </CardTitle>
              <CardDescription>Attach medical documents, images, or other files</CardDescription>
            </CardHeader>
            <CardContent>
              {attachments.length > 0 ? (
                <div className="space-y-3">
                  {attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="font-medium text-gray-900">{attachment.file_name}</p>
                          <p className="text-sm text-gray-500">
                            {attachment.file_type} • {(attachment.file_size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeAttachment(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>No files attached</p>
                  <p className="text-sm">Click &quot;Add File&quot; to attach documents</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4">
            <Button variant="outline" className="text-gray-600 hover:text-gray-700 bg-transparent">
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSaveEvent} className="bg-green-600 hover:bg-green-700">
              <Save className="h-4 w-4 mr-2" />
              Create Medical Event
            </Button>
          </div>
        </main>
      </div>
    </div>
  )
}
