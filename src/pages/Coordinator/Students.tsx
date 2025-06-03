
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
import { Search, MessageSquare, FileText, Users, Download } from 'lucide-react';

// Mock data for all students
const mockStudents = [
  {
    id: 'student-1',
    name: 'John Adebayo',
    matricNumber: '22-04-0191',
    department: 'Computer Science',
    organization: 'Tech Solutions Ltd.',
    organizationLocation: 'Lagos, Ikeja',
    supervisorId: 'supervisor-1',
    supervisorName: 'Dr. Oluwaseun Olamide',
    paymentStatus: 'paid',
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
    organizationLocation: 'Lagos, Ikeja',
    supervisorId: 'supervisor-1',
    supervisorName: 'Dr. Oluwaseun Olamide',
    paymentStatus: 'paid',
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
    organizationLocation: 'Ogun, Abeokuta',
    supervisorId: 'supervisor-2',
    supervisorName: 'Dr. Adebayo Martins',
    paymentStatus: 'pending',
    lastReport: new Date('2023-07-21'),
    status: 'active',
    weeklyReportsSubmitted: 4,
  },
  // Add more mock students...
];

const CoordinatorStudents = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get status filter from URL if any
  const searchParams = new URLSearchParams(location.search);
  const statusParam = searchParams.get('status');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState(statusParam || '');
  const [paymentFilter, setPaymentFilter] = useState('');
  
  // Filter students based on search and filters
  const filteredStudents = mockStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.matricNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.organization.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = !departmentFilter || student.department === departmentFilter;
    const matchesStatus = !statusFilter || student.status === statusFilter;
    const matchesPayment = !paymentFilter || student.paymentStatus === paymentFilter;
    
    return matchesSearch && matchesDepartment && matchesStatus && matchesPayment;
  });
  
  // Group students by organization
  const studentsByOrganization = filteredStudents.reduce<Record<string, typeof mockStudents>>((acc, student) => {
    const key = `${student.organization} - ${student.organizationLocation}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(student);
    return acc;
  }, {});
  
  const departments = [...new Set(mockStudents.map(s => s.department))];
  
  return (
    <DashboardLayout title="All Students">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative md:w-1/3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search students, matric numbers, or organizations"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-col md:flex-row gap-4">
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="md:w-[200px]">
                <SelectValue placeholder="Filter by Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="md:w-[150px]">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="md:w-[150px]">
                <SelectValue placeholder="Payment Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Payments</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            
            <Button className="bg-aapoly-purple hover:bg-aapoly-purple/90">
              <Download size={16} className="mr-2" />
              Export
            </Button>
          </div>
        </div>
        
        <div className="mt-4">
          <p className="text-gray-500">
            Showing {filteredStudents.length} of {mockStudents.length} students grouped by organization
          </p>
        </div>
      </div>
      
      {Object.entries(studentsByOrganization).map(([organization, students]) => (
        <div key={organization} className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">{organization}</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">{students.length} students</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate(`/coordinator/assign-supervisor?org=${encodeURIComponent(organization)}`)}
              >
                Assign Supervisor
              </Button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Student</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Matric Number</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Supervisor</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Payment</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Reports</th>
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
                        {student.supervisorName || 'Not Assigned'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <StatusBadge 
                          status={student.paymentStatus === 'paid' ? 'completed' : 'pending'}
                        />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.weeklyReportsSubmitted} reports
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
                            onClick={() => navigate(`/coordinator/messages/${student.id}`)}
                          >
                            <MessageSquare size={16} className="mr-1" />
                            Message
                          </Button>
                          
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="flex items-center text-gray-700 hover:text-aapoly-purple"
                            onClick={() => navigate(`/coordinator/reports?student=${student.id}`)}
                          >
                            <FileText size={16} className="mr-1" />
                            Reports
                          </Button>
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

export default CoordinatorStudents;
