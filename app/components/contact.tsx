"use client";

export default function contact() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-[#fffaf0] via-[#f1f1f1] to-[#fefefa text-gray-800 font-sans">
      <section
        id="contact"
        className="px-10 py-20 "
      >
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-m font-bold text-gray-700 tracking-widest uppercase mb-2">
            Get In Touch
          </h2>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
            Contact Innovest Team
          </h1>
          <p className="text-gray-700 mb-12">
            {"Have a question, suggestion, or want to collaborate? We'd love to hear from you!"}
          </p>


          <form className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg grid gap-6">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a56d54]"
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a56d54]"
              required
            />
            <textarea
              placeholder="Your Message"
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a56d54]"
              required
            ></textarea>
            <button
              type="submit"
              className="bg-[#a56d54] hover:bg-[#8e5743] text-white font-semibold py-3 px-8 rounded-lg transition duration-300"
            >
              Send Message
            </button>
          </form>

          <div className="mt-12 text-gray-600">
            <p>Email us at: <span className="text-blue-600 font-medium">support@innovest.com</span></p>
            <p>Phone: <span className="text-blue-600 font-medium">+91 9100721889 , +91 6300159445</span></p>
          </div>
          <div className="mt-5 mb-[-20] text-center text-gray-500 font-semibold text-sm">
  © {new Date().getFullYear()} Innovest. All rights reserved.
</div>

        </div>
      </section>
      
    </div>
  );
}
