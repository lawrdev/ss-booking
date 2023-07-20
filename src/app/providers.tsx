"use client";

import { chakraTheme } from "@/chakra/theme";
import { Header } from "@/components/organisms";
import { CacheProvider } from "@chakra-ui/next-js";
import { Box, ChakraProvider, Flex } from "@chakra-ui/react";
import { raleway } from "./fonts";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style jsx global>
        {`
          :root {
            --font-raleway2: ${raleway.style.fontFamily};
          }
        `}
      </style>
      <CacheProvider>
        <ChakraProvider theme={chakraTheme}>
          <Flex
            flexDirection={"column"}
            w={"full"}
            minHeight={"100vh"}
            gap={"0px"}
          >
            <Header />

            <Box flexGrow={1}>{children}</Box>
          </Flex>
        </ChakraProvider>
      </CacheProvider>
    </>
  );
}
