import Select, { StylesConfig, components } from "react-select";
import { useId } from "react";
import { SelectOptionsType } from "@/helpers/types";
import {
  FormControl,
  FormControlProps,
  FormLabel,
  FormLabelProps,
} from "@chakra-ui/react";

type IsMulti = false;

export function CustomSelect({
  options,
  onChange,
  placeholder,
  defaultValue,
  formControlProps,
  formErrorMessage,
  label,
  labelProps,
  dataCy,
}: {
  options: SelectOptionsType[];
  onChange: (value: any) => void;
  placeholder?: string;
  defaultValue?: SelectOptionsType;
  formControlProps?: FormControlProps;
  formErrorMessage?: string;
  label?: string;
  labelProps?: FormLabelProps;
  dataCy?: string;
}) {
  const customStyles: StylesConfig<SelectOptionsType, IsMulti> = {
    option: (defaultStyles, state) => ({
      ...defaultStyles,
      zIndex: 500,
      cursor: "pointer",
      color: state.isSelected ? "#fff" : "#555",

      backgroundColor: state.isSelected ? "#A513E2" : "none",
      ":hover": {
        color: state.isSelected ? "#fff" : "#111",
        backgroundColor: state.isSelected ? "#A513E2" : "#ddd",
      },
    }),
    placeholder: (defaultStyles) => {
      return {
        ...defaultStyles,
        color: "#718096",
        fontWeight: 500,
      };
    },
    control: (defaultStyles, state) => ({
      ...defaultStyles,
      backgroundColor: "#eeeeee20",
      padding: "6px",
      zIndex: 500,
      width: "100%",
      minWidth: "100%",

      border: state.isFocused ? "1px solid #A513E2" : "1px solid #eee",
      boxShadow: "none",
      borderRadius: "6px",
      ":hover": {
        borderColor: state.isFocused ? "#A513E2" : "#ddd",
      },
    }),
    singleValue: (defaultStyles) => ({
      ...defaultStyles,
      color: "#111",
      fontWeight: 600,
      fontSize: "14px",
    }),
    menu: (base) => ({
      ...base,
      //   width: "100%",
      //   minWidth: "100%",
      zIndex: 550,
    }),
  };

  const Input = (props: any) => {
    return <components.Input data-cy={dataCy} {...props} />;
  };

  return (
    <FormControl {...formControlProps}>
      {label ? (
        <FormLabel mb={1} fontWeight={600} fontSize={"sm"} {...labelProps}>
          {label}
        </FormLabel>
      ) : null}

      <Select
        components={{ Input }}
        classNamePrefix={"react-select"}
        placeholder={placeholder ? placeholder : "Select *"}
        defaultValue={defaultValue}
        options={options}
        styles={customStyles}
        onChange={(val) => onChange(val)}
        instanceId={useId()}
        required
      />
    </FormControl>
  );
}
