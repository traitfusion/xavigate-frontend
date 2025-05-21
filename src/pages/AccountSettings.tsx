import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';

interface Profile {
  firstName: string;
  lastName:  string;
  username:  string;
  email:     string;
}

export default function AccountSettings() {
  const [profile, setProfile] = useState<Profile>({
    firstName: '',
    lastName:  '',
    username:  '',
    email:     '',
  });

  useEffect(() => {
    const token = localStorage.getItem('idToken');
    console.log('Using token:', token);
    if (!token) {
      alert('Not logged in');
      return;
    }
    axios
      .get<Profile>('/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        console.log('Profile response data:', res.data);
        setProfile(res.data);
      })
      .catch(err => {
        console.error('Failed to load profile', err);
        alert('Failed to load profile');
      });
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    const token = localStorage.getItem('idToken');
    console.log('Submitting with token:', token, 'payload:', profile);
    if (!token) {
      alert('Not logged in');
      return;
    }
    axios
      .put(
        '/api/user/profile',
        profile,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        console.log('Profile saved successfully');
        alert('Profile saved successfully');
      })
      .catch(err => {
        console.error('Error saving profile', err);
        alert('Error saving profile');
      });
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl mb-4">Account Settings</h1>
      <label className="block mb-2">
        First Name
        <input
          name="firstName"
          value={profile.firstName}
          onChange={handleChange}
          className="w-full border px-2 py-1"
        />
      </label>
      <label className="block mb-2">
        Last Name
        <input
          name="lastName"
          value={profile.lastName}
          onChange={handleChange}
          className="w-full border px-2 py-1"
        />
      </label>
      <label className="block mb-2">
        Username
        <input
          name="username"
          value={profile.username}
          onChange={handleChange}
          className="w-full border px-2 py-1"
        />
      </label>
      <label className="block mb-4">
        Email
        <input
          name="email"
          type="email"
          value={profile.email}
          onChange={handleChange}
          className="w-full border px-2 py-1"
        />
      </label>
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Save Changes
      </button>
    </div>
  );
}