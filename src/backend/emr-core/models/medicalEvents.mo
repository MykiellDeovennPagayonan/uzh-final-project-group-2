import Text "mo:base/Text";
import Nat "mo:base/Nat";
import RXMDB "mo:rxmodb";
import PK "mo:rxmodb/primarykey";
import IDX "mo:rxmodb/index";
import Types "../types";

module MedicalEvents {
  public type MedicalEventPK = Text;
  public type RecordKey = Text;
  public type BatchKey = Text;
  public type CreatedByKey = Text;

  public type Init = {
    db         : RXMDB.RXMDB<Types.MedicalEvent>;
    pk         : PK.Init<MedicalEventPK>;
    record     : IDX.Init<RecordKey>;
    batch      : IDX.Init<BatchKey>;
    created_by : IDX.Init<CreatedByKey>;
  };

  public func init() : Init {
    return {
      db         = RXMDB.init<Types.MedicalEvent>();
      pk         = PK.init<MedicalEventPK>(?32);
      record     = IDX.init<RecordKey>(?32);
      batch      = IDX.init<BatchKey>(?32);
      created_by = IDX.init<CreatedByKey>(?32);
    };
  };

  public func pk_key(h : Types.MedicalEvent) : MedicalEventPK = h.id;

  public func record_key(idx:Nat, h : Types.MedicalEvent) : ?RecordKey = ?(h.record_id # "_" # Nat.toText(idx));

  public func batch_key(idx:Nat, h : Types.MedicalEvent) : ?BatchKey = 
    switch (h.batch_id) {
      case (?batch_id) { ?(batch_id # "_" # Nat.toText(idx)) };
      case null { null };
    };

  public func created_by_key(idx:Nat, h : Types.MedicalEvent) : ?CreatedByKey = ?(h.created_by_id # "_" # Nat.toText(idx));

  public type Use = {
    db         : RXMDB.Use<Types.MedicalEvent>;
    pk         : PK.Use<MedicalEventPK, Types.MedicalEvent>;
    record     : IDX.Use<RecordKey, Types.MedicalEvent>;
    batch      : IDX.Use<BatchKey, Types.MedicalEvent>;
    created_by : IDX.Use<CreatedByKey, Types.MedicalEvent>;
  };

  public func use(init : Init) : Use {
    let obs = RXMDB.init_obs<Types.MedicalEvent>();
    let pk_config : PK.Config<MedicalEventPK, Types.MedicalEvent> = {
      db        = init.db;
      obs;
      store     = init.pk;
      compare   = Text.compare;
      key       = pk_key;
      regenerate= #no;
    };
    PK.Subscribe<MedicalEventPK, Types.MedicalEvent>(pk_config);

    let record_config : IDX.Config<RecordKey, Types.MedicalEvent> = {
      db        = init.db;
      obs;
      store     = init.record;
      compare   = Text.compare;
      key       = record_key;
      regenerate= #no;
      keep      = #all;
    };
    IDX.Subscribe(record_config);

    let batch_config : IDX.Config<BatchKey, Types.MedicalEvent> = {
      db        = init.db;
      obs;
      store     = init.batch;
      compare   = Text.compare;
      key       = batch_key;
      regenerate= #no;
      keep      = #all;
    };
    IDX.Subscribe(batch_config);

    let created_by_config : IDX.Config<CreatedByKey, Types.MedicalEvent> = {
      db        = init.db;
      obs;
      store     = init.created_by;
      compare   = Text.compare;
      key       = created_by_key;
      regenerate= #no;
      keep      = #all;
    };
    IDX.Subscribe(created_by_config);

    return {
      db         = RXMDB.Use<Types.MedicalEvent>(init.db, obs);
      pk         = PK.Use(pk_config);
      record     = IDX.Use(record_config);
      batch      = IDX.Use(batch_config);
      created_by = IDX.Use(created_by_config);
    };
  };
}