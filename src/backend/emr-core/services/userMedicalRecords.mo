import UserMedicalRecords "../models/userMedicalRecords";
import MedicalRecords "../models/medicalRecords";
import Users "../models/users";
import Types "../types";
import Result "mo:base/Result";
import Time "mo:base/Time";
import Buffer "mo:base/Buffer";

module UserMedicalRecordService {
  public func init(userRecordStore : UserMedicalRecords.Use, recordStore : MedicalRecords.Use, userStore : Users.Use) : {
    assignUserToRecord : (Text, Text) -> async Result.Result<(), Text>;
    removeUserFromRecord : (Text, Text) -> async Result.Result<(), Text>;
    getUsersByRecord : (Text) -> async [Types.User];
    getRecordsByUser : (Text) -> async [Types.MedicalRecord];
    getActiveAssignments : (Text) -> async [Types.UserMedicalRecord];
    getUserRecordAccess : (Text, Text) -> async ?Types.UserMedicalRecord;
    hasUserAccessToRecord : (Text, Text) -> async Bool;
    getStaffByPatient : (Text) -> async [Types.User];
    getPatientsByStaff : (Text) -> async [Types.User];
    transferRecordAssignment : (Text, Text, Text) -> async Result.Result<(), Text>;
    bulkAssignUserToRecords : (Text, [Text]) -> async Result.Result<(), Text>;
    deactivateAllUserAssignments : (Text) -> async Result.Result<(), Text>;
  } {
    return {
      assignUserToRecord = func(user_id : Text, record_id : Text) : async Result.Result<(), Text> {
        await assignUserToRecordImpl(user_id, record_id, userRecordStore, recordStore, userStore);
      };
      removeUserFromRecord = func(user_id : Text, record_id : Text) : async Result.Result<(), Text> {
        await removeUserFromRecordImpl(user_id, record_id, userRecordStore);
      };
      getUsersByRecord = func(record_id : Text) : async [Types.User] {
        await getUsersByRecordImpl(record_id, userRecordStore, userStore);
      };
      getRecordsByUser = func(user_id : Text) : async [Types.MedicalRecord] {
        await getRecordsByUserImpl(user_id, userRecordStore, recordStore);
      };
      getActiveAssignments = func(user_id : Text) : async [Types.UserMedicalRecord] {
        await getActiveAssignmentsImpl(user_id, userRecordStore);
      };
      getUserRecordAccess = func(user_id : Text, record_id : Text) : async ?Types.UserMedicalRecord {
        let key = user_id # "#" # record_id;
        userRecordStore.pk.get(key);
      };
      hasUserAccessToRecord = func(user_id : Text, record_id : Text) : async Bool {
        await hasUserAccessToRecordImpl(user_id, record_id, userRecordStore);
      };
      getStaffByPatient = func(patient_id : Text) : async [Types.User] {
        await getStaffByPatientImpl(patient_id, recordStore, userRecordStore, userStore);
      };
      getPatientsByStaff = func(staff_id : Text) : async [Types.User] {
        await getPatientsByStaffImpl(staff_id, userRecordStore, recordStore, userStore);
      };
      transferRecordAssignment = func(from_user_id : Text, to_user_id : Text, record_id : Text) : async Result.Result<(), Text> {
        await transferRecordAssignmentImpl(from_user_id, to_user_id, record_id, userRecordStore, userStore);
      };
      bulkAssignUserToRecords = func(user_id : Text, record_ids : [Text]) : async Result.Result<(), Text> {
        await bulkAssignUserToRecordsImpl(user_id, record_ids, userRecordStore, recordStore, userStore);
      };
      deactivateAllUserAssignments = func(user_id : Text) : async Result.Result<(), Text> {
        await deactivateAllUserAssignmentsImpl(user_id, userRecordStore);
      };
    };
  };

  private func assignUserToRecordImpl(user_id : Text, record_id : Text, userRecordStore : UserMedicalRecords.Use, recordStore : MedicalRecords.Use, userStore : Users.Use) : async Result.Result<(), Text> {
    // Verify user exists and is active
    switch (userStore.pk.get(user_id)) {
      case null { return #err("User not found") };
      case (?user) {
        if (not user.is_active) {
          return #err("User is not active");
        };
        // Only allow staff roles to be assigned
        switch (user.role) {
          case (#Patient) { return #err("Cannot assign patient role to medical records") };
          case (#Doctor or #Nurse or #HIMSP) { /* allowed */ };
        };
      };
    };

    // Verify record exists and is active
    switch (recordStore.pk.get(record_id)) {
      case null { return #err("Medical record not found") };
      case (?record) {
        if (not record.is_active) {
          return #err("Medical record is not active");
        };
      };
    };

    // Check if assignment already exists
    let key = user_id # "#" # record_id;
    let existing = userRecordStore.pk.get(key);
    switch (existing) {
      case (?assignment) {
        if (assignment.is_active) {
          return #err("User is already assigned to this record");
        };
      };
      case null { /* no existing assignment */ };
    };

    let assignment : Types.UserMedicalRecord = {
      user_id = user_id;
      record_id = record_id;
      assigned_date = Time.now();
      is_active = true;
    };

    userRecordStore.db.insert(assignment);
    #ok;
  };

  private func removeUserFromRecordImpl(user_id : Text, record_id : Text, userRecordStore : UserMedicalRecords.Use) : async Result.Result<(), Text> {
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

  private func getUsersByRecordImpl(record_id : Text, userRecordStore : UserMedicalRecords.Use, userStore : Users.Use) : async [Types.User] {
    let startKey = record_id # "_";
    let endKey = record_id # "_~";
    let assignments = userRecordStore.record.find(startKey, endKey, #fwd, 100);
    let buffer = Buffer.Buffer<Types.User>(assignments.size());

    for (assignment in assignments.vals()) {
      if (assignment.is_active) {
        switch (userStore.pk.get(assignment.user_id)) {
          case (?user) {
            if (user.is_active) {
              buffer.add(user);
            };
          };
          case null { /* user not found */ };
        };
      };
    };

    Buffer.toArray(buffer);
  };

  private func getRecordsByUserImpl(user_id : Text, userRecordStore : UserMedicalRecords.Use, recordStore : MedicalRecords.Use) : async [Types.MedicalRecord] {
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
          case null { /* record not found */ };
        };
      };
    };

    Buffer.toArray(buffer);
  };

  private func getActiveAssignmentsImpl(user_id : Text, userRecordStore : UserMedicalRecords.Use) : async [Types.UserMedicalRecord] {
    let startKey = user_id # "_";
    let endKey = user_id # "_~";
    let assignments = userRecordStore.user.find(startKey, endKey, #fwd, 100);
    let buffer = Buffer.Buffer<Types.UserMedicalRecord>(assignments.size());

    for (assignment in assignments.vals()) {
      if (assignment.is_active) {
        buffer.add(assignment);
      };
    };

    Buffer.toArray(buffer);
  };

  private func hasUserAccessToRecordImpl(user_id : Text, record_id : Text, userRecordStore : UserMedicalRecords.Use) : async Bool {
    let key = user_id # "#" # record_id;
    switch (userRecordStore.pk.get(key)) {
      case (?assignment) { assignment.is_active };
      case null { false };
    };
  };

  private func getStaffByPatientImpl(patient_id : Text, recordStore : MedicalRecords.Use, userRecordStore : UserMedicalRecords.Use, userStore : Users.Use) : async [Types.User] {
    // Get all records for this patient
    let startKey = patient_id # "_";
    let endKey = patient_id # "_~";
    let records = recordStore.patient.find(startKey, endKey, #fwd, 100);
    let buffer = Buffer.Buffer<Types.User>(10);

    for (record in records.vals()) {
      if (record.is_active) {
        let staff = await getUsersByRecordImpl(record.record_id, userRecordStore, userStore);
        for (user in staff.vals()) {
          buffer.add(user);
        };
      };
    };

    Buffer.toArray(buffer);
  };

  private func getPatientsByStaffImpl(staff_id : Text, userRecordStore : UserMedicalRecords.Use, recordStore : MedicalRecords.Use, userStore : Users.Use) : async [Types.User] {
    let records = await getRecordsByUserImpl(staff_id, userRecordStore, recordStore);
    let buffer = Buffer.Buffer<Types.User>(records.size());

    for (record in records.vals()) {
      switch (userStore.pk.get(record.patient_id)) {
        case (?patient) {
          if (patient.is_active) {
            buffer.add(patient);
          };
        };
        case null { /* patient not found */ };
      };
    };

    Buffer.toArray(buffer);
  };

  private func transferRecordAssignmentImpl(from_user_id : Text, to_user_id : Text, record_id : Text, userRecordStore : UserMedicalRecords.Use, userStore : Users.Use) : async Result.Result<(), Text> {
    // Verify both users exist
    switch (userStore.pk.get(from_user_id)) {
      case null { return #err("Source user not found") };
      case (?_) { /* user exists */ };
    };

    switch (userStore.pk.get(to_user_id)) {
      case null { return #err("Target user not found") };
      case (?user) {
        if (not user.is_active) {
          return #err("Target user is not active");
        };
      };
    };

    // Get existing assignment
    let fromKey = from_user_id # "#" # record_id;
    let existing = userRecordStore.pk.get(fromKey);
    switch (existing) {
      case null { return #err("Source assignment not found") };
      case (?assignment) {
        if (not assignment.is_active) {
          return #err("Source assignment is not active");
        };

        // Deactivate old assignment
        let deactivatedAssignment : Types.UserMedicalRecord = {
          user_id = assignment.user_id;
          record_id = assignment.record_id;
          assigned_date = assignment.assigned_date;
          is_active = false;
        };
        userRecordStore.db.insert(deactivatedAssignment);

        // Create new assignment
        let newAssignment : Types.UserMedicalRecord = {
          user_id = to_user_id;
          record_id = record_id;
          assigned_date = Time.now();
          is_active = true;
        };
        userRecordStore.db.insert(newAssignment);

        #ok;
      };
    };
  };

  private func bulkAssignUserToRecordsImpl(user_id : Text, record_ids : [Text], userRecordStore : UserMedicalRecords.Use, recordStore : MedicalRecords.Use, userStore : Users.Use) : async Result.Result<(), Text> {
    // Verify user exists
    switch (userStore.pk.get(user_id)) {
      case null { return #err("User not found") };
      case (?user) {
        if (not user.is_active) {
          return #err("User is not active");
        };
      };
    };

    // Assign to each record
    for (record_id in record_ids.vals()) {
      let result = await assignUserToRecordImpl(user_id, record_id, userRecordStore, recordStore, userStore);
      switch (result) {
        case (#err(msg)) { return #err("Failed to assign record " # record_id # ": " # msg) };
        case (#ok) { /* continue */ };
      };
    };

    #ok;
  };

  private func deactivateAllUserAssignmentsImpl(user_id : Text, userRecordStore : UserMedicalRecords.Use) : async Result.Result<(), Text> {
    let startKey = user_id # "_";
    let endKey = user_id # "_~";
    let assignments = userRecordStore.user.find(startKey, endKey, #fwd, 100);

    for (assignment in assignments.vals()) {
      if (assignment.is_active) {
        let deactivatedAssignment : Types.UserMedicalRecord = {
          user_id = assignment.user_id;
          record_id = assignment.record_id;
          assigned_date = assignment.assigned_date;
          is_active = false;
        };
        userRecordStore.db.insert(deactivatedAssignment);
      };
    };

    #ok;
  };
}