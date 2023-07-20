import { Container, CustomH1, Wave2Icon, WaveIcon } from "@/components/atoms";
import { TRANSITION_FAST, TRANSITION_SLOW } from "@/helpers/constants";
import {
  Box,
  Divider,
  HStack,
  Image,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Player } from "@lottiefiles/react-lottie-player";
import { PiParallelogramFill } from "react-icons/pi";

export function Hero() {
  return (
    <Box
      bg={"brand.herobg"}
      position={"relative"}
      transition={`background 0.3s, border 0.3s, border-radius 0.3s, box-shadow 0.3s`}
    >
      <Box
        w={"full"}
        position={"absolute"}
        zIndex={2}
        top={0}
        left={0}
        overflow={"hidden"}
      >
        <WaveIcon />
      </Box>

      <Container>
        <Stack
          flexDirection={{ base: "column", md: "row" }}
          w={"full"}
          pt={16}
          pb={4}
          position={"relative"}
          zIndex={5}
        >
          <Box
            flexBasis={{ base: "100%", md: "50%" }}
            order={{ base: 2, md: 1 }}
          >
            <VStack
              //   minHeight={{ base: 2, md: "50vh" }}
              w={"full"}
              h={"full"}
              pb={2}
              alignItems={"flex-start"}
              justifyContent={"center"}
            >
              <HStack
                pl={1}
                mb={3}
                color={"brand.sec"}
                spacing={"2px"}
                fontSize={"1.2rem"}
              >
                <PiParallelogramFill />
                <PiParallelogramFill />
                <PiParallelogramFill />
                <PiParallelogramFill />
                <PiParallelogramFill />
              </HStack>

              <CustomH1
                headerProps={{
                  mb: 3,
                  fontWeight: 700,
                  size: "3xl",
                  color: "white",
                }}
              >
                Book Your Next Delivery
              </CustomH1>

              <Text
                mb={16}
                color={"whiteAlpha.800"}
                fontWeight={500}
                pr={{ base: 0, md: "50px" }}
              >{`Unlock seamless deliveries, it's time to book our delivery service for your business triumphs. We Provide Safe and Fast Delivery`}</Text>

              <Divider borderColor={"blackAlpha.500"} borderWidth={1} mb={6} />

              <HStack spacing={4}>
                <Box
                  cursor={"pointer"}
                  _hover={{ transform: "scale(1.1)", boxShadow: "md" }}
                  transition={TRANSITION_SLOW}
                >
                  <Image
                    src={`https://res.cloudinary.com/dqveipmsp/image/upload/v1689778854/others/gg_xqrwvd.png`}
                    alt={"playstore"}
                  />
                </Box>
                <Box
                  cursor={"pointer"}
                  _hover={{ transform: "scale(1.1)", boxShadow: "md" }}
                  transition={TRANSITION_SLOW}
                >
                  <Image
                    src={`https://res.cloudinary.com/dqveipmsp/image/upload/v1689778854/others/gg2_wx1mwv.png`}
                    alt={"app store"}
                  />
                </Box>
              </HStack>
            </VStack>
          </Box>

          <Box
            flexBasis={{ base: "100%", md: "50%" }}
            order={{ base: 1, md: 2 }}
          >
            <Player
              src="https://assets5.lottiefiles.com/temp/lf20_ssLgHu.json"
              className="lottieplayer"
              loop
              autoplay
            />
          </Box>
        </Stack>
      </Container>

      {/* <Box
        w={"full"}
        position={"absolute"}
        zIndex={2}
        bottom={"1px"}
        left={0}
        overflow={"hidden"}
        transform={"translateY(100%)"}
      >
        <Wave2Icon />
      </Box> */}
    </Box>
  );
}
