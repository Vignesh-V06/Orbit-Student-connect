// models/MessageDB.js
import Datastore from "nedb-promises";

// ✅ Create / load local DB file (auto-creates if missing)
const db = Datastore.create({
  filename: "./chats.db",  // messages saved in this file
  autoload: true,
});

export default db;
