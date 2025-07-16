import Blob "mo:base/Blob";
import Cycles "mo:base/ExperimentalCycles";
import Text "mo:base/Text";
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

  public func get_hedera_messages() : async Text {
    let host : Text = "testnet.mirrornode.hedera.com";
    let url : Text = "https://" # host # "/api/v1/topics/0.0.6352873/messages";

    let request_headers = [
      { name = "User-Agent"; value = "motoko-hedera-client" },
    ];

    let http_request : IC.http_request_args = {
      url = url;
      max_response_bytes = null;
      headers = request_headers;
      body = null;
      method = #get;
      transform = ?{
        function = transform;
        context = Blob.fromArray([]);
      };
    };

    // Add cycles to pay for HTTPS outcall (see docs for pricing)
    Cycles.add<system>(230_949_972_000);

    // Execute request via management canister
    let http_response : IC.http_request_result = await IC.http_request(http_request);

    let decoded_text : Text = switch (Text.decodeUtf8(http_response.body)) {
      case (null) { "No value returned or failed to decode." };
      case (?text) { text };
    };

    decoded_text;
  };
};
