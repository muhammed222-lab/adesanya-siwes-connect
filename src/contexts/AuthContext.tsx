
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, UserRole } from '../types';
import { DEFAULT_USERS } from '../constants';
import { supabase } from '../lib/supabase';
import { toast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Create context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  logout: () => {},
  isAuthenticated: false
});

// Mock user database for fallback when not connected to Supabase
const mockUsers: Record<string, User & { password: string }> = {
  'student@aapoly.edu.ng': {
    id: 'student-1',
    name: 'John Adebayo',
    email: 'student@aapoly.edu.ng',
    password: 'student123',
    role: 'student',
    createdAt: new Date()
  },
  'supervisor@aapoly.edu.ng': {
    id: 'supervisor-1',
    name: 'Dr. Oluwaseun Olamide',
    email: 'supervisor@aapoly.edu.ng',
    password: 'supervisor123',
    role: 'supervisor',
    createdAt: new Date()
  },
  'coordinator@aapoly.edu.ng': {
    id: 'coordinator-1',
    name: 'Prof. Adebisi Johnson',
    email: 'coordinator@aapoly.edu.ng',
    password: 'coordinator123',
    role: 'coordinator',
    createdAt: new Date()
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    // Check if we have a user in localStorage
    const storedUser = localStorage.getItem('aapoly_siwes_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    // Set up Supabase auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          // Check user role from the database
          getUserData(session.user.id);
        } else {
          setUser(null);
          localStorage.removeItem('aapoly_siwes_user');
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  // Function to get user data from our custom tables
  const getUserData = async (userId: string) => {
    try {
      // Get user basic data
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (userError) throw userError;
      
      if (userData) {
        const user: User = {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role as UserRole,
          createdAt: new Date(userData.created_at)
        };
        
        setUser(user);
        localStorage.setItem('aapoly_siwes_user', JSON.stringify(user));
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch user data",
        variant: "destructive"
      });
    }
  };

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      // First try with Supabase
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('role', role)
        .single();
      
      if (error) {
        console.error('Supabase error, falling back to mock data:', error);
        // Fallback to mock data if Supabase fails
        const foundUser = mockUsers[email];
        
        if (foundUser && foundUser.password === password && foundUser.role === role) {
          // Remove password before storing to state
          const { password: _, ...userWithoutPassword } = foundUser;
          
          // Store user in state and localStorage
          setUser(userWithoutPassword);
          localStorage.setItem('aapoly_siwes_user', JSON.stringify(userWithoutPassword));
          
          return true;
        }
        
        return false;
      }
      
      if (data && data.password === password) {
        const user: User = {
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role as UserRole,
          createdAt: new Date(data.created_at)
        };
        
        setUser(user);
        localStorage.setItem('aapoly_siwes_user', JSON.stringify(user));
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    setUser(null);
    localStorage.removeItem('aapoly_siwes_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
