export const connection = () => (process.env.DATABASE_URL ? 'default' : 'development');
