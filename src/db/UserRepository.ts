import mysql, { Connection } from 'mysql2/promise';

interface AuthData {
    host: string;
    user: string;
    password: string;
    database: string;
}

export class UserRepository {
    private connection: Connection;

    private constructor(connection: Connection) { this.connection = connection;}

    public static async createInstance(authData: AuthData): Promise<UserRepository> {
        const connection = await mysql.createConnection(authData);
        return new UserRepository(connection);
    }

    async create(username: string, passwordHash: string, displayName?: string, profilePicture?: string): Promise<void> {
        const query = "INSERT INTO Users (username, password_hash, display_name, profile_picture) VALUES (?, ?, ?, ?)";
        await this.connection.execute(query, [username, passwordHash, displayName, profilePicture]);
    }

    async getById(userId: number): Promise<any> {
        const query = "SELECT * FROM Users WHERE user_id = ?";
        const [rows]: [any[], any] = await this.connection.execute(query, [userId]);
        return rows[0];
    }

    async update(userId: number, data: Partial<Omit<any, 'user_id'>>): Promise<void> {
        const setStrings: string[] = [];
        const values: any[] = [];

        for (const key in data) {
            setStrings.push(`${key} = ?`);
            values.push(data[key as keyof typeof data]);
        }

        const query = `UPDATE Users SET ${setStrings.join(', ')} WHERE user_id = ?`;
        await this.connection.execute(query, [...values, userId]);
    }

    async delete(userId: number): Promise<void> {
        const query = "DELETE FROM Users WHERE user_id = ?";
        await this.connection.execute(query, [userId]);
    }
}