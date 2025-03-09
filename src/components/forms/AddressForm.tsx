import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { addAddress } from "@/api/users";
import { useAuth } from "@/contexts/AuthContext";

interface AddressFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function AddressForm({ onSuccess, onCancel }: AddressFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
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

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isDefault: checked,
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Address name is required";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Street address is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!formData.zip.trim()) {
      newErrors.zip = "ZIP code is required";
    } else if (!/^\d{5}(-\d{4})?$/.test(formData.zip)) {
      newErrors.zip = "Invalid ZIP code format";
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
        description: "You must be logged in to add an address",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await addAddress({
        userId: user.id,
        name: formData.name,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        isDefault: formData.isDefault,
      });

      toast({
        title: "Address added",
        description: "Your address has been added successfully",
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error adding address:", error);
      toast({
        title: "Error",
        description: "Failed to add address. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Address Name</Label>
        <Input
          id="name"
          placeholder="Home, Work, etc."
          value={formData.name}
          onChange={handleChange}
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Street Address</Label>
        <Input
          id="address"
          placeholder="123 Main St, Apt 4B"
          value={formData.address}
          onChange={handleChange}
          className={errors.address ? "border-red-500" : ""}
        />
        {errors.address && (
          <p className="text-red-500 text-xs mt-1">{errors.address}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            placeholder="New York"
            value={formData.city}
            onChange={handleChange}
            className={errors.city ? "border-red-500" : ""}
          />
          {errors.city && (
            <p className="text-red-500 text-xs mt-1">{errors.city}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            placeholder="NY"
            value={formData.state}
            onChange={handleChange}
            className={errors.state ? "border-red-500" : ""}
          />
          {errors.state && (
            <p className="text-red-500 text-xs mt-1">{errors.state}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="zip">ZIP Code</Label>
        <Input
          id="zip"
          placeholder="10001"
          value={formData.zip}
          onChange={handleChange}
          className={errors.zip ? "border-red-500" : ""}
        />
        {errors.zip && (
          <p className="text-red-500 text-xs mt-1">{errors.zip}</p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="isDefault"
          checked={formData.isDefault}
          onCheckedChange={handleSwitchChange}
        />
        <Label htmlFor="isDefault">Set as default address</Label>
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
          {isSubmitting ? "Adding..." : "Add Address"}
        </Button>
      </div>
    </form>
  );
}
