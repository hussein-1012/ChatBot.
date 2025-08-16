import React, { useState } from 'react';
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  useToast,
  Box,
  Heading,
} from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../../Context/chatProvider';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const { setUser } = useChat();

  const handleClick = () => setShow(!show);

  const submitHandler = async () => {
    setLoading(true);

    if (!email || !password) {
      toast({
        title: 'Please fill all the fields',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      };

      const { data } = await axios.post('/api/user/login', { email, password }, config);

      toast({
        title: 'Login Successful',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);

      setLoading(false);
      navigate('/chats');
    } catch (error) {
      toast({
        title: 'Error Occurred!',
        description: error.response?.data?.message || error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  return (
    <Box
      bg="#1A1A2E"
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      color="white"
      px={4}
    >
      <Box
        bg="rgba(255,255,255,0.05)"
        p={8}
        borderRadius="lg"
        boxShadow="xl"
        maxW="500px"
        w="100%"
      >
        <Heading
          textAlign="center"
          mb={6}
          color="yellow.400"
          fontWeight="bold"
        >
          Welcome Back
        </Heading>

        <VStack spacing="20px">
          <FormControl id="email" isRequired>
            <FormLabel color="yellow.300">Email Address</FormLabel>
            <Input
              value={email}
              type="email"
              placeholder="Enter Your Email Address"
              onChange={(e) => setEmail(e.target.value)}
              bg="rgba(255,255,255,0.1)"
              border="1px solid rgba(255,255,255,0.2)"
              _focus={{ borderColor: 'yellow.400', boxShadow: '0 0 5px yellow' }}
              color="white"
            />
          </FormControl>

          <FormControl id="password" isRequired>
            <FormLabel color="yellow.300">Password</FormLabel>
            <InputGroup size="md">
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={show ? 'text' : 'password'}
                placeholder="Enter password"
                bg="rgba(255,255,255,0.1)"
                border="1px solid rgba(255,255,255,0.2)"
                _focus={{ borderColor: 'yellow.400', boxShadow: '0 0 5px yellow' }}
                color="white"
              />
              <InputRightElement width="4.5rem">
                <Button
                  h="1.75rem"
                  size="sm"
                  onClick={handleClick}
                  colorScheme="yellow"
                  variant="ghost"
                >
                  {show ? 'Hide' : 'Show'}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <Button
            bgGradient="linear(to-r, yellow.400, yellow.500)"
            color="black"
            fontWeight="bold"
            width="100%"
            _hover={{ bgGradient: 'linear(to-r, yellow.300, yellow.400)', transform: 'scale(1.02)' }}
            transition="0.3s"
            onClick={submitHandler}
            isLoading={loading}
          >
            Login
          </Button>

          <Button
            variant="outline"
            colorScheme="yellow"
            width="100%"
            onClick={() => {
              setEmail('guest@example.com');
              setPassword('123456');
            }}
            _hover={{ bg: 'yellow.400', color: 'black' }}
          >
            Get Guest User Credentials
          </Button>
        </VStack>
      </Box>
    </Box>
  );
};

export default Login;
