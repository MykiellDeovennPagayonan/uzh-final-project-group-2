"use client"
import { useState } from "react"
import type React from "react"

import {
  ChevronRight,
  FileText,
  Upload,
  Save,
  Anchor,
  Download,
  Calendar,
  User,
  Stethoscope,
  MessageSquare,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

export default function DoctorEncounterPage() {
  const [soapNotes, setSoapNotes] = useState({
    subjective: "",
    objective: "",
    assessment: "",
    plan: "",
  })
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])

  const mockPatient = {
    id: "P002",
    name: "Michael Chen",
    age: 67,
    appointmentDate: "2024-01-15",
    appointmentTime: "10:30 AM",
    reason: "Follow-up consultation",
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = Array.from(e.dataTransfer.files)
    const fileNames = files.map((file) => file.name)
    setUploadedFiles((prev) => [...prev, ...fileNames])
  }

  const handleSaveNotes = () => {
    toast(`SOAP notes saved for ${mockPatient.name}`)
  }

  const handleUploadAnchor = () => {
    toast("Files have been uploaded and anchored to the blockchain")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Doctor Portal</h1>
              <p className="text-sm text-gray-600">Patient Encounter Documentation</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
            <Calendar className="h-4 w-4 mr-1" />
            {mockPatient.appointmentTime}
          </Badge>
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
              <User className="h-4 w-4 mr-3" />
              Patients
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-700 hover:bg-blue-50">
              <MessageSquare className="h-4 w-4 mr-3" />
              Messages
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 space-y-6">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Patients</span>
            <ChevronRight className="h-4 w-4" />
            <span>{mockPatient.name}</span>
            <ChevronRight className="h-4 w-4" />
            <span className="text-blue-600 font-medium">New Note</span>
          </nav>

          {/* Patient Header */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-blue-900">{mockPatient.name}</h2>
                    <p className="text-blue-700">
                      Patient ID: {mockPatient.id} • Age: {mockPatient.age}
                    </p>
                    <p className="text-sm text-blue-600">
                      Appointment: {mockPatient.appointmentDate} at {mockPatient.appointmentTime}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className="bg-blue-600 mb-2">Active Appointment</Badge>
                  <p className="text-sm text-blue-700">{mockPatient.reason}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SOAP Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                SOAP Notes
              </CardTitle>
              <CardDescription>Document the patient encounter using SOAP format</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="subjective" className="text-base font-semibold text-gray-900">
                  Subjective
                </Label>
                <Textarea
                  id="subjective"
                  placeholder="Patient's chief complaint, history of present illness, symptoms as described by patient..."
                  rows={4}
                  value={soapNotes.subjective}
                  onChange={(e) => setSoapNotes({ ...soapNotes, subjective: e.target.value })}
                  className="resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="objective" className="text-base font-semibold text-gray-900">
                  Objective
                </Label>
                <Textarea
                  id="objective"
                  placeholder="Physical examination findings, vital signs, laboratory results, imaging findings..."
                  rows={4}
                  value={soapNotes.objective}
                  onChange={(e) => setSoapNotes({ ...soapNotes, objective: e.target.value })}
                  className="resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="assessment" className="text-base font-semibold text-gray-900">
                  Assessment
                </Label>
                <Textarea
                  id="assessment"
                  placeholder="Clinical impression, differential diagnosis, problem list..."
                  rows={3}
                  value={soapNotes.assessment}
                  onChange={(e) => setSoapNotes({ ...soapNotes, assessment: e.target.value })}
                  className="resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="plan" className="text-base font-semibold text-gray-900">
                  Plan
                </Label>
                <Textarea
                  id="plan"
                  placeholder="Treatment plan, medications, follow-up instructions, patient education..."
                  rows={4}
                  value={soapNotes.plan}
                  onChange={(e) => setSoapNotes({ ...soapNotes, plan: e.target.value })}
                  className="resize-none"
                />
              </div>

              <Button onClick={handleSaveNotes} className="bg-blue-600 hover:bg-blue-700">
                <Save className="h-4 w-4 mr-2" />
                Save Notes
              </Button>
            </CardContent>
          </Card>

          <Separator />

          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="h-5 w-5 mr-2 text-green-600" />
                Attach Files
              </CardTitle>
              <CardDescription>Upload PDFs, images, lab reports, and other medical documents</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-gray-400"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">Drag and drop files here, or click to browse</p>
                <p className="text-sm text-gray-500">Supports PDF, JPG, PNG, DICOM files up to 10MB each</p>
                <Button variant="outline" className="mt-4 bg-transparent">
                  Browse Files
                </Button>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-base font-semibold">Uploaded Files</Label>
                  <div className="space-y-2">
                    {uploadedFiles.map((fileName, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-gray-500" />
                          <span className="text-sm font-medium">{fileName}</span>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button onClick={handleUploadAnchor} className="bg-green-600 hover:bg-green-700">
                <Anchor className="h-4 w-4 mr-2" />
                Upload & Anchor to Blockchain
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
