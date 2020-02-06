import * as dotenv from 'dotenv';

const path = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';
dotenv.config({ path });

if (!process.env.PORT) throw new Error('Failed to start! Double check your .env!');
if (!process.env.DATABASE_URL) throw new Error('Failed to start! Double check your .env!');
if (!process.env.STRIPE_KEY) throw new Error('Failed to start! Double check your .env!');
if (!process.env.SECRET) throw new Error('Failed to start! Double check your .env!');
if (!process.env.SALT) throw new Error('Failed to start! Double check your .env!');

export const port = Number(process.env.PORT);
export const databaseURL = process.env.DATABASE_URL;
export const stripeKey = process.env.STRIPE_KEY;
export const secret = process.env.SECRET;
export const salt = Number(process.env.SALT);
