const { MongoClient } = require('mongodb');
let cachedDb = null;
async function connectToDatabase() {
  if (cachedDb) return cachedDb;
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  cachedDb = client.db('gotrocks');
  return cachedDb;
}

const HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: HEADERS, body: '' };

  try {
    const db = await connectToDatabase();
    const entries = await db.collection('shift_log').find({}).sort({ ts: 1 }).toArray();
    return { statusCode: 200, headers: HEADERS, body: JSON.stringify({ entries }) };
  } catch (err) {
    console.error('[sl-entries]', err);
    return { statusCode: 500, headers: HEADERS, body: JSON.stringify({ error: err.message }) };
  }
};
