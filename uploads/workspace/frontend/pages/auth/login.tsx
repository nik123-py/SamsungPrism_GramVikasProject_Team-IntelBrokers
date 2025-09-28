import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../../lib/auth';
import toast from 'react-hot-toast';
import {
  UserCircleIcon,
  LockClosedIcon,
  ArrowRightIcon,
  DevicePhoneMobileIcon,
} from '@heroicons/react/24/outline';

function LoginPage() {
  const { isAuthenticated, isLoading, login, loginWithOTP } = useAuth();
  const router = useRouter();
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mobileNumber) {
      toast.error('Please enter your mobile number');
      return;
    }

    if (otpSent && !otp) {
      toast.error('Please enter the OTP');
      return;
    }

    if (otpSent && otp) {
      // Verify OTP
      const result = await loginWithOTP(mobileNumber, otp);
      if (result.success) {
        toast.success('Login successful!');
        router.push('/dashboard');
      } else {
        toast.error(result.message || 'OTP verification failed');
      }
    } else {
      // Send OTP
      const result = await login(mobileNumber, password);
      if (result.success && result.otpSent) {
        setOtpSent(true);
        toast.success('OTP sent to your mobile number');
      } else {
        toast.error(result.message || 'Login failed');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="spinner w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
            <UserCircleIcon className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to Gram-Vikas
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Access your agricultural marketplace account
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="bg-white py-8 px-6 shadow rounded-lg">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
                  Mobile Number
                </label>
                <div className="mt-1 relative">
                  <input
                    id="mobile"
                    name="mobile"
                    type="tel"
                    required
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="form-input pl-10"
                    placeholder="Enter your mobile number"
                  />
                  <DevicePhoneMobileIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              {!otpSent && (
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password (Optional)
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="form-input pl-10"
                      placeholder="Enter password (optional)"
                    />
                    <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Leave blank to receive OTP
                  </p>
                </div>
              )}

              {otpSent && (
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                    Enter OTP
                  </label>
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="form-input"
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                  />
                </div>
              )}

              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                {otpSent ? 'Verify OTP' : 'Sign In'}
                <ArrowRightIcon className="h-5 w-5 ml-2" />
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">New to Gram-Vikas?</span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <Link
                  href="/auth/register"
                  className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                >
                  Create an account
                </Link>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              By signing in, you agree to our{' '}
              <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;