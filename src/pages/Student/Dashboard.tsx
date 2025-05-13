
import { FileText, Users, Building, MessageSquare, CreditCard } from 'lucide-react';
import DashboardLayout from '../../components/Dashboard/DashboardLayout';
import StatCard from '../../components/Dashboard/StatCard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Mock data for student dashboard
  const studentData = {
    name: user?.name || 'John Adebayo',
    matricNumber: '22-04-0191',
    department: 'Computer Science',
    paymentStatus: 'pending', // or 'paid'
    weeklyReportsSubmitted: 4,
    organizationName: 'Tech Solutions Limited',
    supervisorName: 'Dr. Oluwaseun Olamide',
    unreadMessages: 3
  };

  return (
    <DashboardLayout title="Student Dashboard">
      {/* Welcome Message */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Welcome, {studentData.name}</h2>
        <p className="text-gray-600">Matric: {studentData.matricNumber} | {studentData.department}</p>
      </div>
      
      {/* Payment Alert - Show only if payment is pending */}
      {studentData.paymentStatus === 'pending' && (
        <Alert className="mb-6 border-yellow-400 bg-yellow-50">
          <AlertTitle className="text-yellow-800 flex items-center">
            <CreditCard className="mr-2 h-5 w-5" />
            Payment Required
          </AlertTitle>
          <AlertDescription className="text-yellow-700">
            You need to pay the SIWES fee (₦7,000) to access your SIWES letter and unlock full features.
            <div className="mt-2">
              <Button 
                onClick={() => navigate('/student/payment')}
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                Pay Now
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Weekly Reports" 
          value={studentData.weeklyReportsSubmitted}
          icon={<FileText size={24} />}
          color="bg-aapoly-purple"
        />
        
        <StatCard 
          title="Organization" 
          value={studentData.organizationName || "Not Set"}
          icon={<Building size={24} />}
          color="bg-green-500"
        />
        
        <StatCard 
          title="Supervisor" 
          value={studentData.supervisorName || "Not Assigned"}
          icon={<Users size={24} />}
          color="bg-aapoly-gold"
        />
        
        <StatCard 
          title="Unread Messages" 
          value={studentData.unreadMessages}
          icon={<MessageSquare size={24} />}
          color="bg-blue-500"
        />
      </div>
      
      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button 
            onClick={() => navigate('/student/reports')}
            className="bg-aapoly-purple hover:bg-aapoly-purple/90 flex items-center"
          >
            <FileText className="mr-2" size={18} />
            Submit Weekly Report
          </Button>
          
          <Button 
            onClick={() => navigate('/student/organization')}
            variant="outline"
            className="flex items-center"
          >
            <Building className="mr-2" size={18} />
            Update Organization Info
          </Button>
          
          <Button 
            onClick={() => navigate('/student/messages')}
            variant="outline"
            className="flex items-center"
          >
            <MessageSquare className="mr-2" size={18} />
            Message Supervisor
          </Button>
          
          {studentData.paymentStatus === 'paid' ? (
            <Button 
              onClick={() => {
                // Download SIWES letter logic
                alert('Downloading SIWES letter...');
              }}
              className="bg-aapoly-gold hover:bg-aapoly-gold/90 text-aapoly-dark flex items-center"
            >
              <FileText className="mr-2" size={18} />
              Download SIWES Letter
            </Button>
          ) : (
            <Button 
              onClick={() => navigate('/student/payment')}
              className="bg-aapoly-gold hover:bg-aapoly-gold/90 text-aapoly-dark flex items-center"
            >
              <CreditCard className="mr-2" size={18} />
              Pay SIWES Fee
            </Button>
          )}
        </div>
      </div>
      
      {/* Recent Activity - Placeholder */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        
        <div className="space-y-4">
          <div className="flex items-start p-3 border-b border-gray-100">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 flex-shrink-0">
              <FileText size={20} />
            </div>
            <div>
              <p className="font-medium">Weekly Report Submitted</p>
              <p className="text-sm text-gray-500">You submitted Week 4 report</p>
              <p className="text-xs text-gray-400">2 days ago</p>
            </div>
          </div>
          
          <div className="flex items-start p-3 border-b border-gray-100">
            <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3 flex-shrink-0">
              <MessageSquare size={20} />
            </div>
            <div>
              <p className="font-medium">New Message</p>
              <p className="text-sm text-gray-500">Dr. Oluwaseun sent you a message</p>
              <p className="text-xs text-gray-400">3 days ago</p>
            </div>
          </div>
          
          <div className="flex items-start p-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-3 flex-shrink-0">
              <Users size={20} />
            </div>
            <div>
              <p className="font-medium">Supervisor Assigned</p>
              <p className="text-sm text-gray-500">Dr. Oluwaseun was assigned as your supervisor</p>
              <p className="text-xs text-gray-400">1 week ago</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
