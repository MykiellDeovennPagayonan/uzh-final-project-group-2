// Main Medical Event (can contain any type of medical data)
type MedicalEvent = {
  event_id: Text;
  patient_id: Text;
  timestamp: Int;
  event_type: MedicalEventType;
  medical_data: MedicalData;        // Union of all possible medical data
  event_hash: Text;
  batch_id: ?Text;
  status: EventStatus;
  created_by: Text;
  clinic_id: Text;
  attachments: [AttachmentReference]; // Images, documents, etc.
};

type EventStatus = { 
  #Pending;    // Not yet batched
  #Batched;    // Included in batch
  #Submitted;  // Batch submitted to Hedera
  #Verified;   // Batch verified on Hedera
  #Failed;     // Error in processing
};

// Union type for all medical data
type MedicalData = {
  #PatientRegistration: PatientRegistrationData;
  #PatientUpdate: PatientUpdateData;
  #VitalSigns: VitalSignsData;
  #ClinicalNote: ClinicalNoteData;
  #Diagnosis: DiagnosisData;
  #Prescription: PrescriptionData;
  #LabResult: LabResultData;
  #ImagingStudy: ImagingStudyData;
  #Procedure: ProcedureData;
  #Vaccination: VaccinationData;
  #Allergy: AllergyData;
  #Discharge: DischargeData;
  #Referral: ReferralData;
  #Insurance: InsuranceData;
  #Billing: BillingData;
};

type MedicalEventType = {
  #PatientRegistration;
  #PatientUpdate;
  #VitalSigns;
  #ClinicalNote;
  #Diagnosis;
  #Prescription;
  #LabResult;
  #ImagingStudy;      // X-ray, CT, MRI, etc.
  #Procedure;
  #Vaccination;
  #Allergy;
  #Discharge;
  #Referral;
  #Insurance;
  #Billing;
};

// Patient registration (initial patient creation)
type PatientRegistrationData = {
  // Demographics (encrypted)
  first_name: Text;
  last_name: Text;
  date_of_birth: Text;      // YYYY-MM-DD format
  gender: Gender;
  ssn: ?Text;               // Encrypted SSN
  
  // Contact Information (encrypted)
  address: Address;
  phone_primary: Text;
  phone_secondary: ?Text;
  email: ?Text;
  
  // Emergency Contact (encrypted)
  emergency_contact: EmergencyContact;
  
  // Insurance Information
  insurance_info: [InsuranceInfo];
  
  // Medical History Overview
  medical_history_summary: ?Text;
  known_allergies: [Text];
  current_medications: [Text];
  
  // Administrative
  preferred_language: Text;
  ethnicity: ?Text;
  race: ?Text;
  marital_status: ?MaritalStatus;
  occupation: ?Text;
};

// Patient updates (changes to existing patient info)
type PatientUpdateData = {
  field_updated: PatientField;
  old_value: ?Text;         // Previous value (encrypted)
  new_value: Text;          // New value (encrypted)
  reason: Text;             // Reason for update
};

type PatientField = {
  #Demographics;
  #ContactInfo;
  #EmergencyContact;
  #Insurance;
  #MedicalHistory;
  #Preferences;
};

type Gender = {
  #Male;
  #Female;
  #Other: Text;
  #PreferNotToSay;
};

type MaritalStatus = {
  #Single;
  #Married;
  #Divorced;
  #Widowed;
  #Other: Text;
};

type Address = {
  street: Text;
  city: Text;
  state: Text;
  zip_code: Text;
  country: Text;
};

type EmergencyContact = {
  name: Text;
  relationship: Text;
  phone: Text;
  address: ?Address;
};

type InsuranceInfo = {
  insurance_id: Text;
  provider_name: Text;
  policy_number: Text;
  group_number: ?Text;
  subscriber_id: Text;
  relationship_to_subscriber: Text;
  effective_date: Text;
  expiration_date: ?Text;
  is_primary: Bool;
};

// Vital signs measurement
type VitalSignsData = {
  temperature: ?VitalMeasurement;
  blood_pressure: ?BloodPressure;
  heart_rate: ?VitalMeasurement;
  respiratory_rate: ?VitalMeasurement;
  oxygen_saturation: ?VitalMeasurement;
  height: ?VitalMeasurement;
  weight: ?VitalMeasurement;
  bmi: ?Float;
  pain_scale: ?Nat;         // 1-10 scale
  measured_by: Text;        // Staff member ID
  measurement_method: ?Text; // Manual, automated, etc.
  notes: ?Text;
};

type VitalMeasurement = {
  value: Float;
  unit: Text;
  timestamp: Int;
};

type BloodPressure = {
  systolic: Float;
  diastolic: Float;
  unit: Text;               // "mmHg"
  timestamp: Int;
};

// Clinical notes and observations
type ClinicalNoteData = {
  note_type: ClinicalNoteType;
  chief_complaint: ?Text;
  history_present_illness: ?Text;
  review_of_systems: ?Text;
  physical_examination: ?Text;
  assessment: ?Text;
  plan: ?Text;
  free_text_notes: ?Text;
  soap_note: ?SOAPNote;     // Structured SOAP format
  provider_id: Text;
  cosigned_by: ?Text;       // Supervising physician
};

type ClinicalNoteType = {
  #Progress;
  #Consultation;
  #Admission;
  #Discharge;
  #Procedure;
  #Emergency;
  #Followup;
};

type SOAPNote = {
  subjective: Text;         // Patient's description
  objective: Text;          // Observable findings
  assessment: Text;         // Diagnosis/interpretation
  plan: Text;              // Treatment plan
};

// Diagnosis information
type DiagnosisData = {
  primary_diagnosis: DiagnosisCode;
  secondary_diagnoses: [DiagnosisCode];
  diagnosis_confidence: DiagnosisConfidence;
  onset_date: ?Text;
  resolution_date: ?Text;
  severity: ?Severity;
  notes: ?Text;
  differential_diagnoses: [Text];
};

type DiagnosisCode = {
  code: Text;               // ICD-10 code
  description: Text;
  code_system: Text;        // "ICD-10-CM"
};

type DiagnosisConfidence = {
  #Confirmed;
  #Suspected;
  #RuledOut;
  #Differential;
};

type Severity = {
  #Mild;
  #Moderate;
  #Severe;
  #Critical;
};

// Prescription data
type PrescriptionData = {
  medication: MedicationInfo;
  dosage: Dosage;
  frequency: Text;          // "BID", "TID", "QID", etc.
  duration: ?Text;          // "10 days", "30 days", etc.
  quantity: Nat;            // Number of pills/units
  refills: Nat;             // Number of refills allowed
  generic_substitution: Bool;
  prescriber_id: Text;
  pharmacy_info: ?PharmacyInfo;
  indication: ?Text;        // Reason for prescription
  special_instructions: ?Text;
  start_date: Text;
  end_date: ?Text;
  status: PrescriptionStatus;
};

type MedicationInfo = {
  name: Text;               // Brand or generic name
  generic_name: ?Text;
  ndc_code: ?Text;          // National Drug Code
  strength: Text;           // "500mg", "10mg/ml", etc.
  form: MedicationForm;
  route: Route;
};

type MedicationForm = {
  #Tablet;
  #Capsule;
  #Liquid;
  #Injection;
  #Topical;
  #Inhaler;
  #Patch;
  #Other: Text;
};

type Route = {
  #Oral;
  #Intravenous;
  #Intramuscular;
  #Subcutaneous;
  #Topical;
  #Inhalation;
  #Rectal;
  #Other: Text;
};

type Dosage = {
  amount: Float;
  unit: Text;               // "mg", "ml", "units", etc.
  per_administration: Bool; // True if per dose, false if total daily
};

type PharmacyInfo = {
  name: Text;
  address: Address;
  phone: Text;
  npi: ?Text;
};

type PrescriptionStatus = {
  #Active;
  #Completed;
  #Discontinued;
  #OnHold;
  #Cancelled;
};

// Laboratory test results
type LabResultData = {
  test_name: Text;
  test_code: ?Text;         // CPT or LOINC code
  results: [LabValue];
  reference_ranges: [ReferenceRange];
  ordering_provider: Text;
  lab_facility: Text;
  specimen_type: Text;      // Blood, urine, etc.
  collection_date: Text;
  result_date: Text;
  status: LabStatus;
  critical_values: [Text];  // Flagged abnormal values
  interpretation: ?Text;
  notes: ?Text;
};

type LabValue = {
  component: Text;          // "Glucose", "Hemoglobin", etc.
  value: Text;              // Can be numeric or text
  unit: ?Text;
  abnormal_flag: ?AbnormalFlag;
};

type ReferenceRange = {
  component: Text;
  low_value: ?Float;
  high_value: ?Float;
  unit: Text;
  age_range: ?Text;
  gender: ?Gender;
};

type AbnormalFlag = {
  #High;
  #Low;
  #Critical;
  #Abnormal;
};

type LabStatus = {
  #Pending;
  #InProgress;
  #Completed;
  #Cancelled;
  #Corrected;
};

// Medical imaging studies
type ImagingStudyData = {
  study_type: ImagingType;
  study_date: Text;
  ordering_provider: Text;
  radiologist: ?Text;
  facility: Text;
  body_part: Text;
  indication: Text;         // Reason for study
  technique: ?Text;
  contrast_used: Bool;
  findings: ?Text;
  impression: ?Text;
  recommendations: ?Text;
  study_id: Text;           // Accession number
  dicom_series: [DICOMSeries];
  status: ImagingStatus;
};

type ImagingType = {
  #XRay;
  #CT;
  #MRI;
  #Ultrasound;
  #Mammography;
  #Nuclear;
  #PET;
  #Fluoroscopy;
  #Other: Text;
};

type DICOMSeries = {
  series_id: Text;
  series_description: Text;
  image_count: Nat;
  file_references: [Text];  // References to stored DICOM files
};

type ImagingStatus = {
  #Scheduled;
  #InProgress;
  #Completed;
  #Cancelled;
  #Preliminary;
  #Final;
  #Amended;
};

// Medical procedures
type ProcedureData = {
  procedure_name: Text;
  procedure_code: Text;     // CPT code
  description: Text;
  procedure_date: Text;
  duration: ?Nat;           // Minutes
  provider: Text;
  assistant: ?Text;
  location: Text;           // Operating room, clinic, etc.
  indication: Text;
  technique: ?Text;
  complications: ?Text;
  outcomes: ?Text;
  follow_up_required: Bool;
  follow_up_date: ?Text;
  anesthesia_type: ?AnesthesiaType;
  status: ProcedureStatus;
};

type AnesthesiaType = {
  #Local;
  #Regional;
  #General;
  #Sedation;
  #None;
};

type ProcedureStatus = {
  #Scheduled;
  #InProgress;
  #Completed;
  #Cancelled;
  #Complicated;
};

// Vaccination records
type VaccinationData = {
  vaccine_name: Text;
  vaccine_code: ?Text;      // CVX code
  manufacturer: Text;
  lot_number: Text;
  expiration_date: Text;
  administration_date: Text;
  dose_number: ?Nat;        // Which dose in series
  route: Route;
  site: Text;               // Injection site
  administered_by: Text;
  adverse_reactions: ?Text;
  next_dose_due: ?Text;
  vaccine_series: ?Text;    // Series name if part of series
};

// Allergy information
type AllergyData = {
  allergen: Text;
  allergy_type: AllergyType;
  severity: Severity;
  reaction: [Text];         // List of reactions
  onset_date: ?Text;
  notes: ?Text;
  verified_by: Text;
  status: AllergyStatus;
};

type AllergyType = {
  #Drug;
  #Food;
  #Environmental;
  #Contact;
  #Other: Text;
};

type AllergyStatus = {
  #Active;
  #Inactive;
  #Resolved;
  #Unverified;
};

// File attachments (images, documents, etc.)
type AttachmentReference = {
  attachment_id: Text;
  file_name: Text;
  file_type: FileType;
  file_size: Nat;           // Bytes
  mime_type: Text;
  upload_date: Int;
  uploaded_by: Text;
  description: ?Text;
  is_encrypted: Bool;
  storage_location: Text;   // Reference to storage system
  checksum: Text;           // File integrity check
};

type FileType = {
  #Image;                   // X-rays, photos, etc.
  #Document;                // PDFs, Word docs, etc.
  #DICOM;                   // Medical imaging
  #Audio;                   // Voice recordings
  #Video;                   // Procedures, etc.
  #Other: Text;
};

// Additional data types for discharge, referral, insurance, billing
type DischargeData = {
  discharge_date: Text;
  discharge_disposition: Text;
  discharge_diagnosis: [DiagnosisCode];
  discharge_medications: [Text];
  follow_up_instructions: Text;
  activity_restrictions: ?Text;
  next_appointment: ?Text;
  discharged_by: Text;
};

type ReferralData = {
  referred_to: Text;        // Provider/facility name
  specialty: Text;
  reason: Text;
  urgency: ReferralUrgency;
  referred_by: Text;
  referral_date: Text;
  appointment_date: ?Text;
  status: ReferralStatus;
};

type ReferralUrgency = {
  #Routine;
  #Urgent;
  #STAT;
};

type ReferralStatus = {
  #Pending;
  #Scheduled;
  #Completed;
  #Cancelled;
};

type InsuranceData = {
  action: InsuranceAction;
  insurance_info: InsuranceInfo;
  effective_date: Text;
  notes: ?Text;
};

type InsuranceAction = {
  #Add;
  #Update;
  #Remove;
  #Verify;
};

type BillingData = {
  billing_date: Text;
  charges: [BillingCharge];
  insurance_claims: [InsuranceClaim];
  payment_info: ?PaymentInfo;
  total_amount: Float;
  patient_responsibility: Float;
  status: BillingStatus;
};

type BillingCharge = {
  procedure_code: Text;     // CPT code
  description: Text;
  quantity: Nat;
  unit_price: Float;
  total_charge: Float;
  modifier: ?Text;
};

type InsuranceClaim = {
  claim_id: Text;
  insurance_id: Text;
  submitted_date: Text;
  status: ClaimStatus;
  amount_billed: Float;
  amount_paid: Float;
  denial_reason: ?Text;
};

type ClaimStatus = {
  #Pending;
  #Approved;
  #Denied;
  #PartiallyPaid;
  #Resubmitted;
};

type PaymentInfo = {
  payment_method: PaymentMethod;
  amount: Float;
  payment_date: Text;
  reference_number: ?Text;
};

type PaymentMethod = {
  #Cash;
  #Check;
  #CreditCard;
  #Insurance;
  #Other: Text;
};

type BillingStatus = {
  #Draft;
  #Sent;
  #Paid;
  #PartiallyPaid;
  #Overdue;
  #Cancelled;
}