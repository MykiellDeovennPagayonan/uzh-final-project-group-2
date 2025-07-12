import Text "mo:base/Text";
import Nat "mo:base/Nat";
import RXMDB "mo:rxmodb";
import PK "mo:rxmodb/primarykey";
import IDX "mo:rxmodb/index";
import Types "../types";

module MedicalRecords {
  public type MedicalRecordPK = Text;
  public type PatientKey = Text;
  public type ClinicKey = Text;

  public type Init = {
    db      : RXMDB.RXMDB<Types.MedicalRecord>;
    pk      : PK.Init<MedicalRecordPK>;
    patient : IDX.Init<PatientKey>;
    clinic  : IDX.Init<ClinicKey>;
  };

  public func init() : Init {
    return {
      db      = RXMDB.init<Types.MedicalRecord>();
      pk      = PK.init<MedicalRecordPK>(?32);
      patient = IDX.init<PatientKey>(?32);
      clinic  = IDX.init<ClinicKey>(?32);
    };
  };

  public func pk_key(h : Types.MedicalRecord) : MedicalRecordPK = h.record_id;

  public func patient_key(idx:Nat, h : Types.MedicalRecord) : ?PatientKey = ?(h.patient_id # "_" # Nat.toText(idx));

  public func clinic_key(idx:Nat, h : Types.MedicalRecord) : ?ClinicKey = ?(h.clinic_id # "_" # Nat.toText(idx));

  public type Use = {
    db      : RXMDB.Use<Types.MedicalRecord>;
    pk      : PK.Use<MedicalRecordPK, Types.MedicalRecord>;
    patient : IDX.Use<PatientKey, Types.MedicalRecord>;
    clinic  : IDX.Use<ClinicKey, Types.MedicalRecord>;
  };

  public func use(init : Init) : Use {
    let obs = RXMDB.init_obs<Types.MedicalRecord>();
    let pk_config : PK.Config<MedicalRecordPK, Types.MedicalRecord> = {
      db        = init.db;
      obs;
      store     = init.pk;
      compare   = Text.compare;
      key       = pk_key;
      regenerate= #no;
    };
    PK.Subscribe<MedicalRecordPK, Types.MedicalRecord>(pk_config);

    let patient_config : IDX.Config<PatientKey, Types.MedicalRecord> = {
      db        = init.db;
      obs;
      store     = init.patient;
      compare   = Text.compare;
      key       = patient_key;
      regenerate= #no;
      keep      = #all;
    };
    IDX.Subscribe(patient_config);

    let clinic_config : IDX.Config<ClinicKey, Types.MedicalRecord> = {
      db        = init.db;
      obs;
      store     = init.clinic;
      compare   = Text.compare;
      key       = clinic_key;
      regenerate= #no;
      keep      = #all;
    };
    IDX.Subscribe(clinic_config);

    return {
      db      = RXMDB.Use<Types.MedicalRecord>(init.db, obs);
      pk      = PK.Use(pk_config);
      patient = IDX.Use(patient_config);
      clinic  = IDX.Use(clinic_config);
    };
  };
}