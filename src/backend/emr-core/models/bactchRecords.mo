import Text "mo:base/Text";
import Nat "mo:base/Nat";
import RXMDB "mo:rxmodb";
import PK "mo:rxmodb/primarykey";
import IDX "mo:rxmodb/index";
import Types "../types";

module BatchRecords {
  public type BatchRecordPK = Text;
  public type PreviousBatchKey = Text;

  public type Init = {
    db            : RXMDB.RXMDB<Types.BatchRecord>;
    pk            : PK.Init<BatchRecordPK>;
    previous_batch : IDX.Init<PreviousBatchKey>;
  };

  public func init() : Init {
    return {
      db            = RXMDB.init<Types.BatchRecord>();
      pk            = PK.init<BatchRecordPK>(?32);
      previous_batch = IDX.init<PreviousBatchKey>(?32);
    };
  };

  public func pk_key(h : Types.BatchRecord) : BatchRecordPK = h.batch_id;

  public func previous_batch_key(idx:Nat, h : Types.BatchRecord) : ?PreviousBatchKey = 
    switch (h.previous_batch_id) {
      case (?prev_id) { ?(prev_id # "_" # Nat.toText(idx)) };
      case null { null };
    };

  public type Use = {
    db            : RXMDB.Use<Types.BatchRecord>;
    pk            : PK.Use<BatchRecordPK, Types.BatchRecord>;
    previous_batch : IDX.Use<PreviousBatchKey, Types.BatchRecord>;
  };

  public func use(init : Init) : Use {
    let obs = RXMDB.init_obs<Types.BatchRecord>();
    let pk_config : PK.Config<BatchRecordPK, Types.BatchRecord> = {
      db        = init.db;
      obs;
      store     = init.pk;
      compare   = Text.compare;
      key       = pk_key;
      regenerate= #no;
    };
    PK.Subscribe<BatchRecordPK, Types.BatchRecord>(pk_config);

    let previous_batch_config : IDX.Config<PreviousBatchKey, Types.BatchRecord> = {
      db        = init.db;
      obs;
      store     = init.previous_batch;
      compare   = Text.compare;
      key       = previous_batch_key;
      regenerate= #no;
      keep      = #all;
    };
    IDX.Subscribe(previous_batch_config);

    return {
      db            = RXMDB.Use<Types.BatchRecord>(init.db, obs);
      pk            = PK.Use(pk_config);
      previous_batch = IDX.Use(previous_batch_config);
    };
  };
}