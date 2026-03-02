const { Client } = require('pg');
const client = new Client({
    connectionString: "postgresql://postgres:postgres@localhost:5432/zenith"
});

client.connect()
    .then(() => {
        console.log('Connected to PostgreSQL successfully!');
        process.exit(0);
    })
    .catch(err => {
        console.error('Connection error', err.stack);
        process.exit(1);
    });
