import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Image,
  Spacer,
  Text,
} from "@chakra-ui/react";

const Homepage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) navigate("/chats");
  }, [navigate]);

  return (
    <Box bg="#1A1A2E" minH="100vh" color="white">
      {/* Navbar */}
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        wrap="wrap"
        padding="1rem 2rem"
        bg="#1A1A2E"
        borderBottom="1px solid rgba(255,255,255,0.1)"
      >
        <HStack spacing={8}>
          <Text fontSize="2xl" fontWeight="bold" color="yellow.400">🏆</Text>
          <HStack spacing={6} fontWeight="medium">
            {[
              { label: "Home", path: "/" },
              { label: "About", path: "/about" },
              { label: "Our Service", path: "/services" },
              { label: "Portfolio", path: "/portfolio" }
            ].map((item, index) => (
              <Text
                key={index}
                cursor="pointer"
                _hover={{ color: "yellow.400", transform: "scale(1.05)" }}
                transition="all 0.3s ease"
                onClick={() => navigate(item.path)}
              >
                {item.label}
              </Text>
            ))}
          </HStack>
        </HStack>
        <Spacer />
        <HStack spacing={4}>
          <Button
            variant="outline"
            colorScheme="whiteAlpha"
            boxShadow="md"
            _hover={{ bg: "white", color: "#1A1A2E" }}
            transition="all 0.3s ease"
            onClick={() => navigate("/auth?tab=login")}
          >
            Log in
          </Button>
          <Button
            colorScheme="yellow"
            textColor="black"
            boxShadow="lg"
            _hover={{ transform: "scale(1.05)" }}
            transition="all 0.3s ease"
            onClick={() => navigate("/auth?tab=signup")}
          >
            Sign Up
          </Button>
        </HStack>
      </Flex>

      {/* Hero Section */}
      <Container maxW="7xl" py={20}>
        <Flex
          align="center"
          justify="space-between"
          flexWrap="wrap"
          animation="fadeIn 1s ease-in-out"
        >
          {/* Left side - Image */}
          <Box flex="1" minW="300px" textAlign="center">
            <Image
              src="https://cdn-icons-png.flaticon.com/512/4712/4712027.png"
              alt="Chat Bot"
              maxW="300px"
              mx="auto"
              boxShadow="2xl"
              borderRadius="xl"
              transition="transform 0.3s ease"
              _hover={{ transform: "scale(1.05)" }}
            />
          </Box>

          {/* Right side - Text */}
          <Box flex="1" minW="300px" px={8}>
            <Text
              fontSize="6xl"
              fontWeight="bold"
              fontStyle="italic"
              letterSpacing="1px"
              textShadow="2px 2px 8px rgba(0,0,0,0.3)"
            >
              CHAT BOT
            </Text>
            <Text
              fontSize="md"
              opacity={0.85}
              my={4}
              fontFamily="'Poppins', sans-serif"
              lineHeight="1.8"
            >
              Welcome to our website — where innovation meets excellence.  
              We’re dedicated to delivering high-quality services that bring your ideas to life.
            </Text>
            <Button
              size="lg"
              colorScheme="whiteAlpha"
              variant="outline"
              boxShadow="md"
              _hover={{ bg: 'white', color: '#1A1A2E', transform: "scale(1.05)" }}
              transition="all 0.3s ease"
              onClick={() => navigate("/auth")}
            >
              START CHAT
            </Button>
          </Box>
        </Flex>
      </Container>

      {/* CSS Animation */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </Box>
  );
};

export default Homepage;
