
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/Dashboard/DashboardLayout';
import ChatInterface from '../../components/Dashboard/ChatInterface';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Mock student data
const mockStudents = [
  {
    id: 'student-1',
    name: 'John Adebayo',
    matricNumber: '22-04-0191',
  },
  {
    id: 'student-2',
    name: 'Esther Okafor',
    matricNumber: '22-04-0127',
  },
  {
    id: 'student-3',
    name: 'Oluwatobi Bakare',
    matricNumber: '22-04-0112',
  },
  {
    id: 'student-4',
    name: 'Chidinma Eze',
    matricNumber: '22-04-0084',
  },
  {
    id: 'student-5',
    name: 'Mohammed Ibrahim',
    matricNumber: '22-04-0057',
  },
  {
    id: 'student-6',
    name: 'Yetunde Adewale',
    matricNumber: '22-04-0063',
  },
  {
    id: 'student-7',
    name: 'Samuel Okonkwo',
    matricNumber: '22-04-0042',
  },
  {
    id: 'student-8',
    name: 'Fatima Bello',
    matricNumber: '22-04-0031',
  },
];

const SupervisorMessages = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Find selected student
  const selectedStudent = studentId 
    ? mockStudents.find(s => s.id === studentId) 
    : null;
  
  // If studentId is provided but not found
  if (studentId && !selectedStudent) {
    return (
      <DashboardLayout title="Messages">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Student not found</h3>
          <p className="mt-1 text-sm text-gray-500">
            The student you are looking for does not exist or you don't have permission to view.
          </p>
          <Button 
            onClick={() => navigate('/supervisor/messages')}
            className="mt-4 bg-aapoly-purple hover:bg-aapoly-purple/90"
          >
            Back to Messages
          </Button>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout title={selectedStudent ? `Chat with ${selectedStudent.name}` : "Messages"}>
      {selectedStudent ? (
        // Show chat interface with selected student
        <div>
          <Button 
            variant="outline" 
            className="mb-4 flex items-center"
            onClick={() => navigate('/supervisor/messages')}
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to all students
          </Button>
          
          <div className="max-w-4xl">
            <ChatInterface 
              recipientName={selectedStudent.name}
              recipientId={selectedStudent.id}
              currentUserId={user?.id || 'supervisor-1'}
              currentUserName={user?.name || 'Dr. Oluwaseun'}
            />
          </div>
        </div>
      ) : (
        // Show list of students to chat with
        <div className="max-w-4xl">
          <h2 className="text-xl font-semibold mb-4">Select a student to chat with</h2>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="divide-y divide-gray-200">
              {mockStudents.map((student) => (
                <div 
                  key={student.id}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/supervisor/messages/${student.id}`)}
                >
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-aapoly-purple text-white flex items-center justify-center mr-3">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-gray-500">{student.matricNumber}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="ml-auto flex items-center"
                    >
                      <MessageSquare size={16} className="mr-1" />
                      Chat
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default SupervisorMessages;
