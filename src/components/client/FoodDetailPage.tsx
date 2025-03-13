import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Spinner } from "@/components/ui/spinner";
import { useCart } from "@/contexts/CartContext";
import ReviewForm from "@/components/forms/ReviewForm";
import {
  Star,
  Clock,
  Heart,
  Plus,
  Minus,
  Share2,
  ChevronLeft,
  AlertCircle,
  Utensils,
  Leaf,
  Info,
} from "lucide-react";

interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  preparationTime: number;
  restaurant: {
    id: string;
    name: string;
    deliveryTime: string;
    rating: number;
  };
  ingredients: string[];
  nutritionalInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  allergens: string[];
  reviews: {
    id: string;
    user: {
      id: string;
      name: string;
      image?: string;
    };
    rating: number;
    comment: string;
    date: string;
  }[];
  relatedItems: {
    id: string;
    name: string;
    image: string;
    price: number;
    rating: number;
  }[];
}

// Mock data for a food item
const mockFoodItem: FoodItem = {
  id: "1",
  name: "Margherita Pizza",
  description:
    "Classic pizza with tomato sauce, fresh mozzarella, basil, and extra virgin olive oil. Made with our signature hand-tossed dough that's crispy on the outside and soft on the inside.",
  price: 12.99,
  image:
    "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&q=80",
  category: "Pizza",
  rating: 4.7,
  preparationTime: 20,
  restaurant: {
    id: "1",
    name: "Pizza Palace",
    deliveryTime: "20-30 min",
    rating: 4.8,
  },
  ingredients: [
    "Homemade Pizza Dough",
    "San Marzano Tomato Sauce",
    "Fresh Mozzarella",
    "Fresh Basil",
    "Extra Virgin Olive Oil",
    "Sea Salt",
  ],
  nutritionalInfo: {
    calories: 285,
    protein: 12,
    carbs: 36,
    fat: 10,
  },
  allergens: ["Wheat", "Milk"],
  reviews: [
    {
      id: "r1",
      user: {
        id: "u1",
        name: "John Doe",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
      },
      rating: 5,
      comment:
        "Absolutely delicious! The crust was perfect and the ingredients were fresh. Will order again!",
      date: "2023-06-15",
    },
    {
      id: "r2",
      user: {
        id: "u2",
        name: "Jane Smith",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
      },
      rating: 4,
      comment:
        "Very good pizza, but took a bit longer than expected to arrive. Still hot and tasty though!",
      date: "2023-06-10",
    },
    {
      id: "r3",
      user: {
        id: "u3",
        name: "Mike Johnson",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
      },
      rating: 5,
      comment: "Best Margherita in town! Simple but so flavorful.",
      date: "2023-06-05",
    },
  ],
  relatedItems: [
    {
      id: "2",
      name: "Pepperoni Pizza",
      image:
        "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300&q=80",
      price: 14.99,
      rating: 4.6,
    },
    {
      id: "3",
      name: "Vegetarian Pizza",
      image:
        "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=300&q=80",
      price: 13.99,
      rating: 4.5,
    },
    {
      id: "4",
      name: "Garlic Bread",
      image:
        "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=300&q=80",
      price: 5.99,
      rating: 4.8,
    },
  ],
};

export default function FoodDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addToCart } = useCart();
  const [foodItem, setFoodItem] = useState<FoodItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Mock data for multiple food items
  const mockFoodItems = {
    "1": mockFoodItem,
    "2": {
      id: "2",
      name: "Pepperoni Pizza",
      description:
        "Classic pizza with tomato sauce, mozzarella, and pepperoni. Our pepperoni is made from high-quality pork and beef, seasoned with paprika and other spices.",
      price: 14.99,
      image:
        "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&q=80",
      category: "Pizza",
      rating: 4.6,
      preparationTime: 20,
      restaurant: {
        id: "1",
        name: "Pizza Palace",
        deliveryTime: "20-30 min",
        rating: 4.8,
      },
      ingredients: [
        "Homemade Pizza Dough",
        "San Marzano Tomato Sauce",
        "Mozzarella Cheese",
        "Pepperoni Slices",
        "Oregano",
        "Olive Oil",
      ],
      nutritionalInfo: {
        calories: 320,
        protein: 15,
        carbs: 38,
        fat: 14,
      },
      allergens: ["Wheat", "Milk"],
      reviews: [
        {
          id: "r1",
          user: {
            id: "u1",
            name: "Alex Johnson",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
          },
          rating: 5,
          comment:
            "Best pepperoni pizza I've ever had! The pepperoni was perfectly crispy.",
          date: "2023-06-12",
        },
        {
          id: "r2",
          user: {
            id: "u2",
            name: "Sarah Miller",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
          },
          rating: 4,
          comment:
            "Really good pizza, generous amount of pepperoni. Would order again!",
          date: "2023-06-08",
        },
      ],
      relatedItems: [
        {
          id: "1",
          name: "Margherita Pizza",
          image:
            "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=300&q=80",
          price: 12.99,
          rating: 4.7,
        },
        {
          id: "3",
          name: "Vegetarian Pizza",
          image:
            "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=300&q=80",
          price: 13.99,
          rating: 4.5,
        },
        {
          id: "4",
          name: "Garlic Bread",
          image:
            "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=300&q=80",
          price: 5.99,
          rating: 4.8,
        },
      ],
    },
    "3": {
      id: "3",
      name: "Cheeseburger",
      description:
        "Juicy beef patty with cheese, lettuce, tomato, and special sauce. Made with 100% Angus beef and served on a toasted brioche bun.",
      price: 9.99,
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
      category: "Burgers",
      rating: 4.3,
      preparationTime: 15,
      restaurant: {
        id: "2",
        name: "Burger Joint",
        deliveryTime: "15-25 min",
        rating: 4.6,
      },
      ingredients: [
        "Angus Beef Patty",
        "Cheddar Cheese",
        "Lettuce",
        "Tomato",
        "Red Onion",
        "Special Sauce",
        "Brioche Bun",
      ],
      nutritionalInfo: {
        calories: 650,
        protein: 28,
        carbs: 45,
        fat: 38,
      },
      allergens: ["Wheat", "Milk", "Eggs", "Soy"],
      reviews: [
        {
          id: "r1",
          user: {
            id: "u1",
            name: "Chris Wilson",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chris",
          },
          rating: 4,
          comment:
            "Great burger! The meat was juicy and the special sauce was delicious.",
          date: "2023-06-14",
        },
      ],
      relatedItems: [
        {
          id: "4",
          name: "Bacon Burger",
          image:
            "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=300&q=80",
          price: 11.99,
          rating: 4.6,
        },
        {
          id: "7",
          name: "French Fries",
          image:
            "https://images.unsplash.com/photo-1576107232684-1279f390859f?w=300&q=80",
          price: 3.99,
          rating: 4.4,
        },
      ],
    },
    "4": {
      id: "4",
      name: "California Roll",
      description:
        "Crab, avocado, and cucumber wrapped in seaweed and rice. Served with soy sauce, wasabi, and pickled ginger.",
      price: 14.99,
      image:
        "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80",
      category: "Sushi",
      rating: 4.7,
      preparationTime: 25,
      restaurant: {
        id: "3",
        name: "Sushi Express",
        deliveryTime: "25-35 min",
        rating: 4.9,
      },
      ingredients: [
        "Crab Meat",
        "Avocado",
        "Cucumber",
        "Nori Seaweed",
        "Sushi Rice",
        "Sesame Seeds",
      ],
      nutritionalInfo: {
        calories: 255,
        protein: 9,
        carbs: 38,
        fat: 7,
      },
      allergens: ["Shellfish", "Soy"],
      reviews: [
        {
          id: "r1",
          user: {
            id: "u1",
            name: "Emily Chen",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
          },
          rating: 5,
          comment:
            "Fresh ingredients and perfectly prepared rice. One of the best California rolls I've had!",
          date: "2023-06-10",
        },
      ],
      relatedItems: [
        {
          id: "6",
          name: "Dragon Roll",
          image:
            "https://images.unsplash.com/photo-1617196034183-421b4917c92d?w=300&q=80",
          price: 16.99,
          rating: 4.8,
        },
      ],
    },
  };

  useEffect(() => {
    // In a real app, you would fetch the food item data from an API
    // For now, we'll use the mock data
    const fetchFoodItem = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Get the food item based on the ID from the URL
        const selectedItem = mockFoodItems[id] || mockFoodItem;
        setFoodItem(selectedItem);
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

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!foodItem) return;

    setIsAddingToCart(true);

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      addToCart({
        id: foodItem.id,
        name: foodItem.name,
        price: foodItem.price,
        image: foodItem.image,
        quantity,
      });

      toast({
        title: "Added to cart",
        description: `${quantity} x ${foodItem.name} added to your cart`,
        duration: 3000,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: isFavorite
        ? `${foodItem?.name} removed from your favorites`
        : `${foodItem?.name} added to your favorites`,
      duration: 2000,
    });
  };

  const handleShare = () => {
    // In a real app, you would implement sharing functionality
    // For now, we'll just show a toast
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied",
      description: "Share link copied to clipboard",
      duration: 2000,
    });
  };

  const handleReviewSubmit = () => {
    setShowReviewForm(false);
    toast({
      title: "Review submitted",
      description: "Thank you for your feedback!",
      duration: 3000,
    });
  };

  const handleRelatedItemClick = (itemId: string) => {
    navigate(`/client/food/${itemId}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <Spinner size="xl" />
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
        <Button onClick={() => navigate("/client")}>Back to Menu</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pb-20">
      {/* Back button */}
      <Button
        variant="ghost"
        className="mb-4 pl-0"
        onClick={() => navigate(-1)}
      >
        <ChevronLeft className="h-5 w-5 mr-1" /> Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Food Image */}
        <div className="relative rounded-lg overflow-hidden">
          <img
            src={foodItem.image}
            alt={foodItem.name}
            className="w-full h-auto object-cover rounded-lg"
          />
          <div className="absolute top-4 right-4 flex space-x-2">
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
              onClick={handleToggleFavorite}
            >
              <Heart
                className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`}
              />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
              onClick={handleShare}
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Food Details */}
        <div>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{foodItem.name}</h1>
              <div className="flex items-center mb-4">
                <div className="flex items-center mr-4">
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
            </div>
            <div className="text-2xl font-bold">
              ${foodItem.price.toFixed(2)}
            </div>
          </div>

          <div className="mb-6">
            <Badge variant="outline" className="mb-2">
              {foodItem.category}
            </Badge>
            <p className="text-muted-foreground">{foodItem.description}</p>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">
              From {foodItem.restaurant.name}
            </h3>
            <div className="flex items-center text-sm text-muted-foreground">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
              <span>{foodItem.restaurant.rating}</span>
              <span className="mx-2">•</span>
              <Clock className="h-4 w-4 mr-1" />
              <span>{foodItem.restaurant.deliveryTime} delivery</span>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Quantity and Add to Cart */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </motion.div>
              <motion.span
                className="w-12 text-center font-medium"
                key={quantity}
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {quantity}
              </motion.span>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </motion.div>
            </div>
            <motion.div
              className="flex-1 ml-4"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button className="w-full" size="lg" onClick={handleAddToCart}>
                {isAddingToCart ? (
                  <span className="flex items-center">
                    <Spinner size="sm" className="mr-2" />
                    Adding...
                  </span>
                ) : (
                  <>Add to Cart - ${(foodItem.price * quantity).toFixed(2)}</>
                )}
              </Button>
            </motion.div>
          </div>

          {/* Tabs for additional information */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Details</TabsTrigger>
              <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="pt-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold flex items-center mb-2">
                    <Utensils className="h-5 w-5 mr-2" /> Ingredients
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    {foodItem.ingredients.map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                  </ul>
                </div>

                {foodItem.allergens.length > 0 && (
                  <div>
                    <h3 className="font-semibold flex items-center mb-2">
                      <AlertCircle className="h-5 w-5 mr-2" /> Allergens
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {foodItem.allergens.map((allergen, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-600"
                        >
                          {allergen}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="nutrition" className="pt-4">
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center mb-2">
                  <Leaf className="h-5 w-5 mr-2" /> Nutritional Information
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-muted/50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold">
                      {foodItem.nutritionalInfo.calories}
                    </p>
                    <p className="text-sm text-muted-foreground">Calories</p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold">
                      {foodItem.nutritionalInfo.protein}g
                    </p>
                    <p className="text-sm text-muted-foreground">Protein</p>
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
                      Nutritional information is approximate and may vary based
                      on preparation method and serving size.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="pt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">
                    Customer Reviews ({foodItem.reviews.length})
                  </h3>
                  <Button
                    variant="outline"
                    onClick={() => setShowReviewForm(!showReviewForm)}
                  >
                    {showReviewForm ? "Cancel" : "Write a Review"}
                  </Button>
                </div>

                {showReviewForm && (
                  <Card className="mb-6">
                    <CardContent className="pt-6">
                      <ReviewForm
                        foodItemId={foodItem.id}
                        onSuccess={handleReviewSubmit}
                        onCancel={() => setShowReviewForm(false)}
                      />
                    </CardContent>
                  </Card>
                )}

                <div className="space-y-4">
                  {foodItem.reviews.map((review) => (
                    <div
                      key={review.id}
                      className="border-b pb-4 last:border-0"
                    >
                      <div className="flex items-start">
                        <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                          <img
                            src={
                              review.user.image ||
                              `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.user.name}`
                            }
                            alt={review.user.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{review.user.name}</h4>
                            <span className="text-sm text-muted-foreground">
                              {new Date(review.date).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center my-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                          <p className="text-muted-foreground">
                            {review.comment}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Related Items */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {foodItem.relatedItems.map((item) => (
            <Card
              key={item.id}
              className="overflow-hidden cursor-pointer hover:shadow-md transition-all"
              onClick={() => handleRelatedItemClick(item.id)}
            >
              <div className="h-40 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium">{item.name}</h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-bold">${item.price.toFixed(2)}</span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                    <span>{item.rating}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
