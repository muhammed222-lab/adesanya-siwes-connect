
import { useState } from 'react';
import DashboardLayout from '../../components/Dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { NIGERIAN_STATES } from '@/constants';
import LocationMap from '../../components/LocationMap';
import { useAuth } from '../../contexts/AuthContext';
import { getStudents, saveStudents } from '../../lib/mockData';

const StudentOrganization = () => {
  const { user } = useAuth();
  
  // State for organization form
  const [formData, setFormData] = useState({
    organizationName: '',
    address: '',
    state: '',
    lga: '',
    contactPersonName: '',
    contactPersonPosition: '',
    contactPersonPhone: '',
    contactPersonEmail: '',
    startDate: '',
    endDate: '',
    location: { lat: 0, lng: 0 },
  });
  
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [showMap, setShowMap] = useState(false);
  
  // Mock LGAs based on selected state
  const getLGAs = (state: string) => {
    // This would typically come from an API based on the selected state
    // For now, we'll just return some sample LGAs
    switch (state) {
      case 'Lagos':
        return ['Alimosho', 'Ajeromi-Ifelodun', 'Kosofe', 'Mushin', 'Oshodi-Isolo', 'Ojo', 'Ikorodu', 'Surulere', 'Agege', 'Ifako-Ijaiye', 'Somolu', 'Amuwo-Odofin', 'Lagos Mainland', 'Ikeja', 'Eti-Osa', 'Badagry', 'Apapa', 'Lagos Island', 'Epe', 'Ibeju-Lekki'];
      case 'Ogun':
        return ['Abeokuta North', 'Abeokuta South', 'Ado-Odo/Ota', 'Egbado North', 'Egbado South', 'Ewekoro', 'Ifo', 'Ijebu East', 'Ijebu North', 'Ijebu North East', 'Ijebu Ode', 'Ikenne', 'Imeko Afon', 'Ipokia', 'Obafemi Owode', 'Odeda', 'Odogbolu', 'Ogun Waterside', 'Remo North', 'Sagamu'];
      case 'Oyo':
        return ['Afijio', 'Akinyele', 'Atiba', 'Atisbo', 'Egbeda', 'Ibadan North', 'Ibadan North-East', 'Ibadan North-West', 'Ibadan South-East', 'Ibadan South-West', 'Ibarapa Central', 'Ibarapa East', 'Ibarapa North', 'Ido', 'Irepo', 'Iseyin', 'Itesiwaju', 'Iwajowa', 'Kajola', 'Lagelu'];
      default:
        return [];
    }
  };
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  
  // Handle select changes
  const handleSelectChange = (field: string, value: string) => {
    // If changing state, reset LGA
    if (field === 'state') {
      setFormData(prev => ({ ...prev, state: value, lga: '' }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };
  
  // Handle location selection from map
  const handleLocationSelect = (location: { lat: number; lng: number; address: string }) => {
    setFormData(prev => ({
      ...prev,
      location: { lat: location.lat, lng: location.lng },
      address: location.address
    }));
    setShowMap(false);
    toast({
      title: "Location Selected",
      description: "Organization location has been set on the map.",
    });
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    
    // Validate required fields
    const requiredFields = ['organizationName', 'address', 'state', 'lga', 'contactPersonName', 'contactPersonPhone'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      setFormSubmitting(false);
      return;
    }

    if (formData.location.lat === 0 && formData.location.lng === 0) {
      toast({
        title: "Location Required",
        description: "Please select the organization location on the map.",
        variant: "destructive",
      });
      setFormSubmitting(false);
      return;
    }
    
    // Save to localStorage
    try {
      const students = getStudents();
      const studentIndex = students.findIndex(s => s.id === user?.id);
      
      if (studentIndex !== -1) {
        students[studentIndex] = {
          ...students[studentIndex],
          organizationName: formData.organizationName,
          organizationAddress: formData.address,
          organizationState: formData.state,
          organizationLGA: formData.lga,
          organizationContactPerson: formData.contactPersonName,
          organizationPhoneNumber: formData.contactPersonPhone,
          organizationLocation: formData.location,
        };
        
        saveStudents(students);
        
        toast({
          title: "Organization Information Saved",
          description: "Your SIWES organization details have been updated successfully.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save organization information.",
        variant: "destructive",
      });
    }
    
    setFormSubmitting(false);
  };
  
  return (
    <DashboardLayout title="SIWES Organization">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>SIWES Organization Details</CardTitle>
            <CardDescription>
              Enter information about the organization where you're completing your SIWES
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Organization Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="organizationName">Organization Name *</Label>
                  <Input
                    id="organizationName"
                    placeholder="Enter organization name"
                    value={formData.organizationName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Textarea
                    id="address"
                    placeholder="Enter complete address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Organization Location on Map *</Label>
                  <div className="p-4 border border-border rounded-lg bg-gray-50">
                    {formData.location.lat !== 0 ? (
                      <div className="space-y-2">
                        <p className="text-sm text-green-600 font-medium">✓ Location set</p>
                        <p className="text-xs text-muted-foreground">
                          Coordinates: {formData.location.lat.toFixed(4)}, {formData.location.lng.toFixed(4)}
                        </p>
                        <Button 
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setShowMap(true)}
                        >
                          Change Location
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={() => setShowMap(true)}
                      >
                        📍 Select Location on Map
                      </Button>
                    )}
                  </div>
                </div>
                
                {showMap && (
                  <div className="border border-border rounded-lg p-4">
                    <LocationMap 
                      onLocationSelect={handleLocationSelect}
                      initialLocation={formData.location.lat !== 0 ? formData.location : undefined}
                    />
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Select 
                      value={formData.state}
                      onValueChange={(value) => handleSelectChange('state', value)}
                    >
                      <SelectTrigger id="state">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {NIGERIAN_STATES.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lga">Local Government Area *</Label>
                    <Select 
                      value={formData.lga}
                      onValueChange={(value) => handleSelectChange('lga', value)}
                      disabled={!formData.state}
                    >
                      <SelectTrigger id="lga">
                        <SelectValue placeholder={!formData.state ? "Select state first" : "Select LGA"} />
                      </SelectTrigger>
                      <SelectContent>
                        {getLGAs(formData.state).map((lga) => (
                          <SelectItem key={lga} value={lga}>
                            {lga}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Contact Person Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="contactPersonName">Contact Person Name *</Label>
                  <Input
                    id="contactPersonName"
                    placeholder="Enter contact person's full name"
                    value={formData.contactPersonName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactPersonPosition">Position/Title</Label>
                  <Input
                    id="contactPersonPosition"
                    placeholder="Enter position or title"
                    value={formData.contactPersonPosition}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactPersonPhone">Phone Number *</Label>
                    <Input
                      id="contactPersonPhone"
                      placeholder="Enter phone number"
                      value={formData.contactPersonPhone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contactPersonEmail">Email Address</Label>
                    <Input
                      id="contactPersonEmail"
                      type="email"
                      placeholder="Enter email address"
                      value={formData.contactPersonEmail}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">SIWES Period</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full bg-aapoly-purple hover:bg-aapoly-purple/90"
                disabled={formSubmitting}
              >
                {formSubmitting ? 'Saving...' : 'Save Organization Information'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentOrganization;
