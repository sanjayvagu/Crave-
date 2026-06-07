import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';

interface WelcomeProps {
  onStart: () => void;
}

const ONBOARDING_STEPS = [
  {
    id: 1,
    title: "Yeleswaram’s fastest food delivery app",
    description: "crave makes it simple to find the food you love. Enter your address and let us do the rest.",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    title: "Order your favorite meals",
    description: "When you order with crave, we'll hook you up with exclusive coupons, specials and rewards.",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    title: "Fastest delivery to your door",
    description: "Fast delivery to your home, office wherever you are. We offer the fastest delivery to you.",
    image: "https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=800&q=80"
  }
];

export const Welcome: React.FC<WelcomeProps> = ({ onStart }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loginState, setLoginState] = useState<'onboarding' | 'phone' | 'otp'>('onboarding');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');

  const handleNext = () => {
    if (loginState === 'onboarding') {
      if (currentStep < ONBOARDING_STEPS.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        setLoginState('phone');
      }
    } else if (loginState === 'phone') {
      if (phone.length >= 10) {
        setLoginState('otp');
      }
    } else if (loginState === 'otp') {
      if (otp.length >= 4) {
        onStart();
      }
    }
  };

  const step = ONBOARDING_STEPS[currentStep];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: "-100%" }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 bg-white flex flex-col z-40 overflow-hidden"
    >
      <div className="flex-1 relative bg-orange-50/50 overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          {loginState === 'onboarding' ? (
            <motion.img 
              key={step.id}
              initial={{ opacity: 0, scale: 1.1, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              src={step.image} 
              alt={step.title}
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          ) : loginState === 'phone' ? (
            <motion.div
              key="phone-bg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-[#fc8019]/10"
            >
               <h1 className="text-5xl font-black tracking-tight lowercase text-[#fc8019]" style={{ fontFamily: 'Outfit, sans-serif' }}>crave</h1>
            </motion.div>
          ) : (
            <motion.div
              key="otp-bg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-[#fc8019]/10"
            >
               <h1 className="text-5xl font-black tracking-tight lowercase text-[#fc8019]" style={{ fontFamily: 'Outfit, sans-serif' }}>crave</h1>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent" />
      </div>

      <div className="px-8 pb-12 pt-6 shrink-0 z-10 bg-white min-h-[300px] flex flex-col justify-end">
        <AnimatePresence mode="wait">
          {loginState === 'onboarding' && (
            <motion.div
              key="onboarding-controls"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex justify-center gap-2 mb-8">
                {ONBOARDING_STEPS.map((s, idx) => (
                  <div 
                    key={s.id} 
                    className={`h-2 rounded-full transition-all duration-300 ${idx === currentStep ? 'w-8 bg-[#fc8019]' : 'w-2 bg-slate-200'}`}
                  />
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h1 className="text-3xl font-black text-slate-800 mb-4 tracking-tight leading-tight">
                    {step.title}
                  </h1>
                  <p className="text-slate-500 text-base mb-8 leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}

          {loginState === 'phone' && (
            <motion.div
              key="phone-controls"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col gap-4"
            >
              <h1 className="text-2xl font-black text-slate-800 mb-2">Let's get started</h1>
              <p className="text-slate-500 mb-4">Enter your mobile number to continue</p>
              <div className="flex gap-2 mb-6">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 flex items-center justify-center font-bold text-slate-600">
                  +91
                </div>
                <input 
                  type="tel"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 font-bold text-slate-800 outline-none focus:border-[#fc8019]"
                />
              </div>
            </motion.div>
          )}

          {loginState === 'otp' && (
            <motion.div
              key="otp-controls"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col gap-4"
            >
              <h1 className="text-2xl font-black text-slate-800 mb-2">Verify details</h1>
              <p className="text-slate-500 mb-4">OTP sent to +91 {phone} <br/><span className="text-xs text-[#fc8019] mt-1.5 font-medium inline-block bg-orange-50 px-2.5 py-1 rounded-full border border-orange-100">Sample OTP: 1234</span></p>
              <div className="flex justify-between mb-6">
                {[...Array(4)].map((_, i) => (
                  <input 
                    key={i}
                    type="text"
                    maxLength={1}
                    value={otp[i] || ''}
                    onChange={e => {
                      const newOtp = otp.split('');
                      newOtp[i] = e.target.value;
                      setOtp(newOtp.join('').replace(/\D/g, '').slice(0, 4));
                      if (e.target.value && e.target.nextSibling) {
                        (e.target.nextSibling as HTMLInputElement).focus();
                      }
                    }}
                    className="w-16 h-16 text-center text-2xl font-black bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-[#fc8019]"
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          animate={{
            boxShadow: [
              "0px 4px 15px rgba(252, 128, 25, 0.3)",
              "0px 0px 30px rgba(252, 128, 25, 0.7)",
              "0px 4px 15px rgba(252, 128, 25, 0.3)"
            ]
          }}
          transition={{
            boxShadow: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
          onClick={handleNext}
          disabled={(loginState === 'phone' && phone.length < 10) || (loginState === 'otp' && otp.length < 4)}
          className="w-full bg-[#fc8019] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 group mt-auto disabled:opacity-50 disabled:shadow-none"
        >
          {loginState === 'onboarding' ? (currentStep === ONBOARDING_STEPS.length - 1 ? 'Get Started' : 'Next') : loginState === 'phone' ? 'Continue' : 'Verify & Login'}
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </motion.button>
        
        {loginState === 'onboarding' && (
          <button 
            onClick={onStart} 
            className="mt-6 text-center text-slate-500 font-bold text-sm hover:text-slate-800 transition-colors"
          >
            Continue as Guest
          </button>
        )}
      </div>
    </motion.div>
  );
};
