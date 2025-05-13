
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, UserRole } from '../types';
import { DEFAULT_USERS } from '../constants';

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

// Mock user database
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
  }, []);

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    // In a real app, you would make an API call to validate credentials
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
  };

  const logout = () => {
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
