import Users "../models/users";
import Types "../types";
import IdGen "../utils/idGen";
import Result "mo:base/Result";
import Time "mo:base/Time";
import Text "mo:base/Text";

module AuthService {
  public func init(userStore : Users.Use) : {
    register : (Text, Text, Text, Types.UserRole, Text) -> async Result.Result<Types.User, Text>;
    login : (Types.LoginCredentials) -> async Result.Result<{ user : Types.User }, Text>;
  } {
    return {
      register = func(email : Text, password : Text, name : Text, role : Types.UserRole, clinic_id : Text) : async Result.Result<Types.User, Text> {
        await registerImpl(email, password, name, role, clinic_id, userStore);
      };
      login = func(credentials : Types.LoginCredentials) : async Result.Result<{ user : Types.User }, Text> {
        await loginImpl(credentials, userStore);
      };
    };
  };

  private func registerImpl(email : Text, hashedPassword : Text, name : Text, role : Types.UserRole, clinic_id : Text, userStore : Users.Use) : async Result.Result<Types.User, Text> {
    let existing = userStore.email.get(email);
    switch (existing) {
      case (?_) { return #err("Email already registered") };
      case null {
        let userId = await IdGen.generateUserId(userStore);
        let user : Types.User = {
          user_id = userId;
          name = name;
          email = email;
          password_hash = hashedPassword;
          role = role;
          public_key = ""; // Will be set later
          clinic_id = clinic_id;
          created_at = Time.now();
          is_active = true;
          encrypted_data = null;
        };

        userStore.db.insert(user);
        return #ok(user);
      };
    };
  };

  private func loginImpl(credentials : Types.LoginCredentials, userStore : Users.Use) : async Result.Result<{ user : Types.User }, Text> {
    let userOpt = userStore.email.get(credentials.email);
    switch (userOpt) {
      case null { return #err("Invalid email or password") };
      case (?user) {
        if (not user.is_active) {
          return #err("Account is deactivated");
        };

        if (credentials.password != user.password_hash) {
          return #err("Invalid email or password");
        };

        return #ok({
          user = user;
        });
      };
    };
  };
}