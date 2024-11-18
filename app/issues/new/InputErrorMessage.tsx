import React, { PropsWithChildren } from "react";
import { Text } from "@radix-ui/themes";

const InputErrorMessage = ({ children }: PropsWithChildren) => {
  if (!children) return null;
  else
    return (
      <Text as="p" color="red" className="text-sm">
        {children}
      </Text>
    );
};

export default InputErrorMessage;
