import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import React from "react";

export default function SpecialistCard() {
  const [openIndex, setOpenIndex] = useState(null);

  const specialists = [
    { id: 1, title: "NEUROLOGIST" },
    { id: 2, title: "NEUROLOGIST" },
    { id: 3, title: "NEUROLOGIST" },
    { id: 4, title: "NEUROLOGIST" },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
       <h2 className="text-2xl md:text-4xl lg:text-5xl text-green-500 font-light leading-relaxed tracking-wide">OUR SPECIALISTS</h2>
      <div className="w-full max-w-7xl">
        {specialists.map((specialist, index) => (
          <div key={specialist.id} className="mb-6">
            <div 
              className="bg-green-100 p-10 rounded-2xl shadow-lg flex justify-between items-center cursor-pointer w-full"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <div className="flex items-center space-x-6">
                <span className="text-8xl font-thin">{`0${specialist.id}`}</span>
                <span className="text-2xl font-semibold">{specialist.title}</span>
              </div>
              {openIndex === index ? <Minus className="text-gray-800" /> : <Plus className="text-gray-800" />}
            </div>
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="overflow-hidden bg-white p-6 text-gray-700 rounded-b-2xl w-full mt-1"
                >
                  <p className="text-lg">A neurologist specializes in treating diseases of the nervous system, including the brain and spinal cord.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
