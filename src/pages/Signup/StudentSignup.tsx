
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { DEPARTMENTS } from '../../constants';
import Logo from '../../components/Logo';
import { supabase } from '../../lib/supabase';
import { toast } from '@/components/ui/use-toast';

// Define the form validation schema
const formSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  matricNumber: z
    .string()
    .regex(/^(HND)?[0-9]{2}-[0-9]{2}-[0-9]{4}$/, "Invalid matric number format. Example: 22-04-0191 or HND22-04-0191"),
  department: z.string().min(1, "Please select your department"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

// TypeScript type from our schema
type FormValues = z.infer<typeof formSchema>;

const StudentSignup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      matricNumber: '',
      department: '',
      password: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    setError('');
    
    try {
      // Check if user already exists with this email
      const { data: existingUser } = await supabase
        .from('users')
        .select('email')
        .eq('email', data.email)
        .single();
      
      if (existingUser) {
        setError('A user with this email already exists');
        setLoading(false);
        return;
      }
      
      // Check if matric number already exists
      const { data: existingMatric } = await supabase
        .from('students')
        .select('matric_number')
        .eq('matric_number', data.matricNumber)
        .single();
        
      if (existingMatric) {
        setError('This matriculation number is already registered');
        setLoading(false);
        return;
      }
      
      // First create a user record
      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert([
          {
            name: data.fullName,
            email: data.email,
            password: data.password, // In a real app, encrypt this before storing
            role: 'student',
          }
        ])
        .select('id')
        .single();
        
      if (userError) throw userError;
      
      // Then create a student record linked to the user
      const { error: studentError } = await supabase
        .from('students')
        .insert([
          {
            user_id: newUser.id,
            matric_number: data.matricNumber,
            department: data.department,
            payment_status: 'pending',
            level: 'ND1' // Default level as specified
          }
        ]);
      
      if (studentError) {
        // Rollback user creation if student creation fails
        await supabase.from('users').delete().eq('id', newUser.id);
        throw studentError;
      }
      
      toast({
        title: "Registration Successful",
        description: "Your account has been created. Please login to continue.",
      });
      
      navigate('/login/student', { 
        state: { message: 'Registration successful! Please login with your credentials.' } 
      });
    } catch (err) {
      console.error('Error during registration:', err);
      setError('An error occurred during registration. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Logo />
          <h1 className="text-3xl font-bold text-aapoly-dark mt-6">Student Registration</h1>
          <p className="text-aapoly-gray mt-2">Create your student account to get started</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
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
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Create a password" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Confirm your password" 
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
                {loading ? 'Registering...' : 'Register'}
              </Button>
            </form>
          </Form>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <a 
              href="#" 
              className="text-aapoly-purple hover:underline"
              onClick={(e) => {
                e.preventDefault();
                navigate('/login/student');
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

export default StudentSignup;
