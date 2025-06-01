'use client';
import { useRouter } from 'next/navigation';

export default function Template() {
    const router = useRouter(); 

  return (
    <div className="min-h-screen bg-indigo-50 flex items-center justify-center px-4">
      <div className="bg-white border-l-4 border-indigo-500 p-8 rounded-xl shadow-lg max-w-xl w-full">
        <h3 className="text-2xl font-bold text-indigo-800 mb-4 text-center">📄 Important Instructions</h3>
        <ul className="list-disc pl-6 text-gray-700 text-m space-y-2">
          <li>This document will be sent directly to investors. Make sure all information is accurate and professional.</li>
          <li>Download and follow the <strong>provided template</strong> for proper formatting.</li>
          <li>Mention any useful external links such as your <strong>Product Demo Video</strong>, <strong>Website</strong>, or <strong>GitHub</strong>.</li>
          <li>You may also add <strong>screenshots of your UI</strong> or product visuals to support your idea.</li>
          <li>Ensure all files are properly named and relevant (e.g., <code>pitch-deck.pdf</code>, <code>demo-link.txt</code>).</li>
          <li>Upload only in acceptable formats like <strong>.pdf, .pptx, .docx</strong>, or <strong>.zip</strong> if multiple files.</li>
        </ul>
        <div className="text-center mt-6">
          <a
            href="/template/template.pdf"
            download
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition font-medium inline-block"
          >
            ⬇️ Download Template File
          </a>
        </div>
      </div>
       <button
      onClick={() => router.push('/client_dashboard')}
        className="fixed bottom-6 left-8 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-blue-600 z-50"
    >
      Back
    </button>
    </div>
  );
}


