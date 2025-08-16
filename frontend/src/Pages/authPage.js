import React from 'react';
import { useLocation } from 'react-router-dom';
import Login from '../Components/Authentication/Login';
import SignUp from '../Components/Authentication/SignUp';
import {
  Box,
  Container,
  TabPanel,
  TabPanels,
  Tabs,
  Flex,
} from "@chakra-ui/react";
const AuthPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const defaultTab = searchParams.get("tab") === "signup" ? 1 : 0;
  return (
    <Flex
      bg="#1A1A2E"
      align="center"
      justify="center"
      minH="100vh"
      w="100%"
    >
      <Box flex="1" p={8} display="flex" alignItems="center">
           <Container maxW="md">
            <Tabs
              isFitted
              variant="soft-rounded"
              colorScheme="yellow"
              defaultIndex={defaultTab}
              bg="#1A1A2E"
              boxShadow="2xl"
              borderRadius="2xl"
            >
              <TabPanels>
                <TabPanel>
                  <Login />
                </TabPanel>
                <TabPanel>
                  <SignUp />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Container>
        </Box>

    </Flex>
  );
};

export default AuthPage;