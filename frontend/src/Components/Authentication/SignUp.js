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

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [picLoading, setPicLoading] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  const [password, setPassword] = useState('');
  const [pic, setPic] = useState();

  const toast = useToast();
  const navigate = useNavigate();
  const { setUser } = useChat();

  const postDetails = (pics) => {
    setPicLoading(true);
    if (pics === undefined) {
      toast({
        title: 'Please select an image!',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      setPicLoading(false);
      return;
    }

    if (pics.type === 'image/jpeg' || pics.type === 'image/png') {
      const data = new FormData();
      data.append('file', pics);
      data.append('upload_preset', 'chat-app');
      data.append('cloud_name', 'demo');
      fetch('https://api.cloudinary.com/v1_1/demo/image/upload', {
        method: 'post',
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          setPicLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setPicLoading(false);
        });
    } else {
      toast({
        title: 'Please select an image!',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      setPicLoading(false);
      return;
    }
  };

  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !password ) {
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

      const { data } = await axios.post(
        '/api/user',
        { name, email, password, pic },
        config
      );

      toast({
        title: 'Registration Successful',
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
        <Heading textAlign="center" mb={6} color="yellow.400" fontWeight="bold">
          Create Account
        </Heading>

        <VStack spacing="20px">
          <FormControl id="first-name" isRequired>
            <FormLabel color="yellow.300">Name</FormLabel>
            <Input
              placeholder="Enter Your Name"
              onChange={(e) => setName(e.target.value)}
              bg="rgba(255,255,255,0.1)"
              border="1px solid rgba(255,255,255,0.2)"
              _focus={{ borderColor: 'yellow.400', boxShadow: '0 0 5px yellow' }}
              color="white"
            />
          </FormControl>

          <FormControl id="email" isRequired>
            <FormLabel color="yellow.300">Email Address</FormLabel>
            <Input
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
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter Password"
                onChange={(e) => setPassword(e.target.value)}
                bg="rgba(255,255,255,0.1)"
                border="1px solid rgba(255,255,255,0.2)"
                _focus={{ borderColor: 'yellow.400', boxShadow: '0 0 5px yellow' }}
                color="white"
              />
              <InputRightElement width="4.5rem">
                <Button
                  h="1.75rem"
                  size="sm"
                  onClick={() => setShowPassword(!showPassword)}
                  colorScheme="yellow"
                  variant="ghost"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <Button
            bgGradient="linear(to-r, yellow.400, yellow.500)"
            color="black"
            fontWeight="bold"
            width="100%"
            _hover={{
              bgGradient: 'linear(to-r, yellow.300, yellow.400)',
              transform: 'scale(1.02)',
            }}
            transition="0.3s"
            onClick={submitHandler}
            isLoading={loading || picLoading}
          >
            Sign Up
          </Button>
        </VStack>
      </Box>
    </Box>
  );
};

export default SignUp;
