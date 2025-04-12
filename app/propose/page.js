'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function ProposeIdeaPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    startupName: '',
    website: '',
    industry: '',
    stage: '',
    funding: '',
    file: null,
    confirmation: false,
  });

  const industries = ['Tech', 'Healthcare', 'FinTech', 'EdTech'];
  const stages = ['Idea', 'Prototype', 'MVP', 'Scaling', 'Revenue-Generating'];
  const fundingOptions = ['None', 'Bootstrapped', 'Seed', 'Series A', 'Series B+'];

  const handleChange = (e, any) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);
  const handleSubmit = async () => {
    console.log('Submitting:', formData);
  
    const form = new FormData();
    form.append('startupName', formData.startupName);
    form.append('website', formData.website);
    form.append('industry', formData.industry);
    form.append('stage', formData.stage);
    form.append('funding', formData.funding);
    form.append('file', formData.file);
  
    try {
      const res = await fetch('/api/propose', {
        method: 'POST',
        body: form,
      });
  
      const result = await res.json();
  
      if (res.ok) {
        alert('Idea submitted successfully!');
      } else {
        alert(result.error || 'Something went wrong');
      }
    } catch (err) {
      console.error('Submission error:', err);
      alert('An error occurred while submitting.');
    }
  };
  

  return (
<div
  className="min-h-screen bg-cover bg-center p-6 flex items-center justify-center"
  style={{ backgroundImage: "url('/images/propose.png')" }}>
      <div className="bg-white/80 p-8 rounded-xl shadow-xl w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6">Propose New Startup Idea</h2>

        {step === 1 && (
          <>
            <div className="mb-4">
              <label className="block font-semibold">Startup Name</label>
              <input
                type="text"
                name="startupName"
                value={formData.startupName}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold">Website URL(Optional)</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold">Industry</label>
              <select
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="">Select Industry</option>
                {industries.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block font-semibold">Stage of Startup</label>
              <select
                name="stage"
                value={formData.stage}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="">Select Stage</option>
                {stages.map(stage => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
            </div>
            <div className="mb-6">
              <label className="block font-semibold">Funding Raised</label>
              <select
                name="funding"
                value={formData.funding}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="">Select Funding</option>
                {fundingOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end">
              <button onClick={handleNext} className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700">
                Next
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="mb-6">
               <Link href="/template"> <h3 className='ml-90 mt-[-20]'> Click here to download template</h3></Link>
  <label className="block font-semibold mt-2 ">Upload Supporting Document</label>
  <label
    htmlFor="file"
    className="flex items-center justify-center h-18 w-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 transition"
  >
    <input
      id="file"
      type="file"
      name="file"
      onChange={handleChange}
      className="hidden"
    />
    {formData.file ? (
      <span className="text-gray-700">{formData.file.name}</span>
    ) : (
      <span className="text-gray-400">Click to choose a file</span>
    )}
  </label>
</div>

           
       
            <div className="mb-6">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="confirmation"
                  checked={formData.confirmation}
                  onChange={handleChange}
                />
                <span>I confirm that all the information provided is accurate to the best of my knowledge.</span>
              </label>
            </div>
            <div className="flex justify-between">
              <button onClick={handleBack} className="bg-gray-300 px-6 py-2 rounded hover:bg-gray-400">
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={!formData.confirmation}
                className={`px-6 py-2 rounded ${
                  formData.confirmation ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                }`}
              >
                Submit
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
