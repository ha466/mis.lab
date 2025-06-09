import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        setUser(JSON.parse(storedUser));
    }

    // Example: Fetch user profile to verify token and get updated info
    const fetchProfile = async () => {
        try {
            const response = await fetch('/api/auth/profile', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                if(response.status === 401) { // Token might be expired/invalid
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    navigate('/login');
                    return;
                }
                throw new Error((await response.json()).message || 'Failed to fetch profile');
            }
            const data = await response.json();
            setUser(data.userProfile); // Assuming backend returns { userProfile: ... }
            localStorage.setItem('user', JSON.stringify(data.userProfile)); // Update local storage
        } catch (err: any) {
            setProfileError(err.message);
            console.error("Profile fetch error:", err);
        }
    };
    fetchProfile();

  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) {
    return <div className="p-4">Loading dashboard or redirecting...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-2">Welcome, {user.username}!</h2>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
        {profileError && <p className="text-red-500 mt-4">Error fetching profile: {profileError}</p>}
      </div>
      {/* Other dashboard content will go here */}
    </div>
  );
};

export default DashboardPage;
