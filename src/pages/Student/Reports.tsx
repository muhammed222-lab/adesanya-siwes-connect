
import { useState } from 'react';
import DashboardLayout from '../../components/Dashboard/DashboardLayout';
import ReportForm from '../../components/Dashboard/ReportForm';
import StatusBadge from '../../components/Dashboard/StatusBadge';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { FileText, Eye } from 'lucide-react';

// Mock data for previously submitted reports
const previousReports = [
  {
    id: '1',
    weekNumber: 3,
    title: 'Database Design and Implementation',
    submissionDate: new Date('2023-07-15'),
    status: 'reviewed',
    feedback: 'Good work on normalizing the database structure. Make sure to include ER diagrams next time.'
  },
  {
    id: '2',
    weekNumber: 2,
    title: 'User Interface Design',
    submissionDate: new Date('2023-07-08'),
    status: 'reviewed',
    feedback: 'Excellent wireframes. Consider adding more detailed explanations of your design choices.'
  },
  {
    id: '3',
    weekNumber: 1,
    title: 'Introduction to the Organization',
    submissionDate: new Date('2023-07-01'),
    status: 'reviewed',
    feedback: 'Well-written overview of the company structure and your role.'
  }
];

const StudentReports = () => {
  const [activeTab, setActiveTab] = useState('submit');
  const [currentWeek, setCurrentWeek] = useState(4); // Assuming the student is currently in week 4
  
  const handleReportSubmission = (data: {
    title: string;
    description: string;
    weekNumber: number;
    file?: File;
  }) => {
    console.log('Submitting report:', data);
    
    // In a real app, this would be an API call
    toast({
      title: "Report Submitted",
      description: `Your Week ${data.weekNumber} report has been submitted successfully.`,
    });
    
    // Switch to the previous reports tab after submission
    setActiveTab('previous');
  };

  const handleViewReport = (reportId: string) => {
    const report = previousReports.find(r => r.id === reportId);
    if (report) {
      toast({
        title: `Week ${report.weekNumber}: ${report.title}`,
        description: `Feedback: ${report.feedback}`,
      });
    }
  };

  return (
    <DashboardLayout title="Weekly Reports">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Weekly Progress Reports</h2>
        <p className="text-gray-600">Submit and manage your weekly SIWES activity reports</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
          <TabsTrigger value="submit">Submit Report</TabsTrigger>
          <TabsTrigger value="previous">Previous Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="submit">
          <div className="max-w-2xl">
            <ReportForm 
              weekNumber={currentWeek} 
              onSubmit={handleReportSubmission} 
            />
          </div>
        </TabsContent>
        
        <TabsContent value="previous">
          <div className="space-y-6">
            {previousReports.map((report) => (
              <Card key={report.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Week {report.weekNumber}: {report.title}</CardTitle>
                      <CardDescription>
                        Submitted on {report.submissionDate.toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <StatusBadge status={report.status as any} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Feedback:</p>
                      <p className="text-gray-700">{report.feedback}</p>
                    </div>
                    <div>
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewReport(report.id)}
                        className="flex items-center"
                      >
                        <Eye size={16} className="mr-1" />
                        View Full Report
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {previousReports.length === 0 && (
              <div className="text-center py-16 bg-gray-50 rounded-lg">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No reports yet</h3>
                <p className="text-gray-500 mt-2">
                  You haven't submitted any weekly reports yet.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default StudentReports;
