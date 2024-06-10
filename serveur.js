const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
app.use(express.json());
app.use(cors());

const uri = "mongodb+srv://florviev:zVuPA9JeSyzbMuIF@cluster0.0gfntmp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
let db;

async function connectToDatabase() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    db = client.db('calendarDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    throw err;
  }
}


connectToDatabase().catch(console.dir);

const months = [
  "Janvier",
  "Fevrier",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre"
];

app.post('/save-date', async (req, res) => {
  const { date } = req.body;
  console.log('Received request to save date:', date);

  try {
    const [day, month, year] = date.split(' ');
    const monthIndex = months.indexOf(month);
    if (monthIndex === -1) {
      throw new Error('Invalid month format');
    }
    const parsedDate = new Date(year, monthIndex, day);

    if (isNaN(parsedDate)) {
      throw new Error('Invalid date format');
    }

    const result = await db.collection('dates').insertOne({ date: parsedDate });
    console.log('Date saved successfully:', result);
    res.send('Date saved successfully!');
  } catch (err) {
    console.error('Failed to save date:', err);
    res.status(500).send('Failed to save date: ' + err.message);
  }
});

app.get('/get-dates', async (req, res) => {
  try {
    const dates = await db.collection('dates').find({}).toArray();
    res.json(dates.map(doc => {
      if (doc.date instanceof Date) {
        return doc.date.toISOString();
      } else if (typeof doc.date === 'string') {
        const [day, month, year] = doc.date.split(' ');
        const monthIndex = months.indexOf(month);
        if (monthIndex === -1) {
          console.error(`Invalid month format: ${month}`);
          return null;
        }
        const parsedDate = new Date(year, monthIndex, day);
        if (isNaN(parsedDate)) {
          console.error(`Invalid date format: ${doc.date}`);
          return null;
        }
        return parsedDate.toISOString();
      } else {
        console.error(`Expected a Date or string, but got ${typeof doc.date}: ${doc.date}`);
        return null;
      }
    }));
  } catch (err) {
    console.error('Failed to fetch dates:', err);
    res.status(500).send('Failed to fetch dates: ' + err.message);
  }
});


app.listen(3000, () => {
  console.log('App is listening on port 3000');
});
