import { extendTheme } from "@chakra-ui/react";
import { Button } from "./components/button";

const colors = {
  brand: {
    main: "#A513E2",
    main900: "#4C3397",
    sec: "#FCD812",
    herobg: "#5D3EBC",
    footerbg: "#210033",
  },
};

export const chakraTheme = extendTheme({
  colors,
  fonts: {
    heading: "var(--font-raleway2)",
  },
  components: {
    Button,
  },
});
