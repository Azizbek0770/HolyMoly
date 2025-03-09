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

      const mockResults: SearchResult[] = [
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
          name: "Pizza Palace",
          category: "Restaurant",
          type: "restaurant",
        },
        {
          id: "4",
          name: "Pizza",
          category: "Category",
          type: "category",
        },
        {
          id: "5",
          name: "Cheeseburger",
          category: "Burgers",
          image:
            "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&q=75",
          type: "food",
        },
      ].filter(
        (item) =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase()),
      );

      setResults(mockResults);
      setIsLoading(false);
    }, 300);
  };

  useEffect(() => {
    if (open) {
      mockSearch(query);
    }
  }, [query, open]);

  const handleSearch = () => {
    if (onSearch) {
      onSearch(query);
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
          className="pl-8 pr-8"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full rounded-l-none"
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
        />
        <CommandList>
          {isLoading ? (
            <div className="py-6 text-center text-sm">Loading results...</div>
          ) : (
            <>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Foods">
                {results
                  .filter((result) => result.type === "food")
                  .map((result) => (
                    <CommandItem
                      key={result.id}
                      onSelect={() => {
                        setQuery(result.name);
                        handleSearch();
                      }}
                      className="flex items-center gap-2"
                    >
                      {result.image && (
                        <div className="h-8 w-8 overflow-hidden rounded">
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
                        handleSearch();
                      }}
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
                        handleSearch();
                      }}
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
