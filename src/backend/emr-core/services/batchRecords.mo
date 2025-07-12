import BatchRecords "../models/batchRecords";
import MedicalEvents "../models/medicalEvents";
import Types "../types";
import IdGen "../utils/idGen";
import Result "mo:base/Result";
import Time "mo:base/Time";
import Buffer "mo:base/Buffer";
import Array "mo:base/Array";
import Iter "mo:base/Iter";

module BatchRecordService {
  public func init(batchStore : BatchRecords.Use, eventStore : MedicalEvents.Use) : {
    create : ([Text], Text, ?Text) -> async Result.Result<Types.BatchRecord, Text>;
    getById : (Text) -> async ?Types.BatchRecord;
    getBatchesByStatus : (Types.BatchStatus) -> async [Types.BatchRecord];
    getBatchChain : (Text) -> async [Types.BatchRecord];
    updateBatchStatus : (Text, Types.BatchStatus) -> async Result.Result<(), Text>;
    updateHederaTxId : (Text, Text) -> async Result.Result<(), Text>;
    verifyBatch : (Text) -> async Result.Result<Bool, Text>;
    getLatestBatch : () -> async ?Types.BatchRecord;
    getPendingEvents : () -> async [Types.MedicalEvent];
    createBatchFromPendingEvents : (Nat) -> async Result.Result<Types.BatchRecord, Text>;
  } {
    return {
      create = func(event_ids : [Text], merkle_root : Text, previous_batch_id : ?Text) : async Result.Result<Types.BatchRecord, Text> {
        await createImpl(event_ids, merkle_root, previous_batch_id, batchStore, eventStore);
      };
      getById = func(id : Text) : async ?Types.BatchRecord {
        batchStore.pk.get(id);
      };
      getBatchesByStatus = func(status : Types.BatchStatus) : async [Types.BatchRecord] {
        // Note: This would need a status index for efficient querying
        // For now, this is a placeholder that filters all batches
        [];
      };
      getBatchChain = func(batch_id : Text) : async [Types.BatchRecord] {
        await getBatchChainImpl(batch_id, batchStore);
      };
      updateBatchStatus = func(id : Text, status : Types.BatchStatus) : async Result.Result<(), Text> {
        await updateBatchStatusImpl(id, status, batchStore);
      };
      updateHederaTxId = func(id : Text, tx_id : Text) : async Result.Result<(), Text> {
        await updateHederaTxIdImpl(id, tx_id, batchStore);
      };
      verifyBatch = func(id : Text) : async Result.Result<Bool, Text> {
        await verifyBatchImpl(id, batchStore, eventStore);
      };
      getLatestBatch = func() : async ?Types.BatchRecord {
        await getLatestBatchImpl(batchStore);
      };
      getPendingEvents = func() : async [Types.MedicalEvent] {
        await getPendingEventsImpl(eventStore);
      };
      createBatchFromPendingEvents = func(maxEvents : Nat) : async Result.Result<Types.BatchRecord, Text> {
        await createBatchFromPendingEventsImpl(maxEvents, batchStore, eventStore);
      };
    };
  };

  private func createImpl(event_ids : [Text], merkle_root : Text, previous_batch_id : ?Text, batchStore : BatchRecords.Use, eventStore : MedicalEvents.Use) : async Result.Result<Types.BatchRecord, Text> {
    if (event_ids.size() == 0) {
      return #err("Batch must contain at least one event");
    };

    if (event_ids.size() > 100) {
      return #err("Batch cannot exceed 100 events");
    };

    // Verify all events exist and are in pending status
    for (event_id in event_ids.vals()) {
      switch (eventStore.pk.get(event_id)) {
        case null { return #err("Event not found: " # event_id) };
        case (?event) {
          if (event.status != #Pending) {
            return #err("Event is not in pending status: " # event_id);
          };
        };
      };
    };

    let batchId = await IdGen.generateBatchId(batchStore);
    let batch : Types.BatchRecord = {
      batch_id = batchId;
      timestamp = Time.now();
      event_ids = event_ids;
      merkle_root = merkle_root;
      previous_batch_id = previous_batch_id;
      hedera_tx_id = null;
      batch_hash = ""; // Will be calculated
      status = #Created;
      event_count = event_ids.size();
    };

    batchStore.db.insert(batch);

    // Update events to batched status
    for (event_id in event_ids.vals()) {
      switch (eventStore.pk.get(event_id)) {
        case (?event) {
          let updatedEvent : Types.MedicalEvent = {
            id = event.id;
            record_id = event.record_id;
            timestamp = event.timestamp;
            event_type = event.event_type;
            action = event.action;
            data = event.data;
            reference_event_id = event.reference_event_id;
            attachments = event.attachments;
            created_by_id = event.created_by_id;
            event_hash = event.event_hash;
            batch_id = ?batchId;
            status = #Batched;
          };
          eventStore.db.insert(updatedEvent);
        };
        case null { /* should not happen due to earlier check */ };
      };
    };

    #ok(batch);
  };

  private func getBatchChainImpl(batch_id : Text, batchStore : BatchRecords.Use) : async [Types.BatchRecord] {
    let buffer = Buffer.Buffer<Types.BatchRecord>(10);
    var currentBatchId = ?batch_id;
    
    while (currentBatchId != null) {
      switch (currentBatchId) {
        case (?id) {
          switch (batchStore.pk.get(id)) {
            case (?batch) {
              buffer.add(batch);
              currentBatchId := batch.previous_batch_id;
            };
            case null { currentBatchId := null; };
          };
        };
        case null { currentBatchId := null; };
      };
    };

    Buffer.toArray(buffer);
  };

  private func updateBatchStatusImpl(id : Text, status : Types.BatchStatus, batchStore : BatchRecords.Use) : async Result.Result<(), Text> {
    let existing = batchStore.pk.get(id);
    switch (existing) {
      case (?batch) {
        let updatedBatch : Types.BatchRecord = {
          batch_id = batch.batch_id;
          timestamp = batch.timestamp;
          event_ids = batch.event_ids;
          merkle_root = batch.merkle_root;
          previous_batch_id = batch.previous_batch_id;
          hedera_tx_id = batch.hedera_tx_id;
          batch_hash = batch.batch_hash;
          status = status;
          event_count = batch.event_count;
        };
        batchStore.db.insert(updatedBatch);
        #ok;
      };
      case null { #err("Batch not found") };
    };
  };

  private func updateHederaTxIdImpl(id : Text, tx_id : Text, batchStore : BatchRecords.Use) : async Result.Result<(), Text> {
    let existing = batchStore.pk.get(id);
    switch (existing) {
      case (?batch) {
        let updatedBatch : Types.BatchRecord = {
          batch_id = batch.batch_id;
          timestamp = batch.timestamp;
          event_ids = batch.event_ids;
          merkle_root = batch.merkle_root;
          previous_batch_id = batch.previous_batch_id;
          hedera_tx_id = ?tx_id;
          batch_hash = batch.batch_hash;
          status = #Submitted;
          event_count = batch.event_count;
        };
        batchStore.db.insert(updatedBatch);
        #ok;
      };
      case null { #err("Batch not found") };
    };
  };

  private func verifyBatchImpl(id : Text, batchStore : BatchRecords.Use, eventStore : MedicalEvents.Use) : async Result.Result<Bool, Text> {
    let batchOpt = batchStore.pk.get(id);
    switch (batchOpt) {
      case null { return #err("Batch not found") };
      case (?batch) {
        // Verify all events in batch exist
        for (event_id in batch.event_ids.vals()) {
          switch (eventStore.pk.get(event_id)) {
            case null { return #err("Event not found in batch: " # event_id) };
            case (?event) {
              if (event.batch_id != ?batch.batch_id) {
                return #err("Event batch_id mismatch: " # event_id);
              };
            };
          };
        };
        #ok(true);
      };
    };
  };

  private func getLatestBatchImpl(batchStore : BatchRecords.Use) : async ?Types.BatchRecord {
    // This would need a timestamp index for efficient querying
    // For now, this is a placeholder
    null;
  };

  private func getPendingEventsImpl(eventStore : MedicalEvents.Use) : async [Types.MedicalEvent] {
    // This would need a status index for efficient querying
    // For now, this is a placeholder
    [];
  };

  private func createBatchFromPendingEventsImpl(maxEvents : Nat, batchStore : BatchRecords.Use, eventStore : MedicalEvents.Use) : async Result.Result<Types.BatchRecord, Text> {
    let pendingEvents = await getPendingEventsImpl(eventStore);
    if (pendingEvents.size() == 0) {
      return #err("No pending events to batch");
    };

    let eventsToInclude = if (pendingEvents.size() > maxEvents) {
      let buffer = Buffer.Buffer<Types.MedicalEvent>(maxEvents);
      for (i in Iter.range(0, maxEvents - 1)) {
        buffer.add(pendingEvents[i]);
      };
      Buffer.toArray(buffer);
    } else {
      pendingEvents;
    };

    let eventIds = Array.map<Types.MedicalEvent, Text>(eventsToInclude, func(event) { event.id });
    let merkleRoot = ""; // Calculate merkle root from events
    let latestBatch = await getLatestBatchImpl(batchStore);
    let previousBatchId = switch (latestBatch) {
      case (?batch) { ?batch.batch_id };
      case null { null };
    };

    await createImpl(eventIds, merkleRoot, previousBatchId, batchStore, eventStore);
  };
}