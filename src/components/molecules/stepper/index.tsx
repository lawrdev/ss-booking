import {
  Box,
  HStack,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FaDotCircle, FaLocationArrow, FaTruckLoading } from "react-icons/fa";
import { HiLocationMarker } from "react-icons/hi";

interface Props {
  steps: {
    title?: string;
    description?: string;
  }[];
  activeStep: number;
}

export function CustomStepper({ steps, activeStep }: Props) {
  return (
    <>
      <Stepper
        index={activeStep}
        size={"lg"}
        colorScheme="purple"
        gap={"0px"}
        px={"45px"}
        pb={"34px"}
      >
        {steps.map((step, index) => (
          <Step key={index}>
            <VStack w={"full"} alignItems={"flex-start"}>
              <HStack w={"full"} spacing={"0px"} alignItems={"center"}>
                <Box position={"relative"}>
                  <StepIndicator>
                    <StepStatus
                      complete={<StepIcon />}
                      incomplete={
                        <Box
                          color={
                            activeStep !== index && activeStep < index
                              ? "blackAlpha.400"
                              : "blackAlpha.800"
                          }
                          fontWeight={700}
                        >
                          <FaTruckLoading fontSize={"1.2rem"} />
                        </Box>
                      }
                      active={
                        <Box
                          color={
                            activeStep !== index && activeStep < index
                              ? "blackAlpha.600"
                              : "purple.500"
                          }
                          fontWeight={600}
                        >
                          <FaLocationArrow fontSize={"1.2rem"} />
                        </Box>
                      }
                    />
                  </StepIndicator>

                  <Box
                    position={"absolute"}
                    bottom={"-10px"}
                    left={0}
                    transform={"translateY(100%) translateX(-34%)"}
                    w={"fit-content"}
                  >
                    <StepTitle>
                      <Box
                        whiteSpace={"nowrap"}
                        color={
                          activeStep !== index && activeStep < index
                            ? "blackAlpha.600"
                            : "purple.500"
                        }
                        fontWeight={700}
                        fontSize={"md"}
                        fontFamily={"heading"}
                      >
                        {step.title}
                      </Box>
                    </StepTitle>
                  </Box>
                </Box>

                <StepSeparator style={{ margin: 0 }} />
              </HStack>
            </VStack>
          </Step>
        ))}
      </Stepper>
    </>
  );
}
