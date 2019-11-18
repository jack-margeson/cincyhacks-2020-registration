const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY
var Airtable = require('airtable');
var base = new Airtable({apiKey: AIRTABLE_API_KEY}).base('appP0xGQjxYDqFQSk');

const express = require('express')
const app = express()
const port = process.env.PORT || 8080

app.get('/', (req, res) => {
  res.send("Welcome to the CincyHacks2020 registration station!")
})

app.get('/register', (req, res) => {
    data = req.query.array
    base('Signups').create([
        {
          "fields": {
            "First Name": data[0],
            "Last Name": data[1],
            "Preferred Name": data[2],
            "Email": data[3],
            "Phone Number": data[4],
            "School": data[5],
            "Grade": parseInt(data[6]),
            "Age": parseInt(data[7]),
            "Emergency Contact Email": data[8],
            "Emergency Contact Phone Number": data[9],
            "Pronouns": data[10],
            "Shirt Size": data[11],
            "Dietary Restrictions": data[12],
            "How did you hear about us?": data[13],
            "Other": data[14]
          }
        }
      ], function(err, records) {
        if (err) {
          console.error(err);
          return;
        }
        records.forEach(function (record) {
          console.log(record.getId());
        })
      });
    res.send(data)
})

app.listen(port, () => console.log(`Now listening for registrations on port ${port}.`))