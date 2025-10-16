import { useState, useEffect } from 'react';
import { Mail, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { authApi } from '../services/authApi';

interface EmailVerificationPageProps {
  email: string;
  onVerified: () => void;
  onBackToLogin: () => void;
}

export function EmailVerificationPage({ email, onVerified, onBackToLogin }: EmailVerificationPageProps) {
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authApi.verifyEmail({
        email,
        otp_code: otpCode,
      });

      if (response.status === 'Error') {
        setError(response.message || 'Verification failed');
      } else {
        setSuccess('Email verified successfully! Redirecting to login...');
        setTimeout(() => {
          onVerified();
        }, 2000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResending(true);
    setError('');
    setSuccess('');

    try {
      const response = await authApi.resendOTP({ email });

      if (response.status === 'Error') {
        setError(response.message || 'Failed to resend OTP');
      } else {
        setSuccess('OTP sent successfully! Please check your email.');
        setTimer(60);
        setCanResend(false);
        setOtpCode('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <CardTitle>Verify Your Email</CardTitle>
          <CardDescription>
            We've sent a verification code to<br />
            <strong>{email}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">Enter 6-Digit Code</Label>
              <Input
                id="otp"
                type="text"
                placeholder="000000"
                maxLength={6}
                value={otpCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setOtpCode(value);
                  setError('');
                }}
                className="text-center text-2xl tracking-widest"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-600">{success}</p>
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={loading || otpCode.length !== 6}>
              {loading ? 'Verifying...' : 'Verify Email'}
            </Button>

            <div className="space-y-3">
              <div className="text-center">
                {canResend ? (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleResendOTP}
                    disabled={resending}
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${resending ? 'animate-spin' : ''}`} />
                    {resending ? 'Sending...' : 'Resend OTP'}
                  </Button>
                ) : (
                  <p className="text-sm text-gray-500">
                    Resend OTP in <strong>{timer}s</strong>
                  </p>
                )}
              </div>

              <div className="text-center">
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:underline"
                  onClick={onBackToLogin}
                >
                  Back to Login
                </button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
