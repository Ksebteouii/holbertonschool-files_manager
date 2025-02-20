// utils/db.mjs
import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    // Get environment variables or use defaults
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';

    // MongoDB connection URI
    this.uri = `mongodb://${host}:${port}`;
    this.dbName = database;

    // Create a new MongoDB client
    this.client = new MongoClient(this.uri, { useUnifiedTopology: true });

    // Track connection status
    this.connected = false;

    // Connect to MongoDB
    this.client.connect()
      .then(() => {
        this.connected = true;
        console.log('Connected to MongoDB');
      })
      .catch((err) => {
        console.error('Failed to connect to MongoDB', err);
      });
  }

  // Check if the connection to MongoDB is alive
  isAlive() {
    return this.connected;
  }

  // Get the number of documents in the 'users' collection
  async nbUsers() {
    if (!this.connected) return 0; // Ensure connection is established
    const db = this.client.db(this.dbName);
    const usersCollection = db.collection('users');
    return usersCollection.countDocuments();
  }

  // Get the number of documents in the 'files' collection
  async nbFiles() {
    if (!this.connected) return 0; // Ensure connection is established
    const db = this.client.db(this.dbName);
    const filesCollection = db.collection('files');
    return filesCollection.countDocuments();
  }
}

// Create and export an instance of DBClient
const dbClient = new DBClient();
export default dbClient;