"use client"
import { ArrowLeft, Calendar, User, FileText, Download, Shield, Clock, CheckCircle, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

export default function PatientRecordDetail() {
  const mockRecord = {
    id: "R001",
    date: "2024-01-15",
    time: "10:30 AM",
    provider: "Dr. Amanda Wilson",
    specialty: "Internal Medicine",
    type: "Primary Care",
    status: "Complete",
    summary: "Annual physical examination with comprehensive health assessment",
    fullNotes: {
      subjective:
        "Patient presents for annual physical examination. Reports feeling well overall with no acute complaints. Mentions occasional fatigue in the afternoons but attributes this to work stress. No chest pain, shortness of breath, or palpitations. Sleep pattern regular, appetite good. No recent weight changes.",
      objective:
        "Vital Signs: BP 118/76, HR 72, RR 16, Temp 98.6°F, Weight 165 lbs, Height 5'8\". General appearance: Well-developed, well-nourished adult in no acute distress. HEENT: Normal. Cardiovascular: Regular rate and rhythm, no murmurs. Pulmonary: Clear to auscultation bilaterally. Abdomen: Soft, non-tender, no organomegaly. Extremities: No edema.",
      assessment:
        "1. Health maintenance - due for routine screening\n2. Mild fatigue - likely stress-related\n3. Hypertension - well controlled on current medication",
      plan: "1. Continue current antihypertensive medication\n2. Order routine labs: CBC, CMP, lipid panel, HbA1c\n3. Mammogram and colonoscopy screening discussed\n4. Stress management techniques reviewed\n5. Return in 1 year for annual physical or sooner if concerns",
    },
    files: [
      { name: "Lab_Results_2024-01-15.pdf", type: "PDF", size: "245 KB" },
      { name: "EKG_Reading_2024-01-15.pdf", type: "PDF", size: "156 KB" },
      { name: "Chest_Xray_2024-01-15.dcm", type: "DICOM", size: "2.1 MB" },
    ],
    auditTrail: [
      { timestamp: "2024-01-15 10:30:00", action: "Record Created", user: "Dr. Amanda Wilson", verified: true },
      { timestamp: "2024-01-15 11:45:00", action: "Lab Results Added", user: "Lab Technician", verified: true },
      { timestamp: "2024-01-15 12:15:00", action: "EKG Results Added", user: "Dr. Amanda Wilson", verified: true },
      { timestamp: "2024-01-15 14:30:00", action: "Record Finalized", user: "Dr. Amanda Wilson", verified: true },
      { timestamp: "2024-01-15 14:31:00", action: "Blockchain Anchor", user: "System", verified: true },
    ],
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/patient/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Medical Record Detail</h1>
              <p className="text-sm text-gray-600">Record ID: {mockRecord.id}</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
            <Shield className="h-4 w-4 mr-1" />
            Blockchain Verified
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
          {/* Record Header */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-blue-900">{mockRecord.provider}</h2>
                    <p className="text-blue-700">{mockRecord.specialty}</p>
                    <p className="text-sm text-blue-600">
                      {mockRecord.date} at {mockRecord.time}
                    </p>
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <Badge
                    className={
                      mockRecord.type === "Primary Care"
                        ? "bg-blue-600"
                        : mockRecord.type === "Cardiology"
                          ? "bg-red-600"
                          : mockRecord.type === "Laboratory"
                            ? "bg-green-600"
                            : "bg-purple-600"
                    }
                  >
                    {mockRecord.type}
                  </Badge>
                  <div>
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                      {mockRecord.status}
                    </Badge>
                  </div>
                </div>
              </div>
              <Separator className="my-4 bg-blue-200" />
              <p className="text-blue-800 font-medium">{mockRecord.summary}</p>
            </CardContent>
          </Card>

          {/* Tabs Content */}
          <Tabs defaultValue="summary" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="notes">Full Notes</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
              <TabsTrigger value="audit">Audit Trail</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Visit Summary</CardTitle>
                  <CardDescription>Key highlights from this medical encounter</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Key Findings</h3>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• Blood pressure well controlled (118/76)</li>
                        <li>• Normal cardiovascular examination</li>
                        <li>• Clear lung fields on examination</li>
                        <li>• Mild fatigue likely stress-related</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Actions Taken</h3>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• Routine laboratory tests ordered</li>
                        <li>• Screening recommendations discussed</li>
                        <li>• Current medications continued</li>
                        <li>• Follow-up scheduled in 1 year</li>
                      </ul>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Next Steps</h3>
                    <p className="text-sm text-gray-600">
                      Continue current medication regimen. Complete ordered laboratory tests within 2 weeks. Schedule
                      mammogram and discuss colonoscopy screening. Return for annual physical in 1 year or sooner if any
                      concerns arise.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notes" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Complete SOAP Notes</CardTitle>
                  <CardDescription>Detailed clinical documentation from the provider</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Subjective</h3>
                    <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                      {mockRecord.fullNotes.subjective}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Objective</h3>
                    <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                      {mockRecord.fullNotes.objective}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Assessment</h3>
                    <pre className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg whitespace-pre-wrap font-sans">
                      {mockRecord.fullNotes.assessment}
                    </pre>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Plan</h3>
                    <pre className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg whitespace-pre-wrap font-sans">
                      {mockRecord.fullNotes.plan}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="files" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Attached Files</CardTitle>
                  <CardDescription>Medical documents, images, and test results</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockRecord.files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileText className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{file.name}</p>
                            <p className="text-sm text-gray-500">
                              {file.type} • {file.size}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                            <Shield className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="audit" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Blockchain Audit Trail</CardTitle>
                  <CardDescription>Complete history of all record modifications and verifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockRecord.auditTrail.map((entry, index) => (
                      <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          {entry.verified ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <Clock className="h-4 w-4 text-yellow-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900">{entry.action}</h4>
                            <div className="flex items-center space-x-2">
                              <Badge
                                variant="outline"
                                className={
                                  entry.verified
                                    ? "bg-green-100 text-green-800 border-green-300"
                                    : "bg-yellow-100 text-yellow-800 border-yellow-300"
                                }
                              >
                                {entry.verified ? "Verified" : "Pending"}
                              </Badge>
                              <Button variant="outline" size="sm">
                                <Shield className="h-4 w-4 mr-1" />
                                Verify
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            By {entry.user} on {entry.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
