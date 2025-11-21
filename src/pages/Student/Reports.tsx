import { useState, useEffect } from 'react';
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
import { useAuth } from '../../contexts/AuthContext';
import { getReports, saveReports } from '../../lib/mockData';
import { WeeklyReport } from '../../types';

const StudentReports = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('submit');
  const [currentWeek, setCurrentWeek] = useState(1);
  const [previousReports, setPreviousReports] = useState<WeeklyReport[]>([]);
  
  useEffect(() => {
    if (user) {
      const allReports = getReports();
      const myReports = allReports.filter(r => r.studentId === user.id);
      setPreviousReports(myReports.sort((a, b) => b.weekNumber - a.weekNumber));
      
      // Calculate current week (next week after last submission)
      if (myReports.length > 0) {
        const lastWeek = Math.max(...myReports.map(r => r.weekNumber));
        setCurrentWeek(lastWeek + 1);
      }
    }
  }, [user]);
  
  const handleReportSubmission = (data: {
    title: string;
    description: string;
    weekNumber: number;
    file?: File;
  }) => {
    if (!user) return;
    
    // Convert file to base64 if present
    if (data.file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const fileUrl = reader.result as string;
        saveReport(data, fileUrl);
      };
      reader.readAsDataURL(data.file);
    } else {
      saveReport(data);
    }
  };

  const saveReport = (data: any, fileUrl?: string) => {
    const newReport: WeeklyReport = {
      id: `rep-${Date.now()}`,
      studentId: user!.id,
      weekNumber: data.weekNumber,
      title: data.title,
      description: data.description,
      submissionDate: new Date(),
      status: 'pending',
      fileUrl
    };

    const allReports = getReports();
    allReports.push(newReport);
    saveReports(allReports);
    
    setPreviousReports([newReport, ...previousReports]);
    
    toast({
      title: "Report Submitted",
      description: `Your Week ${data.weekNumber} report has been submitted successfully.`,
    });
    
    setActiveTab('previous');
    setCurrentWeek(data.weekNumber + 1);
  };

  const handleViewReport = (report: WeeklyReport) => {
    toast({
      title: `Week ${report.weekNumber}: ${report.title}`,
      description: report.feedback || 'No feedback yet',
    });
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
          <div className="space-y-4">
            {previousReports.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">You haven't submitted any reports yet.</p>
                    <Button 
                      variant="link" 
                      onClick={() => setActiveTab('submit')}
                      className="text-aapoly-purple"
                    >
                      Submit your first report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              previousReports.map((report) => (
                <Card key={report.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">Week {report.weekNumber}: {report.title}</CardTitle>
                        <CardDescription>
                          Submitted: {new Date(report.submissionDate).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <StatusBadge status={report.status} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{report.description}</p>
                    
                    {report.feedback && (
                      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                        <p className="font-medium text-blue-900 mb-1">Supervisor Feedback:</p>
                        <p className="text-blue-800">{report.feedback}</p>
                      </div>
                    )}
                    
                    {report.fileUrl && (
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <FileText size={16} className="mr-2" />
                        <span>File attached</span>
                      </div>
                    )}
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewReport(report)}
                    >
                      <Eye size={16} className="mr-2" />
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default StudentReports;
