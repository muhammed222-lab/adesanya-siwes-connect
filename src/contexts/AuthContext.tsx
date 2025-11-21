import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, UserRole } from "../types";
import { initializeMockData, getStudents, getSupervisors, getCoordinators } from "../lib/mockData";

interface AuthContextType {
  user: User | null;
  login: (identifier: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  logout: () => {},
  isAuthenticated: false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Initialize mock data
    initializeMockData();

    // Check for stored user session
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (identifier: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      const credentials = JSON.parse(localStorage.getItem('credentials') || '{}');
      
      if (role === 'student') {
        // For students, identifier can be matric number or surname
        const studentCred = credentials.students?.find((s: any) => {
          if (s.matricNumber === identifier) return true;
          
          const student = getStudents().find(st => st.id === s.userId);
          if (student) {
            const surname = student.name.split(' ').pop()?.toLowerCase();
            return surname === identifier.toLowerCase();
          }
          return false;
        });
        
        if (studentCred && studentCred.password === password) {
          const student = getStudents().find(s => s.id === studentCred.userId);
          if (student) {
            setUser(student);
            localStorage.setItem('currentUser', JSON.stringify(student));
            return true;
          }
        }
      } else if (role === 'supervisor') {
        const supervisorCred = credentials.supervisors?.find((s: any) => s.email === identifier);
        if (supervisorCred && supervisorCred.password === password) {
          const supervisor = getSupervisors().find(s => s.id === supervisorCred.userId);
          if (supervisor) {
            setUser(supervisor);
            localStorage.setItem('currentUser', JSON.stringify(supervisor));
            return true;
          }
        }
      } else if (role === 'coordinator') {
        const coordinatorCred = credentials.coordinators?.find((c: any) => c.email === identifier);
        if (coordinatorCred && coordinatorCred.password === password) {
          const coordinator = getCoordinators().find(c => c.id === coordinatorCred.userId);
          if (coordinator) {
            setUser(coordinator);
            localStorage.setItem('currentUser', JSON.stringify(coordinator));
            return true;
          }
        }
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
