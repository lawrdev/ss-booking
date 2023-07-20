import { DisclosureProps } from "@/helpers/types";
import {
  Button,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  ModalOverlayProps,
  ModalProps,
  useDisclosure,
} from "@chakra-ui/react";

interface Props {
  disclosure: DisclosureProps;
  children: React.ReactNode;
  modalProps?: ModalProps;
  modalOverlay?: ModalOverlayProps;
  onModalClose?: () => void;
}

export function CustomModal({
  disclosure,
  children,
  modalOverlay,
  modalProps,
  onModalClose,
}: Props) {
  return (
    <>
      <Modal
        isOpen={disclosure.isOpen}
        onClose={disclosure.onClose}
        onCloseComplete={onModalClose}
        {...modalProps}
      >
        <ModalOverlay {...modalOverlay} />
        <ModalContent mx={"12px"} overflow={"hidden"}>
          <ModalCloseButton />
          {children}
        </ModalContent>
      </Modal>
    </>
  );
}
