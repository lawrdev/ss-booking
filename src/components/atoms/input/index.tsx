import {
  FormControl,
  FormControlProps,
  FormErrorIcon,
  FormErrorMessage,
  FormLabel,
  FormLabelProps,
  Input,
  InputProps,
  Textarea,
  TextareaProps,
} from "@chakra-ui/react";

export const CustomInput = ({
  formControlProps,
  inputProps,
  formErrorMessage,
  label,
  labelProps,
}: {
  inputProps: InputProps;
  formControlProps?: FormControlProps;
  formErrorMessage?: string;
  label?: string;
  labelProps?: FormLabelProps;
}) => {
  return (
    <FormControl {...formControlProps}>
      {label ? (
        <FormLabel mb={1} fontWeight={600} fontSize={"sm"} {...labelProps}>
          {label}
        </FormLabel>
      ) : null}

      <Input
        size={"lg"}
        focusBorderColor={"purple.300"}
        borderRadius={"lg"}
        bg={"#eeeeee20"}
        fontWeight={500}
        fontSize={"sm"}
        _disabled={{
          color: "#a1a1a1",
          cursor: "not-allowed",
        }}
        _placeholder={{ fontSize: "sm" }}
        {...inputProps}
      />

      <FormErrorMessage>
        <FormErrorIcon /> {formErrorMessage}
      </FormErrorMessage>
    </FormControl>
  );
};

export const CustomTextarena = ({
  formControlProps,
  textareaProps,
  formErrorMessage,
  label,
  labelProps,
}: {
  textareaProps: TextareaProps;
  formControlProps?: FormControlProps;
  formErrorMessage?: string;
  label?: string;
  labelProps?: FormLabelProps;
}) => {
  return (
    <FormControl {...formControlProps}>
      {label ? (
        <FormLabel mb={1} fontWeight={600} fontSize={"sm"} {...labelProps}>
          {label}
        </FormLabel>
      ) : null}

      <Textarea
        size={"lg"}
        focusBorderColor={"purple.300"}
        borderRadius={"lg"}
        bg={"#eeeeee20"}
        fontWeight={500}
        fontSize={"sm"}
        _disabled={{
          color: "#a1a1a1",
          cursor: "not-allowed",
        }}
        _placeholder={{ fontSize: "sm" }}
        {...textareaProps}
      />

      <FormErrorMessage>
        <FormErrorIcon /> {formErrorMessage}
      </FormErrorMessage>
    </FormControl>
  );
};
