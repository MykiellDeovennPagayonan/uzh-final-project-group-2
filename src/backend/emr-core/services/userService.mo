import Users "../models/users";
import Types "../types";
import Result "mo:base/Result";

module UserService {
  public func init(store : Users.Use) : {
    getById : (Text) -> async ?Types.User;
    getByEmail : (Text) -> async ?Types.User;
    getUsersByClinic : (Text) -> async [Types.User];
    getUsersByRole : (Types.UserRole) -> async [Types.User];
    deactivateUser : (Text) -> async Result.Result<(), Text>;
    activateUser : (Text) -> async Result.Result<(), Text>;
    updatePublicKey : (Text, Text) -> async Result.Result<(), Text>;
  } {
    return {
      getById = func(id : Text) : async ?Types.User {
        store.pk.get(id);
      };
      getByEmail = func(email : Text) : async ?Types.User {
        store.email.get(email);
      };
      getUsersByClinic = func(clinic_id : Text) : async [Types.User] {
        let startKey = clinic_id # "_";
        let endKey = clinic_id # "_~";
        store.clinic.find(startKey, endKey, #fwd, 100);
      };
      getUsersByRole = func(role : Types.UserRole) : async [Types.User] {
        // Note: This would need a role index if you want to query by role efficiently
        // For now, this is a placeholder
        [];
      };
      deactivateUser = func(id : Text) : async Result.Result<(), Text> {
        await toggleUserStatus(id, false, store);
      };
      activateUser = func(id : Text) : async Result.Result<(), Text> {
        await toggleUserStatus(id, true, store);
      };
      updatePublicKey = func(id : Text, publicKey : Text) : async Result.Result<(), Text> {
        await updatePublicKeyImpl(id, publicKey, store);
      };
    };
  };

  private func toggleUserStatus(id : Text, isActive : Bool, store : Users.Use) : async Result.Result<(), Text> {
    let existing = store.pk.get(id);
    switch (existing) {
      case (?user) {
        let updatedUser : Types.User = {
          user_id = user.user_id;
          name = user.name;
          email = user.email;
          password_hash = user.password_hash;
          role = user.role;
          public_key = user.public_key;
          clinic_id = user.clinic_id;
          created_at = user.created_at;
          is_active = isActive;
          encrypted_data = user.encrypted_data;
        };
        store.db.insert(updatedUser);
        #ok
      };
      case null { #err("User not found") };
    };
  };

  private func updatePublicKeyImpl(id : Text, publicKey : Text, store : Users.Use) : async Result.Result<(), Text> {
    let existing = store.pk.get(id);
    switch (existing) {
      case (?user) {
        let updatedUser : Types.User = {
          user_id = user.user_id;
          name = user.name;
          email = user.email;
          password_hash = user.password_hash;
          role = user.role;
          public_key = publicKey;
          clinic_id = user.clinic_id;
          created_at = user.created_at;
          is_active = user.is_active;
          encrypted_data = user.encrypted_data;
        };
        store.db.insert(updatedUser);
        #ok
      };
      case null { #err("User not found") };
    };
  };
}