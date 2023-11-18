import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

export class UserRepository2 {
    public db: Database;

    public constructor(db: Database) { 
        this.db = db;
    }

    public static async createInstance(): Promise<UserRepository2> {
        const db = await open({
            filename: ':memory:',
            driver: sqlite3.Database
        });

        // Initialize the table structure
        await db.exec(`
            CREATE TABLE Users (
                user_id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT,
                password_hash TEXT,
                display_name TEXT,
                profile_picture TEXT
            )
        `);

        return new UserRepository2(db);
    }

    async create(username: string, passwordHash: string, displayName?: string, profilePicture?: string): Promise<void> {
        const query = "INSERT INTO Users (username, password_hash, display_name, profile_picture) VALUES (?, ?, ?, ?)";
        await this.db.run(query, username, passwordHash, displayName, profilePicture);
    }

    async getById(userId: number): Promise<any> {
        const query = "SELECT * FROM Users WHERE user_id = ?";
        const user = await this.db.get(query, userId);
        return user;
    }

    async update(userId: number, data: Partial<Omit<any, 'user_id'>>): Promise<void> {
        const setStrings: string[] = [];
        const values: any[] = [];

        for (const key in data) {
            setStrings.push(`${key} = ?`);
            values.push(data[key as keyof typeof data]);
        }

        const query = `UPDATE Users SET ${setStrings.join(', ')} WHERE user_id = ?`;
        await this.db.run(query, ...values, userId);
    }

    async delete(userId: number): Promise<void> {
        const query = "DELETE FROM Users WHERE user_id = ?";
        await this.db.run(query, userId);
    }
}
