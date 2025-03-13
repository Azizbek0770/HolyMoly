import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Spinner } from "@/components/ui/spinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Calendar,
  Tag,
  Percent,
  DollarSign,
  Image as ImageIcon,
  Save,
  X,
} from "lucide-react";

interface Promotion {
  id: string;
  code: string;
  title: string;
  description: string;
  type: "percentage" | "fixed";
  discount: number;
  minOrder: number | null;
  maxDiscount: number | null;
  startDate: string;
  endDate: string;
  image: string;
  backgroundColor: string;
  active: boolean;
}

// Mock data for promotions
const mockPromotions: Promotion[] = [
  {
    id: "1",
    code: "WELCOME",
    title: "Free Delivery",
    description: "On your first order",
    type: "fixed",
    discount: 5,
    minOrder: 15,
    maxDiscount: null,
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    image:
      "https://images.unsplash.com/photo-1576866209830-589e1bfbaa4d?w=600&q=80",
    backgroundColor: "bg-blue-500",
    active: true,
  },
  {
    id: "2",
    code: "SAVE20",
    title: "20% OFF",
    description: "On orders over $30",
    type: "percentage",
    discount: 20,
    minOrder: 30,
    maxDiscount: 15,
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
    backgroundColor: "bg-green-500",
    active: true,
  },
  {
    id: "3",
    code: "BOGOF",
    title: "Buy One Get One",
    description: "On selected items",
    type: "fixed",
    discount: 0,
    minOrder: null,
    maxDiscount: null,
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80",
    backgroundColor: "bg-purple-500",
    active: true,
  },
];

// Background color options
const backgroundColors = [
  { value: "bg-blue-500", label: "Blue" },
  { value: "bg-green-500", label: "Green" },
  { value: "bg-purple-500", label: "Purple" },
  { value: "bg-red-500", label: "Red" },
  { value: "bg-yellow-500", label: "Yellow" },
  { value: "bg-pink-500", label: "Pink" },
  { value: "bg-indigo-500", label: "Indigo" },
  { value: "bg-orange-500", label: "Orange" },
];

export default function SpecialOffersPage() {
  const { toast } = useToast();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isToggling, setIsToggling] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(
    null,
  );

  // Form state
  const [formData, setFormData] = useState({
    code: "",
    title: "",
    description: "",
    type: "percentage" as "percentage" | "fixed",
    discount: "",
    minOrder: "",
    maxDiscount: "",
    startDate: "",
    endDate: "",
    image: "",
    backgroundColor: "bg-blue-500",
    active: true,
  });

  useEffect(() => {
    // In a real app, you would fetch promotions from an API
    // For now, we'll use the mock data
    const fetchPromotions = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        setPromotions(mockPromotions);
      } catch (error) {
        console.error("Error fetching promotions:", error);
        toast({
          title: "Error",
          description: "Failed to load promotions",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPromotions();
  }, [toast]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      active: checked,
    }));
  };

  const resetForm = () => {
    setFormData({
      code: "",
      title: "",
      description: "",
      type: "percentage",
      discount: "",
      minOrder: "",
      maxDiscount: "",
      startDate: "",
      endDate: "",
      image: "",
      backgroundColor: "bg-blue-500",
      active: true,
    });
  };

  const handleAddPromotion = () => {
    setEditingPromotion(null);
    resetForm();
    setShowAddDialog(true);
  };

  const handleEditPromotion = (promotion: Promotion) => {
    setEditingPromotion(promotion);
    setFormData({
      code: promotion.code,
      title: promotion.title,
      description: promotion.description,
      type: promotion.type,
      discount: promotion.discount.toString(),
      minOrder: promotion.minOrder?.toString() || "",
      maxDiscount: promotion.maxDiscount?.toString() || "",
      startDate: promotion.startDate,
      endDate: promotion.endDate,
      image: promotion.image,
      backgroundColor: promotion.backgroundColor,
      active: promotion.active,
    });
    setShowAddDialog(true);
  };

  const handleDeletePromotion = async (id: string) => {
    setIsDeleting(id);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      setPromotions((prev) => prev.filter((promotion) => promotion.id !== id));
      toast({
        title: "Promotion deleted",
        description: "The promotion has been deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting promotion:", error);
      toast({
        title: "Error",
        description: "Failed to delete promotion. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(null);
    }
  };

  const handleToggleActive = async (id: string, active: boolean) => {
    setIsToggling(id);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setPromotions((prev) =>
        prev.map((promotion) =>
          promotion.id === id ? { ...promotion, active } : promotion,
        ),
      );
      toast({
        title: active ? "Promotion activated" : "Promotion deactivated",
        description: `The promotion has been ${active ? "activated" : "deactivated"} successfully`,
      });
    } catch (error) {
      console.error("Error toggling promotion:", error);
      toast({
        title: "Error",
        description: `Failed to ${active ? "activate" : "deactivate"} promotion. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsToggling(null);
    }
  };

  const validateForm = () => {
    // Basic validation
    if (!formData.code.trim()) {
      toast({
        title: "Validation Error",
        description: "Promo code is required",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Title is required",
        variant: "destructive",
      });
      return false;
    }

    if (
      !formData.discount.trim() ||
      isNaN(parseFloat(formData.discount)) ||
      parseFloat(formData.discount) < 0
    ) {
      toast({
        title: "Validation Error",
        description: "Discount must be a valid number",
        variant: "destructive",
      });
      return false;
    }

    if (
      formData.minOrder.trim() &&
      (isNaN(parseFloat(formData.minOrder)) ||
        parseFloat(formData.minOrder) < 0)
    ) {
      toast({
        title: "Validation Error",
        description: "Minimum order must be a valid number",
        variant: "destructive",
      });
      return false;
    }

    if (
      formData.maxDiscount.trim() &&
      (isNaN(parseFloat(formData.maxDiscount)) ||
        parseFloat(formData.maxDiscount) < 0)
    ) {
      toast({
        title: "Validation Error",
        description: "Maximum discount must be a valid number",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.startDate.trim()) {
      toast({
        title: "Validation Error",
        description: "Start date is required",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.endDate.trim()) {
      toast({
        title: "Validation Error",
        description: "End date is required",
        variant: "destructive",
      });
      return false;
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      toast({
        title: "Validation Error",
        description: "End date must be after start date",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.image.trim()) {
      toast({
        title: "Validation Error",
        description: "Image URL is required",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSavePromotion = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, you would send the data to an API
      // For now, we'll just update the local state
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newPromotion: Promotion = {
        id: editingPromotion?.id || `new-${Date.now()}`,
        code: formData.code,
        title: formData.title,
        description: formData.description,
        type: formData.type,
        discount: parseFloat(formData.discount),
        minOrder: formData.minOrder ? parseFloat(formData.minOrder) : null,
        maxDiscount: formData.maxDiscount
          ? parseFloat(formData.maxDiscount)
          : null,
        startDate: formData.startDate,
        endDate: formData.endDate,
        image: formData.image,
        backgroundColor: formData.backgroundColor,
        active: formData.active,
      };

      if (editingPromotion) {
        // Update existing promotion
        setPromotions((prev) =>
          prev.map((promotion) =>
            promotion.id === editingPromotion.id ? newPromotion : promotion,
          ),
        );
        toast({
          title: "Promotion updated",
          description: "The promotion has been updated successfully",
        });
      } else {
        // Add new promotion
        setPromotions((prev) => [...prev, newPromotion]);
        toast({
          title: "Promotion created",
          description: "The promotion has been created successfully",
        });
      }

      setShowAddDialog(false);
      resetForm();
    } catch (error) {
      console.error("Error saving promotion:", error);
      toast({
        title: "Error",
        description: "Failed to save promotion. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter promotions based on search query
  const filteredPromotions = promotions.filter(
    (promotion) =>
      promotion.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      promotion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      promotion.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Special Offers & Promotions</h1>
        <Button onClick={handleAddPromotion}>
          <Plus className="h-4 w-4 mr-2" /> Add New Promotion
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search promotions..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPromotions.map((promotion) => (
              <Card key={promotion.id} className="overflow-hidden">
                <div className={`${promotion.backgroundColor} h-40 relative`}>
                  <div className="absolute inset-0 bg-black/20"></div>
                  <img
                    src={promotion.image}
                    alt={promotion.title}
                    className="w-full h-full object-cover mix-blend-overlay"
                  />
                  <div className="absolute inset-0 p-4 flex flex-col justify-between text-white">
                    <div>
                      <h3 className="text-xl font-bold">{promotion.title}</h3>
                      <p className="text-white/90">{promotion.description}</p>
                    </div>
                    <Badge className="self-start bg-white/20 hover:bg-white/30 text-white border-0">
                      Code: {promotion.code}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <Badge variant={promotion.active ? "default" : "secondary"}>
                      {promotion.active ? "Active" : "Inactive"}
                    </Badge>
                    <div className="text-sm text-muted-foreground">
                      {promotion.type === "percentage" ? (
                        <span className="flex items-center">
                          <Percent className="h-4 w-4 mr-1" />
                          {promotion.discount}% off
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />$
                          {promotion.discount} off
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    {promotion.minOrder && (
                      <div className="flex items-center">
                        <Tag className="h-4 w-4 mr-2" />
                        Min. Order: ${promotion.minOrder}
                      </div>
                    )}
                    {promotion.maxDiscount && (
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2" />
                        Max. Discount: ${promotion.maxDiscount}
                      </div>
                    )}
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(
                        promotion.startDate,
                      ).toLocaleDateString()} -{" "}
                      {new Date(promotion.endDate).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleToggleActive(promotion.id, !promotion.active)
                    }
                    disabled={isToggling === promotion.id}
                  >
                    {isToggling === promotion.id ? (
                      <Spinner size="sm" className="mr-2" />
                    ) : promotion.active ? (
                      "Deactivate"
                    ) : (
                      "Activate"
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditPromotion(promotion)}
                  >
                    <Edit className="h-4 w-4 mr-2" /> Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete the promotion and remove it from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeletePromotion(promotion.id)}
                          disabled={isDeleting === promotion.id}
                        >
                          {isDeleting === promotion.id ? (
                            <>
                              <Spinner size="sm" className="mr-2" />
                              Deleting...
                            </>
                          ) : (
                            "Delete"
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredPromotions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No promotions found. Create a new promotion to get started.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Promotion Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingPromotion ? "Edit Promotion" : "Add New Promotion"}
            </DialogTitle>
            <DialogDescription>
              {editingPromotion
                ? "Update the details of this promotion."
                : "Create a new special offer or promotion for your customers."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Promo Code</Label>
                <Input
                  id="code"
                  placeholder="e.g., WELCOME20"
                  value={formData.code}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., 20% Off First Order"
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the promotion"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Discount Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => handleSelectChange("type", value)}
                  >
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discount">
                    {formData.type === "percentage"
                      ? "Discount (%)"
                      : "Discount ($)"}
                  </Label>
                  <Input
                    id="discount"
                    type="number"
                    placeholder={
                      formData.type === "percentage" ? "e.g., 20" : "e.g., 5"
                    }
                    value={formData.discount}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minOrder">Min. Order ($)</Label>
                  <Input
                    id="minOrder"
                    type="number"
                    placeholder="e.g., 30"
                    value={formData.minOrder}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxDiscount">Max. Discount ($)</Label>
                  <Input
                    id="maxDiscount"
                    type="number"
                    placeholder="e.g., 15"
                    value={formData.maxDiscount}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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

              <div className="space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  placeholder="https://example.com/image.jpg"
                  value={formData.image}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="backgroundColor">Background Color</Label>
                <Select
                  value={formData.backgroundColor}
                  onValueChange={(value) =>
                    handleSelectChange("backgroundColor", value)
                  }
                >
                  <SelectTrigger id="backgroundColor">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {backgroundColors.map((color) => (
                      <SelectItem key={color.value} value={color.value}>
                        <div className="flex items-center">
                          <div
                            className={`w-4 h-4 rounded-full ${color.value} mr-2`}
                          ></div>
                          {color.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={formData.active}
                    onCheckedChange={handleSwitchChange}
                  />
                  <Label htmlFor="active">Active</Label>
                </div>
              </div>

              <div className="mt-4">
                <Label>Preview</Label>
                <div className="mt-2 border rounded-lg overflow-hidden">
                  <div className={`${formData.backgroundColor} h-32 relative`}>
                    <div className="absolute inset-0 bg-black/20"></div>
                    {formData.image && (
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-full object-cover mix-blend-overlay"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://via.placeholder.com/400x200?text=Invalid+Image+URL";
                        }}
                      />
                    )}
                    <div className="absolute inset-0 p-4 flex flex-col justify-between text-white">
                      <div>
                        <h3 className="text-lg font-bold">
                          {formData.title || "Promotion Title"}
                        </h3>
                        <p className="text-white/90 text-sm">
                          {formData.description || "Promotion description"}
                        </p>
                      </div>
                      <Badge className="self-start bg-white/20 hover:bg-white/30 text-white border-0">
                        Code: {formData.code || "CODE"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddDialog(false)}
              disabled={isSubmitting}
            >
              <X className="h-4 w-4 mr-2" /> Cancel
            </Button>
            <Button onClick={handleSavePromotion} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  {editingPromotion ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {editingPromotion ? "Update Promotion" : "Create Promotion"}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
