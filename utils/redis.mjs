import { createClient } from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.client = createClient();

    // Promisify Redis methods
    this.getAsync = promisify(this.client.get).bind(this.client);
    this.setAsync = promisify(this.client.setex).bind(this.client);
    this.delAsync = promisify(this.client.del).bind(this.client);

    this.client.on('error', (error) => {
      console.error(`Redis client error: ${error}`);
    });
  }

  isAlive() {
    return this.client.connected;
  }

  async get(key) {
    try {
      return await this.getAsync(key);
    } catch (error) {
      console.error(`Error getting key "${key}":`, error);
      return null;
    }
  }

  async set(key, value, duration) {
    try {
      return await this.setAsync(key, duration, value);
    } catch (error) {
      console.error(`Error setting key "${key}":`, error);
      return null; // Ensure a return value to fix ESLint error
    }
  }

  async del(key) {
    try {
      return await this.delAsync(key);
    } catch (error) {
      console.error(`Error deleting key "${key}":`, error);
      return null; // Ensure a return value to fix ESLint error
    }
  }
}

// Export an instance of RedisClient
const redisClient = new RedisClient();
export default redisClient;
