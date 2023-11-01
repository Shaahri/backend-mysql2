import mysql, { Connection } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

class DatabaseConnection {
  private static connection: Connection;

  private constructor() {}

  public static async getInstance(): Promise<Connection> {
    if (!DatabaseConnection.connection) {
      const host = process.env.DB_HOST || 'localhost';
      const user = process.env.DB_USER || 'root';
      const password = process.env.DB_PASSWORD || '';
      const database = process.env.DB_DATABASE || 'mydb';

      const options = {
        host,
        user,
        password,
        database,
      };

      DatabaseConnection.connection = await mysql.createConnection(options);
    }

    return DatabaseConnection.connection;
  }
}

export default DatabaseConnection;

