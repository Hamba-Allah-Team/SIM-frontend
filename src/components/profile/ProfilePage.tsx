"use client";

import { useState, useEffect, forwardRef, InputHTMLAttributes } from 'react';
import { Button } from '@/components/ui/button';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface UserProfile {
  id: string;
  username: string;
  name: string;
  email: string;
}

interface UpdatePayload {
  name: string;
  email: string;
  username: string;
  password?: string; // Tambahkan field password untuk verifikasi
}

const ProfilePage = () => {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [password, setPassword] = useState(''); // State untuk password verifikasi
  const [showPasswordField, setShowPasswordField] = useState(false); // Toggle field password
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("Sesi tidak valid. Silakan login kembali.");
        
        const response = await fetch(`${API_URL}/api/users/profile`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Gagal memuat profil.');
        }
        
        const userData = await response.json();
        setUserProfile(userData);
        setFormData({ name: userData.name, email: userData.email });
      } catch (error: unknown) {
        if (error instanceof Error) setMessage({ type: 'error', text: error.message });
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Jika email diubah, tampilkan field password
    if (name === 'email' && value !== userProfile?.email) {
      setShowPasswordField(true);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleCancelEdit = () => {
    if (!userProfile) return;
    setFormData({
      name: userProfile.name,
      email: userProfile.email,
    });
    setPassword('');
    setShowPasswordField(false);
    setIsEditMode(false);
    setMessage({ type: '', text: '' });
  };

  const handleSave = async () => {
    if (!userProfile?.id) {
      setMessage({ type: 'error', text: 'ID Pengguna tidak valid. Gagal menyimpan.' });
      return;
    }

    // Validasi jika email berubah tapi password kosong
    if (formData.email !== userProfile.email && !password) {
      setMessage({ type: 'error', text: 'Password diperlukan untuk mengubah email' });
      return;
    }

    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("Sesi tidak valid. Silakan login kembali.");

      const payload: UpdatePayload = { 
        ...formData, 
        username: userProfile.username,
        ...(formData.email !== userProfile.email && { password }) // Sertakan password hanya jika email berubah
      };

      const response = await fetch(`${API_URL}/api/users/${userProfile.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Gagal menyimpan perubahan.');
      }
      
      // Update state
      setUserProfile(prev => prev ? { ...prev, name: formData.name, email: formData.email } : null);
      setMessage({ type: 'success', text: data.message });
      setIsEditMode(false);
      setShowPasswordField(false);
      setPassword('');

    } catch (error: unknown) {
      if (error instanceof Error) setMessage({ type: 'error', text: error.message });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-10 text-center">Memuat profil...</div>;
  if (!userProfile) return <div className="p-10 text-center text-red-600">{message.text || "Tidak dapat memuat data profil."}</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg text-slate-900">
      <h1 className="text-2xl font-bold mb-6">Profil Saya</h1>
      {message.text && (
        <div className={`p-3 rounded-md text-sm mb-4 ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
          <Input id="username" value={userProfile.username} disabled className="bg-slate-100 cursor-not-allowed"/>
        </div>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} disabled={!isEditMode || isSaving} />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <Input 
            id="email" 
            name="email" 
            type="email" 
            value={formData.email} 
            onChange={handleChange} 
            disabled={!isEditMode || isSaving} 
          />
        </div>
        
        {/* Field password muncul hanya ketika email diubah dan dalam mode edit */}
        {showPasswordField && isEditMode && (
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Konfirmasi Password untuk Ubah Email
            </label>
            <Input 
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              disabled={isSaving}
              placeholder="Masukkan password Anda"
            />
          </div>
        )}
      </div>

      <div className="pt-12 flex items-center justify-between">
        <a href="/change-password" className={`text-sm font-medium text-custom-orange hover:text-orange-600 ${isEditMode ? 'hidden' : 'block'}`}>
          Ganti Password
        </a>
        <div className="flex items-center gap-3 ml-auto">
          {isEditMode ? (
            <>
              <Button variant="ghost" onClick={handleCancelEdit} disabled={isSaving}>Batal</Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditMode(true)}>Edit Profil</Button>
          )}
        </div>
      </div>
    </div>
  );
};

const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, disabled, ...props }, ref) => {
    return (
      <input
        className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-slate-100 disabled:cursor-not-allowed disabled:text-gray-500 ${className}`}
        ref={ref}
        disabled={disabled}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export default ProfilePage;