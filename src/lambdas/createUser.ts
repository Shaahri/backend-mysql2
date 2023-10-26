import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { UserRepository } from '../db/UserRepository';

const dbConfig = {
    host: process.env.DB_HOST || '',
    user: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || '',
    database: 'ChatApp',
};

const repo = new UserRepository(dbConfig);

export const handler: APIGatewayProxyHandler = async (event, _context) => {
    try {
        const body = JSON.parse(event.body || '{}');
        await repo.create(body.username, body.passwordHash, body.displayName, body.profilePicture);
        return {
            statusCode: 201,
            body: JSON.stringify({ message: 'User created successfully' }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error', error: error.message }),
        };
    }
};