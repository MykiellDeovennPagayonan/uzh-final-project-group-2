import Text "mo:base/Text";
import Nat "mo:base/Nat";
import RXMDB "mo:rxmodb";
import PK "mo:rxmodb/primarykey";
import IDX "mo:rxmodb/index";
import Types "../types";

module UserMedicalRecords {
  public type UserMedicalRecordPK = Text;
  public type UserKey = Text;
  public type RecordKey = Text;

  public type Init = {
    db     : RXMDB.RXMDB<Types.UserMedicalRecord>;
    pk     : PK.Init<UserMedicalRecordPK>;
    user   : IDX.Init<UserKey>;
    record : IDX.Init<RecordKey>;
  };

  public func init() : Init {
    return {
      db     = RXMDB.init<Types.UserMedicalRecord>();
      pk     = PK.init<UserMedicalRecordPK>(?32);
      user   = IDX.init<UserKey>(?32);
      record = IDX.init<RecordKey>(?32);
    };
  };

  public func pk_key(h : Types.UserMedicalRecord) : UserMedicalRecordPK = h.user_id # "#" # h.record_id;

  public func user_key(idx:Nat, h : Types.UserMedicalRecord) : ?UserKey = ?(h.user_id # "_" # Nat.toText(idx));

  public func record_key(idx:Nat, h : Types.UserMedicalRecord) : ?RecordKey = ?(h.record_id # "_" # Nat.toText(idx));

  public type Use = {
    db     : RXMDB.Use<Types.UserMedicalRecord>;
    pk     : PK.Use<UserMedicalRecordPK, Types.UserMedicalRecord>;
    user   : IDX.Use<UserKey, Types.UserMedicalRecord>;
    record : IDX.Use<RecordKey, Types.UserMedicalRecord>;
  };

  public func use(init : Init) : Use {
    let obs = RXMDB.init_obs<Types.UserMedicalRecord>();
    let pk_config : PK.Config<UserMedicalRecordPK, Types.UserMedicalRecord> = {
      db        = init.db;
      obs;
      store     = init.pk;
      compare   = Text.compare;
      key       = pk_key;
      regenerate= #no;
    };
    PK.Subscribe<UserMedicalRecordPK, Types.UserMedicalRecord>(pk_config);

    let user_config : IDX.Config<UserKey, Types.UserMedicalRecord> = {
      db        = init.db;
      obs;
      store     = init.user;
      compare   = Text.compare;
      key       = user_key;
      regenerate= #no;
      keep      = #all;
    };
    IDX.Subscribe(user_config);

    let record_config : IDX.Config<RecordKey, Types.UserMedicalRecord> = {
      db        = init.db;
      obs;
      store     = init.record;
      compare   = Text.compare;
      key       = record_key;
      regenerate= #no;
      keep      = #all;
    };
    IDX.Subscribe(record_config);

    return {
      db     = RXMDB.Use<Types.UserMedicalRecord>(init.db, obs);
      pk     = PK.Use(pk_config);
      user   = IDX.Use(user_config);
      record = IDX.Use(record_config);
    };
  };
}