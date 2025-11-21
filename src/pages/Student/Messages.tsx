import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/Dashboard/DashboardLayout';
import ChatInterface from '../../components/Dashboard/ChatInterface';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getChats, saveChats, getSupervisors, getStudents } from '../../lib/mockData';
import { ChatMessage, Supervisor } from '../../types';

const StudentMessages = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [supervisor, setSupervisor] = useState<Supervisor | null>(null);

  useEffect(() => {
    if (user) {
      // Get student's supervisor
      const students = getStudents();
      const currentStudent = students.find(s => s.id === user.id);
      
      if (currentStudent?.supervisorId) {
        const supervisors = getSupervisors();
        const sup = supervisors.find(s => s.id === currentStudent.supervisorId);
        if (sup) {
          setSupervisor(sup);
          
          // Load messages between student and supervisor
          const allChats = getChats();
          const relevantMessages = allChats.filter(
            m => (m.senderId === user.id && m.receiverId === sup.id) ||
                 (m.senderId === sup.id && m.receiverId === user.id)
          ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
          
          setMessages(relevantMessages);
        }
      }
    }
  }, [user]);

  const handleSendMessage = (message: string) => {
    if (!user || !supervisor) return;

    const newMessage: ChatMessage = {
      id: `chat-${Date.now()}`,
      senderId: user.id,
      receiverId: supervisor.id,
      message,
      timestamp: new Date(),
      read: false
    };

    const allChats = getChats();
    allChats.push(newMessage);
    saveChats(allChats);
    
    setMessages([...messages, newMessage]);
  };

  if (!supervisor) {
    return (
      <DashboardLayout title="Messages">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <User size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">
                No Supervisor Assigned
              </h3>
              <p className="text-gray-500">
                You will be able to message your supervisor once one has been assigned to you.
              </p>
            </div>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Messages">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-4">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-aapoly-purple text-white">
                  {supervisor.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{supervisor.name}</h3>
                <p className="text-sm text-gray-600">{supervisor.department}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <ChatInterface 
          messages={messages}
          currentUserId={user!.id}
          onSendMessage={handleSendMessage}
        />
      </div>
    </DashboardLayout>
  );
};

export default StudentMessages;
