"use client"
import { useState } from "react"
import {
  Search,
  Bell,
  Users,
  FileText,
  Database,
  Shield,
  Stethoscope,
  CheckCircle,
  AlertTriangle,
  User,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function DoctorDashboard() {
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data based on backend types
  const recentMedicalEvents = [
    {
      id: "evt_001",
      record_id: "rec_001",
      patient_name: "Sarah Johnson", // From User.name
      patient_id: "usr_001",
      timestamp: "2024-01-15T10:30:00Z",
      event_type: "vital_signs",
      status: "Verified" as const,
      created_by_id: "usr_doc_001",
    },
    {
      id: "evt_002",
      record_id: "rec_002",
      patient_name: "Michael Chen",
      patient_id: "usr_002",
      timestamp: "2024-01-15T11:15:00Z",
      event_type: "diagnosis",
      status: "Pending" as const,
      created_by_id: "usr_doc_001",
    },
    {
      id: "evt_003",
      record_id: "rec_003",
      patient_name: "Emily Rodriguez",
      patient_id: "usr_003",
      timestamp: "2024-01-15T09:45:00Z",
      event_type: "prescription",
      status: "Batched" as const,
      created_by_id: "usr_doc_001",
    },
  ]

  const activeMedicalRecords = [
    {
      record_id: "rec_001",
      patient_id: "usr_001",
      patient_name: "Sarah Johnson",
      clinic_id: "clinic_001",
      created_at: "2024-01-10T08:00:00Z",
      last_updated: "2024-01-15T10:30:00Z",
      is_active: true,
      current_snapshot_hash: "0x1a2b3c...",
    },
    {
      record_id: "rec_002",
      patient_id: "usr_002",
      patient_name: "Michael Chen",
      clinic_id: "clinic_001",
      created_at: "2024-01-12T14:20:00Z",
      last_updated: "2024-01-15T11:15:00Z",
      is_active: true,
      current_snapshot_hash: "0x4d5e6f...",
    },
  ]

  const batchAlerts = [
    {
      id: "alert_001",
      type: "batch_pending",
      message: "3 batches pending Hedera verification",
      priority: "medium" as const,
      timestamp: "2024-01-15T14:20:00Z",
    },
    {
      id: "alert_002",
      type: "event_failed",
      message: "Medical event verification failed for patient usr_004",
      priority: "high" as const,
      timestamp: "2024-01-15T13:45:00Z",
    },
    {
      id: "alert_003",
      type: "system",
      message: "Blockchain sync completed successfully",
      priority: "low" as const,
      timestamp: "2024-01-15T12:30:00Z",
    },
  ]

  const getEventStatusBadge = (status: string) => {
    switch (status) {
      case "Verified":
        return <Badge className="bg-green-100 text-green-800">Verified</Badge>
      case "Pending":
        return <Badge className="bg-orange-100 text-orange-800">Pending</Badge>
      case "Batched":
        return <Badge className="bg-blue-100 text-blue-800">Batched</Badge>
      case "Failed":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getEventTypeIcon = (eventType: string) => {
    switch (eventType) {
      case "vital_signs":
        return <Stethoscope className="h-4 w-4 text-red-600" />
      case "diagnosis":
        return <FileText className="h-4 w-4 text-blue-600" />
      case "prescription":
        return <FileText className="h-4 w-4 text-purple-600" />
      default:
        return <FileText className="h-4 w-4 text-gray-600" />
    }
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
            <Button variant="default" className="w-full justify-start bg-blue-600 hover:bg-blue-700">
              <FileText className="h-4 w-4 mr-3" />
              Dashboard
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-700 hover:bg-blue-50">
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
          {/* Welcome Section */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Good morning, Dr. Wilson</h1>
              <p className="text-gray-600">Manage medical records and monitor blockchain verification</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Today</p>
              <p className="text-lg font-semibold text-gray-900">{new Date().toLocaleDateString()}</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Records</p>
                    <p className="text-2xl font-bold text-gray-900">{activeMedicalRecords.length}</p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Recent Events</p>
                    <p className="text-2xl font-bold text-gray-900">{recentMedicalEvents.length}</p>
                  </div>
                  <Stethoscope className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Batches</p>
                    <p className="text-2xl font-bold text-gray-900">3</p>
                  </div>
                  <Database className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Alerts</p>
                    <p className="text-2xl font-bold text-gray-900">{batchAlerts.length}</p>
                  </div>
                  <Bell className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Medical Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Stethoscope className="h-5 w-5 mr-2 text-blue-600" />
                  Recent Medical Events
                </CardTitle>
                <CardDescription>Latest medical events you&apos;ve created</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentMedicalEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          {getEventTypeIcon(event.event_type)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{event.patient_name}</p>
                          <p className="text-sm text-gray-500">
                            {event.event_type.replace("_", " ")} • {event.patient_id}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{new Date(event.timestamp).toLocaleTimeString()}</p>
                        {getEventStatusBadge(event.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Active Medical Records */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-green-600" />
                  Active Medical Records
                </CardTitle>
                <CardDescription>Patient records under your care</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeMedicalRecords.map((record) => (
                    <div
                      key={record.record_id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{record.patient_name}</p>
                          <p className="text-sm text-gray-500">{record.record_id}</p>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <Badge className="bg-green-600">Active</Badge>
                        <p className="text-xs text-gray-500">
                          Updated: {new Date(record.last_updated).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2 text-red-600" />
                System Alerts
              </CardTitle>
              <CardDescription>Blockchain verification and system notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {batchAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          alert.priority === "high"
                            ? "bg-red-100"
                            : alert.priority === "medium"
                              ? "bg-orange-100"
                              : "bg-blue-100"
                        }`}
                      >
                        {alert.type === "batch_pending" ? (
                          <Database className="h-4 w-4 text-orange-600" />
                        ) : alert.type === "event_failed" ? (
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{alert.message}</p>
                        <p className="text-sm text-gray-500">{new Date(alert.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
