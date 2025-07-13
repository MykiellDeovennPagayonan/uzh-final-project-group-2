"use client"
import { useState } from "react"
import { Calendar, Filter, FileText, User, Settings, Download, Eye, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function PatientDashboard() {
  const [dateFilter, setDateFilter] = useState("")
  const [providerFilter, setProviderFilter] = useState("all")

  const mockRecords = [
    {
      id: "R001",
      date: "2024-01-15",
      provider: "Dr. Amanda Wilson",
      type: "Primary Care",
      snippet: "Annual physical examination. Blood pressure normal, cholesterol levels reviewed...",
      status: "Complete",
    },
    {
      id: "R002",
      date: "2024-01-08",
      provider: "Dr. James Park",
      type: "Cardiology",
      snippet: "Follow-up for hypertension management. EKG normal, medication adjustment...",
      status: "Complete",
    },
    {
      id: "R003",
      date: "2024-01-03",
      provider: "Lab Services",
      type: "Laboratory",
      snippet: "Comprehensive metabolic panel, lipid profile, HbA1c. Results within normal limits...",
      status: "Complete",
    },
    {
      id: "R004",
      date: "2023-12-20",
      provider: "Dr. Lisa Martinez",
      type: "Family Medicine",
      snippet: "Flu vaccination administered. Discussed seasonal health precautions...",
      status: "Complete",
    },
    {
      id: "R005",
      date: "2023-12-15",
      provider: "Radiology Dept",
      type: "Imaging",
      snippet: "Chest X-ray ordered for persistent cough. No acute findings, clear lung fields...",
      status: "Complete",
    },
  ]

  const mockProviders = ["Dr. Amanda Wilson", "Dr. James Park", "Dr. Lisa Martinez", "Lab Services", "Radiology Dept"]

  const filteredRecords = mockRecords.filter((record) => {
    const matchesProvider = providerFilter === "all" || record.provider === providerFilter
    const matchesDate = !dateFilter || record.date.includes(dateFilter)
    return matchesProvider && matchesDate
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Patient Portal</h1>
              <p className="text-sm text-gray-600">Welcome back, Michael Chen</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
            <FileText className="h-4 w-4 mr-1" />
            {mockRecords.length} Records
          </Badge>
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
              <Calendar className="h-4 w-4 mr-3" />
              My Records
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-700 hover:bg-blue-50">
              <Settings className="h-4 w-4 mr-3" />
              Settings
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 space-y-6">
          {/* Welcome Section */}
          <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-2">Your Medical History</h2>
              <p className="text-blue-100 mb-4">
                Access your complete medical records, view test results, and track your health journey. All records are
                securely stored and verified on the blockchain.
              </p>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{mockRecords.length}</div>
                  <div className="text-sm text-blue-200">Total Records</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">3</div>
                  <div className="text-sm text-blue-200">Providers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">2024</div>
                  <div className="text-sm text-blue-200">Latest Year</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="h-5 w-5 mr-2 text-gray-600" />
                Filter Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="search">Search Records</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input id="search" placeholder="Search by type, provider, or notes..." className="pl-10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date-filter">Date Range</Label>
                  <Input
                    id="date-filter"
                    type="month"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="provider-filter">Provider</Label>
                  <Select onValueChange={setProviderFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All providers" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All providers</SelectItem>
                      {mockProviders.map((provider) => (
                        <SelectItem key={provider} value={provider}>
                          {provider}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Records Grid */}
          <div className="grid gap-4">
            {filteredRecords.map((record) => (
              <Card key={record.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Badge
                          variant="outline"
                          className={
                            record.type === "Primary Care"
                              ? "bg-blue-100 text-blue-800 border-blue-300"
                              : record.type === "Cardiology"
                                ? "bg-red-100 text-red-800 border-red-300"
                                : record.type === "Laboratory"
                                  ? "bg-green-100 text-green-800 border-green-300"
                                  : record.type === "Family Medicine"
                                    ? "bg-purple-100 text-purple-800 border-purple-300"
                                    : "bg-orange-100 text-orange-800 border-orange-300"
                          }
                        >
                          {record.type}
                        </Badge>
                        <span className="text-sm text-gray-500">{record.date}</span>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          {record.status}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">{record.provider}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{record.snippet}</p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Link href={`/patient/record/${record.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredRecords.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Records Found</h3>
                <p className="text-gray-600">Try adjusting your filters to see more records.</p>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  )
}
