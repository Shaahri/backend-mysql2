import { UserRepository2 } from './UserRepository2';
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

describe('UserRepository End-to-End Tests', () => {
    let db: Database;
    let repo: UserRepository2;

    beforeAll(async () => {
        // Initialize in-memory database
        db = await open({
            filename: ':memory:',
            driver: sqlite3.Database
        });
        await db.exec(`
            CREATE TABLE Users (
                user_id INTEGER PRIMARY KEY AUTOINCREMENT, 
                username TEXT, 
                password_hash TEXT, 
                display_name TEXT, 
                profile_picture TEXT
            )
        `);
        repo = new UserRepository2(db);
    });

    it('should create a new user', async () => {
        await repo.create('testuser', 'hash', 'Test User', 'picture.jpg');
        const user = await db.get("SELECT * FROM Users WHERE username = ?", 'testuser');
        expect(user).toEqual({
            user_id: expect.any(Number),
            username: 'testuser',
            password_hash: 'hash',
            display_name: 'Test User',
            profile_picture: 'picture.jpg'
        });
    });

    // Add tests for getById, update, and delete methods
    // ...

    afterAll(async () => {
        await db.close();
    });
});