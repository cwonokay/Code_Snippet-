const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const snippetSchema = new mongoose.Schema({
  username: {type: String, lowercase: true, required: true},
  title:     {type: String, unique: true, lowercase: true, required: true },
  code:      {type: String, required: true },
  notes:     {type: String,},
  language:  {type: String, lowercase: true },
  tags:      [String]
});

const Snippet = mongoose.model("Snippet", snippetSchema);

module.exports = Snippet;
