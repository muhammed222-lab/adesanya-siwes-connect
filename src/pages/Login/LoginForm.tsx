
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';
import Logo from '../../components/Logo';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { DEFAULT_USERS } from '../../constants';

const LoginForm = () => {
  const { role } = useParams<{ role: string }>();
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Validate that the role is valid
  const validRole = ['student', 'supervisor', 'coordinator'].includes(role || '') 
    ? role as UserRole
    : 'student';
  
  // Get default credentials for selected role
  const defaultCredentials = DEFAULT_USERS[validRole];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const success = await login(email, password, validRole);
      
      if (success) {
        // Redirect based on role
        switch (validRole) {
          case 'student':
            navigate('/student/dashboard');
            break;
          case 'supervisor':
            navigate('/supervisor/dashboard');
            break;
          case 'coordinator':
            navigate('/coordinator/dashboard');
            break;
          default:
            navigate('/');
        }
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getFormTitle = () => {
    switch (validRole) {
      case 'student': return 'Student Login';
      case 'supervisor': return 'Supervisor Login';
      case 'coordinator': return 'Coordinator Login';
      default: return 'Login';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Logo />
          <h1 className="text-3xl font-bold text-aapoly-dark mt-6">{getFormTitle()}</h1>
          <p className="text-aapoly-gray mt-2">Enter your credentials to access your account</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="w-full"
              />
              <div className="text-right">
                <a href="#" className="text-sm text-aapoly-purple hover:underline">
                  Forgot password?
                </a>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-aapoly-purple hover:bg-aapoly-purple/90"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
          
          {defaultCredentials && (
            <div className="mt-6 p-3 bg-gray-50 rounded border border-gray-200">
              <p className="text-sm text-gray-600 font-medium">Test Credentials:</p>
              <p className="text-sm text-gray-600">
                Email: <span className="font-mono">{defaultCredentials.email}</span>
              </p>
              <p className="text-sm text-gray-600">
                Password: <span className="font-mono">{defaultCredentials.password}</span>
              </p>
            </div>
          )}
          
          {validRole === 'student' && (
            <div className="mt-6 text-center border-t pt-4">
              <p className="text-gray-600">
                New student?{' '}
                <a 
                  href="#" 
                  className="text-aapoly-purple hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/signup/student');
                  }}
                >
                  Create an account
                </a>
              </p>
              <p className="text-gray-600 mt-2">
                <a 
                  href="#" 
                  className="text-aapoly-purple hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/forgot-password');
                  }}
                >
                  Forgot password?
                </a>
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <Button
            variant="ghost"
            onClick={() => navigate('/login')}
            className="flex items-center text-aapoly-gray hover:text-aapoly-purple"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Role Selection
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
