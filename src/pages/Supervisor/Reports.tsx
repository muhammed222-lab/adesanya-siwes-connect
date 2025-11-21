import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/Dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Search, FileText, Eye, MessageSquare } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAuth } from '../../contexts/AuthContext';
import { getReports, saveReports, getStudents } from '../../lib/mockData';
import { WeeklyReport, Student } from '../../types';
import { toast } from '@/hooks/use-toast';

const SupervisorReports = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<WeeklyReport[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [studentFilter, setStudentFilter] = useState('');
  const [weekFilter, setWeekFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState<WeeklyReport | null>(null);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (user) {
      const allStudents = getStudents();
      const myStudents = allStudents.filter(s => s.supervisorId === user.id);
      setStudents(myStudents);

      const allReports = getReports();
      const myReports = allReports.filter(r => 
        myStudents.some(s => s.id === r.studentId)
      );
      setReports(myReports.sort((a, b) => 
        new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime()
      ));
    }
  }, [user]);

  const filteredReports = reports.filter(report => {
    const student = students.find(s => s.id === report.studentId);
    if (!student) return false;

    const matchesStudent = !studentFilter || studentFilter === "all" || report.studentId === studentFilter;
    const matchesWeek = !weekFilter || weekFilter === "all" || report.weekNumber.toString() === weekFilter;
    const matchesStatus = !statusFilter || statusFilter === "all" || report.status === statusFilter;
    const matchesSearch = !searchQuery || 
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStudent && matchesWeek && matchesStatus && matchesSearch;
  });

  const weeks = Array.from(new Set(reports.map(r => r.weekNumber))).sort((a, b) => b - a);

  const handleSubmitFeedback = () => {
    if (!selectedReport || !feedback.trim()) {
      toast({
        title: "Error",
        description: "Please provide feedback",
        variant: "destructive"
      });
      return;
    }

    const allReports = getReports();
    const reportIndex = allReports.findIndex(r => r.id === selectedReport.id);
    
    if (reportIndex !== -1) {
      allReports[reportIndex] = {
        ...allReports[reportIndex],
        feedback,
        status: 'reviewed'
      };
      saveReports(allReports);
      
      setReports(allReports.filter(r => 
        students.some(s => s.id === r.studentId)
      ));
      
      toast({
        title: "Feedback Submitted",
        description: "Your feedback has been sent to the student."
      });
      
      setSelectedReport(null);
      setFeedback('');
    }
  };

  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    return student ? student.name : 'Unknown Student';
  };

  return (
    <DashboardLayout title="Student Reports">
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="relative md:w-1/3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search reports or students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-wrap gap-4">
            <Select 
              value={studentFilter || "all"} 
              onValueChange={(v) => setStudentFilter(v === "all" ? "" : v)}
            >
              <SelectTrigger className="md:w-[200px]">
                <SelectValue placeholder="All Students" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Students</SelectItem>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select 
              value={weekFilter || "all"} 
              onValueChange={(v) => setWeekFilter(v === "all" ? "" : v)}
            >
              <SelectTrigger className="md:w-[150px]">
                <SelectValue placeholder="All Weeks" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Weeks</SelectItem>
                {weeks.map((week) => (
                  <SelectItem key={week} value={week.toString()}>
                    Week {week}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select 
              value={statusFilter || "all"} 
              onValueChange={(v) => setStatusFilter(v === "all" ? "" : v)}
            >
              <SelectTrigger className="md:w-[150px]">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <p className="text-gray-500">
          Showing {filteredReports.length} of {reports.length} reports
        </p>
      </div>

      {selectedReport ? (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Week {selectedReport.weekNumber}: {selectedReport.title}</CardTitle>
                <CardDescription>
                  By {getStudentName(selectedReport.studentId)} • 
                  Submitted {new Date(selectedReport.submissionDate).toLocaleDateString()}
                </CardDescription>
              </div>
              <Button variant="outline" onClick={() => setSelectedReport(null)}>
                Back to List
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Report Content:</h4>
              <p className="text-gray-600 whitespace-pre-wrap">{selectedReport.description}</p>
            </div>

            {selectedReport.fileUrl && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <FileText className="inline mr-2" size={18} />
                <span className="text-sm">File attachment available</span>
              </div>
            )}

            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Provide Feedback:</h4>
              <Textarea
                placeholder="Enter your feedback for this report..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={4}
                className="mb-4"
              />
              <Button 
                onClick={handleSubmitFeedback}
                className="bg-aapoly-purple hover:bg-aapoly-purple/90"
              >
                Submit Feedback
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredReports.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No reports found matching your filters.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredReports.map((report) => (
              <Card key={report.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        Week {report.weekNumber}: {report.title}
                      </CardTitle>
                      <CardDescription>
                        {getStudentName(report.studentId)} • 
                        Submitted {new Date(report.submissionDate).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge variant={report.status === 'reviewed' ? 'default' : 'secondary'}>
                      {report.status === 'reviewed' ? 'Reviewed' : 'Pending'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 line-clamp-2 mb-4">
                    {report.description}
                  </p>
                  
                  {report.feedback && (
                    <div className="bg-green-50 border-l-4 border-green-500 p-3 mb-4">
                      <p className="text-sm font-medium text-green-900">Your Feedback:</p>
                      <p className="text-sm text-green-800">{report.feedback}</p>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedReport(report);
                        setFeedback(report.feedback || '');
                      }}
                    >
                      <Eye size={16} className="mr-2" />
                      {report.status === 'reviewed' ? 'View & Edit' : 'Review'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default SupervisorReports;
