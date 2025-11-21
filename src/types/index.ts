
export type UserRole = 'student' | 'supervisor' | 'coordinator';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}

export interface Student extends User {
  matricNumber: string;
  department: string;
  paymentStatus: 'pending' | 'paid';
  organizationName?: string;
  organizationAddress?: string;
  organizationState?: string;
  organizationLGA?: string;
  organizationContactPerson?: string;
  organizationPhoneNumber?: string;
  organizationLocation?: {
    lat: number;
    lng: number;
  };
  supervisorId?: string;
}

export interface Supervisor extends User {
  department: string;
  phoneNumber: string;
  assignedStudents?: string[];
}

export interface Coordinator extends User {
  department: string;
  phoneNumber: string;
}

export interface WeeklyReport {
  id: string;
  studentId: string;
  weekNumber: number;
  title: string;
  description: string;
  submissionDate: Date;
  fileUrl?: string;
  feedback?: string;
  status: 'pending' | 'reviewed';
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export interface PaymentInfo {
  id: string;
  studentId: string;
  amount: number;
  referenceNumber: string;
  paymentDate: Date;
  status: 'pending' | 'completed' | 'failed';
  paymentMethod: 'online' | 'manual';
  evidence?: string;
}
