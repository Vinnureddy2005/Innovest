'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ProposeIdeaPage() {
  const [step, setStep] = useState(1);
  const email = sessionStorage.getItem('email'); 
  const [formData, setFormData] = useState({
    startupName: '',
    website: '',
    industry: '',
    stage: '',
    funding: '',
    file: null,
    client_mail:email,
    confirmation: false,
  });
  
  const router = useRouter(); 
  
  
  const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Retail and E-commerce',
    'Environment and Energy',
    'Real Estate and Construction',
    'Media and Entertainment',
    'Transportation and Logistics',
    'Aerospace and Defense',
    'Food and Agriculture',
    'Travel and Hospitality',
    'Legal and Compliance',
    'Consumer Services'
  ];
  const stages = ['Early-Stage','Growth-Stage','Late-Stage'];
  const fundingOptions = [
    'None (Self-funded)',
    '<$50k',
    '$50k-$500k',
    '$500k-$5M',
    '$5M+'
  ];
  const handleChange = (e, any) => {
    console.log(any)
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const [loading, setLoading] = useState(false);  // State to track the loading status
  const [validationTimeout, setValidationTimeout] = useState(false); // Timer state for simulation
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileName, setFileName] = useState("");
  console.log(setValidationTimeout)


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
    form.append('client_mail', formData.client_mail);
    form.append('file', uploadedFile); 


  
    try {
       const storedEmail = sessionStorage.getItem('email'); 
          if (!storedEmail) {
            console.error('No user email found.');
            return;
          }
  
        const client_res = await fetch(`/api/client_profile?email=${storedEmail}`);
        if (!client_res.ok) {
            console.error('Failed to fetch client data');
            return;
          }
          
          const client_data = await client_res.json();

          console.log("client data",client_data)
          const client = client_data.client;
          const clientName= client.fullName;
          const photo=client.photo || "";

          form.append('clientname',clientName);
          form.append('photo',photo);




      const res = await fetch('/api/propose', {
        method: 'POST',
        body: form,
      });
  
      const result = await res.json();
  
      if (res.ok) {
        alert('Idea submitted successfully!');
        router.push(`/client_dashboard?email=${encodeURIComponent(email)}`)
      } else {
        alert(result.error || 'Something went wrong');
      }
    } catch (err) {
      console.error('Submission error:', err);
      alert('An error occurred while submitting.');
    }
  };

  
      
  
      
    

  
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoading(true); 
      try {
        // Step 1: Upload the file and save it to public/uploads
        const filePath = await uploadFileAndSave(file);
        console.log(filePath)
        // Step 2: Send the file path to the backend for validation
        const validationResponse = await validateFile(filePath);
  

        setTimeout(() => {
        if (validationResponse.valid) {
          console.log("File is valid!");
          // If valid, update the formData state
          setFormData(prev => ({
            ...prev,
            file: filePath,  // Store the file path returned from the backend
          }));
         
          setUploadedFile(file); 
          setFileName(file.name); 
         
        } else {
          //console.error("Validation failed:", validationResponse.missing_fields);
          //alert("Validation failed: Missing required fields:\n" + validationResponse.missing_fields.join(', '));
          alert(validationResponse.issues)

        }
        setLoading(false);  // Hide loading animation after validation process completes
        // Simulate completion of validation with a delay
      }, 2000); 
      } catch (error) {
        console.error("Error uploading file:", error);
        alert(error.message);
        setLoading(false);  // Show error message if anything goes wrong
      }
    }
  };
  
  // Function to upload file and save it to public/uploads
  const uploadFileAndSave = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      // Send the file to the backend to save it to public/uploads
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
  
      const result = await res.json();
      
      if (!res.ok) {
        throw new Error(result.error || "File upload failed");
      }
  
      // Return the file path of the saved file
      return result.filePath;
    } catch (error) {
      //console.error("File upload failed:", error);
      throw new Error("File upload failed: " + error.message);
    }
  };
  
  // Function to validate the file by sending its path to the backend
  const validateFile = async (filePath) => {
    try {
      const res = await fetch("/api/valid-file", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filePath }),  // Send the file path for validation
      });
  
      const result = await res.json();
  
      if (!res.ok) {
        throw new Error(result.error || "Validation failed");
      }
  
      return result;
    } catch (error) {
      //console.error("Validation error:", error);
      throw new Error("Validation error: " + error.message);
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
               <Link href="/template"> <h3 className='ml-90 mt-[-20] font-bold'> Click here to download template</h3></Link>
  <label className="block font-semibold mt-2 ">Upload Supporting Document</label>
  <label
    htmlFor="file"
    className="flex items-center justify-center h-18 w-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 transition"
  >
    <input
      id="file"
      type="file"
      name="file"
      onChange={handleFileUpload}
      className="hidden"
    />
    {/* {formData.file ? (
      <span className="text-gray-700">{fileName}</span>
    ) : (
      <span className="text-gray-400">Click to choose a file</span>
    )} */}
    {loading && !validationTimeout ? (
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-500 border-solid"></div>
          <span>Validating...</span>
        </div>
      ) : (
        formData.file ? (
          <span className="text-gray-700">{fileName}</span>
        ) : (
          <span className="text-gray-400">Click to choose a file</span>
        )
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
 <button
      onClick={() => router.push('/client_dashboard')}
        className="fixed bottom-4 left-4 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-blue-600 z-50"
    >
      Back
    </button>
    </div>
  );
}
