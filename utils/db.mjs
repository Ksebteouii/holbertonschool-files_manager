// utils/db.mjs
import mongodb from 'mongodb';
const { MongoClient } = mongodb;

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
    try {
      if (!this.connected) return 0; // Ensure connection is established
      const db = this.client.db(this.dbName);
      const usersCollection = db.collection('users');
      const count = await usersCollection.countDocuments();
      return count;
    } catch (err) {
      console.error('Error in nbUsers:', err);
      return 0;
    }
  }

  // Get the number of documents in the 'files' collection
  async nbFiles() {
    try {
      if (!this.connected) return 0; // Ensure connection is established
      const db = this.client.db(this.dbName);
      const filesCollection = db.collection('files');
      const count = await filesCollection.countDocuments();
      return count;
    } catch (err) {
      console.error('Error in nbFiles:', err);
      return 0;
    }
  }
}

// Create and export an instance of DBClient
const dbClient = new DBClient();
export default dbClient;