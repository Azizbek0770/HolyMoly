import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

type SearchResult = {
  id: string;
  name: string;
  category: string;
  image?: string;
  type: "food" | "restaurant" | "category";
};

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  onSearch,
  placeholder = "Search for food...",
  className = "",
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock search results - in a real app, this would come from an API
  const mockSearch = (query: string) => {
    setIsLoading(true);

    // Simulate API delay
    setTimeout(() => {
      if (!query.trim()) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      // More comprehensive mock data
      const allMockResults: SearchResult[] = [
        // Pizza items
        {
          id: "1",
          name: "Margherita Pizza",
          category: "Pizza",
          image:
            "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=100&q=75",
          type: "food",
        },
        {
          id: "2",
          name: "Pepperoni Pizza",
          category: "Pizza",
          image:
            "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=100&q=75",
          type: "food",
        },
        {
          id: "3",
          name: "Vegetarian Pizza",
          category: "Pizza",
          image:
            "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=100&q=75",
          type: "food",
        },
        // Burger items
        {
          id: "4",
          name: "Cheeseburger",
          category: "Burgers",
          image:
            "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&q=75",
          type: "food",
        },
        {
          id: "5",
          name: "Bacon Burger",
          category: "Burgers",
          image:
            "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=100&q=75",
          type: "food",
        },
        // Sushi items
        {
          id: "6",
          name: "California Roll",
          category: "Sushi",
          image:
            "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=100&q=75",
          type: "food",
        },
        {
          id: "7",
          name: "Dragon Roll",
          category: "Sushi",
          image:
            "https://images.unsplash.com/photo-1617196034183-421b4917c92d?w=100&q=75",
          type: "food",
        },
        // Salad items
        {
          id: "8",
          name: "Caesar Salad",
          category: "Salads",
          image:
            "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=100&q=75",
          type: "food",
        },
        // Restaurants
        {
          id: "9",
          name: "Pizza Palace",
          category: "Restaurant",
          type: "restaurant",
        },
        {
          id: "10",
          name: "Burger Joint",
          category: "Restaurant",
          type: "restaurant",
        },
        {
          id: "11",
          name: "Sushi Express",
          category: "Restaurant",
          type: "restaurant",
        },
        // Categories
        {
          id: "12",
          name: "Pizza",
          category: "Category",
          type: "category",
        },
        {
          id: "13",
          name: "Burgers",
          category: "Category",
          type: "category",
        },
        {
          id: "14",
          name: "Sushi",
          category: "Category",
          type: "category",
        },
        {
          id: "15",
          name: "Salads",
          category: "Category",
          type: "category",
        },
      ];

      // More sophisticated filtering
      const lowerQuery = query.toLowerCase();
      const mockResults = allMockResults.filter((item) => {
        const nameMatch = item.name.toLowerCase().includes(lowerQuery);
        const categoryMatch = item.category.toLowerCase().includes(lowerQuery);

        // For food items, also check if the category name matches the query
        // This helps when searching for "pizza" to find all pizza items
        const categoryTypeMatch =
          item.type === "food" &&
          allMockResults
            .filter((r) => r.type === "category")
            .some(
              (cat) =>
                cat.name.toLowerCase().includes(lowerQuery) &&
                cat.name.toLowerCase() === item.category.toLowerCase(),
            );

        return nameMatch || categoryMatch || categoryTypeMatch;
      });

      setResults(mockResults);
      setIsLoading(false);
    }, 300);
  };

  useEffect(() => {
    if (open) {
      mockSearch(query);
    }
  }, [query, open]);

  const handleSearch = (selectedQuery = query) => {
    if (onSearch) {
      onSearch(selectedQuery);
    }
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    if (onSearch) {
      onSearch("");
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          className="pl-8 pr-8 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full rounded-l-none transition-all hover:bg-muted"
            onClick={clearSearch}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search for food, restaurants, or categories..."
          value={query}
          onValueChange={setQuery}
          className="transition-all duration-200"
        />
        <CommandList className="animate-in fade-in-50 duration-200">
          {isLoading ? (
            <div className="py-6 text-center text-sm">
              <div
                className="inline-block animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"
                aria-hidden="true"
              ></div>
              Loading results...
            </div>
          ) : (
            <>
              <CommandEmpty className="animate-in fade-in-50 duration-200">
                No results found.
              </CommandEmpty>
              <CommandGroup heading="Foods">
                {results
                  .filter((result) => result.type === "food")
                  .map((result) => (
                    <CommandItem
                      key={result.id}
                      onSelect={() => {
                        setQuery(result.name);
                        handleSearch(result.name);
                      }}
                      className="flex items-center gap-2 transition-all duration-200 hover:scale-[1.02]"
                    >
                      {result.image && (
                        <div className="h-8 w-8 overflow-hidden rounded transition-all duration-200 group-hover:scale-105">
                          <img
                            src={result.image}
                            alt={result.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <p>{result.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {result.category}
                        </p>
                      </div>
                    </CommandItem>
                  ))}
              </CommandGroup>

              <CommandGroup heading="Restaurants">
                {results
                  .filter((result) => result.type === "restaurant")
                  .map((result) => (
                    <CommandItem
                      key={result.id}
                      onSelect={() => {
                        setQuery(result.name);
                        handleSearch(result.name);
                      }}
                      className="transition-all duration-200 hover:scale-[1.02]"
                    >
                      {result.name}
                    </CommandItem>
                  ))}
              </CommandGroup>

              <CommandGroup heading="Categories">
                {results
                  .filter((result) => result.type === "category")
                  .map((result) => (
                    <CommandItem
                      key={result.id}
                      onSelect={() => {
                        setQuery(result.name);
                        handleSearch(result.name);
                      }}
                      className="transition-all duration-200 hover:scale-[1.02]"
                    >
                      {result.name}
                    </CommandItem>
                  ))}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </div>
  );
}
