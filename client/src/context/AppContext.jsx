import { createContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AppContext = createContext({
  user: null,
  setUser: () => {},
  showLogin: false,
  setShowLogin: () => {},
  token: '',
  setToken: () => {},
  credit: 0,
  setCredit: () => {},
  backendUrl: '',
  logout: () => {},
  generateImage: async () => {},
  prompt: '',
  setPrompt: () => {},
});

const AppContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [credit, setCredit] = useState(0);
  const [prompt, setPrompt] = useState(localStorage.getItem('prompt') || '');

  const backendUrl = import.meta.env.VITE_BACKEND_URL ;
  const navigate = useNavigate();

  const updatePrompt = (value) => {
    setPrompt(value);
    if (value) {
      localStorage.setItem('prompt', value);
    } else {
      localStorage.removeItem('prompt');
    }
  };

  const loadCreditsData = useCallback(async () => {
    if (!token) return;
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/credits`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 5000,
      });

      if (data?.success) {
        setCredit(data.credits);
        setUser(data.user);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        logout();
      }
    }
  }, [token, backendUrl]);

  const generateImage = async (inputPrompt) => {
    if (!inputPrompt?.trim()) {
      toast.error('Please enter a valid prompt');
      return null;
    }

    if (!token) {
      toast.error('Authentication required');
      setShowLogin(true);
      return null;
    }

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/image/generate-image`,
        { prompt: inputPrompt },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 30000,
        }
      );

      if (!data.success) {
        throw new Error(data.message || 'Generation failed');
      }

      toast.success('Image generated successfully!');
      await loadCreditsData();

      return data.resultImage;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || error.message || 'Image generation failed';

      if (error.response?.status === 402) {
        toast.error('Insufficient credits!');
        navigate('/buy');
      } else {
        toast.error(`Error: ${errorMsg}`);
      }

      await loadCreditsData();
      return null;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('prompt');
    setToken('');
    setUser(null);
    updatePrompt('');
    toast.info('Logged out successfully');
    navigate('/');
  };

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      loadCreditsData();
    }
  }, [token, loadCreditsData]);

  const value = {
    user,
    setUser,
    showLogin,
    setShowLogin,
    token,
    setToken,
    credit,
    setCredit,
    backendUrl,
    logout,
    generateImage,
    prompt,
    setPrompt: updatePrompt,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
