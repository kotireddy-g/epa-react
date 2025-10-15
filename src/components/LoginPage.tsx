import { useState } from 'react';
import { LogIn } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface LoginPageProps {
  onLogin: (username: string) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Dummy authentication
    if (username === 'Admin' && password === 'Admin') {
      onLogin(username);
    } else {
      setError('Invalid credentials. Use Username: Admin, Password: Admin');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
            <LogIn className="w-6 h-6 text-white" />
          </div>
          <CardTitle>Welcome to IDEA to Business</CardTitle>
          <CardDescription>
            Transform your ideas into actionable business plans
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError('');
                }}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-900">
                <strong>Demo Credentials:</strong>
              </p>
              <p className="text-sm text-blue-700 mt-1">
                Username: <strong>Admin</strong>
              </p>
              <p className="text-sm text-blue-700">
                Password: <strong>Admin</strong>
              </p>
            </div>

            <Button type="submit" className="w-full" size="lg">
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{' '}
              <button className="text-blue-600 hover:underline">
                Sign up
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
