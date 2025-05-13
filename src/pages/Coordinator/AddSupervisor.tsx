
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
import { AlertCircle, UserPlus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { DEPARTMENTS } from '../../constants';
import DashboardLayout from '../../components/Dashboard/DashboardLayout';

// Define the form validation schema
const formSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  department: z.string().min(1, "Please select a department"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

// TypeScript type from our schema
type FormValues = z.infer<typeof formSchema>;

const AddSupervisor = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phoneNumber: '',
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
      
      // First create a user record
      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert([
          {
            name: data.fullName,
            email: data.email,
            password: data.password, // In a real app, encrypt this before storing
            role: 'supervisor',
          }
        ])
        .select('id')
        .single();
        
      if (userError) throw userError;
      
      // Then create a supervisor record linked to the user
      const { error: supervisorError } = await supabase
        .from('supervisors')
        .insert([
          {
            user_id: newUser.id,
            department: data.department,
            phone_number: data.phoneNumber,
          }
        ]);
      
      if (supervisorError) {
        // Rollback user creation if supervisor creation fails
        await supabase.from('users').delete().eq('id', newUser.id);
        throw supervisorError;
      }
      
      toast({
        title: "Supervisor Added",
        description: "The supervisor account has been created successfully.",
      });
      
      // Reset form
      form.reset();
      
    } catch (err) {
      console.error('Error adding supervisor:', err);
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout pageTitle="Add Supervisor">
      <div className="container mx-auto py-6">
        <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-6">
            <UserPlus className="h-6 w-6 text-aapoly-purple" />
            <h2 className="text-2xl font-bold">Add New Supervisor</h2>
          </div>
          
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
                      <Input placeholder="Enter supervisor's full name" {...field} />
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
                        placeholder="Enter supervisor's email" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter supervisor's phone number" 
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
                          <SelectValue placeholder="Select department" />
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
                        placeholder="Confirm password" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => form.reset()}
                  type="button"
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  className="bg-aapoly-purple hover:bg-aapoly-purple/90"
                  disabled={loading}
                >
                  {loading ? 'Adding...' : 'Add Supervisor'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AddSupervisor;
