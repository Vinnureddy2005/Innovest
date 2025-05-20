

'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '../client_sidebar/page';
export default function ClientEditProfile() {
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    membershipPlan: "",
  });

  const [previewPic, setPreviewPic] = useState(''); // ✅ Start empty
  const [selectedPhotoBase64, setSelectedPhotoBase64] = useState('');

  // Fetch client details on page load
  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const storedEmail = sessionStorage.getItem('email'); 
        if (!storedEmail) {
          console.error('No user email found.');
          return;
        }

        const res = await fetch(`/api/client_profile?email=${storedEmail}`);
        if (!res.ok) {
          console.error('Failed to fetch client data');
          return;
        }

        const data = await res.json();
        const client = data.client;
        console.log(client.photo)

        setFormData({
          fullName: client.fullName || "",
          email: client.email || "",
          phone: client.phone || "",
          membershipPlan: client.membershipPlan || "",
          validUpto:client.validUpto
        });

        // Check if photo is available in database and set it
        if (client.photo) {
          setPreviewPic(client.photo); // ✅ Only set if available
        } else {
          setPreviewPic(''); // ✅ Reset to empty if no photo in DB
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching client data:', error);
      }
    };

    fetchClientData();
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
      const res = await fetch('/api/client_profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          fullName: formData.fullName,
          phone: formData.phone,
          membershipPlan: formData.membershipPlan,
          validUpto:formData.validUpto,
          photo: selectedPhotoBase64 || previewPic, // Send updated photo or existing photo if no new one
        }),
      });
  
      if (res.ok) {
        alert('Profile updated successfully!');
      } else {
        const errData = await res.json();
        alert(`Error updating profile: ${errData.message}`);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar handleLogout={handleLogout} />

      {/* Main Content */}
      <div className="flex flex-col flex-1 items-center p-8">
        {/* Profile Card */}
        <div className="w-full max-w-4xl bg-white shadow-lg rounded-2xl p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              {/* Pencil Icon */}
              <button
                onClick={() => document.getElementById("photoUploadInput").click()} // Trigger file input on click
                className="absolute top-0 right-0 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-700"
                >
                  <path d="M12 20h9M18.5 3.5l2 2-10 10-2-2 10-10z" />
                </svg>
              </button>

              {/* Profile Image */}
              {previewPic ? (
                <img 
                  src={previewPic}
                  alt="Profile"
                  className="w-28 h-28 rounded-full object-cover border-4 border-orange-400 shadow-md"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-gray-300 flex items-center justify-center border-4 border-orange-400 shadow-md">
                  <span className="text-gray-600">No Image</span>
                </div>
              )}

              {/* Hidden file input */}
              <input
                id="photoUploadInput"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden" // Hide file input
              />
            </div>
            <h2 className="text-3xl font-bold mt-4">{formData.fullName}</h2>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6" encType="multipart/form-data">
            
            {/* Full Name */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 mb-2">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled // email can't be changed
                className="p-3 rounded-lg border border-gray-300 bg-gray-100"
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 mb-2">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            {/* Membership Plan */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 mb-2">Membership Plan</label>
              <input
                type="text"
                name="membershipPlan"
                value={formData.membershipPlan}
                disabled
                className="p-3 rounded-lg border border-gray-300 bg-gray-100"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 mb-2">Valid Upto</label>
              <input
                type="text"
                name="validUpto"
                value={formData.validUpto}
                disabled
              className="p-3 rounded-lg border border-gray-300 bg-gray-100"
              />
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2 flex justify-center mt-8">
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 transition-all duration-300 text-white font-bold py-3 px-8 rounded-full shadow-lg"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
