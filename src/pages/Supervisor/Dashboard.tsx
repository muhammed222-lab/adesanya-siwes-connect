
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/Dashboard/DashboardLayout';
import StatCard from '../../components/Dashboard/StatCard';
import { FileText, Users, MessageSquare, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { getStudents, getReports, getChats } from '../../lib/mockData';

const SupervisorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [supervisorStats, setSupervisorStats] = useState({
    assignedStudents: 0,
    pendingReports: 0,
    unreadMessages: 0,
    inactiveStudents: 0
  });

  const [recentSubmissions, setRecentSubmissions] = useState<any[]>([]);
  const [organizations, setOrganizations] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      const allStudents = getStudents();
      const myStudents = allStudents.filter(s => s.supervisorId === user.id);
      
      const allReports = getReports();
      const myReports = allReports.filter(r => 
        myStudents.some(s => s.id === r.studentId)
      );

      const allChats = getChats();
      const unreadCount = allChats.filter(c => 
        c.receiverId === user.id && !c.read
      ).length;

      const inactiveCount = myStudents.filter(s => s.paymentStatus === 'pending').length;

      setSupervisorStats({
        assignedStudents: myStudents.length,
        pendingReports: myReports.filter(r => r.status === 'pending').length,
        unreadMessages: unreadCount,
        inactiveStudents: inactiveCount
      });

      // Recent submissions
      const recent = myReports
        .sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime())
        .slice(0, 3)
        .map(r => {
          const student = myStudents.find(s => s.id === r.studentId);
          return {
            id: r.id,
            studentName: student?.name || 'Unknown',
            matricNumber: student?.matricNumber || '',
            weekNumber: r.weekNumber,
            submissionDate: new Date(r.submissionDate)
          };
        });
      setRecentSubmissions(recent);

      // Organizations
      const orgMap = new Map<string, number>();
      myStudents.forEach(s => {
        if (s.organizationName) {
          orgMap.set(s.organizationName, (orgMap.get(s.organizationName) || 0) + 1);
        }
      });

      const orgArray = Array.from(orgMap.entries())
        .map(([name, studentCount]) => ({ name, studentCount }))
        .sort((a, b) => b.studentCount - a.studentCount);
      setOrganizations(orgArray);
    }
  }, [user]);
  
  return (
    <DashboardLayout title="Supervisor Dashboard">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Assigned Students" 
          value={supervisorStats.assignedStudents}
          icon={<Users size={24} />}
          color="bg-aapoly-purple"
        />
        
        <StatCard 
          title="Pending Reports" 
          value={supervisorStats.pendingReports}
          icon={<FileText size={24} />}
          color="bg-aapoly-gold"
        />
        
        <StatCard 
          title="Unread Messages" 
          value={supervisorStats.unreadMessages}
          icon={<MessageSquare size={24} />}
          color="bg-blue-500"
        />
        
        <StatCard 
          title="Inactive Students" 
          value={supervisorStats.inactiveStudents}
          icon={<AlertTriangle size={24} />}
          color="bg-red-500"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Submissions */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Recent Submissions</h3>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/supervisor/reports')}
              >
                View All
              </Button>
            </div>
            
            <div className="space-y-4">
              {recentSubmissions.length > 0 ? (
                recentSubmissions.map((submission) => (
                  <div 
                    key={submission.id} 
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors border-b"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-3 flex-shrink-0">
                        {submission.studentName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{submission.studentName}</p>
                        <p className="text-sm text-gray-500">
                          {submission.matricNumber} | Week {submission.weekNumber}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => navigate(`/supervisor/reports/${submission.id}`)}
                      >
                        Review
                      </Button>
                      <p className="text-xs text-gray-500">
                        {submission.submissionDate.toLocaleDateString()} at {
                          submission.submissionDate.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })
                        }
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No recent submissions</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Organizations */}
        <div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Student Organizations</h3>
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/supervisor/students')}
              >
                View All
              </Button>
            </div>
            
            <div className="space-y-3">
              {organizations.map((org, index) => (
                <div 
                  key={index} 
                  className="p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <p className="font-medium">{org.name}</p>
                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                      {org.studentCount} {org.studentCount === 1 ? 'student' : 'students'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SupervisorDashboard;
