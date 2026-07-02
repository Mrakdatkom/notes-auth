import api from '@/lib/axios';
import { LoaderCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react'

const ProfilePage = () => {
  const [user, setUser] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const res = await api.get("/auth/me");
        console.log(res.data.user);
        setUser(res.data.user);
      } catch (error) {
        console.error("An error occured while fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserProfile();
  }, []);

  return (
    <div>
      {loading &&
        <div className='py-10'>
          <LoaderCircle className="h-2 w-2 animate-spin" />
          Loading...
        </div>
      }
      <h1>{user.email}</h1>
    </div>
  )
}

export default ProfilePage
