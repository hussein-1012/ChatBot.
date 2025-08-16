import React from "react";
import { Box, Container, Text, UnorderedList, ListItem } from "@chakra-ui/react";

const OurServicePage = () => {
  return (
    <Box minH="100vh" color="white" py={20}>
      <Container maxW="4xl">
        <Text fontSize="4xl" fontWeight="bold" mb={4}>
          Our Services
        </Text>
        <UnorderedList spacing={3} fontSize="lg" opacity={0.8}>
          <ListItem>Custom Chatbot Development</ListItem>
          <ListItem>AI & Machine Learning Integration</ListItem>
          <ListItem>24/7 Technical Support</ListItem>
        </UnorderedList>
      </Container>
    </Box>
  );
};

export default OurServicePage;
