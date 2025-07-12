import Random "mo:base/Random";
import Array "mo:base/Array";
import Nat8 "mo:base/Nat8";
import Blob "mo:base/Blob";
import Base16 "mo:base16/Base16";

module {
  public func generateSessionToken() : async Text {
    let entropy = await Random.blob();
    let seed = Random.Finite(entropy);

    let tokenBytes = Array.tabulate<Nat8>(
      32,
      func(_) {
        switch (seed.byte()) {
          case (?b) b;
          case null 0;
        };
      },
    );

    Base16.encode(Blob.fromArray(tokenBytes));
  };
};
