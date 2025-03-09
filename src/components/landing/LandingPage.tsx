import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowRight,
  Star,
  Clock,
  MapPin,
  Search,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  // Popular categories
  const categories = [
    { name: "Pizza", icon: "🍕", count: 12 },
    { name: "Burgers", icon: "🍔", count: 8 },
    { name: "Sushi", icon: "🍣", count: 10 },
    { name: "Salads", icon: "🥗", count: 6 },
    { name: "Desserts", icon: "🍰", count: 9 },
    { name: "Drinks", icon: "🥤", count: 7 },
  ];

  // Featured restaurants
  const featuredRestaurants = [
    {
      id: "1",
      name: "Pizza Palace",
      image:
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80",
      rating: 4.8,
      deliveryTime: "20-30 min",
      tags: ["Italian", "Pizza", "Pasta"],
    },
    {
      id: "2",
      name: "Burger Joint",
      image:
        "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&q=80",
      rating: 4.6,
      deliveryTime: "15-25 min",
      tags: ["American", "Burgers", "Fast Food"],
    },
    {
      id: "3",
      name: "Sushi Express",
      image:
        "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&q=80",
      rating: 4.9,
      deliveryTime: "25-35 min",
      tags: ["Japanese", "Sushi", "Asian"],
    },
  ];

  // Popular dishes
  const popularDishes = [
    {
      id: "1",
      name: "Margherita Pizza",
      restaurant: "Pizza Palace",
      image:
        "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&q=80",
      price: 12.99,
      rating: 4.7,
    },
    {
      id: "2",
      name: "Classic Cheeseburger",
      restaurant: "Burger Joint",
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80",
      price: 9.99,
      rating: 4.5,
    },
    {
      id: "3",
      name: "California Roll",
      restaurant: "Sushi Express",
      image:
        "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&q=80",
      price: 14.99,
      rating: 4.8,
    },
    {
      id: "4",
      name: "Caesar Salad",
      restaurant: "Fresh Greens",
      image:
        "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=600&q=80",
      price: 8.99,
      rating: 4.3,
    },
  ];

  // Special offers
  const specialOffers = [
    {
      id: "1",
      title: "Free Delivery",
      description: "On your first order",
      code: "WELCOME",
      image:
        "https://images.unsplash.com/photo-1576866209830-589e1bfbaa4d?w=600&q=80",
      backgroundColor: "bg-blue-500",
    },
    {
      id: "2",
      title: "20% OFF",
      description: "On orders over $30",
      code: "SAVE20",
      image:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
      backgroundColor: "bg-green-500",
    },
    {
      id: "3",
      title: "Buy One Get One",
      description: "On selected items",
      code: "BOGOF",
      image:
        "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80",
      backgroundColor: "bg-purple-500",
    },
  ];

  // Handle scroll for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (user) {
        navigate(`/client?search=${encodeURIComponent(searchQuery)}`);
      } else {
        navigate(`/login`);
      }
    }
  };

  const handleGetStarted = () => {
    if (user) {
      navigate("/client");
    } else {
      navigate("/");
    }
  };

  const handleViewMenu = () => {
    navigate("/client");
  };

  const handleViewRestaurant = (id: string) => {
    if (user) {
      navigate(`/client/restaurant/${id}`);
    } else {
      navigate(`/login`);
    }
  };

  const handleViewDish = (id: string) => {
    if (user) {
      navigate(`/client/food/${id}`);
    } else {
      navigate(`/login`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Sticky Header */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled ? "bg-background/95 backdrop-blur-md shadow-md" : "bg-transparent"}`}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold">FoodDelivery</h1>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <a
              href="#how-it-works"
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              How It Works
            </a>
            <a
              href="#popular-dishes"
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              Popular Dishes
            </a>
            <a
              href="#special-offers"
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              Special Offers
            </a>
            <Button onClick={handleGetStarted}>
              {user ? "Order Now" : "Get Started"}
            </Button>
          </div>

          <Button variant="outline" size="icon" className="md:hidden">
            <ChevronDown className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40 z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80"
          alt="Delicious Food"
          className="w-full h-[500px] md:h-[600px] object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-center container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Delicious Food Delivered to Your Doorstep
            </h1>
            <p className="text-white/90 text-lg mb-6">
              Order from your favorite restaurants and enjoy a wide variety of
              cuisines delivered fast and fresh.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <form onSubmit={handleSearch} className="flex-1 flex">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Enter your address or zip code"
                    className="pl-10 bg-white/95 border-0 h-12 text-black"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button type="submit" className="ml-2 h-12 px-6">
                  Find Food
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">
          Browse by Category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map((category) => (
            <div
              key={category.name}
              className="bg-muted/50 hover:bg-muted rounded-lg p-4 text-center cursor-pointer transition-all hover:shadow-md"
              onClick={() => navigate(`/client?category=${category.name}`)}
            >
              <div className="text-4xl mb-2">{category.icon}</div>
              <h3 className="font-medium">{category.name}</h3>
              <p className="text-sm text-muted-foreground">
                {category.count} items
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Choose Your Food</h3>
              <p className="text-muted-foreground">
                Browse through our extensive menu of delicious options from
                local restaurants.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Place Your Order</h3>
              <p className="text-muted-foreground">
                Customize your meal, add to cart, and securely check out with
                various payment options.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Enjoy Your Delivery
              </h3>
              <p className="text-muted-foreground">
                Track your order in real-time and enjoy your food delivered
                right to your doorstep.
              </p>
            </div>
          </div>
          <div className="mt-10 text-center">
            <Button size="lg" onClick={handleGetStarted}>
              Order Now <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="py-12 container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">
            Featured Restaurants
          </h2>
          <Button variant="outline" onClick={handleViewMenu}>
            View All <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredRestaurants.map((restaurant) => (
            <Card
              key={restaurant.id}
              className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => handleViewRestaurant(restaurant.id)}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute top-2 right-2 bg-white/90 rounded-full px-2 py-1 text-sm font-medium flex items-center">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                  {restaurant.rating}
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-1">{restaurant.name}</h3>
                <div className="flex items-center text-muted-foreground mb-2">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="text-sm">{restaurant.deliveryTime}</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {restaurant.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="bg-muted/50">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Popular Dishes Section */}
      <section id="popular-dishes" className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold">Popular Dishes</h2>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-auto"
            >
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pizza">Pizza</TabsTrigger>
                <TabsTrigger value="burgers">Burgers</TabsTrigger>
                <TabsTrigger value="sushi">Sushi</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularDishes.map((dish) => (
              <Card
                key={dish.id}
                className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => handleViewDish(dish.id)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <p className="text-white font-bold">
                      ${dish.price.toFixed(2)}
                    </p>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-1">{dish.name}</h3>
                  <p className="text-muted-foreground text-sm mb-2">
                    {dish.restaurant}
                  </p>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span>{dish.rating}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Special Offers Section */}
      <section id="special-offers" className="py-12 container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Special Offers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {specialOffers.map((offer) => (
            <div
              key={offer.id}
              className={`${offer.backgroundColor} rounded-lg overflow-hidden text-white relative group cursor-pointer`}
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
              <img
                src={offer.image}
                alt={offer.title}
                className="w-full h-48 object-cover mix-blend-overlay"
              />
              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-1">{offer.title}</h3>
                  <p className="text-white/90">{offer.description}</p>
                </div>
                <div>
                  <Badge className="bg-white/20 hover:bg-white/30 text-white border-0">
                    Use code: {offer.code}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* App Download Section */}
      <section className="py-12 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-3xl font-bold mb-4">Download Our App</h2>
              <p className="text-white/90 mb-6">
                Get the full experience with our mobile app. Order food, track
                deliveries, and earn rewards on the go.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="secondary" size="lg" className="gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-apple"
                  >
                    <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" />
                    <path d="M10 2c1 .5 2 2 2 5" />
                  </svg>
                  App Store
                </Button>
                <Button variant="secondary" size="lg" className="gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-play"
                  >
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  Google Play
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500&q=80"
                alt="Mobile App"
                className="w-64 h-auto rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">FoodDelivery</h3>
              <p className="text-muted-foreground mb-4">
                Delicious food delivered to your doorstep, fast and fresh.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-foreground hover:text-primary transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-facebook"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-foreground hover:text-primary transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-twitter"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-foreground hover:text-primary transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-instagram"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a
                    href="#popular-dishes"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Popular Dishes
                  </a>
                </li>
                <li>
                  <a
                    href="#special-offers"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Special Offers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Contact Us</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <MapPin className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    123 Main Street, New York, NY 10001
                  </span>
                </li>
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-phone h-5 w-5 mr-2 text-muted-foreground"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span className="text-muted-foreground">(123) 456-7890</span>
                </li>
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-mail h-5 w-5 mr-2 text-muted-foreground"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <span className="text-muted-foreground">
                    info@fooddelivery.com
                  </span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Newsletter</h3>
              <p className="text-muted-foreground mb-4">
                Subscribe to our newsletter for the latest updates and offers.
              </p>
              <form className="flex">
                <Input
                  type="email"
                  placeholder="Your email"
                  className="rounded-r-none"
                />
                <Button type="submit" className="rounded-l-none">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>
              &copy; {new Date().getFullYear()} FoodDelivery. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
