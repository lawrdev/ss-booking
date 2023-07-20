import { Container, CustomH1 } from "@/components/atoms";
import { CustomStepper } from "@/components/molecules";
import { BookingForm, Footer, Hero } from "@/components/organisms";
import { TRANSITION_FAST, TRANSITION_SLOW } from "@/helpers/constants";
import { Box, Card, Stack, Text, VStack, useSteps } from "@chakra-ui/react";
import Image from "next/image";

const steps = [
  { title: "1. Pickup", description: " " },
  { title: "2. Delivery", description: " " },
];

export function BookingTemplate() {
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  return (
    <>
      <Box>
        <Hero />
      </Box>

      <main style={{ marginBottom: "72px" }}>
        <Box px={6} pt={"62px"}>
          <Box mb={12} pb={6}>
            <Box maxWidth={"400px"} w={"100%"} mx={"auto"}>
              <CustomStepper steps={steps} activeStep={activeStep} />
            </Box>
          </Box>

          <Box maxWidth={"660px"} w={"100%"} mx={"auto"} pb={16}>
            <BookingForm
              activeStep={activeStep}
              setActiveStep={setActiveStep}
            />
          </Box>
        </Box>
      </main>

      <footer>
        <Footer />
      </footer>
    </>
  );
}
