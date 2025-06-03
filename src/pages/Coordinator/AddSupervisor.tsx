
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/components/ui/use-toast';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';
import { supabase, isSupabaseReady } from '@/lib/supabase';
import { AlertCircle, Plus, UserPlus } from 'lucide-react';

const AddSupervisor = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    phoneNumber: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const departments = [
    'Computer Science',
    'Engineering Technology',
    'Business Administration',
    'Mass Communication',
    'Science Laboratory Technology',
    'Accountancy',
    'Banking and Finance',
    'Marketing',
    'Office Technology and Management',
    'Public Administration',
    'Statistics',
    'Architecture Technology',
    'Building Technology',
    'Civil Engineering Technology',
    'Electrical/Electronic Engineering Technology',
    'Mechanical Engineering Technology',
    'Agricultural Technology',
    'Food Technology'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Full name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.department) {
      setError('Department is required');
      return false;
    }
    if (!formData.phoneNumber.trim()) {
      setError('Phone number is required');
      return false;
    }
    if (!formData.password || formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (!isSupabaseReady) {
        // Fallback for when Supabase is not configured
        console.log('Mock supervisor creation:', formData);
        toast({
          title: "Success!",
          description: `Supervisor ${formData.name} has been added successfully (mock mode)`,
        });
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          department: '',
          phoneNumber: '',
          password: ''
        });
        setLoading(false);
        return;
      }

      // Create user in users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert({
          name: formData.name,
          email: formData.email,
          role: 'supervisor',
          password: formData.password
        })
        .select()
        .single();

      if (userError) throw userError;

      // Create supervisor profile
      const { error: supervisorError } = await supabase
        .from('supervisors')
        .insert({
          user_id: userData.id,
          department: formData.department,
          phone_number: formData.phoneNumber
        });

      if (supervisorError) throw supervisorError;

      toast({
        title: "Success!",
        description: `Supervisor ${formData.name} has been added successfully`,
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        department: '',
        phoneNumber: '',
        password: ''
      });

    } catch (error) {
      console.error('Error creating supervisor:', error);
      setError('Failed to create supervisor. Please try again.');
      toast({
        title: "Error",
        description: "Failed to create supervisor. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <UserPlus className="w-8 h-8 text-aapoly-purple" />
          <div>
            <h1 className="text-3xl font-bold text-aapoly-dark">Add Supervisor</h1>
            <p className="text-aapoly-gray">Create a new supervisor account</p>
          </div>
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Supervisor Information
            </CardTitle>
            <CardDescription>
              Enter the supervisor's details to create their account
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Full Name *
                </label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter supervisor's full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address *
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="supervisor@aapoly.edu.ng"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="department" className="text-sm font-medium text-gray-700">
                  Department *
                </label>
                <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
                  Phone Number *
                </label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  placeholder="08012345678"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password *
                </label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Enter password (min. 6 characters)"
                  required
                  minLength={6}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-aapoly-purple hover:bg-aapoly-purple/90"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Add Supervisor'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AddSupervisor;
