
import React, { useState } from 'react';
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
import { CreditCard, Upload, FileText } from 'lucide-react';
import { SIWES_FEE } from '@/constants';

const StudentPayment = () => {
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'manual'>('online');
  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });

  const handleCardInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setCardInfo(prev => ({ ...prev, [id]: value }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPaymentFile(e.target.files[0]);
    }
  };

  const handleOnlinePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
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
    
    // Simulate payment evidence submission
    setTimeout(() => {
      setPaymentProcessing(false);
      toast({
        title: "Evidence Submitted",
        description: "Your payment evidence has been submitted and is pending verification.",
      });
    }, 2000);
  };

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
              <FileText size={40} className="text-aapoly-purple" />
            </div>

            <Tabs defaultValue="online" onValueChange={(v) => setPaymentMethod(v as 'online' | 'manual')}>
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
                      <Label htmlFor="expiryDate">Expiry Date (MM/YY)</Label>
                      <Input 
                        id="expiryDate"
                        placeholder="MM/YY"
                        value={cardInfo.expiryDate}
                        onChange={handleCardInfoChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input 
                        id="cvv"
                        placeholder="123"
                        value={cardInfo.cvv}
                        onChange={handleCardInfoChange}
                        required
                        maxLength={3}
                        type="password"
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button 
                      type="submit"
                      className="w-full bg-aapoly-purple hover:bg-aapoly-purple/90"
                      disabled={paymentProcessing}
                    >
                      <CreditCard className="mr-2" size={18} />
                      {paymentProcessing ? 'Processing Payment...' : `Pay ₦${SIWES_FEE.toLocaleString()}`}
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="manual">
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800">
                    <h3 className="font-semibold mb-2">Bank Payment Instructions</h3>
                    <p>Make a payment of ₦{SIWES_FEE.toLocaleString()} to the following account:</p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li><strong>Bank Name:</strong> Access Bank</li>
                      <li><strong>Account Number:</strong> 0022334455</li>
                      <li><strong>Account Name:</strong> Abraham Adesanya Polytechnic</li>
                      <li><strong>Reference:</strong> SIWES-[YOUR MATRIC NUMBER]</li>
                    </ul>
                  </div>

                  <form onSubmit={handleManualPayment} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="evidence">Upload Payment Evidence</Label>
                      <div className="border-2 border-dashed rounded-md p-6 text-center">
                        <label htmlFor="evidence" className="cursor-pointer flex flex-col items-center">
                          <Upload className="h-10 w-10 text-gray-400 mb-2" />
                          <span className="text-gray-500 font-medium">
                            {paymentFile ? paymentFile.name : 'Click to upload payment receipt'}
                          </span>
                          <span className="text-sm text-gray-400 mt-1">
                            PDF, JPG or PNG files up to 5MB
                          </span>
                          <input
                            id="evidence"
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="hidden"
                            onChange={handleFileChange}
                            required
                          />
                        </label>
                      </div>
                    </div>

                    <Button 
                      type="submit"
                      className="w-full bg-aapoly-purple hover:bg-aapoly-purple/90"
                      disabled={!paymentFile || paymentProcessing}
                    >
                      <Upload className="mr-2" size={18} />
                      {paymentProcessing ? 'Uploading...' : 'Submit Payment Evidence'}
                    </Button>
                  </form>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-gray-500">
              Need help with your payment? Contact the SIWES coordinator at siwes@aapoly.edu.ng.
            </p>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentPayment;
