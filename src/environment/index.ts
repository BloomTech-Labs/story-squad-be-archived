import * as dotenv from 'dotenv';
dotenv.config();

if (!process.env.DATABASE_URL) throw new Error('Failed to start! Double check your .env!');

export const port = Number(process.env.PORT || '3000');
export const databaseURL = process.env.DATABASE_URL;
export const stripeKey = process.env.STRIPE_KEY;
export const secret = process.env.SECRET;
export const salt = Number(process.env.SALT);
