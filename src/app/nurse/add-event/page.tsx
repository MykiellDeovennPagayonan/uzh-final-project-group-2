"use client"

import { useState } from "react"
import { Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PageLayout } from "@/components/layout/PageLayout"
import { useNavigation } from "@/hooks/useNavigation"
import { useAuth } from "@/contexts/AuthContext"
import { backendCore } from "@/declarations/backendCore"
import { Activity, Upload, X, FileText, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { NewFileAttachment } from "@/declarations/backendCore/backendCore.did"

function NurseAddEventContent() {
  const router = useRouter()
  const searchParams = useSearchParams();
  const recordId: string = searchParams.get("id") ?? "";
  const { user } = useAuth()
  const { navigationItems, activeItemId, handleNavigationClick } = useNavigation({
    currentPage: "add-event"
  })

  const [eventType, setEventType] = useState("")
  const [action, setAction] = useState<"Create" | "Append">("Create")
  const [eventData, setEventData] = useState("")
  const [referenceEventId, setReferenceEventId] = useState("")
  const [attachments, setAttachments] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Nurse can only create these event types
  const nurseEventTypes = [
    { value: "vital_signs", label: "Vital Signs" },
    { value: "medication_administration", label: "Medication Administration" },
    { value: "patient_assessment", label: "Patient Assessment" },
  ]

  // Nurse can only use Create and Append actions
  const nurseActions = [
    { value: "Create", label: "Create" },
    { value: "Append", label: "Append" },
  ]

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    // Filter out DICOM files as nurses can't upload complex DICOM
    const allowedFiles = files.filter(
      (file) => !file.name.toLowerCase().endsWith(".dcm") && !file.type.includes("dicom"),
    )
    setAttachments((prev) => [...prev, ...allowedFiles])
  }

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  const formatFileSize = (bytes: number) => {
    const sizes = ["Bytes", "KB", "MB", "GB"]
    if (bytes === 0) return "0 Bytes"
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i]
  }

  const validateEventData = (data: string) => {
    try {
      JSON.parse(data)
      return true
    } catch {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!user) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    if (!validateEventData(eventData)) {
      setError("Event data must be valid JSON");
      setLoading(false);
      return;
    }

    try {
      // Prepare attachments - this matches Types.NewFileAttachment
      const newFileAttachments: NewFileAttachment[] = await Promise.all(
        attachments.map(async (file) => ({
          file_name: file.name,
          file_type: file.type || "application/octet-stream", // Ensure we have a type
          file_size: BigInt(file.size),
          encrypted_data: new Uint8Array(await file.arrayBuffer()),
        }))
      );

      // Call the Motoko backend with positional args
      const result = await backendCore.createMedicalEvent(
        recordId,
        eventType,
        eventData,
        action === "Create" ? { Create: null } : { Append: null },
        referenceEventId || "",
        newFileAttachments,
        user.user_id
      );

      if ("ok" in result) {
        setSuccess(true);
        setTimeout(() => router.push(`/nurse/record/${recordId}`), 2000);
      } else {
        setError(result.err || "Failed to create medical event");
      }
    } catch (err) {
      console.error("Error creating medical event:", err);
      setError("Failed to create medical event");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null

  return (
    <PageLayout
      navigationItems={navigationItems}
      activeItemId={activeItemId}
      onNavigationClick={handleNavigationClick}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add Medical Event</h1>
          <p className="text-gray-600 mt-1">Create a new medical event for the patient record</p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="bg-green-50 border-green-200">
            <AlertCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Medical event created successfully! Redirecting…
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Event Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Record ID + Event Type */}
              <div className="grid grid-cols-2 gap-4">
                {/* 
                <div className="space-y-2">
                  <Label htmlFor="record_id">Record ID *</Label>
                  <Input
                    id="record_id"
                    value={recordId}
                    onChange={(e) => setRecordId(e.target.value)}
                    placeholder="Enter record ID"
                    required
                  />
                </div>
                */}
                <div className="space-y-2">
                  <Label htmlFor="event_type">Event Type *</Label>
                  <Select value={eventType} onValueChange={setEventType} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      {nurseEventTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Action + Reference Event */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="action">Action *</Label>
                  <Select
                    value={action}
                    onValueChange={(val: "Create" | "Append") => setAction(val)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select action" />
                    </SelectTrigger>
                    <SelectContent>
                      {nurseActions.map((act) => (
                        <SelectItem key={act.value} value={act.value}>
                          {act.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {action === "Append" && (
                  <div className="space-y-2">
                    <Label htmlFor="reference_event_id">Reference Event ID</Label>
                    <Input
                      id="reference_event_id"
                      value={referenceEventId}
                      onChange={(e) => setReferenceEventId(e.target.value)}
                      placeholder="ID of event to append to"
                    />
                  </div>
                )}
              </div>

              {/* Event Data */}
              <div className="space-y-2">
                <Label htmlFor="event_data">Event Data *</Label>
                <Textarea
                  id="event_data"
                  value={eventData}
                  onChange={(e) => setEventData(e.target.value)}
                  placeholder='Enter event data as JSON (e.g., {"blood_pressure":"120/80"})'
                  rows={4}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Enter medical data in JSON format. This will be encrypted before storage.
                </p>
              </div>

              {/* File Attachments */}
              <div className="space-y-4">
                <Label>File Attachments</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                  <div className="text-center">
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Upload files (documents, images – no DICOM)
                    </p>
                    <Input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("file-upload")?.click()}
                    >
                      Choose Files
                    </Button>
                  </div>
                </div>

                {attachments.length > 0 && (
                  <div className="space-y-2">
                    <Label>Selected Files:</Label>
                    {attachments.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-muted p-2 rounded">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span className="text-sm">{file.name}</span>
                          <span className="text-xs text-muted-foreground">
                            ({formatFileSize(file.size)})
                          </span>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => removeAttachment(idx)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating Event..." : "Create Event"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  )
}

export default function NurseAddEvent() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NurseAddEventContent />
    </Suspense>
  )
}