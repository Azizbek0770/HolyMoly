import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createFoodItem, updateFoodItem } from "@/api/admin";

interface FoodItemFormProps {
  initialData?: {
    id?: string;
    name?: string;
    description?: string;
    price?: number;
    category?: string;
    image?: string;
    preparationTime?: number;
    available?: boolean;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
  mode?: "create" | "edit";
}

const categories = [
  "Pizza",
  "Burgers",
  "Sushi",
  "Salads",
  "Desserts",
  "Drinks",
  "Pasta",
  "Sandwiches",
  "Breakfast",
  "Sides",
];

export default function FoodItemForm({
  initialData = {},
  onSuccess,
  onCancel,
  mode = "create",
}: FoodItemFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData.name || "",
    description: initialData.description || "",
    price: initialData.price?.toString() || "",
    category: initialData.category || "Pizza",
    image: initialData.image || "",
    preparationTime: initialData.preparationTime?.toString() || "15",
    available:
      initialData.available !== undefined ? initialData.available : true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
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

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category: value,
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      available: checked,
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.price.trim()) {
      newErrors.price = "Price is required";
    } else if (
      isNaN(parseFloat(formData.price)) ||
      parseFloat(formData.price) <= 0
    ) {
      newErrors.price = "Price must be a positive number";
    }

    if (!formData.image.trim()) {
      newErrors.image = "Image URL is required";
    } else if (!formData.image.match(/^https?:\/\/.+/)) {
      newErrors.image = "Image URL must start with http:// or https://";
    }

    if (!formData.preparationTime.trim()) {
      newErrors.preparationTime = "Preparation time is required";
    } else if (
      isNaN(parseInt(formData.preparationTime)) ||
      parseInt(formData.preparationTime) <= 0
    ) {
      newErrors.preparationTime = "Preparation time must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === "create") {
        await createFoodItem({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          category: formData.category,
          image: formData.image,
          preparationTime: parseInt(formData.preparationTime),
        });

        toast({
          title: "Food item created",
          description: "The food item has been created successfully",
        });
      } else {
        if (!initialData.id) {
          throw new Error("Food item ID is required for editing");
        }

        await updateFoodItem({
          id: initialData.id,
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          category: formData.category,
          image: formData.image,
          preparationTime: parseInt(formData.preparationTime),
          available: formData.available,
        });

        toast({
          title: "Food item updated",
          description: "The food item has been updated successfully",
        });
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error saving food item:", error);
      toast({
        title: "Error",
        description: `Failed to ${mode === "create" ? "create" : "update"} food item. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          placeholder="Food item name"
          value={formData.name}
          onChange={handleChange}
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Food item description"
          value={formData.description}
          onChange={handleChange}
          className={errors.description ? "border-red-500" : ""}
          rows={3}
        />
        {errors.description && (
          <p className="text-red-500 text-xs mt-1">{errors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price ($)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={formData.price}
            onChange={handleChange}
            className={errors.price ? "border-red-500" : ""}
          />
          {errors.price && (
            <p className="text-red-500 text-xs mt-1">{errors.price}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Image URL</Label>
        <Input
          id="image"
          placeholder="https://example.com/image.jpg"
          value={formData.image}
          onChange={handleChange}
          className={errors.image ? "border-red-500" : ""}
        />
        {errors.image && (
          <p className="text-red-500 text-xs mt-1">{errors.image}</p>
        )}
        {formData.image && (
          <div className="mt-2 h-32 w-32 overflow-hidden rounded-md">
            <img
              src={formData.image}
              alt="Preview"
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://via.placeholder.com/150?text=Invalid+Image+URL";
              }}
            />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="preparationTime">Preparation Time (minutes)</Label>
        <Input
          id="preparationTime"
          type="number"
          placeholder="15"
          value={formData.preparationTime}
          onChange={handleChange}
          className={errors.preparationTime ? "border-red-500" : ""}
        />
        {errors.preparationTime && (
          <p className="text-red-500 text-xs mt-1">{errors.preparationTime}</p>
        )}
      </div>

      {mode === "edit" && (
        <div className="flex items-center space-x-2">
          <Switch
            id="available"
            checked={formData.available}
            onCheckedChange={handleSwitchChange}
          />
          <Label htmlFor="available">Available for ordering</Label>
        </div>
      )}

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
          {isSubmitting
            ? mode === "create"
              ? "Creating..."
              : "Updating..."
            : mode === "create"
              ? "Create Item"
              : "Update Item"}
        </Button>
      </div>
    </form>
  );
}
