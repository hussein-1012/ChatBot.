import React from "react";
import { Box, Container, Text } from "@chakra-ui/react";

const PortfolioPage = () => {
  return (
    <Box minH="100vh" color="white" py={20}>
      <Container maxW="4xl">
        <Text fontSize="4xl" fontWeight="bold" mb={4}>
          Portfolio
        </Text>
        <Text fontSize="lg" opacity={0.8}>
          Here are some of our previous chatbot projects and integrations.
        </Text>
      </Container>
    </Box>
  );
};

export default PortfolioPage;
