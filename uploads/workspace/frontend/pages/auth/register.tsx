import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../../lib/auth';
import { authAPI } from '../../lib/api';

interface RegisterForm {
  mobile_number: string;
  name: string;
  email?: string;
  role: string;
  language_preference: string;
}

interface OTPForm {
  otp: string;
}

function RegisterPage() {
  const [showOTP, setShowOTP] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpTimer, setOtpTimer] = useState(0);
  const { register: registerUser, verifyOTP, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>();
  const { register: registerOTP, handleSubmit: handleOTPSubmit, formState: { errors: otpErrors } } = useForm<OTPForm>();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  const onRegisterSubmit = async (data: RegisterForm) => {
    const result = await registerUser(data);
    
    if (result.success) {
      setMobileNumber(data.mobile_number);
      setShowOTP(true);
      setOtpTimer(600); // 10 minutes
      toast.success('Registration successful! Please verify your mobile number.');
    } else {
      toast.error(result.message || 'Registration failed');
    }
  };

  const onOTPSubmit = async (data: OTPForm) => {
    const result = await verifyOTP(mobileNumber, data.otp);
    
    if (result.success) {
      toast.success('Account verified successfully!');
      router.push('/dashboard');
    } else {
      toast.error(result.message || 'Invalid OTP');
    }
  };

  const resendOTP = async () => {
    try {
      const response = await authAPI.resendOTP({ mobile_number: mobileNumber, type: 'register' });
      if (response.data.success) {
        setOtpTimer(600);
        toast.success('OTP resent successfully');
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to resend OTP');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Join Gram-Vikas
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Connect with the rural economic engine
          </p>
        </div>

        {!showOTP ? (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onRegisterSubmit)}>
            <div className="space-y-4">
              <div>
                <label htmlFor="mobile_number" className="form-label">
                  Mobile Number *
                </label>
                <input
                  {...register('mobile_number', {
                    required: 'Mobile number is required',
                    pattern: {
                      value: /^[6-9]\d{9}$/,
                      message: 'Please enter a valid 10-digit mobile number'
                    }
                  })}
                  type="tel"
                  className="form-input"
                  placeholder="Enter your mobile number"
                />
                {errors.mobile_number && (
                  <p className="mt-1 text-sm text-red-600">{errors.mobile_number.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="name" className="form-label">
                  Full Name *
                </label>
                <input
                  {...register('name', {
                    required: 'Name is required',
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters'
                    }
                  })}
                  type="text"
                  className="form-input"
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="form-label">
                  Email (Optional)
                </label>
                <input
                  {...register('email', {
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Please enter a valid email address'
                    }
                  })}
                  type="email"
                  className="form-input"
                  placeholder="Enter your email address"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="role" className="form-label">
                  I am a *
                </label>
                <select
                  {...register('role', { required: 'Please select your role' })}
                  className="form-input"
                >
                  <option value="">Select your role</option>
                  <option value="farmer">Farmer</option>
                  <option value="buyer">Buyer</option>
                  <option value="aggregator">Aggregator</option>
                  <option value="hub_operator">Hub Operator</option>
                  <option value="shg_leader">SHG Leader</option>
                </select>
                {errors.role && (
                  <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="language_preference" className="form-label">
                  Preferred Language
                </label>
                <select
                  {...register('language_preference')}
                  className="form-input"
                  defaultValue="hi"
                >
                  <option value="hi">Hindi</option>
                  <option value="en">English</option>
                  <option value="ta">Tamil</option>
                  <option value="te">Telugu</option>
                  <option value="bn">Bengali</option>
                  <option value="mr">Marathi</option>
                  <option value="gu">Gujarati</option>
                </select>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="spinner mr-2" />
                ) : null}
                Create Account
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleOTPSubmit(onOTPSubmit)}>
            <div>
              <p className="text-center text-sm text-gray-600 mb-4">
                Enter the OTP sent to {mobileNumber}
              </p>
              <div>
                <label htmlFor="otp" className="sr-only">
                  OTP
                </label>
                <input
                  {...registerOTP('otp', {
                    required: 'OTP is required',
                    pattern: {
                      value: /^\d{4,6}$/,
                      message: 'Please enter a valid OTP'
                    }
                  })}
                  type="text"
                  maxLength={6}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm text-center"
                  placeholder="Enter OTP"
                />
                {otpErrors.otp && (
                  <p className="mt-1 text-sm text-red-600">{otpErrors.otp.message}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="spinner mr-2" />
                ) : null}
                Verify Account
              </button>
            </div>

            <div className="text-center space-y-2">
              {otpTimer > 0 ? (
                <p className="text-sm text-gray-600">
                  Resend OTP in {Math.floor(otpTimer / 60)}:{(otpTimer % 60).toString().padStart(2, '0')}
                </p>
              ) : (
                <button
                  type="button"
                  onClick={resendOTP}
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  Resend OTP
                </button>
              )}
              <p className="text-sm text-gray-600">
                <button
                  type="button"
                  onClick={() => setShowOTP(false)}
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Back to registration
                </button>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default RegisterPage;