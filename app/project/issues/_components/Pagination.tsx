"use client";
import { Button, Flex, Text } from "@radix-ui/themes";
import { useRouter, useSearchParams } from "next/navigation";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { RiArrowLeftDoubleFill, RiArrowRightDoubleFill } from "react-icons/ri";

interface Props {
  itemCount: number;
  pageSize: number;
  currentPage: number;
}

const Pagination = ({ itemCount, pageSize, currentPage }: Props) => {
  const router = useRouter();
  const srchParams = useSearchParams();

  const pageCount = Math.ceil(itemCount / pageSize);

  // If there's only 1 page, disable pagination entirely
  if (pageCount <= 1) return null;

  const currentPageValid = currentPage > 0 ? currentPage : 1;

  function changePage(page: number) {
    const params = new URLSearchParams(srchParams.toString());
    if (page > 0 && page <= pageCount) {
      params.set("page", page.toString());
    }
    router.push(`?${params.toString()}`);
  }

  return (
    <Flex justify="center" align="center" gap="2">
      {/* First Page Button */}
      <Button
        radius="large"
        color="gray"
        variant="soft"
        disabled={currentPageValid === 1}
        onClick={() => changePage(1)}
      >
        <RiArrowLeftDoubleFill />
      </Button>

      {/* Previous Page Button */}
      <Button
        radius="large"
        color="gray"
        variant="soft"
        disabled={currentPageValid === 1}
        onClick={() => changePage(currentPageValid - 1)}
      >
        <MdKeyboardArrowLeft />
      </Button>

      {/* Current Page Display */}
      <Text weight="medium" size="2">
        {currentPageValid} of {pageCount}
      </Text>

      {/* Next Page Button */}
      <Button
        radius="large"
        color="gray"
        variant="soft"
        disabled={currentPageValid === pageCount}
        onClick={() => changePage(currentPageValid + 1)}
      >
        <MdKeyboardArrowRight />
      </Button>

      {/* Last Page Button */}
      <Button
        radius="large"
        color="gray"
        variant="soft"
        disabled={currentPageValid === pageCount}
        onClick={() => changePage(pageCount)}
      >
        <RiArrowRightDoubleFill />
      </Button>
    </Flex>
  );
};

export default Pagination;
