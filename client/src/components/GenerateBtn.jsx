import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { motion } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
// const { generateImage } = useContext(AppContext);

const GenerateBtn = () => {
  const { user, setShowLogin, credit , setPrompt } = useContext(AppContext);
  const [input, setInput] = useState('');
  const navigate = useNavigate();

  const onClickHandler = () => {
  if (!input.trim()) {
    toast.error("Please enter a prompt.");
    return;
  }

  if (!user) {
    setShowLogin(true);
    return;
  }

  if (Number(credit <= 0)) {
    toast.error("You have 0 credits. Please buy more to generate images.");
    navigate('/buy');
    return;
  }

  // ✅ Only if user is logged in AND has credits
  setPrompt(input);
  localStorage.setItem('prompt', input);
  navigate('/result');
};


  return (
    <motion.div
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="pb-16 text-center"
    >
      <h1 className="text-2xl md:text-3xl lg:text-4xl mt-4 font-semibold text-neutral-800 py-6 md:py-16">
        See the magic. Try now
      </h1>

      <div className="max-w-lg mx-auto flex gap-4 items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe your image..."
          className="flex-1 border px-4 py-2 rounded-full shadow-sm text-sm outline-none"
        />
        <button
          onClick={onClickHandler}
          className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-black text-white hover:scale-105 transition-all duration-300"
        >
          Generate
          <img src={assets.star_group} alt="Generate" className="h-6" />
        </button>
      </div>
    </motion.div>
  );
};

export default GenerateBtn;
