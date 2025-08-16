import React from "react";
import { Box, Container, Text } from "@chakra-ui/react";

const AboutPage = () => {
  return (
    <Box minH="100vh" color="white" py={20}>
      <Container maxW="4xl">
        <Text fontSize="4xl" fontWeight="bold" mb={4}>
          About Us
        </Text>
        <Text fontSize="lg" opacity={0.8}>
          We are a team passionate about building intelligent chatbot solutions
          to make communication smarter, faster, and easier.
        </Text>
      </Container>
    </Box>
  );
};

export default AboutPage;
