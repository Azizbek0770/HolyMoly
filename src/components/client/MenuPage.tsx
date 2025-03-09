import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Star,
  Clock,
  DollarSign,
  Plus,
  Heart,
  Eye,
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
}

interface Category {
  name: string;
  count: number;
}

export default function MenuPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { addToCart } = useCart();

  // State for food items and loading
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(false);

  // State for filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50]);
  const [sortBy, setSortBy] = useState("rating");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  // Mock data for food items
  const mockFoodItems: FoodItem[] = [
    {
      id: "1",
      name: "Margherita Pizza",
      description:
        "Classic pizza with tomato sauce, fresh mozzarella, basil, and extra virgin olive oil.",
      price: 12.99,
      image:
        "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&q=75",
      category: "Pizza",
      rating: 4.7,
      preparationTime: 20,
    },
    {
      id: "2",
      name: "Pepperoni Pizza",
      description:
        "Classic pizza with tomato sauce, mozzarella, and pepperoni.",
      price: 14.99,
      image:
        "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&q=75",
      category: "Pizza",
      rating: 4.6,
      preparationTime: 20,
    },
    {
      id: "3",
      name: "Cheeseburger",
      description:
        "Juicy beef patty with cheese, lettuce, tomato, and special sauce.",
      price: 9.99,
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=75",
      category: "Burgers",
      rating: 4.3,
      preparationTime: 15,
    },
    {
      id: "4",
      name: "Bacon Burger",
      description:
        "Juicy beef patty with bacon, cheese, lettuce, and special sauce.",
      price: 11.99,
      image:
        "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=600&q=75",
      category: "Burgers",
      rating: 4.6,
      preparationTime: 15,
    },
    {
      id: "5",
      name: "California Roll",
      description: "Crab, avocado, and cucumber wrapped in seaweed and rice.",
      price: 14.99,
      image:
        "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&q=75",
      category: "Sushi",
      rating: 4.7,
      preparationTime: 25,
    },
    {
      id: "6",
      name: "Dragon Roll",
      description: "Eel, crab, and cucumber topped with avocado.",
      price: 16.99,
      image:
        "https://images.unsplash.com/photo-1617196034183-421b4917c92d?w=600&q=75",
      category: "Sushi",
      rating: 4.8,
      preparationTime: 25,
    },
    {
      id: "7",
      name: "Caesar Salad",
      description:
        "Romaine lettuce, croutons, parmesan cheese with Caesar dressing.",
      price: 8.99,
      image:
        "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=600&q=75",
      category: "Salads",
      rating: 4.2,
      preparationTime: 10,
    },
    {
      id: "8",
      name: "Greek Salad",
      description:
        "Tomatoes, cucumbers, olives, feta cheese with olive oil dressing.",
      price: 9.99,
      image:
        "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=75",
      category: "Salads",
      rating: 4.4,
      preparationTime: 10,
    },
  ];

  // Mock categories
  const mockCategories: Category[] = [
    { name: "All", count: mockFoodItems.length },
    {
      name: "Popular",
      count: mockFoodItems.filter((item) => item.rating >= 4.5).length,
    },
    {
      name: "Pizza",
      count: mockFoodItems.filter((item) => item.category === "Pizza").length,
    },
    {
      name: "Burgers",
      count: mockFoodItems.filter((item) => item.category === "Burgers").length,
    },
    {
      name: "Sushi",
      count: mockFoodItems.filter((item) => item.category === "Sushi").length,
    },
    {
      name: "Salads",
      count: mockFoodItems.filter((item) => item.category === "Salads").length,
    },
  ];

  // Parse query parameters on initial load
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get("category");
    const searchParam = params.get("search");

    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }

    if (searchParam) {
      setSearchQuery(searchParam);
    }

    // Load categories and food items
    fetchData();

    // Load favorites if user is logged in
    if (user) {
      fetchFavorites();
    }
  }, [location.search, user]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Set categories and food items
      setCategories(mockCategories);
      setFoodItems(mockFoodItems);
      setTotalPages(Math.ceil(mockFoodItems.length / 6));
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load menu items",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFavorites = async () => {
    if (!user) return;

    setIsLoadingFavorites(true);
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock favorites
      setFavorites(["1", "5"]);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      setIsLoadingFavorites(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const handleAddToCart = async (item: FoodItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    setAddingToCart(item.id);

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: 1,
      });

      toast({
        title: "Added to cart",
        description: `${item.name} has been added to your cart`,
        duration: 2000,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    } finally {
      setAddingToCart(null);
    }
  };

  const handleToggleFavorite = async (itemId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to save favorites",
        variant: "default",
      });
      return;
    }

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (favorites.includes(itemId)) {
        setFavorites(favorites.filter((id) => id !== itemId));
        toast({
          title: "Removed from favorites",
          description: "Item removed from your favorites",
          duration: 2000,
        });
      } else {
        setFavorites([...favorites, itemId]);
        toast({
          title: "Added to favorites",
          description: "Item added to your favorites",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast({
        title: "Error",
        description: "Failed to update favorites",
        variant: "destructive",
      });
    }
  };

  const handleViewDetails = (itemId: string) => {
    navigate(`/client/food/${itemId}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Filter and sort food items
  const filteredItems = foodItems.filter((item) => {
    // Category filter
    const categoryMatch =
      selectedCategory === "All"
        ? true
        : selectedCategory === "Popular"
          ? item.rating >= 4.5
          : item.category === selectedCategory;

    // Search filter
    const searchMatch =
      searchQuery === ""
        ? true
        : item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Price filter
    const priceMatch =
      item.price >= priceRange[0] && item.price <= priceRange[1];

    return categoryMatch && searchMatch && priceMatch;
  });

  // Sort items
  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "time":
        return a.preparationTime - b.preparationTime;
      default: // recommended
        return b.rating - a.rating;
    }
  });

  // Paginate items
  const paginatedItems = sortedItems.slice(
    (currentPage - 1) * 6,
    currentPage * 6,
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search and Filter Bar */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1 flex">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="text"
                placeholder="Search for food..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit" className="ml-2">
              Search
            </Button>
          </form>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
              Filters
              {showFilters ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
            <Tabs value={sortBy} onValueChange={handleSortChange}>
              <TabsList>
                <TabsTrigger value="rating" className="flex items-center gap-1">
                  <Star className="h-4 w-4" /> Rating
                </TabsTrigger>
                <TabsTrigger
                  value="price-low"
                  className="flex items-center gap-1"
                >
                  <DollarSign className="h-4 w-4" /> Price: Low to High
                </TabsTrigger>
                <TabsTrigger
                  value="price-high"
                  className="flex items-center gap-1"
                >
                  <DollarSign className="h-4 w-4" /> Price: High to Low
                </TabsTrigger>
                <TabsTrigger value="time" className="flex items-center gap-1">
                  <Clock className="h-4 w-4" /> Prep Time
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <Card className="mt-4">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Badge
                        key={category.name}
                        variant={
                          selectedCategory === category.name
                            ? "default"
                            : "outline"
                        }
                        className="cursor-pointer"
                        onClick={() => handleCategoryChange(category.name)}
                      >
                        {category.name}{" "}
                        {category.count > 0 && `(${category.count})`}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Price Range</h3>
                  <div className="px-2">
                    <Slider
                      defaultValue={[priceRange[0], priceRange[1]]}
                      max={50}
                      step={1}
                      value={[priceRange[0], priceRange[1]]}
                      onValueChange={handlePriceRangeChange}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-end">
                  <div className="flex gap-2 w-full">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory("All");
                        setPriceRange([0, 50]);
                        setSortBy("rating");
                      }}
                    >
                      Reset
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={() => setShowFilters(false)}
                    >
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Category Pills for Mobile */}
      <div className="md:hidden overflow-x-auto pb-4 mb-4">
        <div className="flex space-x-2 w-max">
          {categories.map((category) => (
            <Badge
              key={category.name}
              variant={
                selectedCategory === category.name ? "default" : "outline"
              }
              className="cursor-pointer whitespace-nowrap"
              onClick={() => handleCategoryChange(category.name)}
            >
              {category.name}
            </Badge>
          ))}
        </div>
      </div>

      {/* Food Items Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : paginatedItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedItems.map((item) => (
            <Card
              key={item.id}
              className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group relative h-full flex flex-col"
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={() => handleViewDetails(item.id)}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute top-2 right-2 bg-white/90 rounded-full px-2 py-1 text-sm font-medium flex items-center">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                  {item.rating}
                </div>
                <Badge
                  variant="outline"
                  className="absolute top-2 left-2 bg-white/90 text-foreground"
                >
                  {item.category}
                </Badge>

                {/* Quick action overlay */}
                {hoveredItem === item.id && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-2 animate-fadeIn">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="rounded-full"
                      onClick={(e) => handleAddToCart(item, e)}
                      disabled={addingToCart === item.id}
                    >
                      {addingToCart === item.id ? (
                        <div className="h-4 w-4 mr-1 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      ) : (
                        <Plus className="h-4 w-4 mr-1" />
                      )}
                      Add to Cart
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full bg-white/80 hover:bg-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(item.id);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Quick View
                    </Button>
                  </div>
                )}
              </div>

              <CardContent className="p-4 flex-1 flex flex-col">
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1 line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <span className="font-bold text-lg">
                    ${item.price.toFixed(2)}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full hover:bg-muted"
                      onClick={(e) => handleToggleFavorite(item.id, e)}
                    >
                      <Heart
                        className={`h-5 w-5 ${favorites.includes(item.id) ? "fill-red-500 text-red-500" : ""}`}
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full hover:bg-muted"
                      onClick={(e) => handleAddToCart(item, e)}
                      disabled={addingToCart === item.id}
                    >
                      {addingToCart === item.id ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      ) : (
                        <Plus className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No items found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search or filters to find what you're looking
            for.
          </p>
          <Button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
              setPriceRange([0, 50]);
              setSortBy("rating");
            }}
          >
            Reset Filters
          </Button>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-in-out;
        }
      `}</style>
    </div>
  );
}
