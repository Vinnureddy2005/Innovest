
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '../investor_sidebar/page';
export default function InvestorEditProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    membershipPlan: '',
    validUpto: '',
  });

  const [previewPic, setPreviewPic] = useState('');
  const [selectedPhotoBase64, setSelectedPhotoBase64] = useState('');

  useEffect(() => {
    const fetchInvestorData = async () => {
      try {
        const storedEmail = typeof window !== 'undefined' ? sessionStorage.getItem('email') : '';
        if (!storedEmail) return console.error('No email found.');

        const res = await fetch(`/api/investor_profile?email=${storedEmail}`);
        if (!res.ok) throw new Error('Failed to fetch investor data');

        const data = await res.json();
        const investor = data.investor;

        setFormData({
          fullName: investor.fullName || '',
          email: investor.email || '',
          phone: investor.phone || '',
          membershipPlan: investor.membershipPlan || '',
          validUpto: investor.validUpto || '',
        });

        setPreviewPic(investor.photo || '');
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchInvestorData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    router.push('/');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedPhotoBase64(reader.result);
        setPreviewPic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/investor_profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          photo: selectedPhotoBase64 || previewPic,
        }),
      });

      if (res.ok) {
        alert('Profile updated successfully!');
      } else {
        const error = await res.json();
        alert(`Error: ${error.message}`);
      }
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar handleLogout={handleLogout} />
      <div className="flex flex-col flex-1 items-center p-8">
        <div className="w-full max-w-4xl bg-white shadow-lg rounded-2xl p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <button
                onClick={() => document.getElementById("photoUploadInput").click()}
                className="absolute top-0 right-0 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
              >
                ✏️
              </button>
              {previewPic ? (
                <img src={previewPic} alt="Profile" className="w-28 h-28 rounded-full object-cover border-4 border-orange-400 shadow-md" />
              ) : (
                <div className="w-28 h-28 rounded-full bg-gray-300 flex items-center justify-center border-4 border-orange-400 shadow-md">
                  <span className="text-gray-600">No Image</span>
                </div>
              )}
              <input id="photoUploadInput" type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
            </div>
            <h2 className="text-3xl font-bold mt-4">{formData.fullName}</h2>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {['fullName', 'phone'].map((field) => (
              <div key={field} className="flex flex-col">
                <label className="text-sm font-semibold text-gray-600 mb-2">
                  {field === 'fullName' ? 'Full Name' : 'Phone Number'}
                </label>
                <input
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            ))}

            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 mb-2">Email</label>
              <input type="email" name="email" value={formData.email} disabled className="p-3 rounded-lg bg-gray-100 border" />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 mb-2">Membership Plan</label>
              <input type="text" value={formData.membershipPlan} disabled className="p-3 rounded-lg bg-gray-100 border" />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 mb-2">Valid Upto</label>
              <input type="text" value={formData.validUpto} disabled className="p-3 rounded-lg bg-gray-100 border" />
            </div>

            <div className="md:col-span-2 flex justify-center mt-8">
              <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full shadow-lg">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
