"use client"
import { useState } from "react"
import {
  Search,
  Bell,
  Calendar,
  Users,
  FileText,
  Database,
  Shield,
  User,
  Stethoscope,
  Plus,
  Trash2,
  Save,
  X,
  CheckCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function DoctorDischargeRecord() {
  const [searchQuery, setSearchQuery] = useState("")
  const [finalDiagnosis, setFinalDiagnosis] = useState("")
  const [dischargeSummary, setDischargeSummary] = useState("")
  const [followUpDate, setFollowUpDate] = useState("")
  const [followUpDepartment, setFollowUpDepartment] = useState("")
  const [medications, setMedications] = useState([
    { id: 1, name: "Metformin", dosage: "1000mg", frequency: "BID", instructions: "Take with meals" },
    { id: 2, name: "Lisinopril", dosage: "10mg", frequency: "Daily", instructions: "Take in morning" },
  ])
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  const patientInfo = {
    id: "P002",
    name: "Michael Chen",
    age: 67,
    recordId: "R2024-001-15",
    admissionDate: "2024-01-15",
    status: "active",
  }

  const icd10Suggestions = [
    { code: "E11.9", description: "Type 2 diabetes mellitus without complications" },
    { code: "I10", description: "Essential hypertension" },
    { code: "Z51.11", description: "Encounter for antineoplastic chemotherapy" },
    { code: "M79.3", description: "Panniculitis, unspecified" },
    { code: "R50.9", description: "Fever, unspecified" },
  ]

  const departments = [
    "Cardiology",
    "Endocrinology",
    "Internal Medicine",
    "Nephrology",
    "Neurology",
    "Orthopedics",
    "Primary Care",
  ]

  const addMedication = () => {
    const newMed = {
      id: medications.length + 1,
      name: "",
      dosage: "",
      frequency: "",
      instructions: "",
    }
    setMedications([...medications, newMed])
  }

  const removeMedication = (id: number) => {
    setMedications(medications.filter((med) => med.id !== id))
  }

  const updateMedication = (id: number, field: string, value: string) => {
    setMedications(medications.map((med) => (med.id === id ? { ...med, [field]: value } : med)))
  }

  const handleSaveAndClose = () => {
    setShowConfirmDialog(true)
  }

  const confirmSaveAndClose = () => {
    // Here would be the actual save logic
    setShowConfirmDialog(false)
    // Redirect or show success message
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
                <p className="text-gray-500">Internal Medicine</p>
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
              Patients
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-700 hover:bg-blue-50">
              <Stethoscope className="h-4 w-4 mr-3" />
              Referrals
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-700 hover:bg-blue-50">
              <Database className="h-4 w-4 mr-3" />
              Batches
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 space-y-6">
          {/* Patient Header */}
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-red-900">{patientInfo.name}</h1>
                    <p className="text-red-700">
                      Patient ID: {patientInfo.id} • Age: {patientInfo.age}
                    </p>
                    <p className="text-sm text-red-600">Record ID: {patientInfo.recordId}</p>
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <Badge className="bg-red-600">Discharge in Progress</Badge>
                  <p className="text-sm text-red-700">Admission: {patientInfo.admissionDate}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Final Diagnosis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                Final Diagnosis
              </CardTitle>
              <CardDescription>Enter ICD-10 diagnosis codes and descriptions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="diagnosis">Primary Diagnosis</Label>
                <Input
                  id="diagnosis"
                  placeholder="Start typing to search ICD-10 codes..."
                  value={finalDiagnosis}
                  onChange={(e) => setFinalDiagnosis(e.target.value)}
                />
              </div>
              {finalDiagnosis && (
                <div className="space-y-2">
                  <Label>Suggested ICD-10 Codes</Label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {icd10Suggestions
                      .filter((code) => code.description.toLowerCase().includes(finalDiagnosis.toLowerCase()))
                      .map((code) => (
                        <div
                          key={code.code}
                          className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => setFinalDiagnosis(`${code.code} - ${code.description}`)}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-blue-600">{code.code}</span>
                            <Button variant="ghost" size="sm">
                              Select
                            </Button>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{code.description}</p>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Discharge Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-green-600" />
                Discharge Summary
              </CardTitle>
              <CardDescription>Comprehensive summary of the patient&apos;s care and treatment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="summary">Clinical Summary</Label>
                <Textarea
                  id="summary"
                  placeholder="Enter detailed discharge summary including reason for admission, course of treatment, patient response, and condition at discharge..."
                  rows={8}
                  value={dischargeSummary}
                  onChange={(e) => setDischargeSummary(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Medications on Discharge */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-purple-600" />
                  Medications on Discharge
                </div>
                <Button onClick={addMedication} size="sm" className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Medication
                </Button>
              </CardTitle>
              <CardDescription>List all medications the patient should continue after discharge</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {medications.map((medication) => (
                  <div key={medication.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="space-y-2">
                      <Label>Medication Name</Label>
                      <Input
                        placeholder="e.g., Metformin"
                        value={medication.name}
                        onChange={(e) => updateMedication(medication.id, "name", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Dosage</Label>
                      <Input
                        placeholder="e.g., 1000mg"
                        value={medication.dosage}
                        onChange={(e) => updateMedication(medication.id, "dosage", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Frequency</Label>
                      <Input
                        placeholder="e.g., BID"
                        value={medication.frequency}
                        onChange={(e) => updateMedication(medication.id, "frequency", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Instructions</Label>
                      <Input
                        placeholder="e.g., Take with meals"
                        value={medication.instructions}
                        onChange={(e) => updateMedication(medication.id, "instructions", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>&nbsp;</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeMedication(medication.id)}
                        className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Follow-Up */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-orange-600" />
                Follow-Up Care
              </CardTitle>
              <CardDescription>Schedule follow-up appointments and care instructions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="followup-date">Follow-Up Date</Label>
                  <Input
                    id="followup-date"
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="followup-dept">Department</Label>
                  <Select onValueChange={setFollowUpDepartment}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4">
            <Button variant="outline" className="text-gray-600 hover:text-gray-700 bg-transparent">
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
              <DialogTrigger asChild>
                <Button onClick={handleSaveAndClose} className="bg-green-600 hover:bg-green-700">
                  <Save className="h-4 w-4 mr-2" />
                  Save & Close Record
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                    Confirm Record Closure
                  </DialogTitle>
                  <DialogDescription>
                    Are you sure you want to save and close this patient record? This action will finalize the discharge
                    and anchor the record to the blockchain.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Record Summary:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>
                        • Patient: {patientInfo.name} ({patientInfo.id})
                      </li>
                      <li>• Final Diagnosis: {finalDiagnosis || "Not specified"}</li>
                      <li>• Medications: {medications.length} items</li>
                      <li>• Follow-up: {followUpDate ? `${followUpDate} - ${followUpDepartment}` : "Not scheduled"}</li>
                    </ul>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={confirmSaveAndClose} className="bg-green-600 hover:bg-green-700">
                    <Shield className="h-4 w-4 mr-2" />
                    Confirm & Anchor to Blockchain
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </main>
      </div>
    </div>
  )
}
