/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useState } from "react"
import { Search, Send, Save, Users, Activity, FileText, Stethoscope, Thermometer, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

export default function NurseVitalsPage() {
  const [selectedPatient, setSelectedPatient] = useState("")
  const [vitals, setVitals] = useState({
    height: "",
    weight: "",
    systolic: "",
    diastolic: "",
    temperature: "",
    pulse: "",
    respiratory: "",
    notes: "",
  })
  const [referral, setReferral] = useState({
    doctor: "",
    message: "",
  })

  const mockPatients = [
    { id: "P001", name: "Sarah Johnson", age: 34, room: "A-101" },
    { id: "P002", name: "Michael Chen", age: 67, room: "B-205" },
    { id: "P003", name: "Emily Rodriguez", age: 28, room: "A-103" },
    { id: "P004", name: "David Thompson", age: 45, room: "C-301" },
  ]

  const mockDoctors = [
    { id: "D001", name: "Dr. Amanda Wilson", specialty: "Internal Medicine" },
    { id: "D002", name: "Dr. James Park", specialty: "Cardiology" },
    { id: "D003", name: "Dr. Lisa Martinez", specialty: "Family Medicine" },
    { id: "D004", name: "Dr. Robert Kim", specialty: "Emergency Medicine" },
  ]

  const handleSaveVitals = () => {
    toast(`Vital signs recorded for ${mockPatients.find((p) => p.id === selectedPatient)?.name}`)
  }

  const handleSendReferral = () => {
    toast(`Referral sent to ${mockDoctors.find((d) => d.id === referral.doctor)?.name}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Nurse Station</h1>
              <p className="text-sm text-gray-600">Patient Vitals & Referrals</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
            <Activity className="h-4 w-4 mr-1" />
            On Duty
          </Badge>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <nav className="p-4 space-y-2">
            <Button variant="ghost" className="w-full justify-start text-gray-700 hover:bg-green-50">
              <Users className="h-4 w-4 mr-3" />
              Patients
            </Button>
            <Button variant="default" className="w-full justify-start bg-green-600 hover:bg-green-700">
              <Activity className="h-4 w-4 mr-3" />
              Vitals
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-700 hover:bg-green-50">
              <FileText className="h-4 w-4 mr-3" />
              Referrals
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 space-y-6">
          {/* Patient Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="h-5 w-5 mr-2 text-green-600" />
                Select Patient
              </CardTitle>
              <CardDescription>Choose a patient to record vitals and create referrals</CardDescription>
            </CardHeader>
            <CardContent>
              <Select onValueChange={setSelectedPatient}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Search or select patient..." />
                </SelectTrigger>
                <SelectContent>
                  {mockPatients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{patient.name}</span>
                        <span className="text-sm text-gray-500 ml-4">
                          Room {patient.room} • Age {patient.age}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {selectedPatient && (
            <>
              {/* Patient Info Banner */}
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-green-900">
                        {mockPatients.find((p) => p.id === selectedPatient)?.name}
                      </h3>
                      <p className="text-sm text-green-700">
                        Patient ID: {selectedPatient} • Room: {mockPatients.find((p) => p.id === selectedPatient)?.room}
                      </p>
                    </div>
                    <Badge className="bg-green-600">Active</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Vitals Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="h-5 w-5 mr-2 text-red-500" />
                    Record Vital Signs
                  </CardTitle>
                  <CardDescription>Enter current vital measurements</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="height">Height (cm)</Label>
                      <Input
                        id="height"
                        placeholder="170"
                        value={vitals.height}
                        onChange={(e) => setVitals({ ...vitals, height: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input
                        id="weight"
                        placeholder="70"
                        value={vitals.weight}
                        onChange={(e) => setVitals({ ...vitals, weight: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="temperature">Temperature (°C)</Label>
                      <div className="relative">
                        <Thermometer className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="temperature"
                          placeholder="36.5"
                          className="pl-10"
                          value={vitals.temperature}
                          onChange={(e) => setVitals({ ...vitals, temperature: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="systolic">Blood Pressure</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="systolic"
                          placeholder="120"
                          value={vitals.systolic}
                          onChange={(e) => setVitals({ ...vitals, systolic: e.target.value })}
                        />
                        <span className="flex items-center text-gray-500">/</span>
                        <Input
                          placeholder="80"
                          value={vitals.diastolic}
                          onChange={(e) => setVitals({ ...vitals, diastolic: e.target.value })}
                        />
                      </div>
                      <p className="text-xs text-gray-500">Systolic / Diastolic (mmHg)</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pulse">Pulse (bpm)</Label>
                      <Input
                        id="pulse"
                        placeholder="72"
                        value={vitals.pulse}
                        onChange={(e) => setVitals({ ...vitals, pulse: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="respiratory">Respiratory Rate</Label>
                      <Input
                        id="respiratory"
                        placeholder="16"
                        value={vitals.respiratory}
                        onChange={(e) => setVitals({ ...vitals, respiratory: e.target.value })}
                      />
                      <p className="text-xs text-gray-500">breaths per minute</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Clinical Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Additional observations or notes..."
                      rows={3}
                      value={vitals.notes}
                      onChange={(e: { target: { value: any } }) => setVitals({ ...vitals, notes: e.target.value })}
                    />
                  </div>

                  <Button onClick={handleSaveVitals} className="bg-green-600 hover:bg-green-700">
                    <Save className="h-4 w-4 mr-2" />
                    Save Vitals
                  </Button>
                </CardContent>
              </Card>

              <Separator />

              {/* Referral Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Send className="h-5 w-5 mr-2 text-blue-600" />
                    Refer to Doctor
                  </CardTitle>
                  <CardDescription>Create a referral for physician consultation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="doctor">Select Physician</Label>
                    <Select onValueChange={(value) => setReferral({ ...referral, doctor: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a doctor..." />
                      </SelectTrigger>
                      <SelectContent>
                        {mockDoctors.map((doctor) => (
                          <SelectItem key={doctor.id} value={doctor.id}>
                            <div className="flex flex-col">
                              <span>{doctor.name}</span>
                              <span className="text-sm text-gray-500">{doctor.specialty}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Referral Message (Optional)</Label>
                    <Textarea
                      id="message"
                      placeholder="Reason for referral, symptoms, or additional context..."
                      rows={4}
                      value={referral.message}
                      onChange={(e: { target: { value: any } }) => setReferral({ ...referral, message: e.target.value })}
                    />
                  </div>

                  <Button
                    onClick={handleSendReferral}
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={!referral.doctor}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Referral
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
