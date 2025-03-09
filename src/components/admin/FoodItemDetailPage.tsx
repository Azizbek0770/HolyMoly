import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
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
  ChevronLeft,
  Save,
  Plus,
  Minus,
  Trash2,
  Edit,
  Star,
  Clock,
  Utensils,
  AlertCircle,
  Leaf,
  Info,
  Image as ImageIcon,
} from "lucide-react";

interface Ingredient {
  id: string;
  name: string;
}

interface Allergen {
  id: string;
  name: string;
}

interface NutritionalInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface Review {
  id: string;
  userId: string;
  userName: string;
  userImage?: string;
  rating: number;
  comment: string;
  date: string;
  status: "approved" | "pending" | "rejected";
}

interface RelatedItem {
  id: string;
  name: string;
}

interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
  rating: number;
  preparationTime: number;
  ingredients: Ingredient[];
  allergens: Allergen[];
  nutritionalInfo: NutritionalInfo;
  reviews: Review[];
  relatedItems: RelatedItem[];
}

// Mock data for a food item
const mockFoodItem: FoodItem = {
  id: "1",
  name: "Margherita Pizza",
  description:
    "Classic pizza with tomato sauce, fresh mozzarella, basil, and extra virgin olive oil.",
  price: 12.99,
  category: "Pizza",
  image:
    "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&q=80",
  available: true,
  rating: 4.7,
  preparationTime: 20,
  ingredients: [
    { id: "i1", name: "Homemade Pizza Dough" },
    { id: "i2", name: "San Marzano Tomato Sauce" },
    { id: "i3", name: "Fresh Mozzarella" },
    { id: "i4", name: "Fresh Basil" },
    { id: "i5", name: "Extra Virgin Olive Oil" },
    { id: "i6", name: "Sea Salt" },
  ],
  allergens: [
    { id: "a1", name: "Wheat" },
    { id: "a2", name: "Milk" },
  ],
  nutritionalInfo: {
    calories: 285,
    protein: 12,
    carbs: 36,
    fat: 10,
  },
  reviews: [
    {
      id: "r1",
      userId: "u1",
      userName: "John Doe",
      userImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
      rating: 5,
      comment:
        "Absolutely delicious! The crust was perfect and the ingredients were fresh. Will order again!",
      date: "2023-06-15",
      status: "approved",
    },
    {
      id: "r2",
      userId: "u2",
      userName: "Jane Smith",
      userImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
      rating: 4,
      comment:
        "Very good pizza, but took a bit longer than expected to arrive. Still hot and tasty though!",
      date: "2023-06-10",
      status: "approved",
    },
    {
      id: "r3",
      userId: "u3",
      userName: "Mike Johnson",
      userImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
      rating: 5,
      comment: "Best Margherita in town! Simple but so flavorful.",
      date: "2023-06-05",
      status: "pending",
    },
  ],
  relatedItems: [
    { id: "2", name: "Pepperoni Pizza" },
    { id: "3", name: "Vegetarian Pizza" },
    { id: "4", name: "Garlic Bread" },
  ],
};

// Mock categories for dropdown
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

// Mock all food items for related items selection
const allFoodItems = [
  { id: "1", name: "Margherita Pizza" },
  { id: "2", name: "Pepperoni Pizza" },
  { id: "3", name: "Vegetarian Pizza" },
  { id: "4", name: "Garlic Bread" },
  { id: "5", name: "Caesar Salad" },
  { id: "6", name: "Cheeseburger" },
  { id: "7", name: "California Roll" },
  { id: "8", name: "Chocolate Cake" },
];

// Mock all allergens for selection
const allAllergens = [
  { id: "a1", name: "Wheat" },
  { id: "a2", name: "Milk" },
  { id: "a3", name: "Eggs" },
  { id: "a4", name: "Fish" },
  { id: "a5", name: "Shellfish" },
  { id: "a6", name: "Tree Nuts" },
  { id: "a7", name: "Peanuts" },
  { id: "a8", name: "Soy" },
];

export default function FoodItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [foodItem, setFoodItem] = useState<FoodItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    available: true,
    preparationTime: "",
  });

  // Nutritional info state
  const [nutritionalInfo, setNutritionalInfo] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });

  // Ingredients state
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [newIngredient, setNewIngredient] = useState("");

  // Allergens state
  const [allergens, setAllergens] = useState<Allergen[]>([]);
  const [selectedAllergen, setSelectedAllergen] = useState("");

  // Related items state
  const [relatedItems, setRelatedItems] = useState<RelatedItem[]>([]);
  const [selectedRelatedItem, setSelectedRelatedItem] = useState("");

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    // In a real app, you would fetch the food item data from an API
    // For now, we'll use the mock data
    const fetchFoodItem = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        // In a real app, you would fetch the food item by ID
        // For now, we'll just use the mock data
        setFoodItem(mockFoodItem);

        // Initialize form data
        setFormData({
          name: mockFoodItem.name,
          description: mockFoodItem.description,
          price: mockFoodItem.price.toString(),
          category: mockFoodItem.category,
          image: mockFoodItem.image,
          available: mockFoodItem.available,
          preparationTime: mockFoodItem.preparationTime.toString(),
        });

        // Initialize nutritional info
        setNutritionalInfo(mockFoodItem.nutritionalInfo);

        // Initialize ingredients
        setIngredients(mockFoodItem.ingredients);

        // Initialize allergens
        setAllergens(mockFoodItem.allergens);

        // Initialize related items
        setRelatedItems(mockFoodItem.relatedItems);

        // Initialize reviews
        setReviews(mockFoodItem.reviews);
      } catch (error) {
        console.error("Error fetching food item:", error);
        toast({
          title: "Error",
          description: "Failed to load food item details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchFoodItem();
  }, [id, toast]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      available: checked,
    }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category: value,
    }));
  };

  const handleNutritionalInfoChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { id, value } = e.target;
    setNutritionalInfo((prev) => ({
      ...prev,
      [id]: parseInt(value) || 0,
    }));
  };

  const handleAddIngredient = () => {
    if (newIngredient.trim()) {
      const newId = `i${Date.now()}`;
      setIngredients((prev) => [
        ...prev,
        { id: newId, name: newIngredient.trim() },
      ]);
      setNewIngredient("");
    }
  };

  const handleRemoveIngredient = (id: string) => {
    setIngredients((prev) => prev.filter((ingredient) => ingredient.id !== id));
  };

  const handleAddAllergen = () => {
    if (selectedAllergen) {
      const allergen = allAllergens.find((a) => a.id === selectedAllergen);
      if (allergen && !allergens.some((a) => a.id === allergen.id)) {
        setAllergens((prev) => [...prev, allergen]);
        setSelectedAllergen("");
      }
    }
  };

  const handleRemoveAllergen = (id: string) => {
    setAllergens((prev) => prev.filter((allergen) => allergen.id !== id));
  };

  const handleAddRelatedItem = () => {
    if (selectedRelatedItem) {
      const item = allFoodItems.find((i) => i.id === selectedRelatedItem);
      if (
        item &&
        !relatedItems.some((i) => i.id === item.id) &&
        item.id !== id
      ) {
        setRelatedItems((prev) => [...prev, item]);
        setSelectedRelatedItem("");
      }
    }
  };

  const handleRemoveRelatedItem = (id: string) => {
    setRelatedItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdateReviewStatus = (
    reviewId: string,
    status: "approved" | "pending" | "rejected",
  ) => {
    setReviews((prev) =>
      prev.map((review) =>
        review.id === reviewId ? { ...review, status } : review,
      ),
    );

    toast({
      title: "Review updated",
      description: `Review status changed to ${status}`,
    });
  };

  const handleDeleteReview = (reviewId: string) => {
    setReviews((prev) => prev.filter((review) => review.id !== reviewId));

    toast({
      title: "Review deleted",
      description: "Review has been deleted successfully",
    });
  };

  const handleSave = async () => {
    try {
      // Validate form data
      if (!formData.name.trim()) {
        toast({
          title: "Validation Error",
          description: "Name is required",
          variant: "destructive",
        });
        return;
      }

      if (!formData.description.trim()) {
        toast({
          title: "Validation Error",
          description: "Description is required",
          variant: "destructive",
        });
        return;
      }

      if (
        !formData.price ||
        isNaN(parseFloat(formData.price)) ||
        parseFloat(formData.price) <= 0
      ) {
        toast({
          title: "Validation Error",
          description: "Price must be a positive number",
          variant: "destructive",
        });
        return;
      }

      if (
        !formData.preparationTime ||
        isNaN(parseInt(formData.preparationTime)) ||
        parseInt(formData.preparationTime) <= 0
      ) {
        toast({
          title: "Validation Error",
          description: "Preparation time must be a positive number",
          variant: "destructive",
        });
        return;
      }

      // In a real app, you would send the updated food item to the API
      // For now, we'll just simulate a successful update
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update the food item state
      const updatedFoodItem: FoodItem = {
        id: foodItem?.id || "",
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        image: formData.image,
        available: formData.available,
        rating: foodItem?.rating || 0,
        preparationTime: parseInt(formData.preparationTime),
        ingredients,
        allergens,
        nutritionalInfo,
        reviews,
        relatedItems,
      };

      setFoodItem(updatedFoodItem);
      setIsEditing(false);

      toast({
        title: "Food item updated",
        description: "Food item has been updated successfully",
      });
    } catch (error) {
      console.error("Error updating food item:", error);
      toast({
        title: "Error",
        description: "Failed to update food item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    if (foodItem) {
      setFormData({
        name: foodItem.name,
        description: foodItem.description,
        price: foodItem.price.toString(),
        category: foodItem.category,
        image: foodItem.image,
        available: foodItem.available,
        preparationTime: foodItem.preparationTime.toString(),
      });

      setNutritionalInfo(foodItem.nutritionalInfo);
      setIngredients(foodItem.ingredients);
      setAllergens(foodItem.allergens);
      setRelatedItems(foodItem.relatedItems);
    }

    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!foodItem) {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[60vh]">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">Food item not found</h2>
        <p className="text-muted-foreground mb-4">
          The food item you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => navigate("/admin/food-items")}>
          Back to Food Items
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pb-20">
      {/* Header with back button and actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            className="mr-2"
            onClick={() => navigate("/admin/food-items")}
          >
            <ChevronLeft className="h-5 w-5 mr-1" /> Back
          </Button>
          <h1 className="text-2xl font-bold">
            {isEditing ? "Edit Food Item" : foodItem.name}
          </h1>
        </div>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" /> Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" /> Edit Food Item
            </Button>
          )}
        </div>
      </div>

      {/* Food Item Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Image and Basic Info */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="mb-4">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="relative rounded-lg overflow-hidden border border-input">
                      <img
                        src={
                          formData.image ||
                          "https://via.placeholder.com/400x300?text=No+Image"
                        }
                        alt="Food item preview"
                        className="w-full h-48 object-cover"
                      />
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
                  </div>
                ) : (
                  <div className="rounded-lg overflow-hidden">
                    <img
                      src={
                        foodItem.image ||
                        "https://via.placeholder.com/400x300?text=No+Image"
                      }
                      alt={foodItem.name}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {isEditing ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        placeholder="Food item name"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={formData.category}
                        onValueChange={handleCategoryChange}
                      >
                        <SelectTrigger>
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

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">Price ($)</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={formData.price}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="preparationTime">Prep Time (min)</Label>
                        <Input
                          id="preparationTime"
                          type="number"
                          placeholder="15"
                          value={formData.preparationTime}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="available"
                        checked={formData.available}
                        onCheckedChange={handleSwitchChange}
                      />
                      <Label htmlFor="available">Available for ordering</Label>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-center">
                      <Badge variant="outline" className="text-sm">
                        {foodItem.category}
                      </Badge>
                      <Badge
                        variant={foodItem.available ? "default" : "secondary"}
                        className="text-sm"
                      >
                        {foodItem.available ? "Available" : "Unavailable"}
                      </Badge>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Star className="h-5 w-5 text-yellow-400 fill-yellow-400 mr-1" />
                        <span className="font-medium">{foodItem.rating}</span>
                        <span className="text-muted-foreground ml-1">
                          ({foodItem.reviews.length} reviews)
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-muted-foreground mr-1" />
                        <span className="text-muted-foreground">
                          {foodItem.preparationTime} min
                        </span>
                      </div>
                    </div>

                    <div className="text-2xl font-bold">
                      ${foodItem.price.toFixed(2)}
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Tabs with Details */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
                  <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>

                {/* Details Tab */}
                <TabsContent value="details" className="pt-4 space-y-4">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Food item description"
                          value={formData.description}
                          onChange={handleInputChange}
                          rows={4}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Related Items</Label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {relatedItems.map((item) => (
                            <Badge
                              key={item.id}
                              variant="secondary"
                              className="flex items-center gap-1"
                            >
                              {item.name}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 p-0 ml-1"
                                onClick={() => handleRemoveRelatedItem(item.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Select
                            value={selectedRelatedItem}
                            onValueChange={setSelectedRelatedItem}
                          >
                            <SelectTrigger className="flex-1">
                              <SelectValue placeholder="Select related item" />
                            </SelectTrigger>
                            <SelectContent>
                              {allFoodItems
                                .filter(
                                  (item) =>
                                    item.id !== id &&
                                    !relatedItems.some(
                                      (ri) => ri.id === item.id,
                                    ),
                                )
                                .map((item) => (
                                  <SelectItem key={item.id} value={item.id}>
                                    {item.name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                          <Button
                            type="button"
                            onClick={handleAddRelatedItem}
                            disabled={!selectedRelatedItem}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold mb-2">Description</h3>
                        <p className="text-muted-foreground">
                          {foodItem.description}
                        </p>
                      </div>

                      {foodItem.relatedItems.length > 0 && (
                        <div>
                          <h3 className="font-semibold mb-2">Related Items</h3>
                          <div className="flex flex-wrap gap-2">
                            {foodItem.relatedItems.map((item) => (
                              <Badge key={item.id} variant="outline">
                                {item.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </TabsContent>

                {/* Ingredients Tab */}
                <TabsContent value="ingredients" className="pt-4 space-y-4">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Ingredients</Label>
                        <div className="space-y-2">
                          {ingredients.map((ingredient) => (
                            <div
                              key={ingredient.id}
                              className="flex items-center justify-between"
                            >
                              <span>{ingredient.name}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() =>
                                  handleRemoveIngredient(ingredient.id)
                                }
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2 mt-2">
                          <Input
                            placeholder="Add new ingredient"
                            value={newIngredient}
                            onChange={(e) => setNewIngredient(e.target.value)}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            onClick={handleAddIngredient}
                            disabled={!newIngredient.trim()}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Allergens</Label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {allergens.map((allergen) => (
                            <Badge
                              key={allergen.id}
                              variant="secondary"
                              className="flex items-center gap-1"
                            >
                              {allergen.name}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 p-0 ml-1"
                                onClick={() =>
                                  handleRemoveAllergen(allergen.id)
                                }
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Select
                            value={selectedAllergen}
                            onValueChange={setSelectedAllergen}
                          >
                            <SelectTrigger className="flex-1">
                              <SelectValue placeholder="Select allergen" />
                            </SelectTrigger>
                            <SelectContent>
                              {allAllergens
                                .filter(
                                  (allergen) =>
                                    !allergens.some(
                                      (a) => a.id === allergen.id,
                                    ),
                                )
                                .map((allergen) => (
                                  <SelectItem
                                    key={allergen.id}
                                    value={allergen.id}
                                  >
                                    {allergen.name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                          <Button
                            type="button"
                            onClick={handleAddAllergen}
                            disabled={!selectedAllergen}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold flex items-center mb-2">
                          <Utensils className="h-5 w-5 mr-2" /> Ingredients
                        </h3>
                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                          {foodItem.ingredients.map((ingredient) => (
                            <li key={ingredient.id}>{ingredient.name}</li>
                          ))}
                        </ul>
                      </div>

                      {foodItem.allergens.length > 0 && (
                        <div>
                          <h3 className="font-semibold flex items-center mb-2">
                            <AlertCircle className="h-5 w-5 mr-2" /> Allergens
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {foodItem.allergens.map((allergen) => (
                              <Badge
                                key={allergen.id}
                                variant="outline"
                                className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-600"
                              >
                                {allergen.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </TabsContent>

                {/* Nutrition Tab */}
                <TabsContent value="nutrition" className="pt-4 space-y-4">
                  {isEditing ? (
                    <div className="space-y-4">
                      <Label>Nutritional Information</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="calories">Calories</Label>
                          <Input
                            id="calories"
                            type="number"
                            value={nutritionalInfo.calories}
                            onChange={handleNutritionalInfoChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="protein">Protein (g)</Label>
                          <Input
                            id="protein"
                            type="number"
                            value={nutritionalInfo.protein}
                            onChange={handleNutritionalInfoChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="carbs">Carbs (g)</Label>
                          <Input
                            id="carbs"
                            type="number"
                            value={nutritionalInfo.carbs}
                            onChange={handleNutritionalInfoChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="fat">Fat (g)</Label>
                          <Input
                            id="fat"
                            type="number"
                            value={nutritionalInfo.fat}
                            onChange={handleNutritionalInfoChange}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <h3 className="font-semibold flex items-center mb-2">
                        <Leaf className="h-5 w-5 mr-2" /> Nutritional
                        Information
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="bg-muted/50 p-4 rounded-lg text-center">
                          <p className="text-2xl font-bold">
                            {foodItem.nutritionalInfo.calories}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Calories
                          </p>
                        </div>
                        <div className="bg-muted/50 p-4 rounded-lg text-center">
                          <p className="text-2xl font-bold">
                            {foodItem.nutritionalInfo.protein}g
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Protein
                          </p>
                        </div>
                        <div className="bg-muted/50 p-4 rounded-lg text-center">
                          <p className="text-2xl font-bold">
                            {foodItem.nutritionalInfo.carbs}g
                          </p>
                          <p className="text-sm text-muted-foreground">Carbs</p>
                        </div>
                        <div className="bg-muted/50 p-4 rounded-lg text-center">
                          <p className="text-2xl font-bold">
                            {foodItem.nutritionalInfo.fat}g
                          </p>
                          <p className="text-sm text-muted-foreground">Fat</p>
                        </div>
                      </div>
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <div className="flex items-start">
                          <Info className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            Nutritional information is approximate and may vary
                            based on preparation method and serving size.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>

                {/* Reviews Tab */}
                <TabsContent value="reviews" className="pt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">
                      Customer Reviews ({reviews.length})
                    </h3>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Comment</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reviews.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="text-center py-4 text-muted-foreground"
                          >
                            No reviews yet
                          </TableCell>
                        </TableRow>
                      ) : (
                        reviews.map((review) => (
                          <TableRow key={review.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full overflow-hidden">
                                  <img
                                    src={
                                      review.userImage ||
                                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.userName}`
                                    }
                                    alt={review.userName}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <span>{review.userName}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                                  />
                                ))}
                              </div>
                            </TableCell>
                            <TableCell className="max-w-xs truncate">
                              {review.comment}
                            </TableCell>
                            <TableCell>
                              {new Date(review.date).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  review.status === "approved"
                                    ? "success"
                                    : review.status === "rejected"
                                      ? "destructive"
                                      : "outline"
                                }
                              >
                                {review.status.charAt(0).toUpperCase() +
                                  review.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Manage Review</DialogTitle>
                                    </DialogHeader>
                                    <div className="py-4">
                                      <div className="flex items-center gap-2 mb-4">
                                        <div className="h-10 w-10 rounded-full overflow-hidden">
                                          <img
                                            src={
                                              review.userImage ||
                                              `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.userName}`
                                            }
                                            alt={review.userName}
                                            className="h-full w-full object-cover"
                                          />
                                        </div>
                                        <div>
                                          <p className="font-medium">
                                            {review.userName}
                                          </p>
                                          <p className="text-sm text-muted-foreground">
                                            {new Date(
                                              review.date,
                                            ).toLocaleDateString()}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="flex items-center mb-2">
                                        {[...Array(5)].map((_, i) => (
                                          <Star
                                            key={i}
                                            className={`h-5 w-5 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                                          />
                                        ))}
                                      </div>
                                      <p className="mb-4">{review.comment}</p>
                                      <div className="space-y-2">
                                        <Label>Review Status</Label>
                                        <Select
                                          value={review.status}
                                          onValueChange={(value) =>
                                            handleUpdateReviewStatus(
                                              review.id,
                                              value as
                                                | "approved"
                                                | "pending"
                                                | "rejected",
                                            )
                                          }
                                        >
                                          <SelectTrigger>
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="approved">
                                              Approved
                                            </SelectItem>
                                            <SelectItem value="pending">
                                              Pending
                                            </SelectItem>
                                            <SelectItem value="rejected">
                                              Rejected
                                            </SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>
                                    <DialogFooter>
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <Button variant="destructive">
                                            <Trash2 className="h-4 w-4 mr-2" />{" "}
                                            Delete Review
                                          </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>
                                              Are you sure?
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                              This action cannot be undone. This
                                              will permanently delete the
                                              review.
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>
                                              Cancel
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                              onClick={() =>
                                                handleDeleteReview(review.id)
                                              }
                                            >
                                              Delete
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
