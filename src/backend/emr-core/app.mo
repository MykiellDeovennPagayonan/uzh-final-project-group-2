import Types "types";
import Users "models/users";
import Sessions "models/sessions";
import MedicalRecords "models/medicalRecords";
import MedicalEvents "models/medicalEvents";
import BatchRecords "models/batchRecords";
import UserMedicalRecords "models/userMedicalRecords";

import AuthService "services/authService";
import BatchRecordService "services/batchRecordService";
import MedicalEventService "services/medicalEventService";
import MedicalRecordService "services/medicalRecordService";
import UserMedicalRecordService "services/userMedicalRecordService";
import UserService "services/userService";
import HederaCanisterService "services/hederaCanisterService";

import Result "mo:base/Result";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Error "mo:base/Error";

actor {
  // Stable Storage Initialization
  stable let user_store = Users.init();
  stable let session_store = Sessions.init();
  stable let medical_record_store = MedicalRecords.init();
  stable let medical_event_store = MedicalEvents.init();
  stable let batch_record_store = BatchRecords.init();
  stable let user_medical_record_store = UserMedicalRecords.init();

  // Store Usage Initialization
  let user = Users.use(user_store);
  let session = Sessions.use(session_store);
  let medicalRecord = MedicalRecords.use(medical_record_store);
  let medicalEvent = MedicalEvents.use(medical_event_store);
  let batchRecord = BatchRecords.use(batch_record_store);
  let userMedicalRecord = UserMedicalRecords.use(user_medical_record_store);

  // Service Initialization
  let authService = AuthService.init(user, session);
  let batchRecordService = BatchRecordService.init(batchRecord, medicalEvent);
  let medicalEventService = MedicalEventService.init(medicalEvent, medicalRecord);
  let medicalRecordService = MedicalRecordService.init(medicalRecord, userMedicalRecord);
  let userMedicalRecordService = UserMedicalRecordService.init(userMedicalRecord, medicalRecord, user);
  let userService = UserService.init(user);
  let hederaCanisterService = HederaCanisterService.init("bkyz2-fmaaa-aaaaa-qaaaq-cai");

  // Authentication endpoints
  public shared func getPasswordHash(email : Text) : async ?{
    password : Text;
    salt : Text;
  } {
    await authService.getPasswordHash(email);
  };

  public shared func registerUser(email : Text, password : Text, name : Text, role : Types.UserRole, clinic_id : Text) : async Result.Result<Types.User, Text> {
    await authService.register(email, password, name, role, clinic_id);
  };

  public shared func loginUser(credentials : Types.LoginCredentials) : async Result.Result<{ user : Types.User; sessionToken : Text }, Text> {
    await authService.login(credentials);
  };

  public shared func validateSession(token : Text) : async ?Types.User {
    await authService.validateSession(token);
  };

  public shared func logoutUser(token : Text) : async Result.Result<(), Text> {
    await authService.logout(token);
  };

  // User management endpoints
  public shared func getUserById(id : Text) : async ?Types.User {
    await userService.getById(id);
  };

  public shared func getUserByEmail(email : Text) : async ?Types.User {
    await userService.getByEmail(email);
  };

  public shared func getUsersByClinic(clinic_id : Text) : async [Types.User] {
    await userService.getUsersByClinic(clinic_id);
  };

  public shared func getUsersByRole(role : Types.UserRole) : async [Types.User] {
    await userService.getUsersByRole(role);
  };

  public shared func deactivateUser(id : Text) : async Result.Result<(), Text> {
    await userService.deactivateUser(id);
  };

  public shared func activateUser(id : Text) : async Result.Result<(), Text> {
    await userService.activateUser(id);
  };

  public shared func updatePublicKey(id : Text, publicKey : Text) : async Result.Result<(), Text> {
    await userService.updatePublicKey(id, publicKey);
  };

  // Medical record endpoints
  public shared func createMedicalRecord(patient_id : Text, clinic_id : Text) : async Result.Result<Types.MedicalRecord, Text> {
    await medicalRecordService.create(patient_id, clinic_id);
  };

  public shared func getAllMedicalRecords() : async [Types.MedicalRecord] {
    await medicalRecordService.getAll();
  };

  public shared func getMedicalRecordById(id : Text) : async ?Types.MedicalRecord {
    await medicalRecordService.getById(id);
  };

  public shared func getMedicalRecordsByPatientId(patient_id : Text) : async [Types.MedicalRecord] {
    await medicalRecordService.getByPatientId(patient_id);
  };

  public shared func getMedicalRecordsByClinicId(clinic_id : Text) : async [Types.MedicalRecord] {
    await medicalRecordService.getByClinicId(clinic_id);
  };

  public shared func assignStaffToMedicalRecord(user_id : Text, record_id : Text) : async Result.Result<(), Text> {
    await medicalRecordService.assignStaffToRecord(user_id, record_id);
  };

  public shared func removeStaffFromMedicalRecord(user_id : Text, record_id : Text) : async Result.Result<(), Text> {
    await medicalRecordService.removeStaffFromRecord(user_id, record_id);
  };

  public shared func getMedicalRecordsByStaff(user_id : Text) : async [Types.MedicalRecord] {
    await medicalRecordService.getRecordsByStaff(user_id);
  };

  public shared func getStaffByMedicalRecord(record_id : Text) : async [Types.UserMedicalRecord] {
    await medicalRecordService.getStaffByRecord(record_id);
  };

  public shared func deactivateMedicalRecord(id : Text) : async Result.Result<(), Text> {
    await medicalRecordService.deactivateRecord(id);
  };

  public shared func activateMedicalRecord(id : Text) : async Result.Result<(), Text> {
    await medicalRecordService.activateRecord(id);
  };

  // Medical event endpoints
  public shared func createMedicalEvent(record_id : Text, event_type : Text, data : Text, action : Types.EventAction, reference_event_id : Text, attachments : [Types.NewFileAttachment], created_by_id : Text) : async Result.Result<Types.MedicalEvent, Text> {
    await medicalEventService.create(record_id, event_type, data, action, reference_event_id, attachments, created_by_id);
  };

  public shared func getMedicalEventById(id : Text) : async ?Types.MedicalEvent {
    await medicalEventService.getById(id);
  };

  public shared func getMedicalEventsByRecordId(record_id : Text) : async [Types.MedicalEvent] {
    await medicalEventService.getByRecordId(record_id);
  };

  public shared func getMedicalEventsByBatchId(batch_id : Text) : async [Types.MedicalEvent] {
    await medicalEventService.getByBatchId(batch_id);
  };

  public shared func getMedicalEventsByCreatedBy(created_by_id : Text) : async [Types.MedicalEvent] {
    await medicalEventService.getByCreatedBy(created_by_id);
  };

  public shared func getMedicalEventsByStatus(status : Types.EventStatus) : async [Types.MedicalEvent] {
    await medicalEventService.getEventsByStatus(status);
  };

  public shared func updateMedicalEventStatus(id : Text, status : Types.EventStatus) : async Result.Result<(), Text> {
    await medicalEventService.updateEventStatus(id, status);
  };

  public shared func updateMedicalEventBatch(id : Text, batch_id : Text) : async Result.Result<(), Text> {
    await medicalEventService.updateEventBatch(id, batch_id);
  };

  // Batch record endpoints
  public shared func createBatchRecord(event_ids : [Text], merkle_root : Text, previous_batch_id : ?Text) : async Result.Result<Types.BatchRecord, Text> {
    await batchRecordService.create(event_ids, merkle_root, previous_batch_id);
  };

  public shared func getBatchRecordById(id : Text) : async ?Types.BatchRecord {
    await batchRecordService.getById(id);
  };

  public shared func getBatchRecordsByStatus(status : Types.BatchStatus) : async [Types.BatchRecord] {
    await batchRecordService.getBatchesByStatus(status);
  };

  public shared func getBatchChain(batch_id : Text) : async [Types.BatchRecord] {
    await batchRecordService.getBatchChain(batch_id);
  };

  public shared func updateBatchRecordStatus(id : Text, status : Types.BatchStatus) : async Result.Result<(), Text> {
    await batchRecordService.updateBatchStatus(id, status);
  };

  public shared func updateBatchRecordHederaTxId(id : Text, tx_id : Text) : async Result.Result<(), Text> {
    await batchRecordService.updateHederaTxId(id, tx_id);
  };

  public shared func verifyBatchRecord(id : Text) : async Result.Result<Bool, Text> {
    await batchRecordService.verifyBatch(id);
  };

  public shared func getLatestBatchRecord() : async ?Types.BatchRecord {
    await batchRecordService.getLatestBatch();
  };

  public shared func getPendingMedicalEvents() : async [Types.MedicalEvent] {
    await batchRecordService.getPendingEvents();
  };

  public shared func createBatchRecordFromPendingEvents(maxEvents : Nat) : async Result.Result<Types.BatchRecord, Text> {
    await batchRecordService.createBatchFromPendingEvents(maxEvents);
  };

  // User medical record endpoints
  public shared func assignUserToMedicalRecord(user_id : Text, record_id : Text) : async Result.Result<(), Text> {
    await userMedicalRecordService.assignUserToRecord(user_id, record_id);
  };

  public shared func removeUserFromMedicalRecord(user_id : Text, record_id : Text) : async Result.Result<(), Text> {
    await userMedicalRecordService.removeUserFromRecord(user_id, record_id);
  };

  public shared func getUsersByMedicalRecord(record_id : Text) : async [Types.User] {
    await userMedicalRecordService.getUsersByRecord(record_id);
  };

  public shared func getMedicalRecordsByUser(user_id : Text) : async [Types.MedicalRecord] {
    await userMedicalRecordService.getRecordsByUser(user_id);
  };

  public shared func getActiveUserMedicalRecordAssignments(user_id : Text) : async [Types.UserMedicalRecord] {
    await userMedicalRecordService.getActiveAssignments(user_id);
  };

  public shared func getUserMedicalRecordAccess(user_id : Text, record_id : Text) : async ?Types.UserMedicalRecord {
    await userMedicalRecordService.getUserRecordAccess(user_id, record_id);
  };

  public shared func hasUserAccessToMedicalRecord(user_id : Text, record_id : Text) : async Bool {
    await userMedicalRecordService.hasUserAccessToRecord(user_id, record_id);
  };

  public shared func getStaffByPatient(patient_id : Text) : async [Types.User] {
    await userMedicalRecordService.getStaffByPatient(patient_id);
  };

  public shared func getPatientsByStaff(staff_id : Text) : async [Types.User] {
    await userMedicalRecordService.getPatientsByStaff(staff_id);
  };

  public shared func transferRecordAssignment(from_user_id : Text, to_user_id : Text, record_id : Text) : async Result.Result<(), Text> {
    await userMedicalRecordService.transferRecordAssignment(from_user_id, to_user_id, record_id);
  };

  public shared func bulkAssignUserToRecords(user_id : Text, record_ids : [Text]) : async Result.Result<(), Text> {
    await userMedicalRecordService.bulkAssignUserToRecords(user_id, record_ids);
  };

  public shared func deactivateAllUserAssignments(user_id : Text) : async Result.Result<(), Text> {
    await userMedicalRecordService.deactivateAllUserAssignments(user_id);
  };

  // New Hedera integration endpoints
  public shared func hederaHealthCheck() : async Result.Result<Text, Text> {
    await hederaCanisterService.healthCheck();
  };

  public shared func hederaCreateTopic() : async Result.Result<Text, Text> {
    await hederaCanisterService.createTopic();
  };

  public shared func sendMessageToHedera(message : Text) : async Result.Result<Text, Text> {
    await hederaCanisterService.sendMessage(message);
  };

  public shared func submitEmrBatchToHedera(eventIds : [Text], merkleRoot : Text) : async Result.Result<Text, Text> {
    try {
      let result = await hederaCanisterService.submitDailyEmrBatch(merkleRoot, eventIds);
      switch (result) {
        case (#ok(response)) { #ok(response) };
        case (#err(error)) { #err("Hedera service error: " # error) };
      };
    } catch (e) {
      #err("Submit EMR batch failed: " # Error.message(e));
    };
  };

  public shared func sendBatchRecordToHedera(batchId : Text) : async Result.Result<Text, Text> {
    switch (await batchRecordService.getById(batchId)) {
      case (null) { #err("Batch record not found") };
      case (?batchRecord) {
        await hederaCanisterService.sendBatchRecord(batchRecord);
      };
    };
  };

  public shared func sendMedicalEventToHedera(eventId : Text) : async Result.Result<Text, Text> {
    switch (await medicalEventService.getById(eventId)) {
      case (null) { #err("Medical event not found") };
      case (?medicalEvent) {
        await hederaCanisterService.sendMedicalEvent(medicalEvent);
      };
    };
  };

  public shared func getHederaMessages() : async Result.Result<Text, Text> {
    await hederaCanisterService.getHederaMessages();
  };

  public shared func getHederaMessagesByBatch(batchId : Text) : async Result.Result<Text, Text> {
    await hederaCanisterService.getMessagesByBatch(batchId);
  };

  public shared func getHederaAllMessages(limit : ?Text) : async Result.Result<Text, Text> {
    await hederaCanisterService.getAllMessages(limit);
  };

  public shared func createBatchRecordAndSendToHedera(event_ids : [Text], merkle_root : Text, previous_batch_id : ?Text) : async Result.Result<Types.BatchRecord, Text> {
    switch (await batchRecordService.create(event_ids, merkle_root, previous_batch_id)) {
      case (#err(error)) { #err(error) };
      case (#ok(batchRecord)) {
        switch (await hederaCanisterService.sendBatchRecord(batchRecord)) {
          case (#err(hederaError)) {
            #ok(batchRecord);
          };
          case (#ok(_)) {
            switch (await batchRecordService.updateBatchStatus(batchRecord.batch_id, #Submitted)) {
              case (#err(_)) { #ok(batchRecord) };
              case (#ok(_)) { #ok(batchRecord) };
            };
          };
        };
      };
    };
  };

  public shared func createMedicalEventAndSendToHedera(record_id : Text, event_type : Text, data : Text, action : Types.EventAction, reference_event_id : Text, attachments : [Types.NewFileAttachment], created_by_id : Text) : async Result.Result<Types.MedicalEvent, Text> {
    switch (await medicalEventService.create(record_id, event_type, data, action, reference_event_id, attachments, created_by_id)) {
      case (#err(error)) { #err(error) };
      case (#ok(medicalEvent)) {
        switch (await hederaCanisterService.sendMedicalEvent(medicalEvent)) {
          case (#err(hederaError)) {
            #ok(medicalEvent);
          };
          case (#ok(_)) {
            switch (await medicalEventService.updateEventStatus(medicalEvent.id, #Verified)) {
              case (#err(_)) { #ok(medicalEvent) };
              case (#ok(_)) { #ok(medicalEvent) };
            };
          };
        };
      };
    };
  };
};
