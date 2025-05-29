"use client";
import { motion } from "framer-motion";
import { UserPlus, Lightbulb, Rocket, CalendarCheck, Repeat } from "lucide-react";

// Icons mapped to steps
const clientSteps = [
  { text: "Register & Take Membership", icon: <UserPlus size={20} /> },
  { text: "Propose Startup Ideas", icon: <Lightbulb size={20} /> },
  { text: "Matched with Investors", icon: <Rocket size={20} /> },
  { text: "Real-Time Consultation", icon: <CalendarCheck size={20} /> },
  { text: "Refine and Iterate", icon: <Repeat size={20} /> },
];

const investorSteps = [
  { text: "Register & Set Preferences", icon: <UserPlus size={20} /> },
  { text: "AI-Based Startup Matches", icon: <Lightbulb size={20} /> },
  { text: "Explore Proposals", icon: <Rocket size={20} /> },
  { text: "Schedule Meet", icon: <CalendarCheck size={20} /> },
  { text: "Give Feedback & Follow-up", icon: <Repeat size={20} /> },
];

export default function Works() {
  return (
    <section className="py-20 px-4 mt-[-40] sm:px-12  bg-gradient-to-r from-[#fffaf0] via-[#f1f1f1] to-[#fefefa]" id="works" >

      <h2 className="text-4xl font-bold text-center mb-16">How It Works ?</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-7xl mx-auto">
        {/* Client Timeline */}
        <div className="relative">
          <h3 className="text-2xl font-bold text-center text-blue-700 mb-10">For Clients</h3>
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full border-l-2 border-blue-200"></div>

          {clientSteps.map((step, index) => {
            const isLeft = index % 2 === 0;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                viewport={{ once: true }}
                className={`mb-10 flex ${isLeft ? "justify-start" : "justify-end"} relative`}
              >
                <div className="w-1/2 px-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-300 shadow flex items-center gap-3">
                    <div className="text-blue-600">{step.icon}</div>
                    <p className="font-semibold text-blue-900">{step.text}</p>
                  </div>
                </div>
                {/* Timeline Dot */}
                <div className="absolute left-1/2 top-5 transform -translate-x-1/2 w-4 h-4 bg-blue-600 border-4 border-white rounded-full shadow"></div>
              </motion.div>
            );
          })}
        </div>

        {/* Investor Timeline */}
        <div className="relative">
          <h3 className="text-2xl font-bold text-center text-green-700 mb-10">For Investors</h3>
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full border-l-2 border-green-200"></div>

          {investorSteps.map((step, index) => {
            const isLeft = index % 2 !== 0; // Flip alternate side
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                viewport={{ once: true }}
                className={`mb-10 flex ${isLeft ? "justify-start" : "justify-end"} relative`}
              >
                <div className="w-1/2 px-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-300 shadow flex items-center gap-3">
                    <div className="text-green-600">{step.icon}</div>
                    <p className="font-semibold text-green-900">{step.text}</p>
                  </div>
                </div>
                {/* Timeline Dot */}
                <div className="absolute left-1/2 top-5 transform -translate-x-1/2 w-4 h-4 bg-green-600 border-4 border-white rounded-full shadow"></div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
