import { Container, Logo } from "@/components/atoms";
import { Box, HStack, VStack } from "@chakra-ui/react";

export function Footer() {
  return (
    <Box w={"full"} bg={"brand.footerbg"}>
      <Container>
        <VStack
          height={"100px"}
          w={"full"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Box>
            <Logo />
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
