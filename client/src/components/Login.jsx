import React, { useState, useContext, useEffect } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { motion } from "framer-motion"
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = () => {
  const [mode, setMode] = useState('Login')
  const { setShowLogin, backendUrl, setToken, setUser } = useContext(AppContext)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (mode === 'Sign Up' && (!name || !email || !password)) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      console.log({ name, email, password });

      if (mode === 'Login') {
        const { data } = await axios.post(`${backendUrl}/api/user/login`, { email, password });

        if (data.success) {
          setToken(data.token);
          setUser(data.user);
          localStorage.setItem('token', data.token);
          setShowLogin(false);
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/user/register`, { name, email, password });

        if (data.success) {
          setToken(data.token);
          setUser(data.user);
          localStorage.setItem('token', data.token);
          setShowLogin(false);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);
    }
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  return (
    <div className="fixed inset-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center">
      <motion.form
        onSubmit={onSubmitHandler}
        initial={{ opacity: 0.2, y: 50 }}
        transition={{ duration: 0.3 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative bg-white p-10 rounded-xl text-slate-500"
      >
        <h1 className="text-center text-2xl text-neutral-700 font-medium">{mode}</h1>
        <p className="text-sm mb-4">
          {mode === 'Login'
            ? 'Welcome back! Please sign in to continue'
            : 'Create an account to get started'}
        </p>

        {mode === 'Sign Up' && (
          <div className="border px-6 py-2 flex items-center gap-2 rounded-full mb-4">
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              name="fullName"
              type="text"
              className="outline-none text-sm flex-1"
              placeholder="Full name"
              required
            />
          </div>
        )}

        <div className="border px-6 py-2 flex items-center gap-2 rounded-full mb-4">
          <img src={assets.email_icon} alt="Email icon" />
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            name="email"
            type="email"
            className="outline-none text-sm flex-1"
            placeholder="Email"
            required
          />
        </div>

        <div className="border px-6 py-2 flex items-center gap-2 rounded-full mb-4">
          <img src={assets.lock_icon} alt="Lock icon" />
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            name="password"
            type="password"
            className="outline-none text-sm flex-1"
            placeholder="Password"
            required
          />
        </div>

        <p className="text-sm text-blue-600 mb-4 cursor-pointer">Forgot Password?</p>

        <button type="submit" className="bg-blue-600 w-full cursor-pointer text-white py-2 rounded-full mb-4">
          {mode === 'Login' ? 'Login' : 'Create Account'}
        </button>

        <p className="text-center">
          {mode === 'Login' ? "Don't have an account? " : 'Already have an account? '}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => setMode(mode === 'Login' ? 'Sign Up' : 'Login')}
          >
            {mode === 'Login' ? 'Sign Up' : 'Login'}
          </span>
        </p>

        <img
          onClick={() => setShowLogin(false)}
          src={assets.cross_icon}
          alt="Close"
          className="absolute top-5 right-5 cursor-pointer"
        />
      </motion.form>
    </div>
  )
}

export default Login;
