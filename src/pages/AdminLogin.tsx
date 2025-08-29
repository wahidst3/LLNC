import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, Shield } from 'lucide-react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // const handleLogin = (e: React.FormEvent) => {
  //   e.preventDefault();
    
  //   // Hardcoded credentials
  //   if (email === 'lnccorganic@gmail.com' && password === 'lnccorganic786') {
  //     localStorage.setItem('adminLoggedIn', 'true');
  //     navigate('/admin/panel');
  //   } else {
  //     setError('Invalid credentials');
  //   }
  // };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;
      console.log("User ID:", uid);

      // Check Firestore role
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists() && userDoc.data().role === "admin") {
        localStorage.setItem("adminLoggedIn", "true");
        navigate("/admin/panel");
      } else {
        setError("You are not authorized as admin.");
      }
    } catch (err) {
      setError("Invalid email or password.");
    }
  };
 
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E4C7D1] to-[#B56F76] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#B56F76] to-[#E4C7D1] p-8 text-center text-white">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Shield size={32} />
          </motion.div>
          <h1 className="text-2xl font-bold mb-2">Admin Panel</h1>
          <p className="text-white/90">LNCC Organics Management</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="p-8 space-y-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
            >
              {error}
            </motion.div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#B56F76] mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail size={20} className="absolute left-3 top-3 text-[#B56F76]/60" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-[#E4C7D1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B56F76] focus:border-transparent"
                placeholder="lnccorganic@gmail.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#B56F76] mb-2">
              Password
            </label>
            <div className="relative">
              <Lock size={20} className="absolute left-3 top-3 text-[#B56F76]/60" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-[#E4C7D1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B56F76] focus:border-transparent"
                placeholder="Enter admin password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-[#B56F76]/60 hover:text-[#B56F76] transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-[#B56F76] text-white py-3 rounded-lg font-semibold hover:bg-[#B56F76]/90 transition-colors"
          >
            Login to Admin Panel
          </motion.button>

          <div className="text-center">
            <motion.button
              type="button"
              onClick={() => navigate('/')}
              whileHover={{ scale: 1.05 }}
              className="text-[#B56F76] hover:underline transition-colors"
            >
              ← Back to Store
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;