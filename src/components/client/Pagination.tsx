import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
}: PaginationProps) {
  // Generate page numbers to display
  const generatePagination = () => {
    // Always show first and last page
    const firstPage = 1;
    const lastPage = totalPages;

    // Calculate range around current page
    const leftSiblingIndex = Math.max(currentPage - siblingCount, firstPage);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, lastPage);

    // Determine if we need to show dots
    const shouldShowLeftDots = leftSiblingIndex > firstPage + 1;
    const shouldShowRightDots = rightSiblingIndex < lastPage - 1;

    // Generate the page numbers array
    const pageNumbers: (number | string)[] = [];

    // Always add first page
    pageNumbers.push(firstPage);

    // Add left dots if needed
    if (shouldShowLeftDots) {
      pageNumbers.push("...");
    }

    // Add page numbers around current page
    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      if (i !== firstPage && i !== lastPage) {
        pageNumbers.push(i);
      }
    }

    // Add right dots if needed
    if (shouldShowRightDots) {
      pageNumbers.push("...");
    }

    // Always add last page if it's different from first page
    if (lastPage !== firstPage) {
      pageNumbers.push(lastPage);
    }

    return pageNumbers;
  };

  const pageNumbers = generatePagination();

  return (
    <div className="flex items-center justify-center space-x-2 mt-6">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous Page</span>
      </Button>

      {pageNumbers.map((page, index) => {
        if (page === "...") {
          return (
            <Button
              key={`ellipsis-${index}`}
              variant="outline"
              size="sm"
              disabled
              className="cursor-default"
            >
              ...
            </Button>
          );
        }

        return (
          <Button
            key={`page-${page}`}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(page as number)}
            className={currentPage === page ? "pointer-events-none" : ""}
          >
            {page}
          </Button>
        );
      })}

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next Page</span>
      </Button>
    </div>
  );
}
