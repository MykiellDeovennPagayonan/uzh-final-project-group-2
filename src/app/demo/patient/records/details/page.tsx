"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FileText,
  Calendar,
  Activity,
  Shield,
  ArrowLeft,
  Heart,
  Thermometer,
  Pill,
  Stethoscope,
  FileImage,
  Download,
  Eye,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  Edit,
  Plus,
  Minus,
  RefreshCw,
  Lock,
  Phone,
  MapPin,
  UserCheck,
  AlertTriangle,
} from "lucide-react"

// Enhanced data types
interface PatientInfo {
  recordId: string
  patientName: string
  patientId: string
  dateOfBirth: string
  gender: string
  bloodType: string
  allergies: string[]
  emergencyContact: {
    name: string
    relationship: string
    phone: string
  }
  clinicName: string
  primaryPhysician: string
  createdAt: string
  lastUpdated: string
  isActive: boolean
}

interface VitalSigns {
  bloodPressure: string
  heartRate: number
  temperature: number
  weight: number
  height: number
  respiratoryRate: number
  oxygenSaturation: number
  bmi: number
  timestamp: string
  recordedBy: string
  location: string
}

interface Diagnosis {
  condition: string
  icd10Code: string
  severity: "Mild" | "Moderate" | "Severe" | "Critical" | "Well-controlled" | "Stable"
  status: "Active" | "Resolved" | "Chronic" | "Under Investigation"
  notes: string
  timestamp: string
  diagnosedBy: string
  followUpRequired: boolean
  nextReviewDate?: string
}

interface Prescription {
  medication: string
  genericName: string
  dosage: string
  frequency: string
  duration: string
  instructions: string
  prescribedBy: string
  timestamp: string
  refillsRemaining: number
  sideEffects: string[]
  interactions: string[]
  status: "Active" | "Completed" | "Discontinued"
}

interface LabResult {
  testName: string
  value: string
  normalRange: string
  unit: string
  status: "Normal" | "High" | "Low" | "Critical"
  timestamp: string
  orderedBy: string
}

interface DataChange {
  field: string
  previousValue: string
  newValue: string
  changeType: "added" | "modified" | "removed"
}

interface PatientFriendlyEvent {
  id: string
  timestamp: string
  title: string
  description: string
  category:
    | "vitals"
    | "diagnosis"
    | "prescription"
    | "appointment"
    | "note"
    | "access"
    | "lab"
    | "imaging"
    | "procedure"
  provider: string
  status: "completed" | "pending" | "cancelled" | "scheduled"
  priority: "low" | "normal" | "high" | "urgent"
  attachments: FileAttachment[]
  dataChanges?: DataChange[]
  ipAddress?: string
  deviceInfo?: string
  verificationHash?: string
  location?: string
  duration?: string
}

interface FileAttachment {
  fileId: string
  fileName: string
  fileType: string
  fileSize: number
  uploadDate: string
  category: "report" | "image" | "document" | "prescription" | "referral"
}

// Enhanced mock data for different patient scenarios
const mockPatients: PatientInfo[] = [
  {
    recordId: "MR-2024-001",
    patientName: "Sarah Johnson",
    patientId: "PAT-001",
    dateOfBirth: "1985-03-15",
    gender: "Female",
    bloodType: "A+",
    allergies: ["Penicillin", "Shellfish", "Latex"],
    emergencyContact: {
      name: "Michael Johnson",
      relationship: "Spouse",
      phone: "(555) 123-4567",
    },
    clinicName: "Metropolitan Medical Center",
    primaryPhysician: "Dr. Emily Rodriguez",
    createdAt: "2024-01-15T10:30:00Z",
    lastUpdated: "2024-07-15T14:22:00Z",
    isActive: true,
  },
  {
    recordId: "MR-2024-002",
    patientName: "Robert Chen",
    patientId: "PAT-002",
    dateOfBirth: "1962-11-08",
    gender: "Male",
    bloodType: "O-",
    allergies: ["Aspirin", "Sulfa drugs"],
    emergencyContact: {
      name: "Linda Chen",
      relationship: "Wife",
      phone: "(555) 987-6543",
    },
    clinicName: "Cardiology Specialists Group",
    primaryPhysician: "Dr. James Wilson",
    createdAt: "2024-02-01T09:15:00Z",
    lastUpdated: "2024-07-14T16:45:00Z",
    isActive: true,
  },
]

const mockVitalSigns: VitalSigns[] = [
  {
    bloodPressure: "118/76",
    heartRate: 68,
    temperature: 98.4,
    weight: 142,
    height: 65,
    respiratoryRate: 16,
    oxygenSaturation: 98,
    bmi: 23.6,
    timestamp: "2024-07-15T09:00:00Z",
    recordedBy: "Nurse Patricia Williams",
    location: "Exam Room 3",
  },
  {
    bloodPressure: "122/78",
    heartRate: 72,
    temperature: 98.6,
    weight: 144,
    height: 65,
    respiratoryRate: 18,
    oxygenSaturation: 97,
    bmi: 24.0,
    timestamp: "2024-06-15T09:30:00Z",
    recordedBy: "Nurse Jennifer Martinez",
    location: "Exam Room 1",
  },
  {
    bloodPressure: "125/80",
    heartRate: 75,
    temperature: 99.1,
    weight: 145,
    height: 65,
    respiratoryRate: 20,
    oxygenSaturation: 96,
    bmi: 24.1,
    timestamp: "2024-05-15T10:15:00Z",
    recordedBy: "Nurse Michael Thompson",
    location: "Urgent Care",
  },
]

const mockDiagnoses: Diagnosis[] = [
  {
    condition: "Gestational Diabetes",
    icd10Code: "O24.4",
    severity: "Well-controlled",
    status: "Active",
    notes:
      "Blood glucose levels are well-managed with diet and exercise. Continue monitoring with weekly glucose logs. No insulin required at this time.",
    timestamp: "2024-07-15T10:30:00Z",
    diagnosedBy: "Dr. Emily Rodriguez",
    followUpRequired: true,
    nextReviewDate: "2024-08-15",
  },
  {
    condition: "Iron Deficiency Anemia",
    icd10Code: "D50.9",
    severity: "Mild",
    status: "Active",
    notes:
      "Hemoglobin levels improving with iron supplementation. Continue current treatment and increase iron-rich foods in diet.",
    timestamp: "2024-06-01T14:15:00Z",
    diagnosedBy: "Dr. Sarah Kim",
    followUpRequired: true,
    nextReviewDate: "2024-08-01",
  },
  {
    condition: "Seasonal Allergic Rhinitis",
    icd10Code: "J30.1",
    severity: "Mild",
    status: "Chronic",
    notes:
      "Symptoms well-controlled with antihistamines during spring season. Patient advised to continue current medication regimen.",
    timestamp: "2024-04-10T11:20:00Z",
    diagnosedBy: "Dr. Michael Foster",
    followUpRequired: false,
  },
]

const mockPrescriptions: Prescription[] = [
  {
    medication: "Prenatal Vitamins",
    genericName: "Multivitamin with Folic Acid",
    dosage: "1 tablet",
    frequency: "Once daily",
    duration: "Until delivery",
    instructions: "Take with food to reduce nausea. Continue throughout pregnancy and while breastfeeding.",
    prescribedBy: "Dr. Emily Rodriguez",
    timestamp: "2024-07-15T11:00:00Z",
    refillsRemaining: 5,
    sideEffects: ["Mild nausea", "Constipation"],
    interactions: ["Avoid taking with calcium supplements"],
    status: "Active",
  },
  {
    medication: "Ferrous Sulfate",
    genericName: "Iron Supplement",
    dosage: "325mg",
    frequency: "Twice daily",
    duration: "3 months",
    instructions: "Take on empty stomach with vitamin C for better absorption. May cause dark stools.",
    prescribedBy: "Dr. Sarah Kim",
    timestamp: "2024-06-01T15:30:00Z",
    refillsRemaining: 2,
    sideEffects: ["Stomach upset", "Constipation", "Dark stools"],
    interactions: ["Avoid with antacids", "Separate from calcium by 2 hours"],
    status: "Active",
  },
  {
    medication: "Loratadine",
    genericName: "Claritin",
    dosage: "10mg",
    frequency: "Once daily as needed",
    duration: "During allergy season",
    instructions: "Take in the morning. May be taken with or without food.",
    prescribedBy: "Dr. Michael Foster",
    timestamp: "2024-04-10T12:00:00Z",
    refillsRemaining: 3,
    sideEffects: ["Drowsiness", "Dry mouth"],
    interactions: ["Avoid alcohol"],
    status: "Active",
  },
]

const mockLabResults: LabResult[] = [
  {
    testName: "Glucose (Fasting)",
    value: "92",
    normalRange: "70-100",
    unit: "mg/dL",
    status: "Normal",
    timestamp: "2024-07-15T08:00:00Z",
    orderedBy: "Dr. Emily Rodriguez",
  },
  {
    testName: "Hemoglobin",
    value: "11.8",
    normalRange: "12.0-15.5",
    unit: "g/dL",
    status: "Low",
    timestamp: "2024-07-15T08:00:00Z",
    orderedBy: "Dr. Emily Rodriguez",
  },
  {
    testName: "Iron",
    value: "85",
    normalRange: "60-170",
    unit: "μg/dL",
    status: "Normal",
    timestamp: "2024-07-15T08:00:00Z",
    orderedBy: "Dr. Sarah Kim",
  },
]

const mockEvents: PatientFriendlyEvent[] = [
  {
    id: "1",
    timestamp: "2024-07-15T14:22:00Z",
    title: "Prenatal Check-up Completed",
    description:
      "Routine prenatal examination including vital signs, fetal heart rate monitoring, and glucose screening. All measurements within normal ranges.",
    category: "appointment",
    provider: "Dr. Emily Rodriguez",
    status: "completed",
    priority: "normal",
    location: "Obstetrics Clinic - Room 205",
    duration: "45 minutes",
    attachments: [
      {
        fileId: "FILE_001",
        fileName: "Prenatal_Visit_Summary_07152024.pdf",
        fileType: "document",
        fileSize: 156780,
        uploadDate: "2024-07-15T14:30:00Z",
        category: "report",
      },
      {
        fileId: "FILE_002",
        fileName: "Fetal_Ultrasound_07152024.jpg",
        fileType: "image",
        fileSize: 2456789,
        uploadDate: "2024-07-15T14:25:00Z",
        category: "image",
      },
    ],
    dataChanges: [
      { field: "Weight", previousValue: "144 lbs", newValue: "142 lbs", changeType: "modified" },
      { field: "Blood Pressure", previousValue: "122/78", newValue: "118/76", changeType: "modified" },
      { field: "Fundal Height", previousValue: "28 cm", newValue: "30 cm", changeType: "modified" },
    ],
    ipAddress: "10.0.0.156",
    deviceInfo: "iPad Pro - Safari",
    verificationHash: "0x8f4a3b2c1d9e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c",
  },
  {
    id: "2",
    timestamp: "2024-07-15T11:30:00Z",
    title: "Lab Results Available",
    description:
      "Complete blood count and glucose screening results are now available. Hemoglobin slightly low, iron supplementation showing improvement.",
    category: "lab",
    provider: "Laboratory Services",
    status: "completed",
    priority: "normal",
    location: "Main Laboratory",
    attachments: [
      {
        fileId: "FILE_003",
        fileName: "Lab_Results_CBC_07152024.pdf",
        fileType: "document",
        fileSize: 89456,
        uploadDate: "2024-07-15T11:35:00Z",
        category: "report",
      },
    ],
    dataChanges: [
      { field: "Hemoglobin", previousValue: "11.2 g/dL", newValue: "11.8 g/dL", changeType: "modified" },
      { field: "Glucose (Fasting)", previousValue: "Not tested", newValue: "92 mg/dL", changeType: "added" },
    ],
    ipAddress: "10.0.0.89",
    deviceInfo: "Windows 11 - Chrome",
    verificationHash: "0x7c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f",
  },
  {
    id: "3",
    timestamp: "2024-07-15T09:00:00Z",
    title: "Vital Signs Recorded",
    description:
      "Pre-appointment vital signs taken by nursing staff. All measurements within expected ranges for gestational age.",
    category: "vitals",
    provider: "Nurse Patricia Williams",
    status: "completed",
    priority: "normal",
    location: "Triage Station",
    attachments: [],
    dataChanges: [
      { field: "Blood Pressure", previousValue: "122/78", newValue: "118/76", changeType: "modified" },
      { field: "Heart Rate", previousValue: "72 bpm", newValue: "68 bpm", changeType: "modified" },
      { field: "Weight", previousValue: "144 lbs", newValue: "142 lbs", changeType: "modified" },
      { field: "Oxygen Saturation", previousValue: "97%", newValue: "98%", changeType: "modified" },
    ],
    ipAddress: "192.168.1.78",
    deviceInfo: "Medical Tablet - Chrome",
    verificationHash: "0x9e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b",
  },
  {
    id: "4",
    timestamp: "2024-07-10T16:45:00Z",
    title: "Prescription Refill Approved",
    description:
      "Prenatal vitamin prescription refill approved and sent to pharmacy. Patient reminded about importance of consistent supplementation.",
    category: "prescription",
    provider: "Dr. Emily Rodriguez",
    status: "completed",
    priority: "normal",
    attachments: [
      {
        fileId: "FILE_004",
        fileName: "Prescription_Refill_07102024.pdf",
        fileType: "document",
        fileSize: 45678,
        uploadDate: "2024-07-10T16:50:00Z",
        category: "prescription",
      },
    ],
    dataChanges: [
      { field: "Refills Remaining", previousValue: "0", newValue: "5", changeType: "modified" },
      { field: "Last Refill Date", previousValue: "2024-06-10", newValue: "2024-07-10", changeType: "modified" },
    ],
    ipAddress: "10.0.0.123",
    deviceInfo: "Windows 11 - Chrome",
    verificationHash: "0x6b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e",
  },
  {
    id: "5",
    timestamp: "2024-07-08T14:20:00Z",
    title: "Appointment Scheduled",
    description:
      "Next prenatal appointment scheduled for routine check-up and glucose tolerance test. Patient provided with preparation instructions.",
    category: "appointment",
    provider: "Scheduling Department",
    status: "scheduled",
    priority: "normal",
    attachments: [
      {
        fileId: "FILE_005",
        fileName: "Appointment_Confirmation_08152024.pdf",
        fileType: "document",
        fileSize: 23456,
        uploadDate: "2024-07-08T14:25:00Z",
        category: "document",
      },
    ],
    dataChanges: [
      {
        field: "Next Appointment",
        previousValue: "Not scheduled",
        newValue: "2024-08-15 10:00 AM",
        changeType: "added",
      },
      { field: "Appointment Type", previousValue: "None", newValue: "Prenatal Check-up + GTT", changeType: "added" },
    ],
    ipAddress: "10.0.0.67",
    deviceInfo: "Windows 10 - Edge",
    verificationHash: "0x5a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d",
  },
  {
    id: "6",
    timestamp: "2024-06-15T09:30:00Z",
    title: "Monthly Prenatal Visit",
    description:
      "Routine monthly check-up showing good progress. Fetal development on track, maternal health stable. Iron supplementation discussed.",
    category: "appointment",
    provider: "Dr. Emily Rodriguez",
    status: "completed",
    priority: "normal",
    location: "Obstetrics Clinic - Room 203",
    duration: "30 minutes",
    attachments: [
      {
        fileId: "FILE_006",
        fileName: "Monthly_Visit_Summary_06152024.pdf",
        fileType: "document",
        fileSize: 134567,
        uploadDate: "2024-06-15T10:00:00Z",
        category: "report",
      },
    ],
    dataChanges: [
      { field: "Gestational Age", previousValue: "24 weeks", newValue: "28 weeks", changeType: "modified" },
      { field: "Fundal Height", previousValue: "24 cm", newValue: "28 cm", changeType: "modified" },
      { field: "Fetal Heart Rate", previousValue: "145 bpm", newValue: "148 bpm", changeType: "modified" },
    ],
    ipAddress: "10.0.0.156",
    deviceInfo: "iPad Pro - Safari",
    verificationHash: "0x4c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f",
  },
]

export default function EnhancedPatientRecordDetails() {
  const [activeTab, setActiveTab] = useState("overview")
  const [expandedEvents, setExpandedEvents] = useState<string[]>([])
  const [selectedPatient, setSelectedPatient] = useState(0)

  const currentPatient = mockPatients[selectedPatient]

  const toggleEventExpansion = (eventId: string) => {
    setExpandedEvents((prev) => (prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId]))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatFileSize = (bytes: number) => {
    const sizes = ["Bytes", "KB", "MB", "GB"]
    if (bytes === 0) return "0 Bytes"
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i]
  }

  const calculateAge = (birthDate: string) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-300">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-300">
            <AlertCircle className="h-3 w-3 mr-1" />
            Cancelled
          </Badge>
        )
      case "scheduled":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-300">
            <Calendar className="h-3 w-3 mr-1" />
            Scheduled
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-300">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Urgent
          </Badge>
        )
      case "high":
        return <Badge className="bg-orange-100 text-orange-800 border-orange-300">High</Badge>
      case "normal":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300">Normal</Badge>
      case "low":
        return <Badge className="bg-gray-100 text-gray-800 border-gray-300">Low</Badge>
      default:
        return <Badge variant="secondary">{priority}</Badge>
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "vitals":
        return <Heart className="h-4 w-4 text-red-500" />
      case "diagnosis":
        return <Stethoscope className="h-4 w-4 text-blue-500" />
      case "prescription":
        return <Pill className="h-4 w-4 text-green-500" />
      case "appointment":
        return <Calendar className="h-4 w-4 text-purple-500" />
      case "note":
        return <FileText className="h-4 w-4 text-gray-500" />
      case "access":
        return <Eye className="h-4 w-4 text-indigo-500" />
      case "lab":
        return <Activity className="h-4 w-4 text-orange-500" />
      case "imaging":
        return <FileImage className="h-4 w-4 text-cyan-500" />
      case "procedure":
        return <UserCheck className="h-4 w-4 text-pink-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case "added":
        return <Plus className="h-3 w-3 text-green-600" />
      case "modified":
        return <Edit className="h-3 w-3 text-blue-600" />
      case "removed":
        return <Minus className="h-3 w-3 text-red-600" />
      default:
        return <RefreshCw className="h-3 w-3 text-gray-600" />
    }
  }

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case "added":
        return "bg-green-50 border-green-200"
      case "modified":
        return "bg-blue-50 border-blue-200"
      case "removed":
        return "bg-red-50 border-red-200"
      default:
        return "bg-gray-50 border-gray-200"
    }
  }

  const getLabStatusColor = (status: string) => {
    switch (status) {
      case "Normal":
        return "text-green-600 bg-green-50"
      case "High":
        return "text-red-600 bg-red-50"
      case "Low":
        return "text-orange-600 bg-orange-50"
      case "Critical":
        return "text-red-800 bg-red-100"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <Button variant="ghost" size="sm" className="mb-2 text-blue-600 hover:bg-blue-100">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">My Medical Record</h1>
            <p className="text-blue-600 mt-1 font-medium">
              {currentPatient.patientName} • {currentPatient.clinicName}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-green-100 text-green-800 border-green-300">
              <CheckCircle className="h-4 w-4 mr-1" />
              Active Record
            </Badge>
            <Badge className="bg-blue-100 text-blue-800 border-blue-300">
              <Shield className="h-4 w-4 mr-1" />
              Secured by Blockchain
            </Badge>
            {/* Patient Selector for Demo */}
            <select
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(Number(e.target.value))}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              {mockPatients.map((patient, index) => (
                <option key={index} value={index}>
                  {patient.patientName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Medical Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Patient Information Card */}
            <Card className="bg-white/70 backdrop-blur-sm border-blue-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Patient Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Full Name</label>
                    <p className="text-gray-900 mt-1 font-semibold">{currentPatient.patientName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Age</label>
                    <p className="text-gray-900 mt-1">{calculateAge(currentPatient.dateOfBirth)} years old</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Gender</label>
                    <p className="text-gray-900 mt-1">{currentPatient.gender}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Blood Type</label>
                    <p className="text-gray-900 mt-1 font-semibold text-red-600">{currentPatient.bloodType}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Primary Physician</label>
                    <p className="text-gray-900 mt-1">{currentPatient.primaryPhysician}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Patient ID</label>
                    <p className="text-gray-900 mt-1 font-mono text-sm">{currentPatient.patientId}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-600">Allergies</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {currentPatient.allergies.map((allergy, index) => (
                        <Badge key={index} className="bg-red-100 text-red-800 border-red-300">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Emergency Contact</label>
                    <p className="text-gray-900 mt-1">{currentPatient.emergencyContact.name}</p>
                    <p className="text-gray-600 text-sm">{currentPatient.emergencyContact.relationship}</p>
                    <p className="text-blue-600 text-sm flex items-center gap-1 mt-1">
                      <Phone className="h-3 w-3" />
                      {currentPatient.emergencyContact.phone}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Medical Content Tabs */}
            <Card className="bg-white/70 backdrop-blur-sm border-blue-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <CardTitle>Your Health Information</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-5 bg-blue-50">
                    <TabsTrigger
                      value="overview"
                      className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    >
                      Overview
                    </TabsTrigger>
                    <TabsTrigger
                      value="vitals"
                      className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    >
                      Vitals
                    </TabsTrigger>
                    <TabsTrigger
                      value="diagnoses"
                      className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    >
                      Conditions
                    </TabsTrigger>
                    <TabsTrigger
                      value="prescriptions"
                      className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    >
                      Medications
                    </TabsTrigger>
                    <TabsTrigger
                      value="labs"
                      className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    >
                      Lab Results
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4 mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Heart className="h-5 w-5 text-red-500" />
                            Latest Vital Signs
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Blood Pressure</span>
                              <span className="font-medium text-lg">{mockVitalSigns[0].bloodPressure} mmHg</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Heart Rate</span>
                              <span className="font-medium text-lg">{mockVitalSigns[0].heartRate} bpm</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Temperature</span>
                              <span className="font-medium text-lg">{mockVitalSigns[0].temperature}°F</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">BMI</span>
                              <span className="font-medium text-lg">{mockVitalSigns[0].bmi}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Stethoscope className="h-5 w-5 text-blue-500" />
                            Current Health Conditions
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {mockDiagnoses.slice(0, 3).map((diagnosis, index) => (
                              <div key={index} className="border-l-4 border-blue-500 pl-3 py-2">
                                <div className="font-medium text-gray-900">{diagnosis.condition}</div>
                                <div className="flex gap-2 mt-1">
                                  <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                                    {diagnosis.severity}
                                  </Badge>
                                  <Badge className="bg-green-100 text-green-800 border-green-300">
                                    {diagnosis.status}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Activity className="h-5 w-5 text-green-500" />
                          Recent Lab Results
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {mockLabResults.map((result, index) => (
                            <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                              <div className="font-medium text-gray-900">{result.testName}</div>
                              <div className="text-2xl font-bold mt-1">
                                {result.value} <span className="text-sm text-gray-500">{result.unit}</span>
                              </div>
                              <div
                                className={`text-xs px-2 py-1 rounded-full mt-2 inline-block ${getLabStatusColor(result.status)}`}
                              >
                                {result.status}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">Normal: {result.normalRange}</div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="vitals" className="space-y-4 mt-6">
                    {mockVitalSigns.map((vital, index) => (
                      <Card key={index} className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Thermometer className="h-5 w-5 text-red-500" />
                            Health Measurements - {formatDate(vital.timestamp)}
                          </CardTitle>
                          <p className="text-sm text-gray-600">
                            Recorded by {vital.recordedBy} at {vital.location}
                          </p>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                              <div className="text-2xl font-bold text-red-600">{vital.bloodPressure}</div>
                              <div className="text-sm text-gray-600 mt-1">Blood Pressure</div>
                              <div className="text-xs text-gray-500">mmHg</div>
                            </div>
                            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                              <div className="text-2xl font-bold text-blue-600">{vital.heartRate}</div>
                              <div className="text-sm text-gray-600 mt-1">Heart Rate</div>
                              <div className="text-xs text-gray-500">beats per minute</div>
                            </div>
                            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                              <div className="text-2xl font-bold text-orange-600">{vital.temperature}°F</div>
                              <div className="text-sm text-gray-600 mt-1">Temperature</div>
                              <div className="text-xs text-gray-500">fahrenheit</div>
                            </div>
                            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                              <div className="text-2xl font-bold text-green-600">{vital.weight}</div>
                              <div className="text-sm text-gray-600 mt-1">Weight</div>
                              <div className="text-xs text-gray-500">pounds</div>
                            </div>
                            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                              <div className="text-2xl font-bold text-purple-600">{vital.respiratoryRate}</div>
                              <div className="text-sm text-gray-600 mt-1">Respiratory Rate</div>
                              <div className="text-xs text-gray-500">breaths per minute</div>
                            </div>
                            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                              <div className="text-2xl font-bold text-cyan-600">{vital.oxygenSaturation}%</div>
                              <div className="text-sm text-gray-600 mt-1">Oxygen Saturation</div>
                              <div className="text-xs text-gray-500">percentage</div>
                            </div>
                            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                              <div className="text-2xl font-bold text-indigo-600">{vital.bmi}</div>
                              <div className="text-sm text-gray-600 mt-1">BMI</div>
                              <div className="text-xs text-gray-500">kg/m²</div>
                            </div>
                            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                              <div className="text-2xl font-bold text-teal-600">{vital.height}&ldquo;</div>
                              <div className="text-sm text-gray-600 mt-1">Height</div>
                              <div className="text-xs text-gray-500">inches</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="diagnoses" className="space-y-4 mt-6">
                    {mockDiagnoses.map((diagnosis, index) => (
                      <Card key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Stethoscope className="h-5 w-5 text-blue-500" />
                            {diagnosis.condition}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex items-center gap-4 flex-wrap">
                              <Badge className="bg-blue-100 text-blue-800 border-blue-300">{diagnosis.severity}</Badge>
                              <Badge className="bg-green-100 text-green-800 border-green-300">{diagnosis.status}</Badge>
                              <span className="text-sm text-gray-600">Medical Code: {diagnosis.icd10Code}</span>
                              <span className="text-sm text-gray-600">Diagnosed by: {diagnosis.diagnosedBy}</span>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                              <span className="text-sm font-medium text-gray-700">Doctor&lsquo;s Notes:</span>
                              <p className="mt-2 text-gray-700 leading-relaxed">{diagnosis.notes}</p>
                            </div>
                            {diagnosis.followUpRequired && diagnosis.nextReviewDate && (
                              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                                <span className="text-sm font-medium text-yellow-800">Follow-up Required:</span>
                                <p className="text-sm text-yellow-700 mt-1">
                                  Next review scheduled for {formatDate(diagnosis.nextReviewDate)}
                                </p>
                              </div>
                            )}
                            <div className="text-sm text-gray-500">Assessed on: {formatDate(diagnosis.timestamp)}</div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="prescriptions" className="space-y-4 mt-6">
                    {mockPrescriptions.map((prescription, index) => (
                      <Card key={index} className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Pill className="h-5 w-5 text-green-500" />
                            {prescription.medication}
                          </CardTitle>
                          <p className="text-sm text-gray-600">Generic: {prescription.genericName}</p>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                              <span className="text-sm font-medium text-gray-600">Dosage:</span>
                              <p className="mt-1 text-lg font-semibold text-gray-900">{prescription.dosage}</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                              <span className="text-sm font-medium text-gray-600">Frequency:</span>
                              <p className="mt-1 text-lg font-semibold text-gray-900">{prescription.frequency}</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                              <span className="text-sm font-medium text-gray-600">Duration:</span>
                              <p className="mt-1 text-lg font-semibold text-gray-900">{prescription.duration}</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                              <span className="text-sm font-medium text-gray-600">Refills Remaining:</span>
                              <p className="mt-1 text-lg font-semibold text-gray-900">
                                {prescription.refillsRemaining}
                              </p>
                            </div>
                          </div>

                          <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                            <span className="text-sm font-medium text-gray-600">Instructions:</span>
                            <p className="mt-2 text-gray-700">{prescription.instructions}</p>
                          </div>

                          {prescription.sideEffects.length > 0 && (
                            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 mb-4">
                              <span className="text-sm font-medium text-yellow-800">Possible Side Effects:</span>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {prescription.sideEffects.map((effect, idx) => (
                                  <Badge key={idx} className="bg-yellow-100 text-yellow-800 border-yellow-300">
                                    {effect}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {prescription.interactions.length > 0 && (
                            <div className="bg-red-50 p-3 rounded-lg border border-red-200 mb-4">
                              <span className="text-sm font-medium text-red-800">Drug Interactions:</span>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {prescription.interactions.map((interaction, idx) => (
                                  <Badge key={idx} className="bg-red-100 text-red-800 border-red-300">
                                    {interaction}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="flex justify-between items-center text-sm text-gray-500">
                            <span>Prescribed by: {prescription.prescribedBy}</span>
                            <span>Date: {formatDate(prescription.timestamp)}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="labs" className="space-y-4 mt-6">
                    <Card className="bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Activity className="h-5 w-5 text-orange-500" />
                          Latest Laboratory Results
                        </CardTitle>
                        <p className="text-sm text-gray-600">Collected on {formatDate(mockLabResults[0].timestamp)}</p>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {mockLabResults.map((result, index) => (
                            <div key={index} className="bg-white p-4 rounded-lg shadow-sm border">
                              <div className="flex justify-between items-start mb-2">
                                <div className="font-medium text-gray-900">{result.testName}</div>
                                <div className={`text-xs px-2 py-1 rounded-full ${getLabStatusColor(result.status)}`}>
                                  {result.status}
                                </div>
                              </div>
                              <div className="text-2xl font-bold text-gray-900 mb-1">
                                {result.value} <span className="text-sm text-gray-500">{result.unit}</span>
                              </div>
                              <div className="text-sm text-gray-600 mb-2">
                                Normal Range: {result.normalRange} {result.unit}
                              </div>
                              <div className="text-xs text-gray-500">Ordered by: {result.orderedBy}</div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Enhanced Activity Timeline */}
          <div className="lg:col-span-1">
            <Card className="bg-white/70 backdrop-blur-sm border-blue-200 shadow-lg sticky top-6">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Medical Activity Log ({mockEvents.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="max-h-[700px] overflow-y-auto p-4">
                <div className="space-y-4">
                  {mockEvents.map((event) => (
                    <div key={event.id} className="border-l-4 border-blue-300 pl-4 pb-4 last:pb-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(event.category)}
                          <span className="font-medium text-gray-900 text-sm">{event.title}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          {getStatusBadge(event.status)}
                          {getPriorityBadge(event.priority)}
                        </div>
                      </div>

                      <div className="text-xs text-gray-600 mb-2">
                        {formatDate(event.timestamp)}
                        {event.location && (
                          <span className="flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3" />
                            {event.location}
                          </span>
                        )}
                        {event.duration && (
                          <span className="flex items-center gap-1 mt-1">
                            <Clock className="h-3 w-3" />
                            Duration: {event.duration}
                          </span>
                        )}
                      </div>

                      <div className="text-sm text-gray-700 mb-3 bg-gray-50 p-3 rounded-lg">{event.description}</div>

                      {/* Data Changes Section */}
                      {event.dataChanges && event.dataChanges.length > 0 && (
                        <div className="mb-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleEventExpansion(event.id)}
                            className="text-xs text-blue-600 hover:bg-blue-50 p-1 h-auto"
                          >
                            {expandedEvents.includes(event.id) ? "Hide" : "Show"} Data Changes (
                            {event.dataChanges.length})
                          </Button>

                          {expandedEvents.includes(event.id) && (
                            <div className="mt-2 space-y-2">
                              {event.dataChanges.map((change, changeIndex) => (
                                <div
                                  key={changeIndex}
                                  className={`text-xs p-2 rounded border ${getChangeColor(change.changeType)}`}
                                >
                                  <div className="flex items-center gap-1 font-medium mb-1">
                                    {getChangeIcon(change.changeType)}
                                    <span className="capitalize">{change.changeType}</span>: {change.field}
                                  </div>
                                  {change.changeType === "modified" && (
                                    <div className="space-y-1">
                                      <div className="text-red-600">
                                        <span className="font-medium">From:</span> {change.previousValue}
                                      </div>
                                      <div className="text-green-600">
                                        <span className="font-medium">To:</span> {change.newValue}
                                      </div>
                                    </div>
                                  )}
                                  {change.changeType === "added" && (
                                    <div className="text-green-600">
                                      <span className="font-medium">Added:</span> {change.newValue}
                                    </div>
                                  )}
                                  {change.changeType === "removed" && (
                                    <div className="text-red-600">
                                      <span className="font-medium">Removed:</span> {change.previousValue}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* File Attachments */}
                      {event.attachments.length > 0 && (
                        <div className="mb-3">
                          <div className="font-medium mb-2 text-xs text-gray-700">Attachments:</div>
                          {event.attachments.map((attachment) => (
                            <div
                              key={attachment.fileId}
                              className="flex items-center justify-between bg-blue-50 p-2 rounded-lg text-xs mb-1"
                            >
                              <div className="flex items-center gap-2">
                                <FileImage className="h-3 w-3 text-blue-500" />
                                <span className="font-medium">{attachment.fileName}</span>
                                <span className="text-gray-500">({formatFileSize(attachment.fileSize)})</span>
                                <Badge className="bg-gray-100 text-gray-600 text-xs">{attachment.category}</Badge>
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0 text-blue-600 hover:bg-blue-100"
                                >
                                  <Eye className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0 text-blue-600 hover:bg-blue-100"
                                >
                                  <Download className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Provider and Security Info */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <User className="h-3 w-3" />
                          <span>by {event.provider}</span>
                        </div>

                        {/* Security Details - Expandable */}
                        {(event.ipAddress || event.deviceInfo || event.verificationHash) && (
                          <details className="text-xs">
                            <summary className="cursor-pointer text-blue-600 hover:text-blue-800 flex items-center gap-1">
                              <Lock className="h-3 w-3" />
                              Security Details
                            </summary>
                            <div className="mt-2 bg-gray-50 p-2 rounded border space-y-1">
                              {event.ipAddress && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">IP Address:</span>
                                  <span className="font-mono">{event.ipAddress}</span>
                                </div>
                              )}
                              {event.deviceInfo && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Device:</span>
                                  <span>{event.deviceInfo}</span>
                                </div>
                              )}
                              {event.verificationHash && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Blockchain Hash:</span>
                                  <span className="font-mono text-xs">
                                    {event.verificationHash.substring(0, 20)}...
                                  </span>
                                </div>
                              )}
                            </div>
                          </details>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
