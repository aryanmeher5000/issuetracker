"use client";
import { Button, Flex, Text } from "@radix-ui/themes";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { RiArrowLeftDoubleFill, RiArrowRightDoubleFill } from "react-icons/ri";

interface Props {
  currentPage?: number;
  totalPages?: number;
}

const Pagination = ({ currentPage, totalPages }: Props) => {
  return (
    <Flex justify="center" align="center" gap="2">
      <Button
        radius="full"
        color="gray"
        variant="soft"
        disabled={currentPage === 0 || totalPages < 2}
      >
        <RiArrowLeftDoubleFill />
      </Button>
      <Button
        radius="full"
        color="gray"
        variant="soft"
        disabled={currentPage === 0 || totalPages < 2}
      >
        <MdKeyboardArrowLeft />
      </Button>
      <Text weight="medium">Page 1 of 250</Text>
      <Button radius="full" color="gray" variant="soft">
        <MdKeyboardArrowRight />
      </Button>
      <Button radius="full" color="gray" variant="soft">
        <RiArrowRightDoubleFill />
      </Button>
    </Flex>
  );
};

export default Pagination;
