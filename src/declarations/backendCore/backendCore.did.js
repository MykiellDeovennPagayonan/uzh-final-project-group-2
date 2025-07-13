export const idlFactory = ({ IDL }) => {
  const Result_1 = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const BatchStatus = IDL.Variant({
    'Failed' : IDL.Null,
    'Submitted' : IDL.Null,
    'Created' : IDL.Null,
    'Verified' : IDL.Null,
  });
  const Time = IDL.Int;
  const BatchRecord = IDL.Record({
    'event_ids' : IDL.Vec(IDL.Text),
    'status' : BatchStatus,
    'batch_hash' : IDL.Text,
    'hedera_tx_id' : IDL.Opt(IDL.Text),
    'batch_id' : IDL.Text,
    'event_count' : IDL.Nat,
    'previous_batch_id' : IDL.Opt(IDL.Text),
    'merkle_root' : IDL.Text,
    'timestamp' : Time,
  });
  const Result_6 = IDL.Variant({ 'ok' : BatchRecord, 'err' : IDL.Text });
  const EventAction = IDL.Variant({
    'Delete' : IDL.Null,
    'Create' : IDL.Null,
    'Update' : IDL.Null,
    'Append' : IDL.Null,
  });
  const FileAttachment = IDL.Record({
    'encrypted_data' : IDL.Vec(IDL.Nat8),
    'file_name' : IDL.Text,
    'file_size' : IDL.Nat,
    'file_type' : IDL.Text,
    'upload_date' : Time,
    'file_id' : IDL.Text,
  });
  const EventStatus = IDL.Variant({
    'Failed' : IDL.Null,
    'Batched' : IDL.Null,
    'Verified' : IDL.Null,
    'Pending' : IDL.Null,
  });
  const MedicalEvent = IDL.Record({
    'id' : IDL.Text,
    'status' : EventStatus,
    'created_by_id' : IDL.Text,
    'action' : EventAction,
    'reference_event_id' : IDL.Opt(IDL.Text),
    'data' : IDL.Text,
    'batch_id' : IDL.Opt(IDL.Text),
    'timestamp' : Time,
    'record_id' : IDL.Text,
    'event_hash' : IDL.Text,
    'attachments' : IDL.Vec(FileAttachment),
    'event_type' : IDL.Text,
  });
  const Result_5 = IDL.Variant({ 'ok' : MedicalEvent, 'err' : IDL.Text });
  const MedicalRecord = IDL.Record({
    'patient_id' : IDL.Text,
    'current_snapshot_hash' : IDL.Text,
    'last_updated' : Time,
    'created_at' : Time,
    'clinic_id' : IDL.Text,
    'is_active' : IDL.Bool,
    'record_id' : IDL.Text,
  });
  const Result_4 = IDL.Variant({ 'ok' : MedicalRecord, 'err' : IDL.Text });
  const UserMedicalRecord = IDL.Record({
    'user_id' : IDL.Text,
    'assigned_date' : Time,
    'is_active' : IDL.Bool,
    'record_id' : IDL.Text,
  });
  const UserRole = IDL.Variant({
    'Nurse' : IDL.Null,
    'Doctor' : IDL.Null,
    'HIMSP' : IDL.Null,
    'Patient' : IDL.Null,
  });
  const User = IDL.Record({
    'password_hash' : IDL.Text,
    'encrypted_data' : IDL.Opt(IDL.Text),
    'public_key' : IDL.Text,
    'name' : IDL.Text,
    'role' : UserRole,
    'created_at' : Time,
    'user_id' : IDL.Text,
    'email' : IDL.Text,
    'clinic_id' : IDL.Text,
    'is_active' : IDL.Bool,
  });
  const LoginCredentials = IDL.Record({
    'password' : IDL.Text,
    'email' : IDL.Text,
  });
  const Result_3 = IDL.Variant({
    'ok' : IDL.Record({ 'user' : User, 'sessionToken' : IDL.Text }),
    'err' : IDL.Text,
  });
  const Result_2 = IDL.Variant({ 'ok' : User, 'err' : IDL.Text });
  const Result = IDL.Variant({ 'ok' : IDL.Bool, 'err' : IDL.Text });
  return IDL.Service({
    'activateMedicalRecord' : IDL.Func([IDL.Text], [Result_1], []),
    'activateUser' : IDL.Func([IDL.Text], [Result_1], []),
    'assignStaffToMedicalRecord' : IDL.Func(
        [IDL.Text, IDL.Text],
        [Result_1],
        [],
      ),
    'assignUserToMedicalRecord' : IDL.Func(
        [IDL.Text, IDL.Text],
        [Result_1],
        [],
      ),
    'bulkAssignUserToRecords' : IDL.Func(
        [IDL.Text, IDL.Vec(IDL.Text)],
        [Result_1],
        [],
      ),
    'createBatchRecord' : IDL.Func(
        [IDL.Vec(IDL.Text), IDL.Text, IDL.Opt(IDL.Text)],
        [Result_6],
        [],
      ),
    'createBatchRecordFromPendingEvents' : IDL.Func([IDL.Nat], [Result_6], []),
    'createMedicalEvent' : IDL.Func(
        [
          IDL.Text,
          IDL.Text,
          IDL.Text,
          EventAction,
          IDL.Text,
          IDL.Vec(FileAttachment),
          IDL.Text,
        ],
        [Result_5],
        [],
      ),
    'createMedicalRecord' : IDL.Func([IDL.Text, IDL.Text], [Result_4], []),
    'deactivateAllUserAssignments' : IDL.Func([IDL.Text], [Result_1], []),
    'deactivateMedicalRecord' : IDL.Func([IDL.Text], [Result_1], []),
    'deactivateUser' : IDL.Func([IDL.Text], [Result_1], []),
    'getActiveUserMedicalRecordAssignments' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(UserMedicalRecord)],
        [],
      ),
    'getBatchChain' : IDL.Func([IDL.Text], [IDL.Vec(BatchRecord)], []),
    'getBatchRecordById' : IDL.Func([IDL.Text], [IDL.Opt(BatchRecord)], []),
    'getBatchRecordsByStatus' : IDL.Func(
        [BatchStatus],
        [IDL.Vec(BatchRecord)],
        [],
      ),
    'getLatestBatchRecord' : IDL.Func([], [IDL.Opt(BatchRecord)], []),
    'getMedicalEventById' : IDL.Func([IDL.Text], [IDL.Opt(MedicalEvent)], []),
    'getMedicalEventsByBatchId' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(MedicalEvent)],
        [],
      ),
    'getMedicalEventsByCreatedBy' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(MedicalEvent)],
        [],
      ),
    'getMedicalEventsByRecordId' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(MedicalEvent)],
        [],
      ),
    'getMedicalEventsByStatus' : IDL.Func(
        [EventStatus],
        [IDL.Vec(MedicalEvent)],
        [],
      ),
    'getMedicalRecordById' : IDL.Func([IDL.Text], [IDL.Opt(MedicalRecord)], []),
    'getMedicalRecordsByClinicId' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(MedicalRecord)],
        [],
      ),
    'getMedicalRecordsByPatientId' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(MedicalRecord)],
        [],
      ),
    'getMedicalRecordsByStaff' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(MedicalRecord)],
        [],
      ),
    'getMedicalRecordsByUser' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(MedicalRecord)],
        [],
      ),
    'getPasswordHash' : IDL.Func(
        [IDL.Text],
        [IDL.Opt(IDL.Record({ 'password' : IDL.Text, 'salt' : IDL.Text }))],
        [],
      ),
    'getPatientsByStaff' : IDL.Func([IDL.Text], [IDL.Vec(User)], []),
    'getPendingMedicalEvents' : IDL.Func([], [IDL.Vec(MedicalEvent)], []),
    'getStaffByMedicalRecord' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(UserMedicalRecord)],
        [],
      ),
    'getStaffByPatient' : IDL.Func([IDL.Text], [IDL.Vec(User)], []),
    'getUserByEmail' : IDL.Func([IDL.Text], [IDL.Opt(User)], []),
    'getUserById' : IDL.Func([IDL.Text], [IDL.Opt(User)], []),
    'getUserMedicalRecordAccess' : IDL.Func(
        [IDL.Text, IDL.Text],
        [IDL.Opt(UserMedicalRecord)],
        [],
      ),
    'getUsersByClinic' : IDL.Func([IDL.Text], [IDL.Vec(User)], []),
    'getUsersByMedicalRecord' : IDL.Func([IDL.Text], [IDL.Vec(User)], []),
    'getUsersByRole' : IDL.Func([UserRole], [IDL.Vec(User)], []),
    'hasUserAccessToMedicalRecord' : IDL.Func(
        [IDL.Text, IDL.Text],
        [IDL.Bool],
        [],
      ),
    'loginUser' : IDL.Func([LoginCredentials], [Result_3], []),
    'logoutUser' : IDL.Func([IDL.Text], [Result_1], []),
    'registerUser' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, UserRole, IDL.Text],
        [Result_2],
        [],
      ),
    'removeStaffFromMedicalRecord' : IDL.Func(
        [IDL.Text, IDL.Text],
        [Result_1],
        [],
      ),
    'removeUserFromMedicalRecord' : IDL.Func(
        [IDL.Text, IDL.Text],
        [Result_1],
        [],
      ),
    'transferRecordAssignment' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text],
        [Result_1],
        [],
      ),
    'updateBatchRecordHederaTxId' : IDL.Func(
        [IDL.Text, IDL.Text],
        [Result_1],
        [],
      ),
    'updateBatchRecordStatus' : IDL.Func(
        [IDL.Text, BatchStatus],
        [Result_1],
        [],
      ),
    'updateMedicalEventBatch' : IDL.Func([IDL.Text, IDL.Text], [Result_1], []),
    'updateMedicalEventStatus' : IDL.Func(
        [IDL.Text, EventStatus],
        [Result_1],
        [],
      ),
    'updatePublicKey' : IDL.Func([IDL.Text, IDL.Text], [Result_1], []),
    'validateSession' : IDL.Func([IDL.Text], [IDL.Opt(User)], []),
    'verifyBatchRecord' : IDL.Func([IDL.Text], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
