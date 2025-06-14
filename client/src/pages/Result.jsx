import React, { useContext, useState, useEffect, useRef } from 'react';
import { assets } from '../assets/assets';
import { motion } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import { useLocation } from 'react-router-dom';

const Result = () => {
  const [image, setImage] = useState(assets.sample_img_1);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');

  const { generateImage } = useContext(AppContext);
  const hasGenerated = useRef(false);
  const location = useLocation();
  const initialPrompt = location.state?.prompt || '';

  useEffect(() => {
    if (!initialPrompt || hasGenerated.current) return;

    hasGenerated.current = true;
    setInput(initialPrompt);
    generateOnce(initialPrompt);
  }, [initialPrompt]);

  const generateOnce = async (text) => {
    setLoading(true);
    const generated = await generateImage(text);
    if (generated) {
      setImage(generated);
      setIsImageLoaded(true);
    }
    setLoading(false);
  };

  const handleGenerate = async (text) => {
    setLoading(true);
    const generated = await generateImage(text);
    if (generated) {
      setImage(generated);
      setIsImageLoaded(true);
    }
    setLoading(false);
  };

  const onClickGenerate = () => {
    if (!input.trim()) return;
    handleGenerate(input);
  };

  return (
    <motion.div
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col items-center justify-center min-h-[90vh]"
    >
      <div>
        <div className="relative">
          <img src={image} alt="Generated" className="max-w-sm rounded" />
          <span
            className={`absolute bottom-0 left-0 h-1 bg-blue-500 ${
              loading ? 'w-full transition-all duration-[10s]' : 'w-0'
            }`}
          />
        </div>
        {loading && <p className="text-center mt-2">Loading...</p>}
      </div>

      {!isImageLoaded && (
        <div className="flex w-full max-w-xl bg-neutral-500 text-white text-sm p-0.5 mt-10 rounded-full">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe what you want to generate"
            className="flex-1 bg-transparent outline-none max-sm:w-20 ml-8 placeholder-color"
          />
          <button
            type="button"
            onClick={onClickGenerate}
            className="bg-zinc-900 px-10 sm:px-16 py-3 rounded-full"
          >
            Generate
          </button>
        </div>
      )}

      {isImageLoaded && (
        <div className="flex gap-2 flex-wrap justify-center text-white text-sm p-0.5 mt-10 rounded-full">
          <p
            onClick={() => {
              setIsImageLoaded(false);
              setImage(assets.sample_img_1);
              setInput('');
              hasGenerated.current = false;
            }}
            className="bg-transparent border border-zinc-900 text-black px-8 py-3 rounded-full cursor-pointer"
          >
            Generate Another
          </p>

          <a
            href={image}
            download
            className="bg-zinc-900 px-10 py-3 rounded-full cursor-pointer"
          >
            Download
          </a>
        </div>
      )}
    </motion.div>
  );
};

export default Result;
