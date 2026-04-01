'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { Mail, Save, Lock, CheckCircle } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

export default function TeacherProfile() {
  const { user, token, setUserFromApi } = useAuth();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
  });

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({ new: '', confirm: '' });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Sync state when user loads
  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.name || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleEditProfile = () => {
    setIsEditingProfile(true);
    setProfileSaved(false);
  };

  const handleSaveProfile = async () => {
    try {
      const res = await fetch('/api/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: profileData.fullName }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUserFromApi(data.user);
      }
      setIsEditingProfile(false);
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save profile:', error);
    }
  };

  const handleSavePassword = async () => {
    if (passwordData.new.length < 8) { setPasswordError('Password must be at least 8 characters'); return; }
    if (passwordData.new !== passwordData.confirm) { setPasswordError('Passwords do not match'); return; }
    setPasswordError('');

    try {
      const res = await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ password: passwordData.new }),
      });
      const data = await res.json();
      if (data.success) {
        setPasswordSuccess('Password changed successfully!');
        setTimeout(() => { setIsChangingPassword(false); setPasswordSuccess(''); setPasswordData({ new: '', confirm: '' }); }, 2000);
      } else {
        setPasswordError('Failed to change password. Please try again.');
      }
    } catch {
      setPasswordError('Server error.');
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Teacher Profile</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          View and manage your personal teacher information and security settings
        </p>
      </div>

      {profileSaved && (
        <Alert variant="success" title="Success">
          Profile updated successfully!
        </Alert>
      )}

      {/* Profile Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Your account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {user?.name?.charAt(0) || 'T'}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{user?.name}</h3>
              <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
              <div className="mt-4 flex gap-2 flex-wrap">
                <Badge variant="success">Active Teacher</Badge>
              </div>
            </div>
          </div>

          {!isEditingProfile ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Email</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{user?.email}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button variant="primary" onClick={handleEditProfile} className="gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Edit Profile
                </Button>
                <Button variant="outline" onClick={() => setIsChangingPassword(true)} className="gap-2">
                  <Lock className="w-4 h-4" />
                  Change Password
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white block mb-2">Full Name</div>
                  <Input
                    value={profileData.fullName}
                    onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white block mb-2">Email</div>
                  <Input
                    value={profileData.email}
                    disabled
                    type="email"
                    placeholder="Your email"
                  />
                  <p className="text-xs text-gray-500 mt-1">Contact your administrator to change your email.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="primary" onClick={handleSaveProfile} className="gap-2">
                  <Save className="w-4 h-4" />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
                  Cancel
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Change Password Modal */}
      <Modal 
        isOpen={isChangingPassword} 
        onClose={() => setIsChangingPassword(false)} 
        title="Change Password"
      >
        <div className="space-y-4">
          {passwordError && <Alert variant="error" title="Error">{passwordError}</Alert>}
          {passwordSuccess && <Alert variant="success" title="Success">{passwordSuccess}</Alert>}
          <Input
            label="New Password"
            type="password"
            value={passwordData.new}
            onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
            placeholder="••••••••"
          />
          <Input
            label="Confirm Password"
            type="password"
            value={passwordData.confirm}
            onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
            placeholder="••••••••"
          />
          <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="secondary" onClick={() => setIsChangingPassword(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSavePassword}>Save Password</Button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
