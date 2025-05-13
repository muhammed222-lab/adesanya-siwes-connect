
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/Dashboard/DashboardLayout';
import StatCard from '../../components/Dashboard/StatCard';
import { FileText, Users, MessageSquare, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SupervisorDashboard = () => {
  const navigate = useNavigate();
  
  // Mock data for supervisor dashboard
  const supervisorStats = {
    assignedStudents: 15,
    pendingReports: 8,
    unreadMessages: 5,
    inactiveStudents: 3
  };
  
  // Mock data for recent student submissions
  const recentSubmissions = [
    {
      id: '1',
      studentName: 'John Adebayo',
      matricNumber: '22-04-0191',
      weekNumber: 4,
      submissionDate: new Date('2023-07-22T10:30:00'),
    },
    {
      id: '2',
      studentName: 'Esther Okafor',
      matricNumber: '22-04-0127',
      weekNumber: 4,
      submissionDate: new Date('2023-07-21T16:15:00'),
    },
    {
      id: '3',
      studentName: 'Oluwatobi Bakare',
      matricNumber: '22-04-0112',
      weekNumber: 4,
      submissionDate: new Date('2023-07-21T09:45:00'),
    }
  ];
  
  // Mock data for organizations
  const organizations = [
    {
      name: 'Tech Solutions Ltd.',
      studentCount: 5,
    },
    {
      name: 'Global Systems Limited',
      studentCount: 4,
    },
    {
      name: 'Datawave Technologies',
      studentCount: 3,
    },
    {
      name: 'Fintech Innovations Ltd.',
      studentCount: 2,
    },
    {
      name: 'Digital Creative Agency',
      studentCount: 1,
    }
  ];
  
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
