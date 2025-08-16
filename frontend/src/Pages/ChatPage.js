import { Box } from "@chakra-ui/react";
import SideDrawer from "../Components/Authentication/miscellaneous/SideDrawer";
import { useChat } from '../Context/chatProvider';
import MyChats from "../Components/mychat";
import ChatBox from "../Components/chatBox";
import { useState } from "react";

const ChatPage = () => {
    const { user } = useChat();
    const [fetchAgain,setFetchAgain] = useState(false);
    return (
        <div style= {{width: "100%",color : 'white' }}>
            {user && <SideDrawer />}
            <Box color={'white'} display="flex" justifyContent='space-between' w= '100%' h= '91.5vh' p= '10px'>
                {user && 
                <MyChats fetchAgain={fetchAgain} />}
                {user && 
                <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
            </Box>
        </div>
    );
};

export default ChatPage;
