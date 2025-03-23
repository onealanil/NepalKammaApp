import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { BottomStackParamsList } from "../ButtonNavigatorTypes";

export interface ActualMessageProps {
    navigation: BottomTabNavigationProp<BottomStackParamsList>;
    route: { params: { conversation_id: string } };
}

export interface User {
    _id: string;
    profilePic: {
        public_id: string;
        url: string;
    };
    username: string;
}

export interface Message {
    __v: number;
    _id: string;
    conversationId: string;
    createdAt: string;
    msg: string;
    senderId: string;
    updatedAt: string;
    recipientId: string;
}

export interface ApiResponse {
    otheruser: User;
    result: Message[];
}