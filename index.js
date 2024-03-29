// Grab Airtable and Postal keys.
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const POSTAL_LIST_ID = process.env.POSTAL_LIST_ID;

// Create new airtable base using user API key and base ID.
var Airtable = require("airtable");
var base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

// Require statements.
const express = require("express");
const request = require("request");

// Init. Express.js server.
const app = express();
const cors = require("cors");
const port = process.env.PORT || 8080;
app.use(cors());

// Main page.
app.get("/", (req, res) => {
  res.send("Welcome to the CincyHacks2020 registration station!");
});

// Registration page.
app.get("/register", (req, res) => {
  // Gets data through an array of params.
  data = req.query.array;
  // Creates new Airtable entry.
  base("Signups").create(
    [
      {
        fields: {
          "First Name": data[0],
          "Last Name": data[1],
          "Preferred Name": data[2],
          Email: data[3],
          "Phone Number": data[4].replace(/\D/g, ""),
          School: data[5],
          Grade: parseInt(data[6]),
          Age: parseInt(data[7]),
          "Emergency Contact Email": data[8],
          "Emergency Contact Phone Number": data[9].replace(/\D/g, ""),
          Pronouns: data[10],
          "Shirt Size": data[11],
          "Dietary Restrictions": data[12],
          "How did you hear about us?": data[13],
          Other: data[14]
        }
      }
    ],
    function(err, records) {
      if (err) {
        // Push error to console.
        console.error(err);
        return;
      }
      records.forEach(function(record) {
        // Log new Airtable entry ID.
        console.log(record.getId());
      });
    }
  );

  // Registration confirmation.
  res.send("The registration has been completed.");
});

// Subscribe page.
app.get("/subscribe", (req, res) => {
  // Gets queries.
  data = req.query;
  subscribeUser(data.email, data.name);
  // Subscribe confirmation.
  res.send("Subscribe request receieved.");
});

// Subscription function.
function subscribeUser(email, name) {
  // Sents request and subscribes passed email and name to Postal ID provided.
  request
    .post("https://postal.hackclub.com/subscribe")
    .form({ list: POSTAL_LIST_ID, email: email, name: name });
}

app.listen(port, () =>
  console.log(`Now listening for registrations on port ${port}.`)
);
