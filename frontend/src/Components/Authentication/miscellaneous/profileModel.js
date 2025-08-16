import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Image,
  Text,
} from '@chakra-ui/react';
import React from 'react';

const ProfileModal = ({ user, isOpen, onClose }) => {
  return (
    <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay bg="rgba(0, 0, 0, 0.6)" />
      <ModalContent
        bg="#1A1A2E"
        color="white"
        borderRadius="lg"
        boxShadow="dark-lg"
        p={4}
      >
        <ModalHeader
          fontSize="28px"
          fontWeight="bold"
          display="flex"
          justifyContent="center"
        >
          {user?.name}
        </ModalHeader>
        <ModalCloseButton color="white" _hover={{ color: "#F6E05E" }} />
        <ModalBody
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          gap={4}
        >
          <Text
            fontSize={{ base: "18px", md: "20px" }}
            color="gray.300"
            textAlign="center"
          >
            Email: <span style={{ color: "#F6E05E" }}>{user?.email}</span>
          </Text>
        </ModalBody>

        <ModalFooter>
          <Button
            onClick={onClose}
            bg="#F6E05E"
            _hover={{ bg: "#ECC94B" }}
            color="#1A1A2E"
            fontWeight="bold"
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ProfileModal;
