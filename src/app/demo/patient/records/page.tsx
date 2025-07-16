"use client"

import { useState } from "react"
import {
  Calendar,
  User,
  FileText,
  Shield,
  Eye,
  ChevronRight,
  Activity,
  Heart,
  Thermometer,
  Weight,
  Stethoscope,
  Pill,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Clock,
  UserCheck,
  Building2,
  Download,
  Share2,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

type MedicalRecord = {
  record_id: string
  patient_id: string
  patient_name: string
  clinic_id: string
  department: string
  primary_physician: string
  created_at: bigint
  last_updated: bigint
  is_active: boolean
  priority: "low" | "normal" | "high" | "urgent"
  current_snapshot_hash: string
  summary: {
    total_events: number
    last_visit: string
    recent_diagnoses: string[]
    active_medications: number
    recent_vitals: {
      blood_pressure: string
      heart_rate: string
      temperature: string
      weight: string
      bmi: string
      oxygen_saturation: string
    }
    upcoming_appointments: number
    pending_lab_results: number
  }
}

const mockMedicalRecords: MedicalRecord[] = [
  {
    record_id: "REC-2024-001",
    patient_id: "PAT-001",
    patient_name: "Sarah Johnson",
    clinic_id: "Metropolitan Medical Center",
    department: "Obstetrics & Gynecology",
    primary_physician: "Dr. Emily Rodriguez",
    created_at: BigInt(1704067200000000), // Jan 1, 2024
    last_updated: BigInt(1721088000000000), // Jul 16, 2024
    is_active: true,
    priority: "normal",
    current_snapshot_hash: "0x7a8f3c2d1e4b5a6f9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b",
    summary: {
      total_events: 18,
      last_visit: "2024-07-15",
      recent_diagnoses: ["Gestational Diabetes", "Iron Deficiency Anemia"],
      active_medications: 3,
      recent_vitals: {
        blood_pressure: "118/76",
        heart_rate: "68 bpm",
        temperature: "98.4°F",
        weight: "142 lbs",
        bmi: "23.6",
        oxygen_saturation: "98%",
      },
      upcoming_appointments: 2,
      pending_lab_results: 0,
    },
  },
  {
    record_id: "REC-2024-002",
    patient_id: "PAT-002",
    patient_name: "Robert Chen",
    clinic_id: "Cardiology Specialists Group",
    department: "Cardiology",
    primary_physician: "Dr. James Wilson",
    created_at: BigInt(1706745600000000), // Feb 1, 2024
    last_updated: BigInt(1720483200000000), // Jul 8, 2024
    is_active: true,
    priority: "high",
    current_snapshot_hash: "0x9b8a7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b",
    summary: {
      total_events: 12,
      last_visit: "2024-07-08",
      recent_diagnoses: ["Cardiac Arrhythmia", "Hypertension"],
      active_medications: 4,
      recent_vitals: {
        blood_pressure: "145/92",
        heart_rate: "82 bpm",
        temperature: "98.4°F",
        weight: "183 lbs",
        bmi: "26.8",
        oxygen_saturation: "96%",
      },
      upcoming_appointments: 1,
      pending_lab_results: 2,
    },
  },
  {
    record_id: "REC-2024-003",
    patient_id: "PAT-003",
    patient_name: "Maria Garcia",
    clinic_id: "Family Health Center",
    department: "Family Medicine",
    primary_physician: "Dr. Michael Thompson",
    created_at: BigInt(1709337600000000), // Mar 1, 2024
    last_updated: BigInt(1720915200000000), // Jul 14, 2024
    is_active: true,
    priority: "normal",
    current_snapshot_hash: "0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d",
    summary: {
      total_events: 9,
      last_visit: "2024-07-12",
      recent_diagnoses: ["Seasonal Allergies", "Vitamin D Deficiency"],
      active_medications: 2,
      recent_vitals: {
        blood_pressure: "122/78",
        heart_rate: "72 bpm",
        temperature: "98.6°F",
        weight: "135 lbs",
        bmi: "22.4",
        oxygen_saturation: "99%",
      },
      upcoming_appointments: 1,
      pending_lab_results: 1,
    },
  },
  {
    record_id: "REC-2023-015",
    patient_id: "PAT-001",
    patient_name: "Sarah Johnson",
    clinic_id: "Metropolitan Medical Center",
    department: "Emergency Medicine",
    primary_physician: "Dr. Lisa Park",
    created_at: BigInt(1693526400000000), // Sep 1, 2023
    last_updated: BigInt(1693612800000000), // Sep 2, 2023
    is_active: false,
    priority: "urgent",
    current_snapshot_hash: "0x5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d",
    summary: {
      total_events: 5,
      last_visit: "2023-09-01",
      recent_diagnoses: ["Acute Gastroenteritis"],
      active_medications: 0,
      recent_vitals: {
        blood_pressure: "120/80",
        heart_rate: "95 bpm",
        temperature: "100.2°F",
        weight: "140 lbs",
        bmi: "23.3",
        oxygen_saturation: "97%",
      },
      upcoming_appointments: 0,
      pending_lab_results: 0,
    },
  },
  {
    record_id: "REC-2024-004",
    patient_id: "PAT-004",
    patient_name: "David Kim",
    clinic_id: "Orthopedic Surgery Center",
    department: "Orthopedic Surgery",
    primary_physician: "Dr. Jennifer Lee",
    created_at: BigInt(1711929600000000), // Apr 1, 2024
    last_updated: BigInt(1720742400000000), // Jul 12, 2024
    is_active: true,
    priority: "high",
    current_snapshot_hash: "0x8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e",
    summary: {
      total_events: 14,
      last_visit: "2024-07-10",
      recent_diagnoses: ["Post-surgical Recovery", "Physical Therapy"],
      active_medications: 3,
      recent_vitals: {
        blood_pressure: "128/82",
        heart_rate: "75 bpm",
        temperature: "98.8°F",
        weight: "175 lbs",
        bmi: "25.1",
        oxygen_saturation: "98%",
      },
      upcoming_appointments: 3,
      pending_lab_results: 0,
    },
  },
] as MedicalRecord[]

export default function EnhancedPatientMedicalRecords() {
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null)

  const formatIcpTime = (icpTime: bigint) => {
    return new Date(Number(icpTime) / 1000000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getStatusColor = (isActive: boolean) => {
    return isActive ? "bg-green-100 text-green-800 border-green-300" : "bg-gray-100 text-gray-800 border-gray-300"
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-300"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-300"
      case "normal":
        return "bg-blue-100 text-blue-800 border-blue-300"
      case "low":
        return "bg-gray-100 text-gray-800 border-gray-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <AlertCircle className="h-3 w-3 mr-1" />
      case "high":
        return <Clock className="h-3 w-3 mr-1" />
      case "normal":
        return <CheckCircle className="h-3 w-3 mr-1" />
      case "low":
        return <CheckCircle className="h-3 w-3 mr-1" />
      default:
        return <CheckCircle className="h-3 w-3 mr-1" />
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
            <h1 className="text-3xl font-bold text-gray-900">My Medical Records</h1>
            <p className="text-blue-600 mt-1 font-medium">View your complete medical history across all departments</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-blue-100 text-blue-800 border-blue-300">{mockMedicalRecords.length} Records</Badge>
            <Badge className="bg-green-100 text-green-800 border-green-300">
              <Shield className="h-4 w-4 mr-1" />
              Blockchain Secured
            </Badge>
            <Button
              variant="outline"
              size="sm"
              className="text-blue-600 border-blue-300 hover:bg-blue-50 bg-transparent"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-blue-600 border-blue-300 hover:bg-blue-50 bg-transparent"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Records List */}
        <div className="space-y-4">
          {mockMedicalRecords.map((record) => (
            <Card
              key={record.record_id}
              className="bg-white/70 backdrop-blur-sm border-blue-200 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2 flex-wrap">
                        <h3 className="font-semibold text-gray-900 text-lg">{record.patient_name}</h3>
                        <Badge className="text-xs font-mono bg-gray-100 text-gray-600 border-gray-300">
                          {record.record_id}
                        </Badge>
                        <Badge className={`text-xs font-medium ${getStatusColor(record.is_active)}`}>
                          {record.is_active ? "Active" : "Closed"}
                        </Badge>
                        <Badge className={`text-xs font-medium ${getPriorityColor(record.priority)}`}>
                          {getPriorityIcon(record.priority)}
                          {record.priority.charAt(0).toUpperCase() + record.priority.slice(1)}
                        </Badge>
                        <Badge className="bg-green-100 text-green-800 border-green-300 text-xs font-medium">
                          <Shield className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Building2 className="h-4 w-4 text-blue-500" />
                          <span className="font-medium">{record.clinic_id}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Stethoscope className="h-4 w-4 text-purple-500" />
                          <span>{record.department}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <UserCheck className="h-4 w-4 text-green-500" />
                          <span>{record.primary_physician}</span>
                        </div>
                      </div>

                      {/* Summary Information */}
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-4">
                        <div className="flex items-center space-x-2">
                          <Activity className="h-4 w-4 text-blue-600" />
                          <span className="text-sm text-gray-600">{record.summary.total_events} events</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-gray-600">Last: {record.summary.last_visit}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Pill className="h-4 w-4 text-purple-600" />
                          <span className="text-sm text-gray-600">{record.summary.active_medications} meds</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Heart className="h-4 w-4 text-red-600" />
                          <span className="text-sm text-gray-600">{record.summary.recent_vitals.heart_rate}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-orange-600" />
                          <span className="text-sm text-gray-600">
                            {record.summary.upcoming_appointments} upcoming
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-cyan-600" />
                          <span className="text-sm text-gray-600">{record.summary.pending_lab_results} pending</span>
                        </div>
                      </div>

                      {/* Recent Diagnoses */}
                      {record.summary.recent_diagnoses.length > 0 && (
                        <div className="mb-4">
                          <span className="text-sm font-medium text-gray-700 mb-2 block">Recent Diagnoses:</span>
                          <div className="flex flex-wrap gap-2">
                            {record.summary.recent_diagnoses.map((diagnosis, index) => (
                              <Badge key={index} className="bg-orange-100 text-orange-800 border-orange-300 text-xs">
                                {diagnosis}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Recent Vitals */}
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                            <Heart className="h-4 w-4 text-red-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Blood Pressure</p>
                            <p className="text-sm font-medium">{record.summary.recent_vitals.blood_pressure}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Thermometer className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Temperature</p>
                            <p className="text-sm font-medium">{record.summary.recent_vitals.temperature}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <Weight className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Weight</p>
                            <p className="text-sm font-medium">{record.summary.recent_vitals.weight}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <Stethoscope className="h-4 w-4 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Heart Rate</p>
                            <p className="text-sm font-medium">{record.summary.recent_vitals.heart_rate}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                            <Activity className="h-4 w-4 text-indigo-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">BMI</p>
                            <p className="text-sm font-medium">{record.summary.recent_vitals.bmi}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center">
                            <Activity className="h-4 w-4 text-cyan-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">O2 Sat</p>
                            <p className="text-sm font-medium">{record.summary.recent_vitals.oxygen_saturation}</p>
                          </div>
                        </div>
                      </div>

                      {/* Metadata */}
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>Created: {formatIcpTime(record.created_at)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>Updated: {formatIcpTime(record.last_updated)}</span>
                        </div>
                      </div>

                      <div className="text-xs text-gray-400 font-mono">
                        Hash: {record.current_snapshot_hash.substring(0, 32)}...
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      onClick={() => setSelectedRecord(record)}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                      size="sm"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Demo notification */}
        {selectedRecord && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="bg-white/90 backdrop-blur-sm max-w-md w-full mx-4">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <CardTitle>Demo Mode</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-600 mb-4">
                  In the full application, this would navigate to the detailed view for record{" "}
                  {selectedRecord.record_id}
                  for patient {selectedRecord.patient_name}.
                </p>
                <Button
                  onClick={() => setSelectedRecord(null)}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                >
                  Close
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
