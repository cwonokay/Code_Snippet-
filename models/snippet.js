const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const snippetSchema = new mongoose.Schema({

  title:     {type: String, unique: true, lowercase: true, required: true },
  code:      {type: String, required: true },
  notes:     {type: String,},
  language:  {type: String, unique: true, lowercase: true },

});

const Snippet = mongoose.model("Snippet", snippetSchema);

module.exports = Snippet;
