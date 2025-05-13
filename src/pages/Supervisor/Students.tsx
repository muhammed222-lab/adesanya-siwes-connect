import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { Search, MessageSquare, FileText, AlertTriangle, Users } from 'lucide-react';

// Mock data for assigned students
const mockStudents = [
  {
    id: 'student-1',
    name: 'John Adebayo',
    matricNumber: '22-04-0191',
    department: 'Computer Science',
    organization: 'Tech Solutions Ltd.',
    lastReport: new Date('2023-07-22'),
    status: 'active',
    weeklyReportsSubmitted: 4,
  },
  {
    id: 'student-2',
    name: 'Esther Okafor',
    matricNumber: '22-04-0127',
    department: 'Computer Science',
    organization: 'Tech Solutions Ltd.',
    lastReport: new Date('2023-07-21'),
    status: 'active',
    weeklyReportsSubmitted: 4,
  },
  {
    id: 'student-3',
    name: 'Oluwatobi Bakare',
    matricNumber: '22-04-0112',
    department: 'Computer Science',
    organization: 'Global Systems Limited',
    lastReport: new Date('2023-07-21'),
    status: 'active',
    weeklyReportsSubmitted: 4,
  },
  {
    id: 'student-4',
    name: 'Chidinma Eze',
    matricNumber: '22-04-0084',
    department: 'Computer Science',
    organization: 'Global Systems Limited',
    lastReport: new Date('2023-07-20'),
    status: 'active',
    weeklyReportsSubmitted: 4,
  },
  {
    id: 'student-5',
    name: 'Mohammed Ibrahim',
    matricNumber: '22-04-0057',
    department: 'Computer Science',
    organization: 'Datawave Technologies',
    lastReport: new Date('2023-07-19'),
    status: 'active',
    weeklyReportsSubmitted: 4,
  },
  {
    id: 'student-6',
    name: 'Yetunde Adewale',
    matricNumber: '22-04-0063',
    department: 'Computer Science',
    organization: 'Datawave Technologies',
    lastReport: new Date('2023-07-15'),
    status: 'inactive',
    weeklyReportsSubmitted: 3,
  },
  {
    id: 'student-7',
    name: 'Samuel Okonkwo',
    matricNumber: '22-04-0042',
    department: 'Computer Science',
    organization: 'Fintech Innovations Ltd.',
    lastReport: new Date('2023-07-10'),
    status: 'inactive',
    weeklyReportsSubmitted: 2,
  },
  {
    id: 'student-8',
    name: 'Fatima Bello',
    matricNumber: '22-04-0031',
    department: 'Computer Science',
    organization: 'Digital Creative Agency',
    lastReport: new Date('2023-07-05'),
    status: 'inactive',
    weeklyReportsSubmitted: 1,
  },
];

// Get unique organizations
const organizations = [...new Set(mockStudents.map(student => student.organization))];

const SupervisorStudents = () => {
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [organizationFilter, setOrganizationFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Filter students based on search and filters
  const filteredStudents = mockStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.matricNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesOrganization = !organizationFilter || student.organization === organizationFilter;
    
    const matchesStatus = !statusFilter || student.status === statusFilter;
    
    return matchesSearch && matchesOrganization && matchesStatus;
  });
  
  // Group students by organization
  const studentsByOrganization = filteredStudents.reduce<Record<string, typeof mockStudents>>((acc, student) => {
    if (!acc[student.organization]) {
      acc[student.organization] = [];
    }
    acc[student.organization].push(student);
    return acc;
  }, {});
  
  return (
    <DashboardLayout title="Assigned Students">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative md:w-1/3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search by name or matric number"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-col md:flex-row gap-4">
            <Select 
              value={organizationFilter} 
              onValueChange={setOrganizationFilter}
            >
              <SelectTrigger className="md:w-[240px]">
                <SelectValue placeholder="Filter by Organization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Organizations</SelectItem>
                {organizations.map((org) => (
                  <SelectItem key={org} value={org}>{org}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select 
              value={statusFilter} 
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="md:w-[180px]">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="mt-4">
          <p className="text-gray-500">
            Showing {filteredStudents.length} of {mockStudents.length} students
          </p>
        </div>
      </div>
      
      {Object.entries(studentsByOrganization).map(([organization, students]) => (
        <div key={organization} className="mb-8">
          <h2 className="text-xl font-semibold mb-4">{organization}</h2>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Student</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Matric Number</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Reports</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Last Report</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {students.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-aapoly-purple text-white flex items-center justify-center">
                            {student.name.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{student.name}</div>
                            <div className="text-sm text-gray-500">{student.department}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.matricNumber}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.weeklyReportsSubmitted} reports
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.lastReport.toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <StatusBadge 
                          status={student.status === 'active' ? 'completed' : 'pending'}
                        />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="flex items-center text-gray-700 hover:text-aapoly-purple"
                            onClick={() => navigate(`/supervisor/messages/${student.id}`)}
                          >
                            <MessageSquare size={16} className="mr-1" />
                            Message
                          </Button>
                          
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="flex items-center text-gray-700 hover:text-aapoly-purple"
                            onClick={() => navigate(`/supervisor/reports?student=${student.id}`)}
                          >
                            <FileText size={16} className="mr-1" />
                            Reports
                          </Button>
                          
                          {student.status === 'inactive' && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="flex items-center text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <AlertTriangle size={16} className="mr-1" />
                              Flag
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ))}
      
      {filteredStudents.length === 0 && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No students found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}
    </DashboardLayout>
  );
};

export default SupervisorStudents;
