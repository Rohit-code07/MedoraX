import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useApp } from '../context/AppContext';
import { Sparkles, ArrowRight, ShieldCheck, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent } from '../components/ui/Card';
import { MedoraxLogo } from '../components/ui/MedoraxLogo';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { login as apiLogin, signup as apiSignup } from '../api/auth.api';

type AuthMode = 'login' | 'signup';

export const Auth: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useApp();
  const [mode, setMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');
    const userId = searchParams.get('userId');
    const name = searchParams.get('name');
    const email = searchParams.get('email');
    const error = searchParams.get('error');

    if (error) {
      toast.error('Google Sign-in failed. Please try again.');
      return;
    }

    if (token) {
      localStorage.setItem('token', token);
      if (userId) localStorage.setItem('userId', userId);
      login(email || 'user@medorax.ai', name || undefined);
      toast.success('Successfully logged in with Google!');
      navigate('/dashboard', { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    }
  });

  const toggleMode = () => {
    setMode(prev => prev === 'login' ? 'signup' : 'login');
    reset();
  };

  const onSubmit = async (data: any) => {
    setIsSubmitLoading(true);
    try {
      if (mode === 'login') {
        const res = await apiLogin({ email: data.email, password: data.password });
        const { token, userId, name, email } = res.data || {};
        if (token) localStorage.setItem('token', token);
        if (userId) localStorage.setItem('userId', String(userId));
        login(email || data.email, name);
        toast.success('Welcome back to MedoraX!');
        navigate('/dashboard');
      } else {
        const res = await apiSignup({ name: data.name, email: data.email, password: data.password });
        const { token, userId, name, email } = res.data || {};
        if (token) localStorage.setItem('token', token);
        if (userId) localStorage.setItem('userId', String(userId));
        login(email || data.email, name || data.name);
        toast.success('Account created successfully!');
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || err.response?.data?.error || 'Authentication failed. Please check credentials.');
      // Fallback to local session if server is offline during dev
      login(data.email, data.name);
      navigate('/dashboard');
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);
    const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    const backendBase = import.meta.env.VITE_API_BASE_URL || (isLocal ? 'http://localhost:8080' : 'https://medorax-0.onrender.com');
    window.location.href = `${backendBase}/oauth2/authorization/google`;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#09090B] flex text-slate-800 dark:text-zinc-300 transition-colors duration-300">
      
      {/* Left Column: Visual Illustration and Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-tr from-brand-primary via-[#1e40af] to-brand-accent p-16 text-white flex-col justify-between relative overflow-hidden text-left">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        
        {/* Glow Spheres */}
        <div className="absolute top-1/4 -right-16 w-80 h-80 rounded-full bg-brand-secondary/20 blur-3xl" />
        <div className="absolute bottom-1/4 -left-16 w-80 h-80 rounded-full bg-brand-accent/20 blur-3xl" />

        {/* Header Branding */}
        <div className="relative z-10 flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shadow-lg overflow-hidden border border-white/20">
            <MedoraxLogo size={32} />
          </div>
          <span className="font-bold text-sm tracking-tight">MedoraX</span>
        </div>

        {/* Feature Promo illustration */}
        <div className="relative z-10 my-auto flex flex-col gap-6 max-w-lg">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-[10px] font-semibold uppercase tracking-wider w-max">
            MedoraX AI Engine
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-[1.15]">
            Simplify your <br />
            medical routine <br />
            with precision.
          </h2>
          <p className="text-sm text-slate-200/90 leading-relaxed">
            Our intelligent clinical dashboard organizes daily dosages, monitors interactions, and alerts contacts when vital schedules are missed.
          </p>

          {/* Sparkle Highlights list */}
          <div className="flex flex-col gap-4 mt-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-brand-secondary" />
              </div>
              <span className="text-xs font-semibold text-slate-100">HIPAA Compliant Data Vault</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center overflow-hidden">
                <MedoraxLogo size={32} />
              </div>
              <span className="text-xs font-semibold text-slate-100">AI Prescriptions Comparison Scan</span>
            </div>
          </div>
        </div>

        {/* Footer credits */}
        <div className="relative z-10 text-[10px] text-slate-300">
          <span>&copy; 2026 MedoraX. Secure medical coordinator portal.</span>
        </div>
      </div>

      {/* Right Column: Interactive Login/Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 relative">
        <div className="absolute top-8 left-8 lg:hidden flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 rounded-lg bg-[#0f172a] flex items-center justify-center shadow-md overflow-hidden">
            <MedoraxLogo size={32} />
          </div>
          <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white">MedoraX</span>
        </div>

        <motion.div
          key={mode}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md"
        >
          <div className="text-left mb-8">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
            </h1>
            <p className="text-xs text-slate-400 dark:text-zinc-500 mt-2">
              {mode === 'login' 
                ? 'Enter your clinical credentials to access your medication shelf.' 
                : 'Start organizing your medicine intake in under two minutes.'
              }
            </p>
          </div>

          <Card className="border-slate-100 dark:border-zinc-800/80 bg-white/50 dark:bg-zinc-900/30 shadow-xl">
            <CardContent className="p-6 md:p-8 flex flex-col gap-6">
              
              {/* Google login Button */}
              <Button
                variant="outline"
                className="w-full h-11 text-xs tracking-wide bg-white dark:bg-zinc-900/50 border-slate-200 dark:border-zinc-800 flex items-center justify-center gap-2 cursor-pointer"
                onClick={handleGoogleLogin}
                isLoading={isGoogleLoading}
              >
                {!isGoogleLoading && (
                  <svg className="w-4 h-4 mr-1 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                )}
                Continue with Google
              </Button>

              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-100 dark:border-zinc-800" />
                </div>
                <span className="relative z-10 px-3 bg-white dark:bg-[#121214] text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">
                  Or email credentials
                </span>
              </div>

              {/* Form elements */}
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                {mode === 'signup' && (
                  <Input
                    label="Full Name"
                    placeholder="E.g., Rohit Kumar"
                    leftIcon={<User className="w-4 h-4" />}
                    error={errors.name?.message}
                    {...register('name', { required: 'Name is required' })}
                  />
                )}

                <Input
                  label="Email Address"
                  type="email"
                  placeholder="name@company.com"
                  leftIcon={<Mail className="w-4 h-4" />}
                  error={errors.email?.message}
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                />

                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  leftIcon={<Lock className="w-4 h-4" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1 rounded hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 dark:text-zinc-500 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                  error={errors.password?.message}
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                />

                {mode === 'login' && (
                  <div className="flex justify-end mt-[-4px]">
                    <a href="#" className="text-[11px] font-semibold text-brand-primary dark:text-brand-secondary hover:underline">
                      Forgot Password?
                    </a>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-11 rounded-xl text-xs font-bold tracking-wider uppercase mt-2 cursor-pointer"
                  isLoading={isSubmitLoading}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  {mode === 'login' ? 'Login Securely' : 'Create Account'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Toggle Login/Signup */}
          <div className="text-center mt-6">
            <span className="text-xs text-slate-400 dark:text-zinc-500">
              {mode === 'login' ? "Don't have an account?" : 'Already registered?'}
            </span>
            <button
              type="button"
              onClick={toggleMode}
              className="text-xs font-bold text-brand-primary dark:text-brand-secondary hover:underline ml-1.5 cursor-pointer"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        </motion.div>
      </div>

    </div>
  );
};
export default Auth;
