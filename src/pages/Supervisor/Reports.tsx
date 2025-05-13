
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/Dashboard/DashboardLayout';
import StatusBadge from '../../components/Dashboard/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { Search, FileText, Download, Eye, FileCheck } from 'lucide-react';

// Mock reports data
const mockReports = [
  {
    id: 'report-1',
    studentId: 'student-1',
    studentName: 'John Adebayo',
    matricNumber: '22-04-0191',
    weekNumber: 4,
    title: 'Database Design and Implementation',
    description: 'This week, I focused on designing and implementing the database schema for the company\'s new project. I created entity-relationship diagrams, normalized the database structure, and implemented it using PostgreSQL. I also wrote SQL queries to retrieve and manipulate data based on business requirements.',
    submissionDate: new Date('2023-07-22T10:30:00'),
    status: 'pending',
    feedback: '',
  },
  {
    id: 'report-2',
    studentId: 'student-2',
    studentName: 'Esther Okafor',
    matricNumber: '22-04-0127',
    weekNumber: 4,
    title: 'Frontend Development with React',
    description: 'I worked on building UI components using React. Created reusable components for forms, tables, and navigation. Implemented state management with React hooks and context API. Also worked on responsive design using CSS Grid and Flexbox.',
    submissionDate: new Date('2023-07-21T16:15:00'),
    status: 'pending',
    feedback: '',
  },
  {
    id: 'report-3',
    studentId: 'student-3',
    studentName: 'Oluwatobi Bakare',
    matricNumber: '22-04-0112',
    weekNumber: 4,
    title: 'API Integration',
    description: 'Spent the week integrating third-party APIs into our application. Worked with RESTful APIs for payment processing and geolocation services. Implemented error handling and data validation. Created a wrapper service to standardize API calls across the application.',
    submissionDate: new Date('2023-07-21T09:45:00'),
    status: 'pending',
    feedback: '',
  },
  {
    id: 'report-4',
    studentId: 'student-4',
    studentName: 'Chidinma Eze',
    matricNumber: '22-04-0084',
    weekNumber: 3,
    title: 'Quality Assurance and Testing',
    description: 'Focused on writing and executing test cases for the application. Created unit tests using Jest, integration tests, and end-to-end tests with Cypress. Identified and reported bugs, and worked with developers to fix them.',
    submissionDate: new Date('2023-07-14T11:20:00'),
    status: 'reviewed',
    feedback: 'Great work on implementing the testing framework. Try to include more test coverage statistics in your next report.',
  },
  {
    id: 'report-5',
    studentId: 'student-5',
    studentName: 'Mohammed Ibrahim',
    matricNumber: '22-04-0057',
    weekNumber: 3,
    title: 'DevOps and Deployment',
    description: 'Learned about CI/CD pipelines and deployment processes. Set up automated testing and deployment using GitHub Actions. Configured Docker containers for development and production environments. Deployed the application to AWS.',
    submissionDate: new Date('2023-07-14T08:45:00'),
    status: 'reviewed',
    feedback: 'Impressive work with the CI/CD pipelines. Would be good to include diagrams of the deployment architecture in future reports.',
  }
];

// Mock students data
const mockStudents = [
  { id: 'student-1', name: 'John Adebayo', matricNumber: '22-04-0191' },
  { id: 'student-2', name: 'Esther Okafor', matricNumber: '22-04-0127' },
  { id: 'student-3', name: 'Oluwatobi Bakare', matricNumber: '22-04-0112' },
  { id: 'student-4', name: 'Chidinma Eze', matricNumber: '22-04-0084' },
  { id: 'student-5', name: 'Mohammed Ibrahim', matricNumber: '22-04-0057' },
  { id: 'student-6', name: 'Yetunde Adewale', matricNumber: '22-04-0063' },
  { id: 'student-7', name: 'Samuel Okonkwo', matricNumber: '22-04-0042' },
  { id: 'student-8', name: 'Fatima Bello', matricNumber: '22-04-0031' },
];

const SupervisorReports = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get student filter from URL if any
  const searchParams = new URLSearchParams(location.search);
  const studentParam = searchParams.get('student');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [studentFilter, setStudentFilter] = useState(studentParam || '');
  const [statusFilter, setStatusFilter] = useState('');
  const [weekFilter, setWeekFilter] = useState('');
  
  const [selectedReport, setSelectedReport] = useState<(typeof mockReports)[0] | null>(null);
  const [feedback, setFeedback] = useState('');
  
  // Filter reports based on search and filters
  const filteredReports = mockReports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          report.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          report.matricNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStudent = !studentFilter || report.studentId === studentFilter;
    
    const matchesStatus = !statusFilter || report.status === statusFilter;
    
    const matchesWeek = !weekFilter || report.weekNumber.toString() === weekFilter;
    
    return matchesSearch && matchesStudent && matchesStatus && matchesWeek;
  });
  
  const handleOpenReport = (report: (typeof mockReports)[0]) => {
    setSelectedReport(report);
    setFeedback(report.feedback);
  };
  
  const handleProvideFeedback = () => {
    if (!selectedReport) return;
    
    // In a real app, this would be an API call
    toast({
      title: "Feedback Submitted",
      description: `Feedback for ${selectedReport.studentName}'s Week ${selectedReport.weekNumber} report has been submitted.`,
    });
    
    // Update the report in our mock data
    mockReports.forEach(report => {
      if (report.id === selectedReport.id) {
        report.feedback = feedback;
        report.status = 'reviewed';
      }
    });
    
    setSelectedReport(null);
  };
  
  // Get unique weeks from reports
  const weeks = [...new Set(mockReports.map(report => report.weekNumber))].sort((a, b) => b - a);
  
  return (
    <DashboardLayout title="Student Reports">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative md:w-1/3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search reports"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-col md:flex-row gap-4">
            <Select 
              value={studentFilter} 
              onValueChange={setStudentFilter}
            >
              <SelectTrigger className="md:w-[200px]">
                <SelectValue placeholder="All Students" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Students</SelectItem>
                {mockStudents.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select 
              value={weekFilter} 
              onValueChange={setWeekFilter}
            >
              <SelectTrigger className="md:w-[150px]">
                <SelectValue placeholder="All Weeks" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Weeks</SelectItem>
                {weeks.map((week) => (
                  <SelectItem key={week} value={week.toString()}>
                    Week {week}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select 
              value={statusFilter} 
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="md:w-[150px]">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="mt-4">
          <p className="text-gray-500">
            Showing {filteredReports.length} of {mockReports.length} reports
          </p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Student</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Week</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Title</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Submission Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-aapoly-purple text-white flex items-center justify-center">
                        {report.studentName.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{report.studentName}</div>
                        <div className="text-xs text-gray-500">{report.matricNumber}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    Week {report.weekNumber}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900 max-w-xs truncate">
                    {report.title}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.submissionDate.toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <StatusBadge status={report.status === 'reviewed' ? 'reviewed' : 'pending'} />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex items-center"
                            onClick={() => handleOpenReport(report)}
                          >
                            <Eye size={16} className="mr-1" />
                            Review
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>Week {report.weekNumber} Report: {report.title}</DialogTitle>
                            <DialogDescription>
                              Submitted by {report.studentName} ({report.matricNumber}) on {report.submissionDate.toLocaleDateString()}
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-4 my-4">
                            <div className="p-4 bg-gray-50 rounded-md">
                              <h4 className="text-sm font-medium text-gray-500 mb-1">Report Content</h4>
                              <p className="text-gray-800 whitespace-pre-wrap">{report.description}</p>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="feedback">Feedback</Label>
                              <Textarea
                                id="feedback"
                                placeholder="Provide feedback to the student"
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                rows={4}
                              />
                            </div>
                          </div>
                          
                          <DialogFooter>
                            {report.status === 'reviewed' ? (
                              <Button 
                                onClick={handleProvideFeedback}
                                className="bg-aapoly-purple hover:bg-aapoly-purple/90"
                              >
                                <FileCheck size={16} className="mr-2" />
                                Update Feedback
                              </Button>
                            ) : (
                              <Button 
                                onClick={handleProvideFeedback}
                                className="bg-aapoly-purple hover:bg-aapoly-purple/90"
                              >
                                <FileCheck size={16} className="mr-2" />
                                Submit Feedback
                              </Button>
                            )}
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="flex items-center text-gray-700 hover:text-aapoly-purple"
                      >
                        <Download size={16} className="mr-1" />
                        Download
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {filteredReports.length === 0 && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No reports found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}
    </DashboardLayout>
  );
};

export default SupervisorReports;
