import { ComponentStyleConfig, defineStyle } from "@chakra-ui/react";

const ghost = defineStyle({
  _hover: { bg: "blackAlpha.50" },
});

export const Button: ComponentStyleConfig = {
  variants: { ghost },
  baseStyle: {
    borderRadius: "lg",
    fontWeight: 700,
    _active: { transform: "scale(0.95)" },
    transition: "all 0.25s cubic-bezier(0.645,0.045,0.355,1)",
  },
  defaultProps: {
    variant: "solid",
    colorScheme: "purple",
    size: "sm",
  },
};
