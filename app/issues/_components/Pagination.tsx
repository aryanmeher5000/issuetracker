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
  if (pageCount <= 1) return null;

  function changePage(page: number) {
    const params = new URLSearchParams(srchParams);
    params.set("page", page.toString());
    router.push("?" + params.toString());
  }

  return (
    <Flex justify="center" align="center" gap="2">
      <Button
        radius="large"
        color="gray"
        variant="soft"
        disabled={currentPage === 1}
        onClick={() => changePage(1)}
      >
        <RiArrowLeftDoubleFill />
      </Button>
      <Button
        radius="large"
        color="gray"
        variant="soft"
        disabled={currentPage === 1}
        onClick={() => changePage(currentPage - 1)}
      >
        <MdKeyboardArrowLeft />
      </Button>
      <Text weight="medium" size="2">
        {currentPage} of {pageCount}
      </Text>
      <Button
        radius="large"
        color="gray"
        variant="soft"
        disabled={currentPage === pageCount}
        onClick={() => changePage(currentPage + 1)}
      >
        <MdKeyboardArrowRight />
      </Button>
      <Button
        radius="large"
        color="gray"
        variant="soft"
        disabled={currentPage === pageCount}
        onClick={() => changePage(pageCount)}
      >
        <RiArrowRightDoubleFill />
      </Button>
    </Flex>
  );
};

export default Pagination;
