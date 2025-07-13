import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface BatchRecord {
  'event_ids' : Array<string>,
  'status' : BatchStatus,
  'batch_hash' : string,
  'hedera_tx_id' : [] | [string],
  'batch_id' : string,
  'event_count' : bigint,
  'previous_batch_id' : [] | [string],
  'merkle_root' : string,
  'timestamp' : bigint,
}
export type BatchStatus = { 'Failed' : null } |
  { 'Submitted' : null } |
  { 'Created' : null } |
  { 'Verified' : null };
export type EventAction = { 'Delete' : null } |
  { 'Create' : null } |
  { 'Update' : null } |
  { 'Append' : null };
export type EventStatus = { 'Failed' : null } |
  { 'Batched' : null } |
  { 'Verified' : null } |
  { 'Pending' : null };
export interface FileAttachment {
  'encrypted_data' : Uint8Array | number[],
  'file_name' : string,
  'file_size' : bigint,
  'file_type' : string,
  'upload_date' : bigint,
  'file_id' : string,
}
export interface LoginCredentials { 'password' : string, 'email' : string }
export interface MedicalEvent {
  'id' : string,
  'status' : EventStatus,
  'created_by_id' : string,
  'action' : EventAction,
  'reference_event_id' : [] | [string],
  'data' : string,
  'batch_id' : [] | [string],
  'timestamp' : bigint,
  'record_id' : string,
  'event_hash' : string,
  'attachments' : Array<FileAttachment>,
  'event_type' : string,
}
export interface MedicalRecord {
  'patient_id' : string,
  'current_snapshot_hash' : string,
  'last_updated' : bigint,
  'created_at' : bigint,
  'clinic_id' : string,
  'is_active' : boolean,
  'record_id' : string,
}
export type Result = { 'ok' : boolean } |
  { 'err' : string };
export type Result_1 = { 'ok' : null } |
  { 'err' : string };
export type Result_2 = { 'ok' : User } |
  { 'err' : string };
export type Result_3 = { 'ok' : { 'user' : User, 'sessionToken' : string } } |
  { 'err' : string };
export type Result_4 = { 'ok' : MedicalRecord } |
  { 'err' : string };
export type Result_5 = { 'ok' : MedicalEvent } |
  { 'err' : string };
export type Result_6 = { 'ok' : BatchRecord } |
  { 'err' : string };
export interface User {
  'password_hash' : string,
  'encrypted_data' : [] | [string],
  'public_key' : string,
  'name' : string,
  'role' : UserRole,
  'created_at' : bigint,
  'user_id' : string,
  'email' : string,
  'clinic_id' : string,
  'is_active' : boolean,
}
export interface UserMedicalRecord {
  'user_id' : string,
  'assigned_date' : bigint,
  'is_active' : boolean,
  'record_id' : string,
}
export type UserRole = { 'Nurse' : null } |
  { 'Doctor' : null } |
  { 'HIMSP' : null } |
  { 'Patient' : null };
export interface _SERVICE {
  'activateMedicalRecord' : ActorMethod<[string], Result_1>,
  'activateUser' : ActorMethod<[string], Result_1>,
  'assignStaffToMedicalRecord' : ActorMethod<[string, string], Result_1>,
  'assignUserToMedicalRecord' : ActorMethod<[string, string], Result_1>,
  'bulkAssignUserToRecords' : ActorMethod<[string, Array<string>], Result_1>,
  'createBatchRecord' : ActorMethod<
    [Array<string>, string, [] | [string]],
    Result_6
  >,
  'createBatchRecordFromPendingEvents' : ActorMethod<[bigint], Result_6>,
  'createMedicalEvent' : ActorMethod<
    [
      string,
      string,
      string,
      EventAction,
      string,
      Array<FileAttachment>,
      string,
    ],
    Result_5
  >,
  'createMedicalRecord' : ActorMethod<[string, string], Result_4>,
  'deactivateAllUserAssignments' : ActorMethod<[string], Result_1>,
  'deactivateMedicalRecord' : ActorMethod<[string], Result_1>,
  'deactivateUser' : ActorMethod<[string], Result_1>,
  'getActiveUserMedicalRecordAssignments' : ActorMethod<
    [string],
    Array<UserMedicalRecord>
  >,
  'getBatchChain' : ActorMethod<[string], Array<BatchRecord>>,
  'getBatchRecordById' : ActorMethod<[string], [] | [BatchRecord]>,
  'getBatchRecordsByStatus' : ActorMethod<[BatchStatus], Array<BatchRecord>>,
  'getLatestBatchRecord' : ActorMethod<[], [] | [BatchRecord]>,
  'getMedicalEventById' : ActorMethod<[string], [] | [MedicalEvent]>,
  'getMedicalEventsByBatchId' : ActorMethod<[string], Array<MedicalEvent>>,
  'getMedicalEventsByCreatedBy' : ActorMethod<[string], Array<MedicalEvent>>,
  'getMedicalEventsByRecordId' : ActorMethod<[string], Array<MedicalEvent>>,
  'getMedicalEventsByStatus' : ActorMethod<[EventStatus], Array<MedicalEvent>>,
  'getMedicalRecordById' : ActorMethod<[string], [] | [MedicalRecord]>,
  'getMedicalRecordsByClinicId' : ActorMethod<[string], Array<MedicalRecord>>,
  'getMedicalRecordsByPatientId' : ActorMethod<[string], Array<MedicalRecord>>,
  'getMedicalRecordsByStaff' : ActorMethod<[string], Array<MedicalRecord>>,
  'getMedicalRecordsByUser' : ActorMethod<[string], Array<MedicalRecord>>,
  'getPasswordHash' : ActorMethod<
    [string],
    [] | [{ 'password' : string, 'salt' : string }]
  >,
  'getPatientsByStaff' : ActorMethod<[string], Array<User>>,
  'getPendingMedicalEvents' : ActorMethod<[], Array<MedicalEvent>>,
  'getStaffByMedicalRecord' : ActorMethod<[string], Array<UserMedicalRecord>>,
  'getStaffByPatient' : ActorMethod<[string], Array<User>>,
  'getUserByEmail' : ActorMethod<[string], [] | [User]>,
  'getUserById' : ActorMethod<[string], [] | [User]>,
  'getUserMedicalRecordAccess' : ActorMethod<
    [string, string],
    [] | [UserMedicalRecord]
  >,
  'getUsersByClinic' : ActorMethod<[string], Array<User>>,
  'getUsersByMedicalRecord' : ActorMethod<[string], Array<User>>,
  'getUsersByRole' : ActorMethod<[UserRole], Array<User>>,
  'hasUserAccessToMedicalRecord' : ActorMethod<[string, string], boolean>,
  'loginUser' : ActorMethod<[LoginCredentials], Result_3>,
  'logoutUser' : ActorMethod<[string], Result_1>,
  'registerUser' : ActorMethod<
    [string, string, string, UserRole, string],
    Result_2
  >,
  'removeStaffFromMedicalRecord' : ActorMethod<[string, string], Result_1>,
  'removeUserFromMedicalRecord' : ActorMethod<[string, string], Result_1>,
  'transferRecordAssignment' : ActorMethod<[string, string, string], Result_1>,
  'updateBatchRecordHederaTxId' : ActorMethod<[string, string], Result_1>,
  'updateBatchRecordStatus' : ActorMethod<[string, BatchStatus], Result_1>,
  'updateMedicalEventBatch' : ActorMethod<[string, string], Result_1>,
  'updateMedicalEventStatus' : ActorMethod<[string, EventStatus], Result_1>,
  'updatePublicKey' : ActorMethod<[string, string], Result_1>,
  'validateSession' : ActorMethod<[string], [] | [User]>,
  'verifyBatchRecord' : ActorMethod<[string], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
