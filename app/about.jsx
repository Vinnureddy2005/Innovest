export default function AboutUs() {
    return (
      <section className="bg-gray-100 py-12">
        <div className="max-w-6xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center gap-10">
          
          {/* Left Side - Text Content */}
          <div className="md:w-1/2">
            <h3 className="text-red-500 uppercase font-semibold tracking-wider">About Us</h3>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
              Why will you choose our platform?
            </h2>
            <p className="text-gray-600 mt-4">
              Our agency can only be as strong as our people, and because of this, our team has designed game-changing products.
            </p>
            <p className="text-gray-600 mt-2">
              Our platform connects visionary startups with investors, empowering innovation and financial growth on a global scale.
            </p>
  
            {/* Stats */}
            <div className="flex flex-wrap gap-6 mt-6">
              <div className="flex items-center gap-2">
                <div className="text-red-500 text-3xl font-bold">50%</div>
                <p className="text-gray-700">Business strategy growth</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-red-500 text-3xl font-bold">75%</div>
                <p className="text-gray-700">Finance valuable ideas</p>
              </div>
            </div>
          </div>
  
          {/* Right Side - Image */}
          <div className="md:w-1/2 relative">

            <div className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white px-6 py-3 rounded-lg text-lg font-semibold">
              10+ Years of Experience
            </div>
          </div>
          
        </div>
      </section>
    );
  }
  