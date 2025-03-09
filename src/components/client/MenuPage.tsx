import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Star, Plus, Filter, Clock } from "lucide-react";

type FoodItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  preparationTime: number;
};

const categories = [
  "All",
  "Popular",
  "Pizza",
  "Burgers",
  "Sushi",
  "Salads",
  "Desserts",
  "Drinks",
];

const mockFoodItems: FoodItem[] = [
  {
    id: "1",
    name: "Margherita Pizza",
    description: "Classic pizza with tomato sauce, mozzarella, and basil",
    price: 12.99,
    image:
      "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&q=75",
    category: "Pizza",
    rating: 4.5,
    preparationTime: 20,
  },
  {
    id: "2",
    name: "Cheeseburger",
    description:
      "Juicy beef patty with cheese, lettuce, tomato, and special sauce",
    price: 9.99,
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=75",
    category: "Burgers",
    rating: 4.3,
    preparationTime: 15,
  },
  {
    id: "3",
    name: "California Roll",
    description: "Crab, avocado, and cucumber wrapped in seaweed and rice",
    price: 14.99,
    image:
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&q=75",
    category: "Sushi",
    rating: 4.7,
    preparationTime: 25,
  },
  {
    id: "4",
    name: "Caesar Salad",
    description:
      "Romaine lettuce, croutons, parmesan cheese with Caesar dressing",
    price: 8.99,
    image:
      "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=600&q=75",
    category: "Salads",
    rating: 4.2,
    preparationTime: 10,
  },
];

import Pagination from "./Pagination";
import SearchBar from "./SearchBar";

export default function MenuPage() {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("recommended");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50]);
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 6;

  // Filter items based on category, search query, and price range
  const filteredItems = mockFoodItems.filter((item) => {
    // Category filter
    const categoryMatch =
      activeCategory === "All"
        ? true
        : activeCategory === "Popular"
          ? item.rating >= 4.5
          : item.category === activeCategory;

    // Search filter
    const searchMatch =
      searchQuery === ""
        ? true
        : item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase());

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
        return b.rating - a.rating; // Default sort by rating
    }
  });

  // Paginate items
  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);
  const paginatedItems = sortedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery, sortBy, priceRange]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Reset category to "All" when searching
    setActiveCategory("All");
  };

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
    });

    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart`,
      duration: 2000,
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of results
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Menu</h1>
          <p className="text-muted-foreground">
            Discover our delicious offerings
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recommended">Recommended</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="time">Fastest Delivery</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Search bar for mobile */}
      <div className="md:hidden mb-4">
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Advanced filters */}
      {showFilters && (
        <div className="bg-muted/30 rounded-lg p-4 mb-4">
          <h3 className="font-medium mb-3">Price Range</h3>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="text-sm">${priceRange[0]}</span>
                <span className="text-sm">${priceRange[1]}</span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="5"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], parseInt(e.target.value)])
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Featured Event Banner */}
      <div className="relative rounded-lg overflow-hidden my-4">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40 z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1555244162-803834f70033?w=1200&q=80"
          alt="Special Event"
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-center p-6">
          <Badge className="w-fit mb-2">Limited Time</Badge>
          <h2 className="text-2xl font-bold text-white mb-2">
            Summer Food Festival
          </h2>
          <p className="text-white/90 mb-4 max-w-md">
            Join us for special dishes and exclusive discounts from June 15-30
          </p>
          <Button className="w-fit">View Special Menu</Button>
        </div>
      </div>

      <Tabs defaultValue="All" className="w-full">
        <div className="overflow-x-auto pb-2">
          <TabsList className="inline-flex h-9 items-center justify-start rounded-lg bg-muted p-1 text-muted-foreground w-auto">
            {categories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                onClick={() => setActiveCategory(category)}
                className="rounded-md px-3 py-1 text-sm font-medium whitespace-nowrap"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Pagination controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 mb-2">
          <p className="text-sm text-muted-foreground mb-2 sm:mb-0">
            Showing{" "}
            <span className="font-medium">
              {(currentPage - 1) * itemsPerPage + 1}-
              {Math.min(currentPage * itemsPerPage, filteredItems.length)}
            </span>{" "}
            of <span className="font-medium">{filteredItems.length}</span> items
          </p>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>

        {categories.map((category) => (
          <TabsContent key={category} value={category} className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedItems.map((item) => (
                <Card
                  key={item.id}
                  className="overflow-hidden group relative transition-all duration-300 hover:shadow-lg"
                >
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    {item.rating >= 4.5 && (
                      <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center">
                        <Star className="h-3 w-3 fill-current mr-1" />
                        Popular
                      </div>
                    )}
                  </div>
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <Star className="h-3 w-3 fill-current" />
                        {item.rating}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 pb-2">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-sm flex items-center">
                        <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                        {item.preparationTime} min
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {item.category}
                      </Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex items-center justify-between">
                    <p className="font-semibold">${item.price.toFixed(2)}</p>
                    <Button
                      size="sm"
                      onClick={() => handleAddToCart(item)}
                      className="transition-all hover:scale-105"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add to cart
                    </Button>
                  </CardFooter>

                  {/* Quick view overlay on hover */}
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="bg-white/20 text-white hover:bg-white/30 w-32 transition-all hover:scale-105"
                      >
                        Quick View
                      </Button>
                      <Button
                        className="w-32 transition-all hover:scale-105"
                        onClick={() => handleAddToCart(item)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add to cart
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
