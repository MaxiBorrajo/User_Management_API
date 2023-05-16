const MONGOOSE = require("mongoose");


const BLACK_LISTED_TOKEN_SCHEMA = new MONGOOSE.Schema(
  {
    user_id: { type: MONGOOSE.Schema.Types.ObjectId, ref: "user" },
    token:String,
    created_at: { type: Date, default: Date.now, expires: "30d" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const BLACK_LISTED_TOKEN = MONGOOSE.model(
  "black_listed_token",
  BLACK_LISTED_TOKEN_SCHEMA
);

module.exports = BLACK_LISTED_TOKEN;
