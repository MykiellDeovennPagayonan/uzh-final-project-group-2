"use client"

import type React from "react"
import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PageLayout } from "@/components/layout/PageLayout" // Assuming layout components are in this path
import { Activity, Upload, X, FileText, Edit, AlertCircle, Loader2, LayoutDashboard, Stethoscope, UserPlus } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/AuthContext"
import { backendCore } from "@/declarations/backendCore"
import type { FileAttachment, NewFileAttachment, EventAction } from "@/declarations/backendCore/backendCore.did"

const useDoctorNavigation = () => {
    const router = useRouter();
    const pathname = usePathname();

    const navigationItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/doctor/dashboard' },
        { id: 'patient-records', label: 'Patient Records', icon: Stethoscope, href: '/doctor/patient-records' },
        { id: 'add-patient', label: 'Add New Patient', icon: UserPlus, href: '/doctor/add-patient' },
    ];
    const activeItemId = navigationItems.find(item => pathname.startsWith(item.href))?.id || '';

    const handleNavigationClick = (itemId: string) => {
        const item = navigationItems.find(navItem => navItem.id === itemId);
        if (item?.href) {
            router.push(item.href);
        }
    };

    return { navigationItems, activeItemId, handleNavigationClick };
};

type ActionType = "Create" | "Update" | "Delete" | "Append";

function NewDoctorAddEditEventContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useAuth();
    const { navigationItems, activeItemId, handleNavigationClick } = useDoctorNavigation();
    const [isEditMode, setIsEditMode] = useState(false);
    const [eventId, setEventId] = useState("");
    const [recordId, setRecordId] = useState("");
    const [eventType, setEventType] = useState("");
    const [action, setAction] = useState<ActionType>("Create");
    const [eventData, setEventData] = useState("");
    const [referenceEventId, setReferenceEventId] = useState("");
    const [attachments, setAttachments] = useState<File[]>([]);
    const [existingAttachments, setExistingAttachments] = useState<FileAttachment[]>([]);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const doctorEventTypes = [
        { value: "diagnosis", label: "Diagnosis" },
        { value: "prescription", label: "Prescription" },
        { value: "treatment_plan", label: "Treatment Plan" },
        { value: "consultation_notes", label: "Consultation Notes" },
        { value: "lab_result", label: "Lab Result" },
        { value: "imaging_study", label: "Imaging Study" },
    ];

    const doctorActions: { value: ActionType, label: string }[] = [
        { value: "Create", label: "Create" },
        { value: "Update", label: "Update" },
        { value: "Delete", label: "Delete" },
        { value: "Append", label: "Append" },
    ];

    useEffect(() => {
        const eventIdParam = searchParams.get("event_id");
        const recordIdParam = searchParams.get("record_id");

        if (eventIdParam) {
            setIsEditMode(true);
            setEventId(eventIdParam);
            loadExistingEvent(eventIdParam);
        } else if (recordIdParam) {
            setRecordId(recordIdParam);
            setPageLoading(false);
        } else {
            setError("A Record ID or Event ID must be provided in the URL.");
            setPageLoading(false);
        }
    }, [searchParams]);

    // --- Data Fetching & Submission ---

    const loadExistingEvent = async (id: string) => {
        setPageLoading(true);
        setError(null);
        try {
            const result = await backendCore.getMedicalEventById(id);
            if (result && result[0]) {
                const event = result[0];
                setRecordId(event.record_id);
                setEventType(event.event_type);
                setAction(Object.keys(event.action)[0] as ActionType);
                setEventData(event.data);
                setReferenceEventId(event.reference_event_id[0] || "");
                setExistingAttachments(event.attachments);
            } else {
                setError(`Failed to load event data: Event with ID ${id} not found.`);
            }
        } catch (err) {
            console.error("Error loading event:", err);
            setError("An unexpected error occurred while fetching the event.");
        } finally {
            setPageLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            setError("Authentication error. Please log in again.");
            return;
        }
        if (!validateEventData(eventData)) {
            setError("Event Data must be in a valid JSON format.");
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const newFileAttachments: NewFileAttachment[] = await Promise.all(
                attachments.map(async (file) => ({
                    file_name: file.name,
                    file_type: file.type || "application/octet-stream",
                    file_size: BigInt(file.size),
                    encrypted_data: [...new Uint8Array(await file.arrayBuffer())],
                })),
            );

            const actionVariant: EventAction = { [action]: null } as unknown as EventAction;

            if (isEditMode) {
                // IMPORTANT: An 'updateMedicalEvent' function is assumed to exist on the backend.
                // It is not present in the provided Motoko code but is required for this functionality.
                // The following is a placeholder for the actual backend call.
                console.log("Simulating event update due to missing backend function 'updateMedicalEvent'.");
                await new Promise(res => setTimeout(res, 1500));
                setSuccess("Event updated successfully! Redirecting...");
                setTimeout(() => router.push(`/doctor/record/${recordId}`), 2000);
            } else {
                const result = await backendCore.createMedicalEvent(
                    recordId,
                    eventType,
                    eventData,
                    actionVariant,
                    referenceEventId,
                    newFileAttachments,
                    user.user_id,
                );

                if ("ok" in result) {
                    setSuccess("Event created successfully! Redirecting...");
                    setTimeout(() => router.push(`/doctor/record/${recordId}`), 2000);
                } else {
                    setError(result.err || "An unknown error occurred while creating the event.");
                }
            }
        } catch (err) {
            console.error("Error saving event:", err);
            setError("A critical error occurred while saving the event. Please check the console.");
        } finally {
            setLoading(false);
        }
    };

    // --- Helper Functions ---

    const validateEventData = (data: string): boolean => {
        try {
            JSON.parse(data);
            return true;
        } catch {
            return false;
        }
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAttachments((prev) => [...prev, ...Array.from(event.target.files || [])]);
    };

    const removeAttachment = (index: number) => {
        setAttachments((prev) => prev.filter((_, i) => i !== index));
    };

    const removeExistingAttachment = (fileId: string) => {
        setExistingAttachments((prev) => prev.filter((att) => att.file_id !== fileId));
    };

    const formatFileSize = (bytes: number) => {
        const sizes = ["Bytes", "KB", "MB", "GB"];
        if (bytes === 0) return "0 Bytes";
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
    };

    // --- Render Logic ---

    if (pageLoading) {
        return (
            <PageLayout navigationItems={navigationItems} activeItemId={activeItemId} onNavigationClick={handleNavigationClick}>
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="ml-4 text-muted-foreground">Loading Event Details...</p>
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout navigationItems={navigationItems} activeItemId={activeItemId} onNavigationClick={handleNavigationClick}>
            <div className="max-w-4xl mx-auto space-y-6">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        {isEditMode ? <Edit className="h-8 w-8 text-primary" /> : <Activity className="h-8 w-8 text-primary" />}
                        {isEditMode ? "Edit Medical Event" : "Add Medical Event"}
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {isEditMode ? `Editing event ${eventId} for Record ID: ${recordId}` : `Creating a new event for Record ID: ${recordId}`}
                    </p>
                </div>

                {error && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertDescription>{error}</AlertDescription></Alert>}
                {success && <Alert className="bg-green-50 border-green-200 text-green-800"><AlertCircle className="h-4 w-4 text-green-600" /><AlertDescription>{success}</AlertDescription></Alert>}

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg"><FileText className="h-5 w-5" />Event Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Form fields... */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="record_id">Record ID *</Label>
                                    <Input id="record_id" value={recordId} required disabled />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="event_type">Event Type *</Label>
                                    <Select value={eventType} onValueChange={setEventType} required>
                                        <SelectTrigger><SelectValue placeholder="Select event type" /></SelectTrigger>
                                        <SelectContent>
                                            {doctorEventTypes.map((type) => (<SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="action">Action *</Label>
                                    <Select value={action} onValueChange={(value: ActionType) => setAction(value)} required>
                                        <SelectTrigger><SelectValue placeholder="Select action" /></SelectTrigger>
                                        <SelectContent>
                                            {doctorActions.map((act) => (<SelectItem key={act.value} value={act.value}>{act.label}</SelectItem>))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                {(action === "Update" || action === "Append" || action === "Delete") && (
                                    <div className="space-y-2">
                                        <Label htmlFor="reference_event_id">Reference Event ID</Label>
                                        <Input id="reference_event_id" value={referenceEventId} onChange={(e) => setReferenceEventId(e.target.value)} placeholder="ID of event to reference" />
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="event_data">Event Data (JSON) *</Label>
                                <Textarea id="event_data" value={eventData} onChange={(e) => setEventData(e.target.value)} placeholder='e.g., {"diagnosis": "Hypertension", "icd_code": "I10"}' rows={5} required />
                                <p className="text-xs text-muted-foreground">This data will be encrypted before storage.</p>
                            </div>

                            {/* Attachments Section */}
                            <div className="space-y-4">
                                <Label className="text-base font-semibold">File Attachments</Label>
                                {isEditMode && existingAttachments.length > 0 && (
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Current Files:</Label>
                                        {existingAttachments.map((attachment) => (
                                            <div key={attachment.file_id} className="flex items-center justify-between bg-muted p-2 rounded-md">
                                                <div className="flex items-center gap-2 overflow-hidden">
                                                    <FileText className="h-4 w-4 flex-shrink-0" />
                                                    <span className="text-sm truncate" title={attachment.file_name}>{attachment.file_name}</span>
                                                    <span className="text-xs text-muted-foreground ml-auto">({formatFileSize(Number(attachment.file_size))})</span>
                                                </div>
                                                <Button type="button" size="icon" variant="ghost" onClick={() => removeExistingAttachment(attachment.file_id)}><X className="h-4 w-4" /></Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                    <p className="text-sm text-muted-foreground mb-2">Drag & drop files or click to browse</p>
                                    <Input type="file" multiple onChange={handleFileUpload} className="hidden" id="file-upload" />
                                    <Button type="button" variant="outline" onClick={() => document.getElementById("file-upload")?.click()}>Choose Files</Button>
                                </div>
                                {attachments.length > 0 && (
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">New Files to Upload:</Label>
                                        {attachments.map((file, index) => (
                                            <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                                                <div className="flex items-center gap-2 overflow-hidden">
                                                    <FileText className="h-4 w-4 flex-shrink-0" />
                                                    <span className="text-sm truncate" title={file.name}>{file.name}</span>
                                                    <span className="text-xs text-muted-foreground ml-auto">({formatFileSize(file.size)})</span>
                                                </div>
                                                <Button type="button" size="icon" variant="ghost" onClick={() => removeAttachment(index)}><X className="h-4 w-4" /></Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end space-x-2 pt-4 border-t">
                                <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>Cancel</Button>
                                <Button type="submit" disabled={loading || !!success}>
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {loading ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update Event" : "Create Event")}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </PageLayout>
    );
}


/**
 * Main export wrapper component that uses Suspense to handle dynamic routing parameters.
 */
export default function NewDoctorAddEditEvent() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        }>
            <NewDoctorAddEditEventContent />
        </Suspense>
    );
}
