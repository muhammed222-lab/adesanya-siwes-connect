import { Student, Supervisor, Coordinator, WeeklyReport, ChatMessage, PaymentInfo } from '../types';

// Initialize mock data in localStorage
export const initializeMockData = () => {
  if (!localStorage.getItem('students')) {
    const mockStudents: Student[] = [
      {
        id: '1',
        name: 'John Adebayo',
        email: 'john.adebayo@student.aapoly.edu.ng',
        role: 'student',
        matricNumber: '22-04-0191',
        department: 'Computer Science',
        paymentStatus: 'paid',
        organizationName: 'Tech Solutions Ltd.',
        organizationAddress: '15 Ikeja Industrial Estate, Ikeja',
        organizationState: 'Lagos',
        organizationLGA: 'Ikeja',
        organizationContactPerson: 'Mr. Adebayo Johnson',
        organizationPhoneNumber: '08012345678',
        organizationLocation: { lat: 6.6018, lng: 3.3515 },
        supervisorId: 'sup-1',
        createdAt: new Date('2024-01-15')
      },
      {
        id: '2',
        name: 'Esther Okafor',
        email: 'esther.okafor@student.aapoly.edu.ng',
        role: 'student',
        matricNumber: '22-04-0192',
        department: 'Computer Science',
        paymentStatus: 'paid',
        organizationName: 'Tech Solutions Ltd.',
        organizationAddress: '15 Ikeja Industrial Estate, Ikeja',
        organizationState: 'Lagos',
        organizationLGA: 'Ikeja',
        organizationContactPerson: 'Mr. Adebayo Johnson',
        organizationPhoneNumber: '08012345678',
        organizationLocation: { lat: 6.6018, lng: 3.3515 },
        supervisorId: 'sup-1',
        createdAt: new Date('2024-01-16')
      },
      {
        id: '3',
        name: 'Mohammed Ibrahim',
        email: 'mohammed.ibrahim@student.aapoly.edu.ng',
        role: 'student',
        matricNumber: '22-04-0193',
        department: 'Electrical Engineering',
        paymentStatus: 'pending',
        createdAt: new Date('2024-01-17')
      }
    ];
    localStorage.setItem('students', JSON.stringify(mockStudents));
  }

  if (!localStorage.getItem('supervisors')) {
    const mockSupervisors: Supervisor[] = [
      {
        id: 'sup-1',
        name: 'Dr. Oluwaseun Adeleke',
        email: 'oluwaseun.adeleke@aapoly.edu.ng',
        role: 'supervisor',
        department: 'Computer Science',
        phoneNumber: '08098765432',
        assignedStudents: ['1', '2'],
        createdAt: new Date('2024-01-01')
      },
      {
        id: 'sup-2',
        name: 'Prof. Chinedu Okonkwo',
        email: 'chinedu.okonkwo@aapoly.edu.ng',
        role: 'supervisor',
        department: 'Electrical Engineering',
        phoneNumber: '08087654321',
        assignedStudents: [],
        createdAt: new Date('2024-01-01')
      }
    ];
    localStorage.setItem('supervisors', JSON.stringify(mockSupervisors));
  }

  if (!localStorage.getItem('coordinators')) {
    const mockCoordinators: Coordinator[] = [
      {
        id: 'coord-1',
        name: 'Dr. Funmilayo Adeyemi',
        email: 'funmilayo.adeyemi@aapoly.edu.ng',
        role: 'coordinator',
        department: 'SIWES Coordination Office',
        phoneNumber: '08076543210',
        createdAt: new Date('2024-01-01')
      }
    ];
    localStorage.setItem('coordinators', JSON.stringify(mockCoordinators));
  }

  if (!localStorage.getItem('reports')) {
    const mockReports: WeeklyReport[] = [
      {
        id: 'rep-1',
        studentId: '1',
        weekNumber: 1,
        title: 'Introduction to Company Operations',
        description: 'Learned about the company structure, met team members, and got familiar with the work environment.',
        submissionDate: new Date('2024-02-01'),
        status: 'reviewed',
        feedback: 'Good start! Make sure to document specific technical skills you learn.'
      },
      {
        id: 'rep-2',
        studentId: '1',
        weekNumber: 2,
        title: 'Frontend Development Training',
        description: 'Started learning React.js and worked on basic components.',
        submissionDate: new Date('2024-02-08'),
        status: 'pending'
      }
    ];
    localStorage.setItem('reports', JSON.stringify(mockReports));
  }

  if (!localStorage.getItem('chats')) {
    const mockChats: ChatMessage[] = [
      {
        id: 'chat-1',
        senderId: '1',
        receiverId: 'sup-1',
        message: 'Good morning sir, I have submitted my week 2 report.',
        timestamp: new Date('2024-02-08T09:30:00'),
        read: true
      },
      {
        id: 'chat-2',
        senderId: 'sup-1',
        receiverId: '1',
        message: 'Good morning John, I will review it shortly.',
        timestamp: new Date('2024-02-08T10:15:00'),
        read: true
      }
    ];
    localStorage.setItem('chats', JSON.stringify(mockChats));
  }

  if (!localStorage.getItem('payments')) {
    const mockPayments: PaymentInfo[] = [
      {
        id: 'pay-1',
        studentId: '1',
        amount: 7000,
        referenceNumber: 'PAY-2024-001',
        paymentDate: new Date('2024-01-20'),
        status: 'completed',
        paymentMethod: 'online'
      }
    ];
    localStorage.setItem('payments', JSON.stringify(mockPayments));
  }

  // Login credentials for testing
  if (!localStorage.getItem('credentials')) {
    const credentials = {
      students: [
        { matricNumber: '22-04-0191', password: 'adebayo', userId: '1' },
        { matricNumber: '22-04-0192', password: 'okafor', userId: '2' },
        { matricNumber: '22-04-0193', password: 'ibrahim', userId: '3' }
      ],
      supervisors: [
        { email: 'oluwaseun.adeleke@aapoly.edu.ng', password: 'supervisor123', userId: 'sup-1' },
        { email: 'chinedu.okonkwo@aapoly.edu.ng', password: 'supervisor123', userId: 'sup-2' }
      ],
      coordinators: [
        { email: 'funmilayo.adeyemi@aapoly.edu.ng', password: 'coordinator123', userId: 'coord-1' }
      ]
    };
    localStorage.setItem('credentials', JSON.stringify(credentials));
  }
};

// Helper functions to get data
export const getStudents = (): Student[] => {
  const data = localStorage.getItem('students');
  return data ? JSON.parse(data) : [];
};

export const getSupervisors = (): Supervisor[] => {
  const data = localStorage.getItem('supervisors');
  return data ? JSON.parse(data) : [];
};

export const getCoordinators = (): Coordinator[] => {
  const data = localStorage.getItem('coordinators');
  return data ? JSON.parse(data) : [];
};

export const getReports = (): WeeklyReport[] => {
  const data = localStorage.getItem('reports');
  return data ? JSON.parse(data) : [];
};

export const getChats = (): ChatMessage[] => {
  const data = localStorage.getItem('chats');
  return data ? JSON.parse(data) : [];
};

export const getPayments = (): PaymentInfo[] => {
  const data = localStorage.getItem('payments');
  return data ? JSON.parse(data) : [];
};

// Helper functions to save data
export const saveStudents = (students: Student[]) => {
  localStorage.setItem('students', JSON.stringify(students));
};

export const saveSupervisors = (supervisors: Supervisor[]) => {
  localStorage.setItem('supervisors', JSON.stringify(supervisors));
};

export const saveCoordinators = (coordinators: Coordinator[]) => {
  localStorage.setItem('coordinators', JSON.stringify(coordinators));
};

export const saveReports = (reports: WeeklyReport[]) => {
  localStorage.setItem('reports', JSON.stringify(reports));
};

export const saveChats = (chats: ChatMessage[]) => {
  localStorage.setItem('chats', JSON.stringify(chats));
};

export const savePayments = (payments: PaymentInfo[]) => {
  localStorage.setItem('payments', JSON.stringify(payments));
};
