"use client"
import { useState } from "react"
import {
  Search,
  Bell,
  Calendar,
  Users,
  FileText,
  Database,
  Filter,
  Download,
  Shield,
  User,
  Stethoscope,
  Activity,
  TestTube,
  Pill,
  Eye,
  CheckCircle,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export default function DoctorPatientHistory() {
  const [searchQuery, setSearchQuery] = useState("")
  const [eventTypeFilter, setEventTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateRange, setDateRange] = useState("")

  const patientInfo = {
    id: "P002",
    name: "Michael Chen",
    age: 67,
    status: "active",
    lastVisit: "2024-01-15",
    conditions: ["Hypertension", "Type 2 Diabetes"],
  }

  const medicalEvents = [
    {
      id: "E001",
      date: "2024-01-15",
      time: "10:30 AM",
      type: "consultation",
      status: "verified",
      provider: "Dr. Amanda Wilson",
      summary: "Annual physical examination. Blood pressure controlled, diabetes management reviewed.",
      blockchainHash: "0x1a2b3c...",
    },
    {
      id: "E002",
      date: "2024-01-15",
      time: "11:45 AM",
      type: "lab",
      status: "verified",
      provider: "Lab Services",
      summary: "HbA1c: 6.8%, Lipid panel: Total cholesterol 185 mg/dL, LDL 110 mg/dL.",
      blockchainHash: "0x4d5e6f...",
    },
    {
      id: "E003",
      date: "2024-01-08",
      time: "02:15 PM",
      type: "prescription",
      status: "pending",
      provider: "Dr. James Park",
      summary: "Metformin 1000mg BID, Lisinopril 10mg daily. Medication adjustment for better control.",
      blockchainHash: null,
    },
    {
      id: "E004",
      date: "2024-01-03",
      time: "09:00 AM",
      type: "vitals",
      status: "verified",
      provider: "Nurse Sarah",
      summary: "BP: 128/82, Weight: 175 lbs, BMI: 26.6. Slight weight increase noted.",
      blockchainHash: "0x7g8h9i...",
    },
    {
      id: "E005",
      date: "2023-12-20",
      time: "03:30 PM",
      type: "imaging",
      status: "verified",
      provider: "Radiology Dept",
      summary: "Chest X-ray: No acute cardiopulmonary abnormalities. Heart size normal.",
      blockchainHash: "0xj1k2l3...",
    },
    {
      id: "E006",
      date: "2023-12-15",
      time: "11:00 AM",
      type: "consultation",
      status: "verified",
      provider: "Dr. Lisa Martinez",
      summary: "Cardiology consultation. Echo shows normal EF. Continue current medications.",
      blockchainHash: "0xm4n5o6...",
    },
  ]

  const getEventIcon = (type: string) => {
    switch (type) {
      case "consultation":
        return <Stethoscope className="h-5 w-5 text-blue-600" />
      case "lab":
        return <TestTube className="h-5 w-5 text-green-600" />
      case "prescription":
        return <Pill className="h-5 w-5 text-purple-600" />
      case "vitals":
        return <Activity className="h-5 w-5 text-red-600" />
      case "imaging":
        return <Eye className="h-5 w-5 text-orange-600" />
      default:
        return <FileText className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string, hasHash: boolean) => {
    if (status === "verified" && hasHash) {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-300">
          <CheckCircle className="h-3 w-3 mr-1" />
          Verified
        </Badge>
      )
    } else if (status === "pending") {
      return (
        <Badge className="bg-orange-100 text-orange-800 border-orange-300">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      )
    }
    return <Badge variant="outline">{status}</Badge>
  }

  const filteredEvents = medicalEvents.filter((event) => {
    const matchesType = eventTypeFilter === "all" || event.type === eventTypeFilter
    const matchesStatus = statusFilter === "all" || event.status === statusFilter
    const matchesSearch = event.summary.toLowerCase().includes(searchQuery.toLowerCase())
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
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-blue-900">{patientInfo.name}</h1>
                    <p className="text-blue-700">
                      Patient ID: {patientInfo.id} • Age: {patientInfo.age}
                    </p>
                    <p className="text-sm text-blue-600">Last visit: {patientInfo.lastVisit}</p>
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <Badge
                    className={
                      patientInfo.status === "active"
                        ? "bg-green-600"
                        : patientInfo.status === "inactive"
                          ? "bg-gray-600"
                          : "bg-red-600"
                    }
                  >
                    {patientInfo.status.charAt(0).toUpperCase() + patientInfo.status.slice(1)}
                  </Badge>
                  <div className="space-y-1">
                    {patientInfo.conditions.map((condition, index) => (
                      <Badge key={index} variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                        {condition}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="h-5 w-5 mr-2 text-gray-600" />
                Filter Medical History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="event-type">Event Type</Label>
                  <Select onValueChange={setEventTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All types</SelectItem>
                      <SelectItem value="consultation">Consultation</SelectItem>
                      <SelectItem value="lab">Laboratory</SelectItem>
                      <SelectItem value="prescription">Prescription</SelectItem>
                      <SelectItem value="vitals">Vitals</SelectItem>
                      <SelectItem value="imaging">Imaging</SelectItem>
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
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date-range">Date Range</Label>
                  <Input
                    id="date-range"
                    type="month"
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>&nbsp;</Label>
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <Download className="h-4 w-4 mr-2" />
                    Download CSV
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Medical Events Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                Medical History Timeline
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
                        {getEventIcon(event.type)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-semibold text-gray-900 capitalize">{event.type}</h3>
                          <Badge variant="outline" className="text-xs">
                            {event.type}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(event.status, !!event.blockchainHash)}
                          {event.blockchainHash && (
                            <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                              <Shield className="h-3 w-3 mr-1" />
                              Blockchain
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{event.summary}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>
                          {event.date} at {event.time} • {event.provider}
                        </span>
                        {event.blockchainHash && (
                          <span className="font-mono bg-gray-200 px-2 py-1 rounded">Hash: {event.blockchainHash}</span>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
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
