import MedicalEvents "../models/medicalEvents";
import MedicalRecords "../models/medicalRecords";
import Types "../types";
import IdGen "../utils/idGen";
import Result "mo:base/Result";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Random "mo:base/Random";

module MedicalEventService {
  public func init(eventStore : MedicalEvents.Use, recordStore : MedicalRecords.Use) : {
    create : (Text, Text, Text, Types.EventAction, Text, [Types.NewFileAttachment], Text) -> async Result.Result<Types.MedicalEvent, Text>;
    getById : (Text) -> async ?Types.MedicalEvent;
    getByRecordId : (Text) -> async [Types.MedicalEvent];
    getByBatchId : (Text) -> async [Types.MedicalEvent];
    getByCreatedBy : (Text) -> async [Types.MedicalEvent];
    getEventsByStatus : (Types.EventStatus) -> async [Types.MedicalEvent];
    updateEventStatus : (Text, Types.EventStatus) -> async Result.Result<(), Text>;
    updateEventBatch : (Text, Text) -> async Result.Result<(), Text>;
  } {
    return {
      create = func(record_id : Text, event_type : Text, data : Text, action : Types.EventAction, reference_event_id : Text, newAttachments : [Types.NewFileAttachment], created_by_id : Text) : async Result.Result<Types.MedicalEvent, Text> {
        await createImpl(record_id, event_type, data, action, reference_event_id, newAttachments, created_by_id, eventStore, recordStore);
      };
      getById = func(id : Text) : async ?Types.MedicalEvent {
        eventStore.pk.get(id);
      };
      getByRecordId = func(record_id : Text) : async [Types.MedicalEvent] {
        let startKey = record_id # "_";
        let endKey = record_id # "_~";
        eventStore.record.find(startKey, endKey, #fwd, 100);
      };
      getByBatchId = func(batch_id : Text) : async [Types.MedicalEvent] {
        let startKey = batch_id # "_";
        let endKey = batch_id # "_~";
        eventStore.batch.find(startKey, endKey, #fwd, 100);
      };
      getByCreatedBy = func(created_by_id : Text) : async [Types.MedicalEvent] {
        let startKey = created_by_id # "_";
        let endKey = created_by_id # "_~";
        eventStore.created_by.find(startKey, endKey, #fwd, 100);
      };
      getEventsByStatus = func(status : Types.EventStatus) : async [Types.MedicalEvent] {
        // Note: This would need a status index for efficient querying
        // For now, this is a placeholder
        [];
      };
      updateEventStatus = func(id : Text, status : Types.EventStatus) : async Result.Result<(), Text> {
        await updateEventStatusImpl(id, status, eventStore);
      };
      updateEventBatch = func(id : Text, batch_id : Text) : async Result.Result<(), Text> {
        await updateEventBatchImpl(id, batch_id, eventStore);
      };
    };
  };

  private func createImpl(record_id : Text, event_type : Text, data : Text, action : Types.EventAction, reference_event_id : Text, newAttachments : [Types.NewFileAttachment], created_by_id : Text, eventStore : MedicalEvents.Use, recordStore : MedicalRecords.Use) : async Result.Result<Types.MedicalEvent, Text> {
    // Verify record exists
    let recordOpt = recordStore.pk.get(record_id);
    switch (recordOpt) {
      case null { return #err("Medical record not found") };
      case (?record) {
        if (not record.is_active) {
          return #err("Medical record is not active");
        };
      };
    };

    let now = Time.now();
    
    // Get entropy once for all file IDs
    let entropy = await Random.blob();
    
    // Convert NewFileAttachment to FileAttachment
    let fullAttachments = Array.map<Types.NewFileAttachment, Types.FileAttachment>(
      newAttachments,
      func(att : Types.NewFileAttachment) : Types.FileAttachment {
        {
          file_id = IdGen.simpleGenerateIdSync(record_id, entropy);
          file_name = att.file_name;
          file_type = att.file_type;
          file_size = att.file_size;
          encrypted_data = att.encrypted_data;
          upload_date = now;
        };
      },
    );

    // Build the event
    let eventId = await IdGen.generateEventId(eventStore);
    let event : Types.MedicalEvent = {
      id = eventId;
      record_id = record_id;
      timestamp = now;
      event_type = event_type;
      action = action;
      data = data;
      reference_event_id = if (reference_event_id == "") null else ?reference_event_id;
      attachments = fullAttachments;
      created_by_id = created_by_id;
      event_hash = "";
      batch_id = null;
      status = #Pending;
    };

    eventStore.db.insert(event);
    #ok(event);
  };

  private func updateEventStatusImpl(id : Text, status : Types.EventStatus, eventStore : MedicalEvents.Use) : async Result.Result<(), Text> {
    let existing = eventStore.pk.get(id);
    switch (existing) {
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
          batch_id = event.batch_id;
          status = status;
        };
        eventStore.db.insert(updatedEvent);
        #ok;
      };
      case null { #err("Event not found") };
    };
  };

  private func updateEventBatchImpl(id : Text, batch_id : Text, eventStore : MedicalEvents.Use) : async Result.Result<(), Text> {
    let existing = eventStore.pk.get(id);
    switch (existing) {
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
          batch_id = ?batch_id;
          status = #Batched;
        };
        eventStore.db.insert(updatedEvent);
        #ok;
      };
      case null { #err("Event not found") };
    };
  };
};