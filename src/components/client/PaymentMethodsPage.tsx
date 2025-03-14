import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/contexts/AuthContext";
import PaymentMethodForm from "@/components/forms/PaymentMethodForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CreditCard, Plus, Edit, Trash2 } from "lucide-react";

interface PaymentMethod {
  id: string;
  type: string;
  last4: string;
  expiry: string;
  isDefault: boolean;
}

export default function PaymentMethodsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState<string | null>(null);

  // Mock payment methods
  const mockPaymentMethods: PaymentMethod[] = [
    {
      id: "1",
      type: "Visa",
      last4: "4242",
      expiry: "12/25",
      isDefault: true,
    },
    {
      id: "2",
      type: "Mastercard",
      last4: "5555",
      expiry: "10/24",
      isDefault: false,
    },
  ];

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    setIsLoading(true);
    try {
      // In a real app, you would fetch payment methods from an API
      // const response = await getUserPaymentMethods(user.id);
      // setPaymentMethods(response);

      // For now, we'll use mock data
      await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate API delay
      setPaymentMethods(mockPaymentMethods);
    } catch (error) {
      console.error("Error fetching payment methods:", error);
      toast({
        title: "Error",
        description: "Failed to load payment methods. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPaymentMethod = () => {
    setShowAddDialog(true);
  };

  const handleDeletePaymentMethod = (paymentId: string) => {
    setPaymentToDelete(paymentId);
  };

  const confirmDeletePaymentMethod = async () => {
    if (!paymentToDelete) return;

    try {
      // In a real app, you would call an API to delete the payment method
      // await deletePaymentMethod(paymentToDelete);

      // For now, we'll just update the local state
      await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate API delay
      setPaymentMethods((prevMethods) =>
        prevMethods.filter((method) => method.id !== paymentToDelete),
      );

      toast({
        title: "Payment method deleted",
        description: "Your payment method has been deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting payment method:", error);
      toast({
        title: "Error",
        description: "Failed to delete payment method. Please try again.",
        variant: "destructive",
      });
    } finally {
      setPaymentToDelete(null);
    }
  };

  const handleSetDefault = async (paymentId: string) => {
    try {
      // In a real app, you would call an API to set the default payment method
      // await setDefaultPaymentMethod(paymentId);

      // For now, we'll just update the local state
      await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate API delay
      setPaymentMethods((prevMethods) =>
        prevMethods.map((method) => ({
          ...method,
          isDefault: method.id === paymentId,
        })),
      );

      toast({
        title: "Default payment method updated",
        description:
          "Your default payment method has been updated successfully",
      });
    } catch (error) {
      console.error("Error setting default payment method:", error);
      toast({
        title: "Error",
        description:
          "Failed to update default payment method. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePaymentFormSuccess = () => {
    setShowAddDialog(false);
    fetchPaymentMethods();
  };

  const getCardIcon = (type: string) => {
    // In a real app, you would use actual card brand logos
    return <CreditCard className="h-5 w-5" />;
  };

  const getCardBackground = (type: string) => {
    switch (type.toLowerCase()) {
      case "visa":
        return "bg-blue-500";
      case "mastercard":
        return "bg-red-500";
      case "american express":
        return "bg-green-500";
      case "discover":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Payment Methods</h1>
        <Button onClick={handleAddPaymentMethod}>
          <Plus className="h-4 w-4 mr-2" /> Add Payment Method
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      ) : paymentMethods.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">No payment methods found</p>
            <p className="text-muted-foreground mb-6 text-center">
              You haven't added any payment methods yet.
            </p>
            <Button onClick={handleAddPaymentMethod}>
              <Plus className="h-4 w-4 mr-2" /> Add Payment Method
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paymentMethods.map((method) => (
            <Card key={method.id} className="overflow-hidden">
              <div
                className={`${getCardBackground(
                  method.type,
                )} text-white p-6 relative`}
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <p className="text-white/80 text-sm">Card Number</p>
                    <p className="font-mono text-lg">
                      •••• •••• •••• {method.last4}
                    </p>
                  </div>
                  <div>{getCardIcon(method.type)}</div>
                </div>
                <div className="mt-6 flex justify-between items-end">
                  <div>
                    <p className="text-white/80 text-xs">Expiry Date</p>
                    <p>{method.expiry}</p>
                  </div>
                  <div className="font-bold">{method.type}</div>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <p className="font-medium">
                    {method.type} ending in {method.last4}
                  </p>
                  {method.isDefault && (
                    <Badge variant="secondary">Default</Badge>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {!method.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefault(method.id)}
                    >
                      Set as Default
                    </Button>
                  )}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete this payment method. You
                          cannot undo this action.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeletePaymentMethod(method.id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Payment Method Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
          </DialogHeader>
          <PaymentMethodForm
            onSuccess={handlePaymentFormSuccess}
            onCancel={() => setShowAddDialog(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Payment Method Confirmation */}
      <AlertDialog
        open={!!paymentToDelete}
        onOpenChange={() => setPaymentToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this payment method. You cannot undo
              this action.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeletePaymentMethod}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
