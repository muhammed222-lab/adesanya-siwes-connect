
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { UserRole } from '../../types';
import Logo from '../../components/Logo';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { DEPARTMENTS } from '../../constants';

const RegisterForm = () => {
  const { role } = useParams<{ role: string }>();
  const navigate = useNavigate();
  
  // Validate that the role is valid
  const validRole = ['student', 'supervisor', 'coordinator'].includes(role || '') 
    ? role as UserRole
    : 'student';
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    matricNumber: '',
    department: '',
    phoneNumber: '',
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, department: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    
    // In a real app, this would be an API call to register the user
    setTimeout(() => {
      setLoading(false);
      // Simulate successful registration
      navigate(`/login/${validRole}`, { 
        state: { message: 'Registration successful! Please login with your credentials.' } 
      });
    }, 1500);
  };

  const getFormTitle = () => {
    switch (validRole) {
      case 'student': return 'Student Registration';
      case 'supervisor': return 'Supervisor Registration';
      case 'coordinator': return 'Coordinator Registration';
      default: return 'Registration';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Logo />
          <h1 className="text-3xl font-bold text-aapoly-dark mt-6">{getFormTitle()}</h1>
          <p className="text-aapoly-gray mt-2">Create your account to get started</p>
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
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                className="w-full"
              />
            </div>

            {validRole === 'student' && (
              <div className="space-y-2">
                <label htmlFor="matricNumber" className="block text-sm font-medium text-gray-700">Matriculation Number</label>
                <Input
                  id="matricNumber"
                  value={formData.matricNumber}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 22-04-0191"
                  className="w-full"
                  pattern="\d{2}-\d{2}-\d{4}"
                  title="Format: XX-XX-XXXX (e.g., 22-04-0191)"
                />
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
              <Select 
                onValueChange={handleSelectChange} 
                defaultValue={formData.department}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your department" />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {(validRole === 'supervisor' || validRole === 'coordinator') && (
              <div className="space-y-2">
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  placeholder="Enter your phone number"
                  className="w-full"
                />
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Create a password"
                className="w-full"
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm your password"
                className="w-full"
                minLength={6}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-aapoly-purple hover:bg-aapoly-purple/90"
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </Button>
          </form>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <a 
              href={`/login/${validRole}`} 
              className="text-aapoly-purple hover:underline"
              onClick={(e) => {
                e.preventDefault();
                navigate(`/login/${validRole}`);
              }}
            >
              Login here
            </a>
          </p>
        </div>

        <div className="mt-8 text-center">
          <Button
            variant="ghost"
            onClick={() => navigate('/register')}
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

export default RegisterForm;
