process.env.DATABASE_URL = 'postgresql://neondb_owner:npg_k0h9pXrJxRcQ@ep-lingering-flower-a4gancu9-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const { queryOne } = require('../lib/db');

(async () => {
  const version = await queryOne('SELECT version()');
  const users = await queryOne('SELECT COUNT(*) as count FROM users');

  console.log('version', version);
  console.log('users', users);
})();