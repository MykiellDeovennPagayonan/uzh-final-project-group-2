import Blob "mo:base/Blob";
import Cycles "mo:base/ExperimentalCycles";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Nat "mo:base/Nat";
import Time "mo:base/Time";
import Int "mo:base/Int";
import IC "ic:aaaaa-aa";

actor {

  public query func transform({
    context : Blob;
    response : IC.http_request_result;
  }) : async IC.http_request_result {
    {
      response with headers = [];
    };
  };

  private func convert_headers(headers: [(Text, Text)]) : [IC.http_header] {
    Array.map<(Text, Text), IC.http_header>(headers, func(h) {
      { name = h.0; value = h.1 }
    });
  };

  private func make_http_request(url: Text, method: {#get; #post}, body: ?Text, extra_headers: [(Text, Text)]) : async Text {
    let default_headers = [("User-Agent", "motoko-hedera-client")];
    let all_headers = Array.append(default_headers, extra_headers);
    let request_headers = convert_headers(all_headers);

    let http_request : IC.http_request_args = {
      url = url;
      max_response_bytes = null;
      headers = request_headers;
      body = switch(body) {
        case (null) { null };
        case (?text) { ?Text.encodeUtf8(text) };
      };
      method = method;
      transform = ?{
        function = transform;
        context = Blob.fromArray([]);
      };
    };

    Cycles.add<system>(230_949_972_000);
    let http_response : IC.http_request_result = await IC.http_request(http_request);

    switch (Text.decodeUtf8(http_response.body)) {
      case (null) { "Failed to decode response" };
      case (?text) { text };
    };
  };

  private func build_event_ids_string(eventIds: [Text]) : Text {
    let quoted_ids = Array.map<Text, Text>(eventIds, func(id) { "\"" # id # "\"" });
    "[" # Text.join(",", quoted_ids.vals()) # "]";
  };

  // Generate a batch ID with timestamp
  private func generate_batch_id() : Text {
    let timestamp = Time.now();
    "emr_batch_" # Int.toText(timestamp);
  };

  public func health_check() : async Text {
    let url = "https://uzh-final-project-hedera-server.onrender.com/health";
    await make_http_request(url, #get, null, []);
  };

  public func create_topic() : async Text {
    let url = "https://uzh-final-project-hedera-server.onrender.com/api/hedera/create-topic";
    let headers = [("Content-Type", "application/json")];
    await make_http_request(url, #post, ?"{}", headers);
  };

  // 3. Send Message - POST /api/hedera/send
  public func send_message(message: Text) : async Text {
    let url = "https://uzh-final-project-hedera-server.onrender.com/api/hedera/send";
    let body = "{\"message\":\"" # message # "\"}";
    let headers = [("Content-Type", "application/json")];
    await make_http_request(url, #post, ?body, headers);
  };

  // 4. Send Message with Batch ID and Event IDs
  public func send_message_with_batch(message: Text, batchId: Text, eventIds: [Text]) : async Text {
    let url = "https://uzh-final-project-hedera-server.onrender.com/api/hedera/send";
    let eventIds_str = build_event_ids_string(eventIds);
    let body = "{\"message\":\"" # message # "\",\"batchId\":\"" # batchId # "\",\"eventIds\":" # eventIds_str # "}";
    let headers = [("Content-Type", "application/json")];
    await make_http_request(url, #post, ?body, headers);
  };

  // NEW: Submit EMR Batch with Merkle Root
  public func submit_emr_batch(merkleRoot: Text, eventIds: [Text]) : async Text {
    let batchId = generate_batch_id();
    await send_message_with_batch(merkleRoot, batchId, eventIds);
  };

  // NEW: Submit EMR Batch with custom batch ID
  public func submit_emr_batch_with_id(merkleRoot: Text, batchId: Text, eventIds: [Text]) : async Text {
    await send_message_with_batch(merkleRoot, batchId, eventIds);
  };

  // NEW: Submit daily EMR batch (typical use case)
  public func submit_daily_emr_batch(merkleRoot: Text, eventIds: [Text]) : async Text {
    let timestamp = Time.now();
    let batchId = "daily_emr_batch_" # Int.toText(timestamp);
    await send_message_with_batch(merkleRoot, batchId, eventIds);
  };

  // NEW: Submit patient-specific EMR batch
  public func submit_patient_emr_batch(patientId: Text, merkleRoot: Text, eventIds: [Text]) : async Text {
    let timestamp = Time.now();
    let batchId = "patient_" # patientId # "_batch_" # Int.toText(timestamp);
    await send_message_with_batch(merkleRoot, batchId, eventIds);
  };

  // 5. Get All Messages - GET /api/hedera/messages?limit=10
  public func get_all_messages(limit: ?Text) : async Text {
    let base_url = "https://uzh-final-project-hedera-server.onrender.com/api/hedera/messages";
    let url = switch(limit) {
      case (null) { base_url };
      case (?l) { base_url # "?limit=" # l };
    };
    await make_http_request(url, #get, null, []);
  };

  // 6. Get Messages by Batch ID - GET /api/hedera/messages/batch/batch_001
  public func get_messages_by_batch(batchId: Text) : async Text {
    let url = "https://uzh-final-project-hedera-server.onrender.com/api/hedera/messages/batch/" # batchId;
    await make_http_request(url, #get, null, []);
  };

  // NEW: Verify EMR batch integrity
  public func verify_emr_batch(batchId: Text) : async Text {
    await get_messages_by_batch(batchId);
  };

  // 7. Get Hedera Messages (your original function, now using helper)
  public func get_hedera_messages() : async Text {
    let url = "https://testnet.mirrornode.hedera.com/api/v1/topics/0.0.6352873/messages";
    await make_http_request(url, #get, null, []);
  };

  // 8. Simple convenience function for basic message sending
  public func send_simple_message(message: Text) : async Text {
    await send_message(message);
  };

  // 9. Get messages with custom limit
  public func get_messages_with_limit(limit: Nat) : async Text {
    await get_all_messages(?(Nat.toText(limit)));
  };
}