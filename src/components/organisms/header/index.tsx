import { useEffect, useState } from "react";
import { Container, Logo } from "@/components/atoms";
import { TRANSITION_FAST } from "@/helpers/constants";
import { Link } from "@chakra-ui/next-js";
import { Box, Button, Flex, HStack, IconButton } from "@chakra-ui/react";
import { FaChevronUp } from "react-icons/fa";
import { RxHamburgerMenu } from "react-icons/rx";

export function Header() {
  const [scrollDirection, setScrollDirectione] = useState("top");

  useEffect(() => {
    let lastVal = 0;
    window.onscroll = function () {
      let y = window.scrollY;
      if (y > lastVal) {
        setScrollDirectione("down");
      }
      if (y < lastVal) {
        setScrollDirectione("up");
      }
      if (y === 0 || y < 220) {
        setScrollDirectione("top");
      }
      lastVal = y;
    };
  }, []);

  return (
    <>
      <Box w={"full"} bg={"brand.main900"} boxShadow={"sm"}>
        <Container>
          <Flex
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
            height={"75.5px"}
          >
            <Logo />

            <Box display={{ base: "none", lg: "block" }}>
              <HStack spacing={8} alignItems={"flex-end"}>
                {["Schedule A Ride", "Get An Estimate", "API Guide"].map(
                  (op, index) => (
                    <Link
                      key={index}
                      href={"/"}
                      fontSize={"sm"}
                      fontFamily={"heading"}
                      fontWeight={700}
                      transition={TRANSITION_FAST}
                      color={op === "Schedule A Ride" ? "brand.sec" : "white"}
                      _hover={{
                        textDecoration: "none",
                        color: "brand.sec",
                      }}
                    >
                      {op}
                    </Link>
                  )
                )}
              </HStack>
            </Box>

            <Box>
              <HStack display={{ base: "none", lg: "flex" }} spacing={4}>
                <Button
                  variant={"ghost"}
                  colorScheme="yellow"
                  color={"white"}
                  _hover={{ bg: "whiteAlpha.300" }}
                >
                  Sign In
                </Button>
                <Button boxShadow={"sm"} colorScheme="yellow">
                  Create an accout
                </Button>
              </HStack>

              <IconButton
                display={{ base: "flex", lg: "none" }}
                colorScheme="yellow"
                aria-label="menu"
                fontSize={"1.4em"}
                color={"blackAlpha.700"}
                icon={<RxHamburgerMenu />}
              />
            </Box>
          </Flex>
        </Container>
      </Box>

      {scrollDirection === "up" ? (
        <Box position={"fixed"} bottom={"60px"} right={"20px"} zIndex={502}>
          <IconButton
            colorScheme={"purple"}
            borderRadius={"full"}
            size={"lg"}
            icon={<FaChevronUp fontSize={"20px"} />}
            aria-label={"scroll to the top"}
            boxShadow={"xl"}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          />
        </Box>
      ) : null}
    </>
  );
}
