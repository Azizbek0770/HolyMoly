import { useState } from "react";
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

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredItems =
    activeCategory === "All"
      ? mockFoodItems
      : activeCategory === "Popular"
        ? mockFoodItems.filter((item) => item.rating >= 4.5)
        : mockFoodItems.filter((item) => item.category === activeCategory);

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
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Select defaultValue="recommended">
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
        <div className="flex items-center justify-between mt-4 mb-2">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-medium">1-{filteredItems.length}</span> of{" "}
            <span className="font-medium">{filteredItems.length}</span> items
          </p>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-primary text-primary-foreground"
            >
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              3
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>

        {categories.map((category) => (
          <TabsContent key={category} value={category} className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((item) => (
                <Card key={item.id} className="overflow-hidden group relative">
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
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add to cart
                    </Button>
                  </CardFooter>

                  {/* Quick view overlay on hover */}
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="bg-white/20 text-white hover:bg-white/30 w-32"
                      >
                        Quick View
                      </Button>
                      <Button className="w-32">
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
