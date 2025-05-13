
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { ArrowLeft, AlertCircle, Key } from 'lucide-react';
import Logo from '../components/Logo';
import { supabase } from '../lib/supabase';
import { useToast } from '@/components/ui/use-toast';

// Define the form validation schema
const formSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  matricNumber: z
    .string()
    .regex(/^(HND)?[0-9]{2}-[0-9]{2}-[0-9]{4}$/, "Invalid matric number format. Example: 22-04-0191 or HND22-04-0191"),
});

// TypeScript type from our schema
type FormValues = z.infer<typeof formSchema>;

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showResetForm, setShowResetForm] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      matricNumber: '',
    }
  });

  const onVerifySubmit = async (data: FormValues) => {
    setLoading(true);
    setError('');
    
    try {
      // First, get the student record by matric number
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .select('user_id, matric_number')
        .eq('matric_number', data.matricNumber)
        .single();
      
      if (studentError || !studentData) {
        setError('Student with this matriculation number not found');
        setLoading(false);
        return;
      }
      
      // Then verify user details
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, name, email')
        .eq('id', studentData.user_id)
        .eq('name', data.fullName)
        .eq('email', data.email)
        .single();
        
      if (userError || !userData) {
        setError('The details provided do not match our records');
        setLoading(false);
        return;
      }
      
      // If all checks pass, show the reset form
      setUserId(userData.id);
      setShowResetForm(true);
      
    } catch (err) {
      console.error('Error during verification:', err);
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) {
      setError('User information is missing. Please try again.');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    try {
      const { error: updateError } = await supabase
        .from('users')
        .update({ password: newPassword })
        .eq('id', userId);
        
      if (updateError) throw updateError;
      
      toast({
        title: "Password Reset Successful",
        description: "Your password has been updated. You can now login with your new password.",
      });
      
      navigate('/login/student');
      
    } catch (err) {
      console.error('Error resetting password:', err);
      setError('Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Logo />
          <h1 className="text-3xl font-bold text-aapoly-dark mt-6">Recover Password</h1>
          <p className="text-aapoly-gray mt-2">
            {showResetForm 
              ? "Set your new password" 
              : "Enter your details to verify your account"}
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!showResetForm ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onVerifySubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="Enter your email" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="matricNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Matriculation Number</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., 22-04-0191 or HND22-04-0191" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-aapoly-purple hover:bg-aapoly-purple/90"
                  disabled={loading}
                >
                  {loading ? 'Verifying...' : 'Verify Account'}
                </Button>
              </form>
            </Form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full"
                  required
                  minLength={6}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full"
                  required
                  minLength={6}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-aapoly-purple hover:bg-aapoly-purple/90"
                disabled={loading}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </form>
          )}
        </div>

        <div className="mt-8 text-center">
          <Button
            variant="ghost"
            onClick={() => navigate('/login/student')}
            className="flex items-center text-aapoly-gray hover:text-aapoly-purple"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
