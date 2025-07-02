// pages/admin/users.tsx
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/router';

interface User {
  id: string;
  email: string | null;
  role: string | null;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [email, setEmail] = useState('');
  const router = useRouter();

  // Check if logged in, else redirect
  useEffect(() => {
    const session = supabase.auth.getSession();
    session.then(({ data }) => {
      if (!data.session) router.push('/login');
    });
  }, []);

  // Fetch users from Supabase
  const fetchUsers = async () => {
    // Adjust to your user management setup
    // This example assumes you have a "profiles" table with user metadata including role
    let { data, error } = await supabase.from('profiles').select('id, email, role');
    if (error) {
      alert('Error loading users: ' + error.message);
      return;
    }
    setUsers(data || []);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Invite user via email (sign up link)
  const inviteUser = async () => {
    const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${window.location.origin}/login`
    });
    if (error) {
      alert('Invite failed: ' + error.message);
    } else {
      alert('Invitation sent to ' + email);
      setEmail('');
      fetchUsers();
    }
  };

  // Delete user by id
  const deleteUser = async (id: string) => {
    const { error } = await supabase.auth.admin.deleteUser(id);
    if (error) {
      alert('Delete failed: ' + error.message);
    } else {
      alert('User deleted');
      fetchUsers();
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>User Management</h1>
      <div>
        <input
          type="email"
          placeholder="Invite user email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ padding: 8, width: 250 }}
        />
        <button onClick={inviteUser} style={{ marginLeft: 10, padding: '8px 12px' }}>
          Invite User
        </button>
      </div>

      <table border={1} cellPadding={10} style={{ marginTop: 20, width: '100%' }}>
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 && (
            <tr>
              <td colSpan={3}>No users found</td>
            </tr>
          )}
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>{user.role || 'N/A'}</td>
              <td>
                <button onClick={() => deleteUser(user.id)} style={{ color: 'red' }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
