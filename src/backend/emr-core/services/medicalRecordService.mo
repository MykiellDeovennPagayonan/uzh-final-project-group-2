import MedicalRecords "../models/medicalRecords";
import UserMedicalRecords "../models/userMedicalRecords";
import Types "../types";
import IdGen "../utils/idGen";
import Result "mo:base/Result";
import Time "mo:base/Time";
import Buffer "mo:base/Buffer";

module MedicalRecordService {
  public func init(recordStore : MedicalRecords.Use, userRecordStore : UserMedicalRecords.Use) : {
    create : (Text, Text) -> async Result.Result<Types.MedicalRecord, Text>;
    getById : (Text) -> async ?Types.MedicalRecord;
    getByPatientId : (Text) -> async [Types.MedicalRecord];
    getByClinicId : (Text) -> async [Types.MedicalRecord];
    assignStaffToRecord : (Text, Text) -> async Result.Result<(), Text>;
    removeStaffFromRecord : (Text, Text) -> async Result.Result<(), Text>;
    getRecordsByStaff : (Text) -> async [Types.MedicalRecord];
    getStaffByRecord : (Text) -> async [Types.UserMedicalRecord];
    deactivateRecord : (Text) -> async Result.Result<(), Text>;
    activateRecord : (Text) -> async Result.Result<(), Text>;
  } {
    return {
      create = func(patient_id : Text, clinic_id : Text) : async Result.Result<Types.MedicalRecord, Text> {
        await createImpl(patient_id, clinic_id, recordStore);
      };
      getById = func(id : Text) : async ?Types.MedicalRecord {
        recordStore.pk.get(id);
      };
      getByPatientId = func(patient_id : Text) : async [Types.MedicalRecord] {
        let startKey = patient_id # "_";
        let endKey = patient_id # "_~";
        recordStore.patient.find(startKey, endKey, #fwd, 100);
      };
      getByClinicId = func(clinic_id : Text) : async [Types.MedicalRecord] {
        let startKey = clinic_id # "_";
        let endKey = clinic_id # "_~";
        recordStore.clinic.find(startKey, endKey, #fwd, 100);
      };
      assignStaffToRecord = func(user_id : Text, record_id : Text) : async Result.Result<(), Text> {
        await assignStaffImpl(user_id, record_id, userRecordStore);
      };
      removeStaffFromRecord = func(user_id : Text, record_id : Text) : async Result.Result<(), Text> {
        await removeStaffImpl(user_id, record_id, userRecordStore);
      };
      getRecordsByStaff = func(user_id : Text) : async [Types.MedicalRecord] {
        await getRecordsByStaffImpl(user_id, userRecordStore, recordStore);
      };
      getStaffByRecord = func(record_id : Text) : async [Types.UserMedicalRecord] {
        let startKey = record_id # "_";
        let endKey = record_id # "_~";
        userRecordStore.record.find(startKey, endKey, #fwd, 100);
      };
      deactivateRecord = func(id : Text) : async Result.Result<(), Text> {
        await toggleRecordStatus(id, false, recordStore);
      };
      activateRecord = func(id : Text) : async Result.Result<(), Text> {
        await toggleRecordStatus(id, true, recordStore);
      };
    };
  };

  private func createImpl(patient_id : Text, clinic_id : Text, recordStore : MedicalRecords.Use) : async Result.Result<Types.MedicalRecord, Text> {
    let recordId = await IdGen.generateRecordId(recordStore);
    let record : Types.MedicalRecord = {
      record_id = recordId;
      patient_id = patient_id;
      clinic_id = clinic_id;
      created_at = Time.now();
      last_updated = Time.now();
      is_active = true;
      current_snapshot_hash = ""; // Will be set when first event is added
    };

    recordStore.db.insert(record);
    #ok(record);
  };

  private func assignStaffImpl(user_id : Text, record_id : Text, userRecordStore : UserMedicalRecords.Use) : async Result.Result<(), Text> {
    let assignment : Types.UserMedicalRecord = {
      user_id = user_id;
      record_id = record_id;
      assigned_date = Time.now();
      is_active = true;
    };

    userRecordStore.db.insert(assignment);
    #ok;
  };

  private func removeStaffImpl(user_id : Text, record_id : Text, userRecordStore : UserMedicalRecords.Use) : async Result.Result<(), Text> {
    let key = user_id # "#" # record_id;
    let existing = userRecordStore.pk.get(key);
    switch (existing) {
      case (?assignment) {
        let updatedAssignment : Types.UserMedicalRecord = {
          user_id = assignment.user_id;
          record_id = assignment.record_id;
          assigned_date = assignment.assigned_date;
          is_active = false;
        };
        userRecordStore.db.insert(updatedAssignment);
        #ok;
      };
      case null { #err("Assignment not found") };
    };
  };

  private func getRecordsByStaffImpl(user_id : Text, userRecordStore : UserMedicalRecords.Use, recordStore : MedicalRecords.Use) : async [Types.MedicalRecord] {
    let startKey = user_id # "_";
    let endKey = user_id # "_~";
    let assignments = userRecordStore.user.find(startKey, endKey, #fwd, 100);
    let buffer = Buffer.Buffer<Types.MedicalRecord>(assignments.size());

    for (assignment in assignments.vals()) {
      if (assignment.is_active) {
        switch (recordStore.pk.get(assignment.record_id)) {
          case (?record) {
            if (record.is_active) {
              buffer.add(record);
            };
          };
          case null { /* do nothing */ };
        };
      };
    };

    Buffer.toArray(buffer);
  };

  private func toggleRecordStatus(id : Text, isActive : Bool, recordStore : MedicalRecords.Use) : async Result.Result<(), Text> {
    let existing = recordStore.pk.get(id);
    switch (existing) {
      case (?record) {
        let updatedRecord : Types.MedicalRecord = {
          record_id = record.record_id;
          patient_id = record.patient_id;
          clinic_id = record.clinic_id;
          created_at = record.created_at;
          last_updated = Time.now();
          is_active = isActive;
          current_snapshot_hash = record.current_snapshot_hash;
        };
        recordStore.db.insert(updatedRecord);
        #ok;
      };
      case null { #err("Record not found") };
    };
  };
}