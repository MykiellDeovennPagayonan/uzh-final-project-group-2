import Text "mo:base/Text";
import RXMDB "mo:rxmodb";
import PK "mo:rxmodb/primarykey";
import Types "../types";

module Sessions {
  public type SessionPK = Text;

  public type Init = {
    db : RXMDB.RXMDB<Types.SessionToken>;
    pk : PK.Init<SessionPK>;
  };

  public func init() : Init {
    return {
      db = RXMDB.init<Types.SessionToken>();
      pk = PK.init<SessionPK>(?32);
    };
  };

  public func pk_key(s : Types.SessionToken) : SessionPK = s.token;

  public type Use = {
    db : RXMDB.Use<Types.SessionToken>;
    pk : PK.Use<SessionPK, Types.SessionToken>;
  };

  public func use(init : Init) : Use {
    let obs = RXMDB.init_obs<Types.SessionToken>();
    let pk_config : PK.Config<SessionPK, Types.SessionToken> = {
      db = init.db;
      obs;
      store = init.pk;
      compare = Text.compare;
      key = pk_key;
      regenerate = #no;
    };
    PK.Subscribe<SessionPK, Types.SessionToken>(pk_config);

    return {
      db = RXMDB.Use<Types.SessionToken>(init.db, obs);
      pk = PK.Use(pk_config);
    };
  };
}