import { LIMIT_DEFAULT, OFFSET_DEFAULT } from "@/constants/constants";
import { useSearchParameters } from "@/hooks/useSearchParameters";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/components/ui/pagination";

type PaginationPageProp = {
  hasOtherData: boolean;
};

export const PaginationPage = ({ hasOtherData }: PaginationPageProp) => {
  const { searchParameters, onSearch } = useSearchParameters();

  const handleNextPage = () => {
    const offset = hasOtherData
      ? Number(searchParameters.offset || 0) + LIMIT_DEFAULT
      : OFFSET_DEFAULT;
    onSearch({ ...searchParameters, offset });
  };

  const handleBackPage = () => {
    const offset = hasOtherData
      ? Number(searchParameters.offset || 0) - LIMIT_DEFAULT <= 0
        ? OFFSET_DEFAULT
        : Number(searchParameters.offset) - LIMIT_DEFAULT
      : OFFSET_DEFAULT;

    onSearch({ ...searchParameters, offset });
  };

  return (
    <>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={handleBackPage}
              className="cursor-pointer"
            >
              Trước
            </PaginationPrevious>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext onClick={handleNextPage} className="cursor-pointer">
              Trước
            </PaginationNext>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
};
