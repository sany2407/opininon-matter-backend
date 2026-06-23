import { supabaseAdmin, checkConnection } from './config/database';

async function setupDatabase() {
  console.log('Checking database connection...');
  const isConnected = await checkConnection();
  if (!isConnected) {
    process.exit(1);
  }

  console.log('Creating tables...');

  // Create categories table
  const { error: categoriesError } = await supabaseAdmin.rpc('create_categories_table', {
    sql: `
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `
  });

  // Create blogs table
  const { error: blogsError } = await supabaseAdmin.rpc('create_blogs_table', {
    sql: `
      CREATE TABLE IF NOT EXISTS blogs (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        published_date TIMESTAMP,
        category_id INTEGER REFERENCES categories(id),
        status VARCHAR(50) DEFAULT 'draft',
        updated_at TIMESTAMP DEFAULT NOW(),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `
  });

  // Create newsletter_subscribers table
  const { error: newsletterError } = await supabaseAdmin.rpc('create_newsletter_table', {
    sql: `
      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        subscribed_at TIMESTAMP DEFAULT NOW()
      );
    `
  });

  // Create admin_users table
  const { error: adminError } = await supabaseAdmin.rpc('create_admin_users_table', {
    sql: `
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `
  });

  // Disable RLS for admin_users (for seeding)
  await supabaseAdmin.rpc('disable_rls_admin_users', {
    sql: `ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;`
  });

  console.log('✅ Database setup completed');
  console.log('Please run: bun run src/seedAdmin.ts');
  process.exit(0);
}

setupDatabase().catch(console.error);
