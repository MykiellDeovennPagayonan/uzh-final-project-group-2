import Time "mo:base/Time";
module {
  // Medical Record - the main patient record container
  public type MedicalRecord = {
    record_id : Text;
    patient_id : Text; // References User with role #Patient
    clinic_id : Text;
    created_at : Time.Time;
    last_updated : Time.Time;
    is_active : Bool;
    current_snapshot_hash : Text; // Hash of current state for integrity
  };

  // Medical Event - individual changes/additions to the record
  public type MedicalEvent = {
    id : Text;
    record_id : Text; // References which MedicalRecord this updates
    timestamp : Time.Time;
    event_type : Text; // "vital_signs", "diagnosis", "prescription", etc.
    action : EventAction;
    data : Text; // JSON string of encrypted medical data
    reference_event_id : ?Text; // For modifications, points to original event
    attachments : [FileAttachment];
    created_by_id : Text; // Staff user_id who made the entry
    event_hash : Text;
    batch_id : ?Text;
    status : EventStatus;
  };

  // User type
  public type User = {
    user_id : Text;
    name : Text;
    email : Text;
    password_hash : Text;
    role : UserRole;
    public_key : Text;
    clinic_id : Text;
    created_at : Time.Time;
    is_active : Bool;
    encrypted_data : ?Text; // Additional info (patient demographics, staff details)
  };

  public type UserMedicalRecord = {
    user_id : Text;
    record_id : Text;
    assigned_date : Time.Time;
    is_active : Bool;
  };

  // Role-based distinction
  public type UserRole = {
    #Patient;
    #Doctor;
    #Nurse;
    #HIMSP;
  };

  // New enum for event actions
  public type EventAction = {
    #Create; // Original data entry
    #Update; // Modification of existing data
    #Delete; // Soft delete (mark as inactive)
    #Append; // Add additional info to existing record
  };

  // Batch Record
  public type BatchRecord = {
    batch_id : Text;
    timestamp : Time.Time;
    event_ids : [Text]; // Up to 100 events
    merkle_root : Text;
    previous_batch_id : ?Text;
    hedera_tx_id : ?Text;
    batch_hash : Text;
    status : BatchStatus;
    event_count : Nat;
  };

  public type EventStatus = {
    #Pending;
    #Batched;
    #Verified;
    #Failed;
  };

  public type BatchStatus = {
    #Created;
    #Submitted;
    #Verified;
    #Failed;
  };

  public type FileAttachment = {
    file_id : Text;
    file_name : Text;
    file_type : Text; // "image", "document", "dicom"
    file_size : Nat;
    encrypted_data : Blob; // reference to storage
    upload_date : Time.Time;
  };

  public type EMRError = {
    #NotFound : Text;
    #Unauthorized;
    #InvalidData : Text;
    #SystemError : Text;
  };

  public type Result<T, E> = {
    #Ok : T;
    #Err : E;
  };


  public type LoginCredentials = {
    email: Text;
    password: Text
  };

    public type AuthResult = {
    #ok : {
      user : User;
      sessionToken : Text;
    };
    #err : Text;
  };

  public type SessionToken = {
    token : Text;
    userId : Text;
    expiresAt : Time.Time;
    createdAt : Time.Time;
  };

};
