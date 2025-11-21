import React, { useState, useEffect } from 'react';
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
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { CreditCard, Upload, FileText, CheckCircle } from 'lucide-react';
import { SIWES_FEE } from '@/constants';
import { useAuth } from '../../contexts/AuthContext';
import { getPayments, savePayments, getStudents, saveStudents } from '../../lib/mockData';
import { Student } from '../../types';

const StudentPayment = () => {
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'manual'>('online');
  const [paymentFile, setPaymentFile] = useState<string | null>(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'paid'>('pending');
  
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });

  useEffect(() => {
    if (user) {
      const students = getStudents();
      const currentStudent = students.find(s => s.id === user.id) as Student;
      if (currentStudent) {
        setPaymentStatus(currentStudent.paymentStatus);
      }
    }
  }, [user]);

  const handleCardInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setCardInfo(prev => ({ ...prev, [id]: value }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOnlinePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentProcessing(true);
    
    setTimeout(() => {
      // Save payment record
      const payments = getPayments();
      payments.push({
        id: `pay-${Date.now()}`,
        studentId: user!.id,
        amount: SIWES_FEE,
        referenceNumber: `PAY-${Date.now()}`,
        paymentDate: new Date(),
        status: 'completed',
        paymentMethod: 'online'
      });
      savePayments(payments);
      
      // Update student payment status
      const students = getStudents();
      const studentIndex = students.findIndex(s => s.id === user!.id);
      if (studentIndex !== -1) {
        students[studentIndex] = {
          ...students[studentIndex],
          paymentStatus: 'paid'
        };
        saveStudents(students);
        setPaymentStatus('paid');
      }
      
      setPaymentProcessing(false);
      toast({
        title: "Payment Successful",
        description: `Your payment of ₦${SIWES_FEE.toLocaleString()} has been processed successfully. You can now download your SIWES letter.`,
      });
    }, 2000);
  };

  const handleManualPayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paymentFile) {
      toast({
        title: "Error",
        description: "Please upload your payment evidence",
        variant: "destructive"
      });
      return;
    }
    
    setPaymentProcessing(true);
    
    setTimeout(() => {
      // Save payment record with evidence
      const payments = getPayments();
      payments.push({
        id: `pay-${Date.now()}`,
        studentId: user!.id,
        amount: SIWES_FEE,
        referenceNumber: `MAN-${Date.now()}`,
        paymentDate: new Date(),
        status: 'pending',
        paymentMethod: 'manual',
        evidence: paymentFile
      });
      savePayments(payments);
      
      setPaymentProcessing(false);
      toast({
        title: "Evidence Submitted",
        description: "Your payment evidence has been submitted and is pending verification by the coordinator.",
      });
    }, 1500);
  };

  if (paymentStatus === 'paid') {
    return (
      <DashboardLayout title="SIWES Payment">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
                <h2 className="text-2xl font-bold text-green-600 mb-2">Payment Completed</h2>
                <p className="text-gray-600 mb-6">
                  Your SIWES fee payment has been verified. You now have full access to all features.
                </p>
                <Button className="bg-aapoly-purple hover:bg-aapoly-purple/90">
                  <FileText className="mr-2" size={18} />
                  Download SIWES Letter
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="SIWES Payment">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>SIWES Fee Payment</CardTitle>
            <CardDescription>
              Pay the required fee to access your SIWES letter and unlock full features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50 mb-6">
              <div>
                <h3 className="text-lg font-medium">Amount Due</h3>
                <p className="text-3xl font-bold text-aapoly-purple">₦{SIWES_FEE.toLocaleString()}</p>
              </div>
              <CreditCard size={48} className="text-aapoly-purple" />
            </div>
            
            <Tabs value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as 'online' | 'manual')}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="online">Online Payment</TabsTrigger>
                <TabsTrigger value="manual">Manual Payment</TabsTrigger>
              </TabsList>
              
              <TabsContent value="online">
                <form onSubmit={handleOnlinePayment} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardInfo.cardNumber}
                      onChange={handleCardInfoChange}
                      required
                      maxLength={19}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cardHolder">Card Holder Name</Label>
                    <Input
                      id="cardHolder"
                      placeholder="John Doe"
                      value={cardInfo.cardHolder}
                      onChange={handleCardInfoChange}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        placeholder="MM/YY"
                        value={cardInfo.expiryDate}
                        onChange={handleCardInfoChange}
                        required
                        maxLength={5}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        type="password"
                        placeholder="123"
                        value={cardInfo.cvv}
                        onChange={handleCardInfoChange}
                        required
                        maxLength={3}
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-aapoly-purple hover:bg-aapoly-purple/90"
                    disabled={paymentProcessing}
                  >
                    {paymentProcessing ? 'Processing...' : `Pay ₦${SIWES_FEE.toLocaleString()}`}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="manual">
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Bank Payment Details:</h4>
                    <div className="space-y-1 text-sm text-blue-800">
                      <p><strong>Bank Name:</strong> First Bank of Nigeria</p>
                      <p><strong>Account Name:</strong> Abraham Adesanya Polytechnic</p>
                      <p><strong>Account Number:</strong> 1234567890</p>
                      <p><strong>Amount:</strong> ₦{SIWES_FEE.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <form onSubmit={handleManualPayment} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="evidence">Upload Payment Evidence *</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-aapoly-purple transition-colors">
                        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600 mb-2">
                          {paymentFile ? '✓ File uploaded' : 'Click to upload or drag and drop'}
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG or PDF (max. 5MB)</p>
                        <Input
                          id="evidence"
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleFileChange}
                          className="mt-2"
                          required
                        />
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-aapoly-purple hover:bg-aapoly-purple/90"
                      disabled={paymentProcessing}
                    >
                      {paymentProcessing ? 'Submitting...' : 'Submit Evidence'}
                    </Button>
                  </form>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentPayment;
