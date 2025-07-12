import Random "mo:base/Random";
import Array "mo:base/Array";
import Nat8 "mo:base/Nat8";
import Int "mo:base/Int";
import Time "mo:base/Time";
import Text "mo:base/Text";

module {
  public type StoreWithPK<T> = {
    pk : {
      get : (Text) -> ?T;
    };
  };

  public func generateId(prefix : Text, store : StoreWithPK<Any>) : async Text {
    var attempts = 0;
    let maxAttempts = 5;

    while (attempts < maxAttempts) {
      let entropy = await Random.blob();
      let seed = Random.Finite(entropy);

      let randomBytes = Array.tabulate<Nat8>(
        12, // Shorter for readability
        func(_) {
          switch (seed.byte()) {
            case (?b) b;
            case null 0;
          };
        },
      );

      var candidateId = prefix # "_";
      for (byte in randomBytes.vals()) {
        candidateId := candidateId # Nat8.toText(byte);
      };

      switch (store.pk.get(candidateId)) {
        case null { return candidateId };
        case (?_) { attempts += 1 };
      };
    };

    prefix # "_" # Int.toText(Time.now());
  };

  public func generateUserId(store : StoreWithPK<Any>) : async Text {
    await generateId("user", store);
  };

  public func generateRecordId(store : StoreWithPK<Any>) : async Text {
    await generateId("record", store);
  };

  public func generateEventId(store : StoreWithPK<Any>) : async Text {
    await generateId("event", store);
  };

  public func generateBatchId(store : StoreWithPK<Any>) : async Text {
    await generateId("batch", store);
  };

  public func generateSessionId(store : StoreWithPK<Any>) : async Text {
    await generateId("session", store);
  };
}