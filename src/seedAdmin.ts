import bcrypt from 'bcryptjs';
import { supabaseAdmin, checkConnection } from './config/database';

async function seedAdmin() {
  console.log('Checking database connection...');
  const isConnected = await checkConnection();
  if (!isConnected) {
    process.exit(1);
  }

  const username = 'admin';
  const password = 'admin@123';
  const passwordHash = await bcrypt.hash(password, 10);

  // Check if user already exists
  const { data: existingUsers } = await supabaseAdmin
    .from('admin_users')
    .select('*')
    .eq('username', username);

  if (existingUsers && existingUsers.length > 0) {
    console.log('Admin user already exists, updating password...');
    const { data, error } = await supabaseAdmin
      .from('admin_users')
      .update({ password_hash: passwordHash })
      .eq('username', username)
      .select()
      .single();

    if (error) {
      console.error('Error updating admin user:', error);
      process.exit(1);
    }

    console.log('✅ Admin user updated successfully:', data);
  } else {
    console.log('Creating new admin user...');
    const { data, error } = await supabaseAdmin
      .from('admin_users')
      .insert({
        username,
        password_hash: passwordHash,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating admin user:', error);
      process.exit(1);
    }

    console.log('✅ Admin user created successfully:', data);
  }

  console.log('Username:', username);
  console.log('Password:', password);
  process.exit(0);
}

seedAdmin();
