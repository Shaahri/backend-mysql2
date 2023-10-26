import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { UserRepository } from '../db/UserRepository';

const dbConfig = {
    // Using environment variables for security
    host: process.env.DB_HOST || '',
    user: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || '',
    database: 'ChatApp',
};

const repo = new UserRepository(dbConfig);

export const handler: APIGatewayProxyHandler = async (event, _context) => {
    try {
        const userId = parseInt(event.pathParameters?.id || '', 10);
        const body = JSON.parse(event.body || '{}');

        await repo.update(userId, body);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'User updated successfully' }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error', error: error.message }),
        };
    }
};