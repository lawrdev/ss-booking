import { ReactNode } from "react";
import { Heading, HeadingProps } from "@chakra-ui/react";

export const CustomH3 = ({
  children,
  headerProps,
}: {
  children: ReactNode;
  headerProps?: HeadingProps;
}) => {
  return (
    <Heading
      as={"h3"}
      color={"blackAlpha.900"}
      fontWeight={600}
      fontFamily={"heading"}
      size={"sm"}
      {...headerProps}
    >
      {children}
    </Heading>
  );
};

export const CustomH2 = ({
  children,
  headerProps,
}: {
  children: ReactNode;
  headerProps?: HeadingProps;
}) => {
  return (
    <Heading
      as={"h2"}
      color={"blackAlpha.900"}
      fontWeight={600}
      fontFamily={"heading"}
      letterSpacing={"wide"}
      size={"md"}
      {...headerProps}
    >
      {children}
    </Heading>
  );
};

export const CustomH1 = ({
  children,
  headerProps,
}: {
  children: ReactNode;
  headerProps?: HeadingProps;
}) => {
  return (
    <Heading
      as={"h1"}
      color={"blackAlpha.900"}
      fontWeight={600}
      fontFamily={"heading"}
      letterSpacing={"wide"}
      size={"lg"}
      {...headerProps}
    >
      {children}
    </Heading>
  );
};
