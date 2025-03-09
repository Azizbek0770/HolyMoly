import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addPaymentMethod } from "@/api/users";
import { useAuth } from "@/contexts/AuthContext";

interface PaymentMethodFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function PaymentMethodForm({
  onSuccess,
  onCancel,
}: PaymentMethodFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardholderName: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    type: "Visa",
    isDefault: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    // Clear error when user types
    if (errors[id]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 16) value = value.slice(0, 16);

    // Format with spaces every 4 digits
    const formatted = value.replace(/(.{4})/g, "$1 ").trim();
    setFormData((prev) => ({
      ...prev,
      cardNumber: formatted,
    }));

    // Clear error when user types
    if (errors.cardNumber) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.cardNumber;
        return newErrors;
      });
    }

    // Auto-detect card type
    if (value.startsWith("4")) {
      setFormData((prev) => ({ ...prev, type: "Visa" }));
    } else if (
      value.startsWith("5") ||
      (parseInt(value.substring(0, 2)) >= 51 &&
        parseInt(value.substring(0, 2)) <= 55)
    ) {
      setFormData((prev) => ({ ...prev, type: "Mastercard" }));
    } else if (value.startsWith("3")) {
      setFormData((prev) => ({ ...prev, type: "American Express" }));
    } else if (value.startsWith("6")) {
      setFormData((prev) => ({ ...prev, type: "Discover" }));
    }
  };

  const handleTypeChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      type: value,
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isDefault: checked,
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = "Card number is required";
    } else if (formData.cardNumber.replace(/\s/g, "").length < 15) {
      newErrors.cardNumber = "Invalid card number";
    }

    if (!formData.cardholderName.trim()) {
      newErrors.cardholderName = "Cardholder name is required";
    }

    if (!formData.expiryMonth.trim()) {
      newErrors.expiryMonth = "Expiry month is required";
    } else if (!/^(0[1-9]|1[0-2])$/.test(formData.expiryMonth)) {
      newErrors.expiryMonth = "Invalid month (01-12)";
    }

    if (!formData.expiryYear.trim()) {
      newErrors.expiryYear = "Expiry year is required";
    } else if (!/^\d{2}$/.test(formData.expiryYear)) {
      newErrors.expiryYear = "Invalid year (YY)";
    } else {
      const currentYear = new Date().getFullYear() % 100;
      const year = parseInt(formData.expiryYear);
      if (year < currentYear) {
        newErrors.expiryYear = "Card has expired";
      }
    }

    if (!formData.cvv.trim()) {
      newErrors.cvv = "CVV is required";
    } else if (!/^\d{3,4}$/.test(formData.cvv)) {
      newErrors.cvv = "Invalid CVV";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to add a payment method",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, you would send this to a payment processor
      // Here we're just simulating it
      const cardNumber = formData.cardNumber.replace(/\s/g, "");
      const last4 = cardNumber.slice(-4);
      const expiry = `${formData.expiryMonth}/${formData.expiryYear}`;

      await addPaymentMethod({
        userId: user.id,
        type: formData.type,
        last4,
        expiry,
        isDefault: formData.isDefault,
      });

      toast({
        title: "Payment method added",
        description: "Your payment method has been added successfully",
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error adding payment method:", error);
      toast({
        title: "Error",
        description: "Failed to add payment method. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="cardNumber">Card Number</Label>
        <Input
          id="cardNumber"
          placeholder="1234 5678 9012 3456"
          value={formData.cardNumber}
          onChange={handleCardNumberChange}
          className={errors.cardNumber ? "border-red-500" : ""}
          maxLength={19} // 16 digits + 3 spaces
        />
        {errors.cardNumber && (
          <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="cardholderName">Cardholder Name</Label>
        <Input
          id="cardholderName"
          placeholder="John Doe"
          value={formData.cardholderName}
          onChange={handleChange}
          className={errors.cardholderName ? "border-red-500" : ""}
        />
        {errors.cardholderName && (
          <p className="text-red-500 text-xs mt-1">{errors.cardholderName}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Card Type</Label>
          <Select value={formData.type} onValueChange={handleTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select card type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Visa">Visa</SelectItem>
              <SelectItem value="Mastercard">Mastercard</SelectItem>
              <SelectItem value="American Express">American Express</SelectItem>
              <SelectItem value="Discover">Discover</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label htmlFor="expiryMonth">Month</Label>
            <Input
              id="expiryMonth"
              placeholder="MM"
              value={formData.expiryMonth}
              onChange={handleChange}
              className={errors.expiryMonth ? "border-red-500" : ""}
              maxLength={2}
            />
            {errors.expiryMonth && (
              <p className="text-red-500 text-xs mt-1">{errors.expiryMonth}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiryYear">Year</Label>
            <Input
              id="expiryYear"
              placeholder="YY"
              value={formData.expiryYear}
              onChange={handleChange}
              className={errors.expiryYear ? "border-red-500" : ""}
              maxLength={2}
            />
            {errors.expiryYear && (
              <p className="text-red-500 text-xs mt-1">{errors.expiryYear}</p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cvv">CVV</Label>
        <Input
          id="cvv"
          type="password"
          placeholder="123"
          value={formData.cvv}
          onChange={handleChange}
          className={errors.cvv ? "border-red-500" : ""}
          maxLength={4}
        />
        {errors.cvv && (
          <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="isDefault"
          checked={formData.isDefault}
          onCheckedChange={handleSwitchChange}
        />
        <Label htmlFor="isDefault">Set as default payment method</Label>
      </div>

      <div className="flex justify-end space-x-2 pt-2">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Payment Method"}
        </Button>
      </div>
    </form>
  );
}
