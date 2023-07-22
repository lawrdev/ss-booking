import { useState, useEffect, useRef, useMemo } from "react";
import {
  CustomH3,
  CustomInput,
  CustomModal,
  CustomSelect,
  CustomTextarena,
} from "@/components/atoms";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  HStack,
  IconButton,
  Image,
  Skeleton,
  Stack,
  Text,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { BiMapPin, BiMap } from "react-icons/bi";
import { AiFillEdit } from "react-icons/ai";
import { BsHouseAddFill } from "react-icons/bs";
import {
  BE_Locations,
  DeliveryLocationFormData,
  LocalStorageDeliveryLocationProp,
  SelectOptionsType,
} from "@/helpers/types";
import { getDeliveryPrice, getLocations, requestDelivery } from "@/API/booking";
import { v4 as uuidv4 } from "uuid";
import {
  formatPrice,
  getDeliveryLocations,
  updateDeliveryLocations,
} from "@/helpers/functions";
import dayjs from "dayjs";

interface Props {
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  activeStep: number;
}

const initDeliveryData = {
  id: "",
  name: "",
  phone: "",
  state: "Lagos",
  area: "01",
  address: "",
};
const initPickupData = {
  id: "",
  name: "",
  phone: "",
  state: "Lagos",
  area: "01",
  address: "",
  date: dayjs().format("YYYY-MM-DD"),
};

export function BookingForm({ setActiveStep, activeStep }: Props) {
  const [isSaving, setIsSaving] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [checkingPrice, setCheckingPrice] = useState(false);
  const [savedLocations, setSavedLocations] = useState<
    LocalStorageDeliveryLocationProp[]
  >([]);
  const [deliveryData, setDeliveryData] =
    useState<DeliveryLocationFormData>(initDeliveryData);
  const [pickupData, setPickupData] =
    useState<DeliveryLocationFormData>(initPickupData);
  const [statesOps, setStatesOps] = useState<SelectOptionsType[]>([]);
  const [areaOps, setAreaOps] = useState<
    {
      area: string;
      locals: SelectOptionsType[];
    }[]
  >([]);
  const [isEdit, setIsEdit] = useState(false);
  const [checkedDLs, setCheckedDLs] = useState<DeliveryLocationFormData[]>([]);
  const [prices, setPrices] = useState<{ price: number }[]>([]);

  const timerRef = useRef<any | null>(null);
  const continueRef = useRef<any | null>(null);

  const addDisclosure = useDisclosure();
  const priceDisclosure = useDisclosure();
  const toast = useToast();

  const handleContinue = (val: 0 | 1) => {
    setActiveStep(val);
    window.scrollTo({ top: 500, behavior: "smooth" });
  };

  const handleSaveLocation = (newObj: DeliveryLocationFormData) => {
    const locations = getDeliveryLocations();

    if (locations.find((x) => x.id === newObj.id)) {
      const newLocations = locations.filter((x) => x.id !== newObj.id);

      newLocations.push(newObj);
      updateDeliveryLocations(newLocations);
    } else {
      locations.push(newObj);
      updateDeliveryLocations(locations);
    }

    setSavedLocations(getDeliveryLocations());
    toast({
      status: "success",
      title: "Location saved!",
      position: "top",
    });

    setIsSaving(false);
    addDisclosure.onClose();
  };

  const handleEditDeliveryLocation = (id: string) => {
    setIsEdit(true);
    const locations = getDeliveryLocations();

    const found = locations.find((deliveryData) => deliveryData.id === id);

    if (found) {
      setDeliveryData(found);
    }

    addDisclosure.onOpen();
  };

  const handleDeleteLocation = (id: string) => {
    const locations = getDeliveryLocations();

    if (locations.find((x) => x.id === id)) {
      const newLocations = locations.filter((x) => x.id !== id);

      updateDeliveryLocations(newLocations);
    }

    setSavedLocations(getDeliveryLocations());
    toast({
      status: "success",
      title: "Location deleted successfully",
      position: "top",
    });
    addDisclosure.onClose();
  };

  useEffect(() => {
    const getLcs = async () => {
      const locations = await getLocations();

      if (locations && locations.length > 0) {
        setStatesOps(
          locations.map((op) => ({
            label: op.state,
            value: op.state,
          }))
        );

        setAreaOps(
          locations.map((op) => ({
            area: op.state,
            locals: [
              ...op.locals.map((x) => ({
                label: x.name,
                value: x.locationCode,
              })),
            ],
          }))
        );
      }
    };

    getLcs();
  }, []);

  useEffect(() => {
    setSavedLocations(getDeliveryLocations());
  }, []);

  const handleBookNow = async () => {
    if (!pickupData.id) {
      toast({
        status: "error",
        title: "Some field are missing",
        description: "Please check previous fields",
        position: "top",
      });

      return;
    }

    setCheckingPrice(true);
    priceDisclosure.onOpen();

    try {
      const resp = await Promise.all(
        checkedDLs.map((val) => {
          return getDeliveryPrice({
            pickupCode: pickupData.area,
            dropoffCode: val.area,
            pickupDate: pickupData.date!,
            // pickupGeo: {
            //   lat: "6.637954799999999",
            //   long: "3.5439057",
            // },
            // dropoffGeo: {
            //   lat: "6.459488599999999",
            //   long: "3.4179723",
            // },
          });
        })
      );

      setPrices(resp);
      setCheckingPrice(false);
    } catch (error: any) {
      toast({
        status: "error",
        title: error?.response?.data?.message || "Something went wrong",
      });

      setCheckingPrice(false);
    }
  };

  const onConfirmBooking = async () => {
    setIsBooking(true);
    try {
      const res = await requestDelivery({
        pickup: {
          address: pickupData.address,
          locationCode: pickupData.area,
          pickupName: pickupData.name,
          pickupNumber: pickupData.phone,
          altPickupNumber: pickupData.phone2,
          pickupDate: pickupData.date!,
          note: pickupData.notes,
        },
        drops: checkedDLs.map((op) => ({
          locationCode: op.area,
          address: op.address,
          recipientName: op.name,
          recipientNumber: op.phone,
          altRecipientNumber: op.phone2,
          note: op.notes,
        })),
      });

      // console.log("finallllly", res);
      toast({
        status: "success",
        title: "Booking confirmed!",
      });
      setIsBooking(false);

      priceDisclosure.onClose();
    } catch (error: any) {
      toast({
        status: "error",
        title: error?.response?.data?.message || "Something went wrong",
      });
      setIsBooking(false);
    }

    setIsBooking(false);
  };

  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
      clearTimeout(continueRef.current);
    };
  }, []);

  return (
    <>
      {activeStep === 0 ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setIsSaving(true);

            if (dayjs(pickupData.date).diff(dayjs(), "minute") < 0) {
              toast({
                status: "error",
                title: "Pickup Date should not be an older date",
                position: "top",
              });

              setIsSaving(false);
              return;
            }

            const uid = uuidv4();

            let newObj = { ...pickupData, id: uid };
            setPickupData(newObj);

            continueRef.current = setTimeout(() => {
              setIsSaving(false);
              handleContinue(1);
            }, 1000);
          }}
        >
          <Box mb={8}>
            <CustomH3
              headerProps={{
                mb: 1,
                textTransform: "uppercase",
                fontWeight: 700,
                color: "blackAlpha.700",
              }}
            >
              {`Sender's Details`}
            </CustomH3>
            <Text fontSize={"sm"} fontWeight={500} color={"blackAlpha.600"}>
              Required fields are marked *
            </Text>

            <Stack
              mt={4}
              mb={{ base: 3, md: 6 }}
              w={"full"}
              flexDirection={{ base: "column", md: "row" }}
              gap={{ base: 3, md: 6 }}
            >
              <CustomInput
                dataCy="pickup-input-name"
                inputProps={{
                  type: "text",
                  placeholder: "FULL NAME *",
                  isRequired: true,
                  onChange: (e) => {
                    setPickupData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }));
                  },
                }}
              />

              <CustomInput
                inputProps={{
                  type: "email",
                  placeholder: "EMAIL ADDRESS (optional)",
                  onChange: (e) => {
                    setPickupData((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }));
                  },
                }}
              />
            </Stack>

            <Stack
              w={"full"}
              flexDirection={{ base: "column", md: "row" }}
              gap={{ base: 3, md: 6 }}
            >
              <CustomInput
                dataCy="pickup-input-phone"
                inputProps={{
                  type: "tel",
                  placeholder: "PHONE NUMBER *",
                  isRequired: true,
                  onChange: (e) => {
                    setPickupData((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }));
                  },
                }}
              />

              <CustomInput
                inputProps={{
                  type: "tel",
                  placeholder: "PHONE NUMBER 2 (optional)",
                  onChange: (e) => {
                    setPickupData((prev) => ({
                      ...prev,
                      phone2: e.target.value,
                    }));
                  },
                }}
              />
            </Stack>
          </Box>

          <Box mb={{ base: 8, md: 12 }}>
            <CustomH3
              headerProps={{
                mb: 1,
                textTransform: "uppercase",
                fontWeight: 700,
                color: "blackAlpha.700",
              }}
            >
              {`Pickup Details`}
            </CustomH3>

            <Stack
              mt={4}
              mb={{ base: 3, md: 6 }}
              w={"full"}
              flexDirection={{ base: "column", md: "row" }}
              gap={{ base: 3, md: 6 }}
            >
              <Box w={"full"}>
                <CustomSelect
                  dataCy="pickup-select-state"
                  label="State *"
                  options={statesOps}
                  placeholder="Lagos state"
                  onChange={(value) => {
                    setPickupData((prev) => ({
                      ...prev,
                      state: value?.value,
                    }));
                  }}
                />
              </Box>

              <Box w={"full"}>
                <CustomSelect
                  dataCy="pickup-select-area"
                  label="Area/Landmark *"
                  placeholder="Eg: Surulere"
                  options={
                    areaOps?.find((x) => x.area === deliveryData.state)
                      ?.locals || []
                  }
                  onChange={(value) => {
                    setPickupData((prev) => ({
                      ...prev,
                      area: value?.value,
                    }));
                  }}
                />
              </Box>
            </Stack>

            <Stack
              mt={4}
              mb={{ base: 4, md: 6 }}
              w={"full"}
              flexDirection={{ base: "column", md: "row" }}
              gap={{ base: 3, md: 6 }}
            >
              <Box w={"full"}>
                <CustomInput
                  dataCy="pickup-input-address"
                  label="Street address *"
                  inputProps={{
                    type: "text",
                    placeholder: "No 2 Cliffs Street, Surulere, Lagos",
                    isRequired: true,
                    onChange: (e) => {
                      setPickupData((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }));
                    },
                  }}
                />
              </Box>

              <Box w={"full"}>
                <CustomInput
                  dataCy="pickup-input-date"
                  label="Pickup Date *"
                  inputProps={{
                    type: "date",
                    // placeholder: "No 2 Cliffs Street, Surulere, Lagos",
                    isRequired: true,

                    onChange: (e) => {
                      setPickupData((prev) => ({
                        ...prev,
                        date: dayjs(e.target.value).format("YYYY-MM-DD"),
                      }));
                    },
                  }}
                />
              </Box>
            </Stack>

            <Stack
              mb={2}
              w={"full"}
              flexDirection={"column"}
              gap={{ base: 3, md: 6 }}
            >
              <CustomTextarena
                label="Pickup instructions"
                textareaProps={{
                  placeholder: "Leave a note...",
                  onChange: (e) => {
                    setPickupData((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }));
                  },
                }}
              />
            </Stack>

            <Box>
              <Checkbox
                colorScheme="purple"
                color={"blackAlpha.700"}
                size={"md"}
              >
                <Text as={"span"} fontSize={"sm"}>
                  {" "}
                  Remember this pickup location
                </Text>
              </Checkbox>
            </Box>
          </Box>

          <HStack w={"full"} justifyContent={"center"}>
            <Button
              data-cy="pickup-btn-continue"
              w={"full"}
              size={"md"}
              type={"submit"}
              isLoading={isSaving}
            >
              Continue to delivery
            </Button>
          </HStack>
        </form>
      ) : (
        <>
          <Box mb={{ base: 8, md: 12 }}>
            <CustomH3
              headerProps={{
                mb: 1,
                textTransform: "uppercase",
                fontWeight: 700,
                color: "blackAlpha.700",
              }}
            >
              {`Delivery locations`}
            </CustomH3>
            <Text
              mb={6}
              fontSize={"sm"}
              fontWeight={500}
              color={"blackAlpha.600"}
            >
              Select one or multiple locations for your delivery
            </Text>

            <HStack position={"relative"} w={"full"} spacing={5}>
              <Box
                flexBasis={{ base: "100%", md: "50%" }}
                bg={"#F5F5F5"}
                borderRadius={"lg"}
                pt={2}
              >
                <Box
                  w={"full"}
                  px={3}
                  py={2}
                  height={"320px"}
                  overflowY={"auto"}
                  className="thinSB"
                >
                  <VStack
                    data-cy="delivery-list"
                    w={"full"}
                    h={"full"}
                    justifyContent={
                      savedLocations.length > 0 ? "flex-start" : "center"
                    }
                  >
                    {savedLocations.length > 0 ? (
                      <>
                        {savedLocations.map((op, index) => (
                          <HStack
                            key={index}
                            data-cy={`saved-location`}
                            w={"full"}
                            pl={4}
                            pr={2}
                            py={2}
                            spacing={1}
                            boxShadow={"md"}
                            borderRadius={"md"}
                            border={"1.5px solid transparent"}
                            bg={"white"}
                            position={"relative"}
                          >
                            <Checkbox
                              data-cy={`saved-location-checkbox`}
                              borderRadius={"full"}
                              w={"full"}
                              colorScheme="purple"
                              gap={2}
                              isChecked={
                                checkedDLs.length > 0 &&
                                !!checkedDLs.find((x) => x.id === op.id)
                              }
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setCheckedDLs([...checkedDLs, op]);
                                } else {
                                  let newDLs = [...checkedDLs].filter(
                                    (x) => x.id !== op.id
                                  );
                                  setCheckedDLs(newDLs);
                                }
                              }}
                            >
                              <VStack
                                w={"full"}
                                alignItems={"flex-start"}
                                spacing={"1px"}
                              >
                                <Text
                                  fontWeight={600}
                                  color={"blackAlpha.600"}
                                  fontSize={"xs"}
                                  textTransform={"uppercase"}
                                  fontFamily={"heading"}
                                >
                                  Send to
                                </Text>
                                <Text
                                  data-cy={`saved-location-name`}
                                  noOfLines={1}
                                  fontSize={"sm"}
                                  fontWeight={600}
                                  color={"blackAlpha.800"}
                                >
                                  {op.name}
                                </Text>
                              </VStack>
                            </Checkbox>

                            <IconButton
                              variant={"ghost"}
                              size={"sm"}
                              aria-label="edit delivery location"
                              color={"blackAlpha.600"}
                              icon={<AiFillEdit fontSize={"1.1rem"} />}
                              onClick={() => handleEditDeliveryLocation(op.id)}
                            />
                          </HStack>
                        ))}

                        <Divider
                          mt={5}
                          width={"60px"}
                          borderWidth={1}
                          borderColor={"blackAlpha.300"}
                        />
                        <HStack mt={1} w={"full"} justifyContent={"center"}>
                          <Button
                            data-cy="modal-btn-add-delivery"
                            variant={"ghost"}
                            fontWeight={600}
                            leftIcon={<BsHouseAddFill fontSize={"1.2rem"} />}
                            onClick={() => {
                              setIsEdit(false);
                              setDeliveryData(initDeliveryData);
                              addDisclosure.onOpen();
                            }}
                          >
                            Add new delivery address
                          </Button>
                        </HStack>
                      </>
                    ) : (
                      <Box w={"full"}>
                        <Text
                          mb={1}
                          textAlign={"center"}
                          fontSize={"sm"}
                          fontWeight={500}
                          color={"blackAlpha.800"}
                        >
                          You have no saved delivery address
                        </Text>

                        <HStack w={"full"} justifyContent={"center"}>
                          <Button
                            data-cy="modal-btn-add-delivery"
                            variant={"ghost"}
                            fontWeight={600}
                            leftIcon={<BsHouseAddFill fontSize={"1.2rem"} />}
                            onClick={() => {
                              setIsEdit(false);
                              setDeliveryData(initDeliveryData);
                              addDisclosure.onOpen();
                            }}
                          >
                            Add delivery address
                          </Button>
                        </HStack>
                      </Box>
                    )}
                  </VStack>
                </Box>
              </Box>

              <Box
                flexBasis={{ base: "100%", md: "50%" }}
                display={{ base: "none", md: "block" }}
              >
                <Box w={"fit-content"} ml={"auto"} mt={"20px"} pr={4}>
                  <Image
                    height={"300px"}
                    src={
                      "https://res.cloudinary.com/dqveipmsp/image/upload/v1689730172/others/Coronavirus_Delivery_Preventions_1_kb6unj.gif"
                    }
                    alt={"empty delivery location"}
                  />
                </Box>
              </Box>
            </HStack>
          </Box>

          <HStack w={"full"} justifyContent={"center"} spacing={4}>
            <Button
              w={"full"}
              variant={"outline"}
              maxWidth={"550px"}
              size={"md"}
              onClick={() => handleContinue(0)}
            >
              Previous
            </Button>

            <Button
              data-cy={`delivery-btn-book-now`}
              w={"full"}
              maxWidth={"550px"}
              size={"md"}
              isDisabled={!(checkedDLs.length > 0)}
              onClick={handleBookNow}
            >
              Book Now
            </Button>
          </HStack>
        </>
      )}

      {/* Add Delivery location modal */}
      <CustomModal
        disclosure={addDisclosure}
        // @ts-ignore
        modalProps={{ size: "xl" }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setIsSaving(true);

            if (deliveryData.id) {
              handleSaveLocation(deliveryData);
            } else {
              const uid = uuidv4();

              let newObj = { ...deliveryData, id: uid };
              setDeliveryData(newObj);

              timerRef.current = setTimeout(() => {
                handleSaveLocation(newObj);
              }, 1000);
            }
          }}
        >
          <Box py={8} px={10}>
            <CustomH3
              headerProps={{
                mb: 6,
                pb: 3,
                textTransform: "uppercase",
                fontWeight: 700,
                color: "blackAlpha.700",
                width: "100%",
                textAlign: "center",
                border: "1px solid transparent",
                borderBottomColor: "blackAlpha.200",
              }}
            >
              {isEdit ? "Edit" : "Add"} Delivery Location
            </CustomH3>

            <Box mb={8}>
              <CustomH3
                headerProps={{
                  mb: 1,
                  textTransform: "uppercase",
                  fontWeight: 700,
                  color: "blackAlpha.700",
                }}
              >
                {`RECEIVER'S Details`}
              </CustomH3>
              <Text fontSize={"sm"} fontWeight={500} color={"blackAlpha.600"}>
                Required fields are marked *
              </Text>

              <Stack
                mt={4}
                mb={{ base: 3, md: 6 }}
                w={"full"}
                flexDirection={{ base: "column", md: "row" }}
                gap={{ base: 3, md: 6 }}
              >
                <CustomInput
                  dataCy={`delivery-input-name`}
                  inputProps={{
                    type: "text",
                    placeholder: "FULL NAME *",
                    isRequired: true,
                    value: deliveryData.name,
                    onChange: (e) => {
                      setDeliveryData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }));
                    },
                  }}
                />

                <CustomInput
                  inputProps={{
                    type: "email",
                    placeholder: "EMAIL ADDRESS (optional)",
                    value: deliveryData.email,
                    onChange: (e) => {
                      setDeliveryData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }));
                    },
                  }}
                />
              </Stack>

              <Stack
                w={"full"}
                flexDirection={{ base: "column", md: "row" }}
                gap={{ base: 3, md: 6 }}
              >
                <CustomInput
                  dataCy={`delivery-input-phone`}
                  inputProps={{
                    type: "tel",
                    placeholder: "PHONE NUMBER *",
                    isRequired: true,
                    value: deliveryData.phone,
                    onChange: (e) => {
                      setDeliveryData((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }));
                    },
                  }}
                />

                <CustomInput
                  inputProps={{
                    type: "tel",
                    placeholder: "PHONE NUMBER 2 (optional)",
                    value: deliveryData.phone2,
                    onChange: (e) => {
                      setDeliveryData((prev) => ({
                        ...prev,
                        phone2: e.target.value,
                      }));
                    },
                  }}
                />
              </Stack>
            </Box>

            <Stack
              mt={4}
              mb={{ base: 3, md: 6 }}
              w={"full"}
              flexDirection={{ base: "column", md: "row" }}
              gap={{ base: 3, md: 6 }}
            >
              <Box w={"full"}>
                <CustomSelect
                  dataCy={`delivery-input-state`}
                  label="State *"
                  options={statesOps}
                  placeholder="Lagos state"
                  defaultValue={
                    statesOps.find((x) => x.value === deliveryData.state) ||
                    undefined
                  }
                  onChange={(value) => {
                    setDeliveryData((prev) => ({
                      ...prev,
                      state: value?.value,
                    }));
                  }}
                />
              </Box>

              <Box w={"full"}>
                <CustomSelect
                  dataCy={`delivery-input-area`}
                  label="Area/Landmark *"
                  options={
                    areaOps?.find((x) => x.area === deliveryData.state)
                      ?.locals || []
                  }
                  placeholder="Eg: Surulere"
                  defaultValue={
                    areaOps
                      ?.find((x) => x.area === deliveryData.state)
                      ?.locals.find((a) => a.value === deliveryData.area) ||
                    undefined
                  }
                  onChange={(value) => {
                    setDeliveryData((prev) => ({
                      ...prev,
                      area: value?.value,
                    }));
                  }}
                />
              </Box>
            </Stack>

            <Stack
              mt={4}
              mb={{ base: 4, md: 6 }}
              w={"full"}
              flexDirection={{ base: "column", md: "row" }}
              gap={{ base: 3, md: 6 }}
            >
              <Box w={"full"}>
                <CustomInput
                  dataCy={`delivery-input-address`}
                  label="Street address *"
                  inputProps={{
                    type: "text",
                    placeholder: "No 2 Cliffs Street, Surulere, Lagos",
                    isRequired: true,
                    value: deliveryData.address,
                    onChange: (e) => {
                      setDeliveryData((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }));
                    },
                  }}
                />
              </Box>
            </Stack>

            <Stack
              mb={6}
              w={"full"}
              flexDirection={"column"}
              gap={{ base: 3, md: 6 }}
            >
              <CustomTextarena
                label="Delivery instructions"
                textareaProps={{
                  placeholder: "Leave a note...",
                  value: deliveryData.notes,
                  onChange: (e) => {
                    setDeliveryData((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }));
                  },
                }}
              />
            </Stack>

            <HStack w={"full"} justifyContent={"center"}>
              {isEdit ? (
                <Button
                  w={"full"}
                  maxWidth={"550px"}
                  size={"md"}
                  type={"button"}
                  variant={"outline"}
                  colorScheme="red"
                  isLoading={isSaving}
                  onClick={() => handleDeleteLocation(deliveryData.id)}
                >
                  Delete Location
                </Button>
              ) : null}
              <Button
                data-cy={`delivery-btn-save`}
                w={"full"}
                maxWidth={"550px"}
                size={"md"}
                type={"submit"}
                isLoading={isSaving}
              >
                Save location
              </Button>
            </HStack>
          </Box>
        </form>
      </CustomModal>

      {/* Confirm delivery price */}
      <CustomModal
        disclosure={priceDisclosure}
        onModalClose={() => {
          setPrices([]);
          setCheckedDLs([]);
          setIsBooking(false);
        }}
        // @ts-ignore
        modalProps={{ size: "xl" }}
      >
        <Box py={8} px={10}>
          <CustomH3
            headerProps={{
              mb: 6,
              pb: 3,
              textTransform: "uppercase",
              fontWeight: 700,
              color: "blackAlpha.700",
              width: "100%",
              textAlign: "center",
              border: "1px solid transparent",
              borderBottomColor: "blackAlpha.200",
            }}
          >
            Confirm delivery Price
          </CustomH3>

          <Box w={"full"}>
            <HStack
              w={"full"}
              boxShadow={"md"}
              mb={10}
              borderRadius={"lg"}
              py={3}
              px={5}
              spacing={4}
            >
              <Box color={"yellow.500"}>
                <BiMapPin fontSize={"1.5rem"} />
              </Box>

              <VStack w={"full"} alignItems={"flex-start"} spacing={0}>
                <Text
                  textTransform={"uppercase"}
                  fontWeight={600}
                  color={"blackAlpha.600"}
                  fontSize={"xs"}
                  fontFamily={"heading"}
                  mb={1}
                >
                  Pickup Location
                </Text>

                <Text fontSize={"sm"} fontWeight={600}>
                  {pickupData.address}
                </Text>
              </VStack>
            </HStack>

            <CustomH3
              headerProps={{
                mb: 2,
                textTransform: "uppercase",
                fontWeight: 700,
                fontSize: "sm",
                color: "blackAlpha.600",
              }}
            >
              {`Delivery Price Per Destination`}
            </CustomH3>

            <VStack mb={12} w={"full"} alignItems={"flex-start"}>
              {checkedDLs.map((op, index) => (
                <Box key={index} w={"full"}>
                  <HStack
                    w={"full"}
                    border={"1px solid transparent"}
                    borderBottomColor={"blackAlpha.300"}
                    p={3}
                    spacing={4}
                  >
                    <Box color={"blackAlpha.600"}>
                      <BiMap fontSize={"1.5rem"} />
                    </Box>

                    <VStack w={"full"} alignItems={"flex-start"} spacing={0}>
                      <Text
                        textTransform={"uppercase"}
                        fontWeight={600}
                        color={"blackAlpha.600"}
                        fontSize={"sm"}
                        fontFamily={"heading"}
                        mb={1}
                      >
                        {op.name}
                      </Text>

                      <Text fontSize={"sm"} fontWeight={600}>
                        {op.address}
                      </Text>
                    </VStack>

                    {checkingPrice ? (
                      <Skeleton
                        width={"60px"}
                        height={"18px"}
                        borderRadius={"md"}
                      />
                    ) : (
                      <Text textAlign={"end"} fontSize={"md"} fontWeight={600}>
                        {formatPrice(prices[index]?.price || 0)}
                      </Text>
                    )}
                  </HStack>
                </Box>
              ))}
            </VStack>

            <Button
              data-cy={`btn-confirm-booking`}
              py={5}
              w={"full"}
              isLoading={isBooking}
              onClick={onConfirmBooking}
            >
              Confirm Booking
            </Button>
          </Box>
        </Box>
      </CustomModal>
    </>
  );
}
