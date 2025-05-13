
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/Dashboard/DashboardLayout';
import StatCard from '../../components/Dashboard/StatCard';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Users, FileText, Building, User, MessageSquare, AlertTriangle } from 'lucide-react';

// Mock data for weekly report submissions
const reportSubmissionData = [
  { week: 'Week 1', submissions: 150, pending: 0, reviewed: 150 },
  { week: 'Week 2', submissions: 145, pending: 5, reviewed: 140 },
  { week: 'Week 3', submissions: 130, pending: 30, reviewed: 100 },
  { week: 'Week 4', submissions: 100, pending: 85, reviewed: 15 },
];

// Mock data for organizations
const topOrganizations = [
  { name: 'Tech Solutions Ltd.', students: 15 },
  { name: 'Global Systems Limited', students: 12 },
  { name: 'Datawave Technologies', students: 10 },
  { name: 'Fintech Innovations Ltd.', students: 8 },
  { name: 'Digital Creative Agency', students: 6 },
];

const CoordinatorDashboard = () => {
  const navigate = useNavigate();
  
  // Mock data for coordinator dashboard
  const coordinatorStats = {
    totalStudents: 152,
    activeStudents: 140,
    inactiveStudents: 12,
    totalSupervisors: 15,
    totalOrganizations: 42,
    pendingReports: 120,
    reviewedReports: 405,
    totalReports: 525,
  };
  
  return (
    <DashboardLayout title="Coordinator Dashboard">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Students" 
          value={coordinatorStats.totalStudents}
          icon={<Users size={24} />}
          color="bg-aapoly-purple"
        />
        
        <StatCard 
          title="Organizations" 
          value={coordinatorStats.totalOrganizations}
          icon={<Building size={24} />}
          color="bg-blue-500"
        />
        
        <StatCard 
          title="Supervisors" 
          value={coordinatorStats.totalSupervisors}
          icon={<User size={24} />}
          color="bg-aapoly-gold"
        />
        
        <StatCard 
          title="Total Reports" 
          value={coordinatorStats.totalReports}
          icon={<FileText size={24} />}
          color="bg-green-500"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Student Status */}
        <Card>
          <CardHeader>
            <CardTitle>Student Status</CardTitle>
            <CardDescription>Active vs. Inactive Students</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[240px] flex items-center justify-center">
              <div className="relative w-full max-w-[200px] h-full flex items-center justify-center">
                {/* Circle for Active Students */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-full rounded-full border-[24px] border-aapoly-purple"></div>
                </div>
                
                {/* Circle for Inactive Students */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div 
                    className="w-full h-full rounded-full border-[24px] border-red-400" 
                    style={{ 
                      clipPath: `polygon(0 0, 100% 0, 100% ${(coordinatorStats.inactiveStudents / coordinatorStats.totalStudents) * 100}%, 0 ${(coordinatorStats.inactiveStudents / coordinatorStats.totalStudents) * 100}%)` 
                    }}
                  ></div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold">{coordinatorStats.activeStudents}</div>
                  <div className="text-sm text-gray-500">Active</div>
                  <div className="mt-2 text-lg font-medium text-red-500">{coordinatorStats.inactiveStudents}</div>
                  <div className="text-xs text-gray-500">Inactive</div>
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <Button 
                onClick={() => navigate('/coordinator/students')}
                className="w-full bg-aapoly-purple hover:bg-aapoly-purple/90"
              >
                View All Students
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Report Status */}
        <Card>
          <CardHeader>
            <CardTitle>Report Status</CardTitle>
            <CardDescription>Pending vs. Reviewed Reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[240px] flex items-center justify-center">
              <div className="space-y-4 w-full">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Pending</span>
                  <span className="text-sm font-medium">{coordinatorStats.pendingReports}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-yellow-400 h-2.5 rounded-full" 
                    style={{ width: `${(coordinatorStats.pendingReports / coordinatorStats.totalReports) * 100}%` }}
                  ></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Reviewed</span>
                  <span className="text-sm font-medium">{coordinatorStats.reviewedReports}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-green-500 h-2.5 rounded-full" 
                    style={{ width: `${(coordinatorStats.reviewedReports / coordinatorStats.totalReports) * 100}%` }}
                  ></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total</span>
                  <span className="text-sm font-medium">{coordinatorStats.totalReports}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-aapoly-purple h-2.5 rounded-full" 
                    style={{ width: '100%' }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <Button 
                onClick={() => navigate('/coordinator/reports')}
                className="w-full bg-aapoly-purple hover:bg-aapoly-purple/90"
              >
                View All Reports
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Top Organizations */}
        <Card>
          <CardHeader>
            <CardTitle>Top Organizations</CardTitle>
            <CardDescription>By number of students</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[240px] overflow-y-auto">
              <div className="space-y-4">
                {topOrganizations.map((org, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                        index === 0 ? 'bg-yellow-100 text-yellow-600' :
                        index === 1 ? 'bg-gray-100 text-gray-600' :
                        index === 2 ? 'bg-amber-100 text-amber-600' :
                        'bg-aapoly-light text-aapoly-purple'
                      }`}>
                        {index + 1}
                      </div>
                      <span className="ml-3 font-medium text-gray-800">{org.name}</span>
                    </div>
                    <span className="bg-aapoly-light text-aapoly-purple text-xs px-2 py-1 rounded-full">
                      {org.students} students
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-4">
              <Button 
                onClick={() => navigate('/coordinator/organizations')}
                className="w-full bg-aapoly-purple hover:bg-aapoly-purple/90"
              >
                View All Organizations
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Reports Chart */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Weekly Report Submissions</CardTitle>
          <CardDescription>Number of reports submitted each week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={reportSubmissionData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="reviewed" stackId="a" fill="#6E59A5" name="Reviewed" />
                <Bar dataKey="pending" stackId="a" fill="#F97316" name="Pending" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common coordinator tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={() => navigate('/coordinator/supervisors')}
              className="bg-aapoly-purple hover:bg-aapoly-purple/90 flex items-center justify-center"
              size="lg"
            >
              <User className="mr-2" size={18} />
              Manage Supervisors
            </Button>
            
            <Button 
              onClick={() => navigate('/coordinator/messages')}
              variant="outline"
              className="flex items-center justify-center"
              size="lg"
            >
              <MessageSquare className="mr-2" size={18} />
              Send Broadcast
            </Button>
            
            <Button 
              onClick={() => navigate('/coordinator/students?status=inactive')}
              variant="outline"
              className="flex items-center justify-center text-red-600 border-red-200 hover:bg-red-50"
              size="lg"
            >
              <AlertTriangle className="mr-2" size={18} />
              View Inactive Students
            </Button>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default CoordinatorDashboard;
