import Types "../types";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Error "mo:base/Error";

module {
  // Define the interface for the Hedera canister
  public type HederaCanisterActor = actor {
    // Health and basic operations
    health_check : () -> async Text;
    create_topic : () -> async Text;
    
    // Message operations
    send_message : (Text) -> async Text;
    send_message_with_batch : (Text, Text, [Text]) -> async Text;
    send_simple_message : (Text) -> async Text;
    
    // Message retrieval
    get_all_messages : (?Text) -> async Text;
    get_messages_by_batch : (Text) -> async Text;
    get_messages_with_limit : (Nat) -> async Text;
    get_hedera_messages : () -> async Text;
  };

  public class HederaCanisterService(canister_id: Text) {
    
    // Convert canister ID to Principal
    private let hedera_canister : HederaCanisterActor = actor(canister_id);
    
    // Health check
    public func healthCheck() : async Result.Result<Text, Text> {
      try {
        let result = await hedera_canister.health_check();
        #ok(result)
      } catch (error) {
        #err("Health check failed: " # Error.message(error))
      }
    };
    
    // Create topic
    public func createTopic() : async Result.Result<Text, Text> {
      try {
        let result = await hedera_canister.create_topic();
        #ok(result)
      } catch (error) {
        #err("Create topic failed: " # Error.message(error))
      }
    };
    
    // Send simple message
    public func sendMessage(message: Text) : async Result.Result<Text, Text> {
      try {
        let result = await hedera_canister.send_simple_message(message);
        #ok(result)
      } catch (error) {
        #err("Send message failed: " # Error.message(error))
      }
    };
    
    // Send message with batch and event IDs
    public func sendMessageWithBatch(message: Text, batchId: Text, eventIds: [Text]) : async Result.Result<Text, Text> {
      try {
        let result = await hedera_canister.send_message_with_batch(message, batchId, eventIds);
        #ok(result)
      } catch (error) {
        #err("Send message with batch failed: " # Error.message(error))
      }
    };
    
    // Get all messages with optional limit
    public func getAllMessages(limit: ?Text) : async Result.Result<Text, Text> {
      try {
        let result = await hedera_canister.get_all_messages(limit);
        #ok(result)
      } catch (error) {
        #err("Get all messages failed: " # Error.message(error))
      }
    };
    
    // Get messages by batch ID
    public func getMessagesByBatch(batchId: Text) : async Result.Result<Text, Text> {
      try {
        let result = await hedera_canister.get_messages_by_batch(batchId);
        #ok(result)
      } catch (error) {
        #err("Get messages by batch failed: " # Error.message(error))
      }
    };
    
    // Get messages with specific limit
    public func getMessagesWithLimit(limit: Nat) : async Result.Result<Text, Text> {
      try {
        let result = await hedera_canister.get_messages_with_limit(limit);
        #ok(result)
      } catch (error) {
        #err("Get messages with limit failed: " # Error.message(error))
      }
    };
    
    // Get Hedera messages directly
    public func getHederaMessages() : async Result.Result<Text, Text> {
      try {
        let result = await hedera_canister.get_hedera_messages();
        #ok(result)
      } catch (error) {
        #err("Get Hedera messages failed: " # Error.message(error))
      }
    };
    
    // Convenience method to send batch record to Hedera
    public func sendBatchRecord(batchRecord: Types.BatchRecord) : async Result.Result<Text, Text> {
      let message = "BatchRecord:" # batchRecord.batch_id # ":" # batchRecord.merkle_root;
      let eventIds = batchRecord.event_ids;
      await sendMessageWithBatch(message, batchRecord.batch_id, eventIds)
    };
    
    // Convenience method to send medical event to Hedera
    public func sendMedicalEvent(medicalEvent: Types.MedicalEvent) : async Result.Result<Text, Text> {
      let message = "MedicalEvent:" # medicalEvent.id # ":" # medicalEvent.event_type;
      await sendMessage(message)
    };
  };
  
  // Factory function to create the service
  public func init(canister_id: Text) : HederaCanisterService {
    HederaCanisterService(canister_id)
  };
}