
// import React, { useState,useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { X, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';
// import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile ,onAuthStateChanged} from "firebase/auth";
// import { auth,db } from '../config/firebase'; // Adjust the import based on your firebase setup
// import { doc, setDoc } from "firebase/firestore";
//  const [firebaseUser, setFirebaseUser] = useState<any>(null);

// interface AuthModalProps {
//   isOpen: boolean;
//   onClose: () => void;
// }
 
// const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
//   const [isLogin, setIsLogin] = useState(true);
//   const [showPassword, setShowPassword] = useState(false);
//   const [formData, setFormData] = useState({ name: '', email: '', password: '' });
//   const { login, register, user, logout } = useAuth();

//  useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       setFirebaseUser(user);
//     });
//     return unsubscribe;
//   }, []);
//   // const handleSubmit = async (e: React.FormEvent) => {
//   //   e.preventDefault();

//   //   const action = isLogin
//   //     ? () => login(formData.email, formData.password)
//   //     : () => register(formData.email, formData.password, formData.name);

//   //   const success = await action();

//   //   if (success) {
//   //     onClose();
//   //   } else {
//   //     alert(isLogin ? 'Invalid credentials. Please try again.' : 'Registration failed. Please try again.');
//   //   }
//   // };
// const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();

//   try {
//     if (isLogin) {
//       // Login
//       await signInWithEmailAndPassword(auth, formData.email, formData.password);
//       onClose();
//     } else {
//       // Sign Up
//       const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);

//       // Optional: Update display name
//       if (formData.name) {
//         await updateProfile(userCredential.user, { displayName: formData.name });
//       }
//    await setDoc(doc(db, "users", userCredential.user.uid), {
//           uid: userCredential.user.uid,
//           name: formData.name,
//           email: formData.email,
//           createdAt: new Date(),
//         });

//       onClose();
//     }
//   } catch (error: any) {
//     alert(error.message);
//   }
// };
//   const toggleMode = () => {
//     setIsLogin(!isLogin);
//     setFormData({ name: '', email: '', password: '' });
//     setShowPassword(false);
//   };

//   const handleChange = (field: keyof typeof formData, value: string) =>
//     setFormData(prev => ({ ...prev, [field]: value }));

//   const handleLogout = () => {
//     logout();
//     onClose();
//   };

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <>
//           {/* Background Overlay */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             onClick={onClose}
//             className="fixed inset-0 bg-black/50 z-40"
//           />

//           {/* Auth Modal */}
//           <motion.div
//             initial={{ opacity: 0, scale: 0.9, y: 50 }}
//             animate={{ opacity: 1, scale: 1, y: 0 }}
//             exit={{ opacity: 0, scale: 0.9, y: 50 }}
//             className={`fixed ${isLogin ? 'top-[43%] left-1/2' : "top-[32%]"} left-1/2 transform -translate-x-1/2 -translate-y-1/2 
//                        bg-white rounded-2xl shadow-2xl z-50 w-full max-w-md overflow-hidden`}
//           >
//             {/* Header */}
//             <div className="bg-gradient-to-r from-[#B56F76] to-[#E4C7D1] p-6 text-white">
//               <div className="flex items-center justify-between">
//                 <h2 className="text-2xl font-bold">{isLogin ? 'Welcome Back' : 'Join Us'}</h2>
//                 <motion.button
//                   whileHover={{ scale: 1.1 }}
//                   whileTap={{ scale: 0.9 }}
//                   onClick={onClose}
//                   className="p-2 rounded-full hover:bg-white/20 transition-colors"
//                 >
//                   <X size={20} />
//                 </motion.button>
//               </div>
//               <p className="mt-2 opacity-90">
//                 {isLogin ? 'Sign in to your account' : 'Create your account'}
//               </p>
//             </div>

//             {/* If user is logged in */}
//             {user ? (
//               <div className="p-6 text-center">
//                 <div className="w-16 h-16 bg-[#E4C7D1] rounded-full flex items-center justify-center mx-auto mb-4">
//                   <User size={32} className="text-[#B56F76]" />
//                 </div>
//                 <h2 className="text-2xl font-bold text-[#B56F76] mb-2">Hello!</h2>
//                 <p className="text-gray-600 mb-6">{user.name}</p>
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={handleLogout}
//                   className="w-full bg-[#B56F76] text-white py-3 rounded-lg font-semibold hover:bg-[#B56F76]/90 transition-colors"
//                 >
//                   Logout
//                 </motion.button>
//               </div>
//             ) : (
//               /* Login / Signup Form */
//               <form onSubmit={handleSubmit} className="p-6 space-y-4">
//                 {!isLogin && (
//                   <div>
//                     <label className="block text-sm font-medium text-[#B56F76] mb-2">Full Name</label>
//                     <div className="relative">
//                       <User size={20} className="absolute left-3 top-3 text-[#B56F76]/60" />
//                       <input
//                         type="text"
//                         value={formData.name}
//                         onChange={(e) => handleChange('name', e.target.value)}
//                         className="w-full pl-10 pr-4 py-3 border border-[#E4C7D1] rounded-lg 
//                                    focus:outline-none focus:ring-2 focus:ring-[#B56F76]"
//                         placeholder="Enter your full name"
//                         required
//                       />
//                     </div>
//                   </div>
//                 )}

//                 <div>
//                   <label className="block text-sm font-medium text-[#B56F76] mb-2">Email Address</label>
//                   <div className="relative">
//                     <Mail size={20} className="absolute left-3 top-3 text-[#B56F76]/60" />
//                     <input
//                       type="email"
//                       value={formData.email}
//                       onChange={(e) => handleChange('email', e.target.value)}
//                       className="w-full pl-10 pr-4 py-3 border border-[#E4C7D1] rounded-lg 
//                                  focus:outline-none focus:ring-2 focus:ring-[#B56F76]"
//                       placeholder="Enter your email"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-[#B56F76] mb-2">Password</label>
//                   <div className="relative">
//                     <Lock size={20} className="absolute left-3 top-3 text-[#B56F76]/60" />
//                     <input
//                       type={showPassword ? 'text' : 'password'}
//                       value={formData.password}
//                       onChange={(e) => handleChange('password', e.target.value)}
//                       className="w-full pl-10 pr-12 py-3 border border-[#E4C7D1] rounded-lg 
//                                  focus:outline-none focus:ring-2 focus:ring-[#B56F76]"
//                       placeholder="Enter your password"
//                       required
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword(!showPassword)}
//                       className="absolute right-3 top-3 text-[#B56F76]/60 hover:text-[#B56F76]"
//                     >
//                       {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                     </button>
//                   </div>
//                 </div>

//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   type="submit"
//                   className="w-full bg-[#B56F76] text-white py-3 rounded-lg font-semibold hover:bg-[#B56F76]/90 transition-colors"
//                 >
//                   {isLogin ? 'Sign In' : 'Create Account'}
//                 </motion.button>

//                 <div className="text-center">
//                   <button
//                     type="button"
//                     onClick={toggleMode}
//                     className="text-[#B56F76] hover:underline"
//                   >
//                     {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
//                   </button>
//                 </div>
//               </form>
//             )}
//           </motion.div>
//         </>
//       )}
//     </AnimatePresence>
//   );
// };

// export default AuthModal;

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { auth, db } from "../config/firebase";
import { doc, setDoc } from "firebase/firestore";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState<any>(null);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
    });
    return unsubscribe;
  }, []);

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        // Login
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
        onClose();
      } else {
        // Sign Up
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );

        // Update display name
        if (formData.name) {
          await updateProfile(userCredential.user, { displayName: formData.name });
        }

        // Save in Firestore
        await setDoc(
          doc(db, "users", userCredential.user.uid),
          {
            uid: userCredential.user.uid,
            name: formData.name,
            email: formData.email,
             role: "user",
            createdAt: new Date(),
          },
          { merge: true } // prevents overwriting
        );

        console.log("User stored in Firestore");
        onClose();
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ name: "", email: "", password: "" });
    setShowPassword(false);
  };

  const handleChange = (field: keyof typeof formData, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleLogout = async () => {
    await signOut(auth);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Background Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className={`fixed ${isLogin ? "top-[43%]" : "top-[32%]"} left-1/2 transform -translate-x-1/2 -translate-y-1/2 
              bg-white rounded-2xl shadow-2xl z-50 w-full max-w-md overflow-hidden`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#B56F76] to-[#E4C7D1] p-6 text-white">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  {isLogin ? "Welcome Back" : "Join Us"}
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-white/20 transition-colors"
                >
                  <X size={20} />
                </motion.button>
              </div>
              <p className="mt-2 opacity-90">
                {isLogin ? "Sign in to your account" : "Create your account"}
              </p>
            </div>

            {/* Logged-in view */}
            {firebaseUser ? (
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-[#E4C7D1] rounded-full flex items-center justify-center mx-auto mb-4">
                  <User size={32} className="text-[#B56F76]" />
                </div>
                <h2 className="text-2xl font-bold text-[#B56F76] mb-2">Hello!</h2>
                <p className="text-gray-600 mb-6">
                  {firebaseUser.displayName || firebaseUser.email}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="w-full bg-[#B56F76] text-white py-3 rounded-lg font-semibold hover:bg-[#B56F76]/90"
                >
                  Logout
                </motion.button>
              </div>
            ) : (
              /* Login / Signup Form */
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-[#B56F76] mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User size={20} className="absolute left-3 top-3 text-[#B56F76]/60" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-[#E4C7D1] rounded-lg 
                          focus:outline-none focus:ring-2 focus:ring-[#B56F76]"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-[#B56F76] mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={20} className="absolute left-3 top-3 text-[#B56F76]/60" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-[#E4C7D1] rounded-lg 
                        focus:outline-none focus:ring-2 focus:ring-[#B56F76]"
                      placeholder="Enter your email"
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
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      className="w-full pl-10 pr-12 py-3 border border-[#E4C7D1] rounded-lg 
                        focus:outline-none focus:ring-2 focus:ring-[#B56F76]"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-[#B56F76]/60 hover:text-[#B56F76]"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-[#B56F76] text-white py-3 rounded-lg font-semibold hover:bg-[#B56F76]/90"
                >
                  {isLogin ? "Sign In" : "Create Account"}
                </motion.button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="text-[#B56F76] hover:underline"
                  >
                    {isLogin
                      ? "Don't have an account? Sign up"
                      : "Already have an account? Sign in"}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
