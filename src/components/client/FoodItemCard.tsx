import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/contexts/CartContext";
import { Star, ShoppingCart, Eye, Heart } from "lucide-react";
import { motion } from "framer-motion";

interface FoodItemCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  preparationTime: number;
  onToggleFavorite?: (id: string) => void;
  isFavorite?: boolean;
}

export default function FoodItemCard({
  id,
  name,
  description,
  price,
  image,
  category,
  rating,
  preparationTime,
  onToggleFavorite,
  isFavorite = false,
}: FoodItemCardProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAddingToCart(true);

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      addToCart({
        id,
        name,
        price,
        image,
        quantity: 1,
      });

      toast({
        title: "Added to cart",
        description: `${name} has been added to your cart`,
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

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onToggleFavorite) return;

    setIsTogglingFavorite(true);

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      onToggleFavorite(id);

      toast({
        title: isFavorite ? "Removed from favorites" : "Added to favorites",
        description: isFavorite
          ? `${name} removed from your favorites`
          : `${name} added to your favorites`,
        duration: 2000,
      });
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  const handleViewDetails = () => {
    navigate(`/client/food/${id}`);
  };

  const truncateDescription = (text: string, maxLength: number = 60) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <Card
      className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group relative h-full flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleViewDetails}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute top-2 right-2 bg-white/90 rounded-full px-2 py-1 text-sm font-medium flex items-center">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
          {rating}
        </div>
        <Badge
          variant="outline"
          className="absolute top-2 left-2 bg-white/90 text-foreground"
        >
          {category}
        </Badge>

        {/* Quick action overlay */}
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/60 flex items-center justify-center gap-2"
          >
            <Button
              size="sm"
              variant="secondary"
              className="rounded-full"
              onClick={handleAddToCart}
              disabled={isAddingToCart}
            >
              {isAddingToCart ? (
                <Spinner size="sm" className="mr-1" />
              ) : (
                <ShoppingCart className="h-4 w-4 mr-1" />
              )}
              Add to Cart
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="rounded-full bg-white/80 hover:bg-white"
              onClick={handleViewDetails}
            >
              <Eye className="h-4 w-4 mr-1" />
              Quick View
            </Button>
          </motion.div>
        )}
      </div>

      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-1 line-clamp-1">{name}</h3>
          <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
            {truncateDescription(description)}
          </p>
        </div>

        <div className="flex items-center justify-between mt-2">
          <span className="font-bold text-lg">${price.toFixed(2)}</span>
          <div className="flex items-center gap-2">
            {onToggleFavorite && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-muted"
                onClick={handleToggleFavorite}
                disabled={isTogglingFavorite}
              >
                {isTogglingFavorite ? (
                  <Spinner size="sm" />
                ) : (
                  <Heart
                    className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`}
                  />
                )}
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-muted"
              onClick={handleAddToCart}
              disabled={isAddingToCart}
            >
              {isAddingToCart ? (
                <Spinner size="sm" />
              ) : (
                <ShoppingCart className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
