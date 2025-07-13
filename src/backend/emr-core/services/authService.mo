import Users "../models/users";
import Sessions "../models/sessions";
import Types "../types";
import SessionTokenGen "../utils/crypto";
import IdGen "../utils/idGen";
import Result "mo:base/Result";
import Time "mo:base/Time";
import Text "mo:base/Text";

module AuthService {
  public func init(userStore : Users.Use, sessionStore : Sessions.Use) : {
    register : (Text, Text, Text, Types.UserRole, Text) -> async Result.Result<Types.User, Text>;
    login : (Types.LoginCredentials) -> async Result.Result<{ user : Types.User; sessionToken : Text }, Text>;
    validateSession : (Text) -> async ?Types.User;
    logout : (Text) -> async Result.Result<(), Text>;
    getPasswordHash : (Text) -> async ?{ password : Text; salt : Text };
  } {
    return {
      register = func(email : Text, password : Text, name : Text, role : Types.UserRole, clinic_id : Text) : async Result.Result<Types.User, Text> {
        await registerImpl(email, password, name, role, clinic_id, userStore);
      };
      login = func(credentials : Types.LoginCredentials) : async Result.Result<{ user : Types.User; sessionToken : Text }, Text> {
        await loginImpl(credentials, userStore, sessionStore);
      };
      validateSession = func(token : Text) : async ?Types.User {
        await validateSessionImpl(token, sessionStore, userStore);
      };
      logout = func(token : Text) : async Result.Result<(), Text> {
        await logoutImpl(token, sessionStore);
      };
      getPasswordHash = func(email : Text) : async ?{ password : Text; salt : Text } {
        await getPasswordHashImpl(email, userStore);
      };
    };
  };

  private func getPasswordHashImpl(email : Text, userStore : Users.Use) : async ?{ password : Text; salt : Text } {
    let maybeUser = userStore.email.get(email);
    switch (maybeUser) {
      case (null) { null };
      case (?user) {
        ?{ password = user.password_hash; salt = "" };
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
          public_key = "";
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

  private func loginImpl(credentials : Types.LoginCredentials, userStore : Users.Use, sessionStore : Sessions.Use) : async Result.Result<{ user : Types.User; sessionToken : Text }, Text> {
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

        let sessionToken = await SessionTokenGen.generateSessionToken();
        let oneDayInNanoSeconds : Int = 86_400_000_000_000;

        let session : Types.SessionToken = {
          token = sessionToken;
          userId = user.user_id;
          expiresAt = Time.now() + oneDayInNanoSeconds;
          createdAt = Time.now();
        };

        sessionStore.db.insert(session);

        return #ok({
          user = user;
          sessionToken = sessionToken;
        });
      };
    };
  };

  private func validateSessionImpl(token : Text, sessionStore : Sessions.Use, userStore : Users.Use) : async ?Types.User {
    let sessionOpt = sessionStore.pk.get(token);
    switch (sessionOpt) {
      case null null;
      case (?session) {
        if (session.expiresAt < Time.now()) {
          sessionStore.pk.delete(token);
          return null;
        };

        userStore.pk.get(session.userId);
      };
    };
  };

  private func logoutImpl(token : Text, sessionStore : Sessions.Use) : async Result.Result<(), Text> {
    sessionStore.pk.delete(token);
    return #ok(());
  };
};