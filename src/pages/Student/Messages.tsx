
import { useState } from 'react';
import DashboardLayout from '../../components/Dashboard/DashboardLayout';
import ChatInterface from '../../components/Dashboard/ChatInterface';
import { useAuth } from '@/contexts/AuthContext';

const StudentMessages = () => {
  const { user } = useAuth();
  
  // For a real application, these would come from the API
  const supervisorData = {
    id: 'supervisor-1',
    name: 'Dr. Oluwaseun Olamide'
  };
  
  return (
    <DashboardLayout title="Messages">
      <div className="max-w-4xl mx-auto">
        <ChatInterface 
          recipientName={supervisorData.name}
          recipientId={supervisorData.id}
          currentUserId={user?.id || 'student-1'}
          currentUserName={user?.name || 'Student'}
        />
      </div>
    </DashboardLayout>
  );
};

export default StudentMessages;
