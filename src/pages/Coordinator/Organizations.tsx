
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/Dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Search, Building, Users, MapPin, Phone, Mail } from 'lucide-react';

// Mock data for organizations
const mockOrganizations = [
  {
    id: 'org-1',
    name: 'Tech Solutions Ltd.',
    address: '15 Ikeja Industrial Estate, Ikeja',
    state: 'Lagos',
    lga: 'Ikeja',
    contactPerson: 'Mr. Adebayo Johnson',
    contactPhone: '08012345678',
    contactEmail: 'adebayo@techsolutions.com',
    studentCount: 5,
    students: ['John Adebayo', 'Esther Okafor', 'Michael Okon', 'Sarah Ahmed', 'David Okoro']
  },
  {
    id: 'org-2',
    name: 'Global Systems Limited',
    address: '23 Oba Akran Avenue, Abeokuta',
    state: 'Ogun',
    lga: 'Abeokuta North',
    contactPerson: 'Mrs. Folake Adeyemi',
    contactPhone: '08087654321',
    contactEmail: 'folake@globalsystems.ng',
    studentCount: 4,
    students: ['Oluwatobi Bakare', 'Chidinma Eze', 'Ibrahim Hassan', 'Grace Okafor']
  },
  {
    id: 'org-3',
    name: 'Datawave Technologies',
    address: '8 Computer Village, Ikeja',
    state: 'Lagos',
    lga: 'Ikeja',
    contactPerson: 'Engr. Tunde Ogundimu',
    contactPhone: '08098765432',
    contactEmail: 'tunde@datawave.com.ng',
    studentCount: 3,
    students: ['Mohammed Ibrahim', 'Yetunde Adewale', 'Kemi Oladele']
  },
  {
    id: 'org-4',
    name: 'Fintech Innovations Ltd.',
    address: '45 Victoria Island, Lagos',
    state: 'Lagos',
    lga: 'Lagos Island',
    contactPerson: 'Dr. Emeka Nwankwo',
    contactPhone: '08054321098',
    contactEmail: 'emeka@fintech.ng',
    studentCount: 2,
    students: ['Samuel Okonkwo', 'Blessing Okwu']
  },
  {
    id: 'org-5',
    name: 'Digital Creative Agency',
    address: '12 Ikorodu Road, Lagos',
    state: 'Lagos',
    lga: 'Kosofe',
    contactPerson: 'Miss Aisha Bello',
    contactPhone: '08076543210',
    contactEmail: 'aisha@digitalcreative.ng',
    studentCount: 1,
    students: ['Fatima Bello']
  }
];

const CoordinatorOrganizations = () => {
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [lgaFilter, setLgaFilter] = useState('');
  
  // Filter organizations based on search and filters
  const filteredOrganizations = mockOrganizations.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         org.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         org.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesState = !stateFilter || org.state === stateFilter;
    const matchesLGA = !lgaFilter || org.lga === lgaFilter;
    
    return matchesSearch && matchesState && matchesLGA;
  });
  
  // Get unique states and LGAs for filters
  const states = [...new Set(mockOrganizations.map(org => org.state))];
  const lgas = stateFilter 
    ? [...new Set(mockOrganizations.filter(org => org.state === stateFilter).map(org => org.lga))]
    : [...new Set(mockOrganizations.map(org => org.lga))];
  
  return (
    <DashboardLayout title="SIWES Organizations">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative md:w-1/3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search organizations, addresses, or contact persons"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-col md:flex-row gap-4">
            <Select value={stateFilter || "all"} onValueChange={(v) => setStateFilter(v === "all" ? "" : v)}>
              <SelectTrigger className="md:w-[150px]">
                <SelectValue placeholder="Filter by State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                {states.map((state) => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={lgaFilter || "all"} onValueChange={(v) => setLgaFilter(v === "all" ? "" : v)}>
              <SelectTrigger className="md:w-[180px]">
                <SelectValue placeholder="Filter by LGA" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All LGAs</SelectItem>
                {lgas.map((lga) => (
                  <SelectItem key={lga} value={lga}>{lga}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="mt-4">
          <p className="text-gray-500">
            Showing {filteredOrganizations.length} of {mockOrganizations.length} organizations
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrganizations.map((organization) => (
          <Card key={organization.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5 text-aapoly-purple" />
                <span className="truncate">{organization.name}</span>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-gray-600">
                    <div>{organization.address}</div>
                    <div>{organization.lga}, {organization.state}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{organization.contactPhone}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{organization.contactEmail}</span>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Contact Person</span>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-aapoly-purple" />
                    <span className="text-sm font-medium text-aapoly-purple">
                      {organization.studentCount} students
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{organization.contactPerson}</p>
              </div>
              
              <div className="border-t pt-4">
                <div className="text-sm font-medium mb-2">Students:</div>
                <div className="space-y-1">
                  {organization.students.slice(0, 3).map((student, index) => (
                    <div key={index} className="text-sm text-gray-600">• {student}</div>
                  ))}
                  {organization.students.length > 3 && (
                    <div className="text-sm text-gray-500">
                      +{organization.students.length - 3} more...
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => navigate(`/coordinator/students?org=${encodeURIComponent(organization.name)}`)}
                >
                  View Students
                </Button>
                <Button 
                  size="sm" 
                  className="flex-1 bg-aapoly-purple hover:bg-aapoly-purple/90"
                  onClick={() => navigate(`/coordinator/assign-supervisor?org=${encodeURIComponent(organization.name)}`)}
                >
                  Assign Supervisor
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredOrganizations.length === 0 && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <Building className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No organizations found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}
    </DashboardLayout>
  );
};

export default CoordinatorOrganizations;
