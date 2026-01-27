const { Client } = require('pg');

const client = new Client({
  host: '127.0.0.1',
  port: 5432,
  user: 'postgres',
  password: '2000',
  database: 'warranty_bot',
});

console.log('connecting...');

client.connect()
  .then(() => {
    console.log('CONNECTED');
    return client.query('select 1');
  })
  .then(r => {
    console.log('QUERY OK', r.rows);
    process.exit(0);
  })
  .catch(e => {
    console.error('ERROR', e);
    process.exit(1);
  });
