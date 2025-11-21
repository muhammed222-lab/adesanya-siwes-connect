import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/Dashboard/DashboardLayout';
import ChatInterface from '../../components/Dashboard/ChatInterface';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getChats, saveChats, getStudents } from '../../lib/mockData';
import { ChatMessage, Student } from '../../types';

const SupervisorMessages = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (user) {
      const allStudents = getStudents();
      const myStudents = allStudents.filter(s => s.supervisorId === user.id);
      setStudents(myStudents);
      
      if (myStudents.length > 0 && !selectedStudent) {
        setSelectedStudent(myStudents[0]);
      }
    }
  }, [user]);

  useEffect(() => {
    if (user && selectedStudent) {
      const allChats = getChats();
      const relevantMessages = allChats.filter(
        m => (m.senderId === user.id && m.receiverId === selectedStudent.id) ||
             (m.senderId === selectedStudent.id && m.receiverId === user.id)
      ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      
      setMessages(relevantMessages);
    }
  }, [user, selectedStudent]);

  const handleSendMessage = (message: string) => {
    if (!user || !selectedStudent) return;

    const newMessage: ChatMessage = {
      id: `chat-${Date.now()}`,
      senderId: user.id,
      receiverId: selectedStudent.id,
      message,
      timestamp: new Date(),
      read: false
    };

    const allChats = getChats();
    allChats.push(newMessage);
    saveChats(allChats);
    
    setMessages([...messages, newMessage]);
  };

  if (students.length === 0) {
    return (
      <DashboardLayout title="Messages">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Users size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">
                No Students Assigned
              </h3>
              <p className="text-gray-500">
                You will be able to message students once they have been assigned to you.
              </p>
            </div>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Messages">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Student List */}
        <Card className="md:col-span-1">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-4">Your Students</h3>
            <div className="space-y-2">
              {students.map((student) => (
                <Button
                  key={student.id}
                  variant={selectedStudent?.id === student.id ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setSelectedStudent(student)}
                >
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarFallback>
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left flex-1 overflow-hidden">
                    <div className="font-medium truncate">{student.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{student.matricNumber}</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Interface */}
        <div className="md:col-span-2">
          {selectedStudent && (
            <>
              <Card className="mb-4">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-aapoly-purple text-white">
                        {selectedStudent.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{selectedStudent.name}</h3>
                      <p className="text-sm text-gray-600">{selectedStudent.matricNumber} • {selectedStudent.department}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <ChatInterface 
                messages={messages}
                currentUserId={user!.id}
                onSendMessage={handleSendMessage}
              />
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SupervisorMessages;
