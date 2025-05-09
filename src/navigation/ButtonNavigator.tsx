/**
 * @file ButtonNavigator.tsx
 * @description This file contains the bottom tab navigator for the app.
 * @author Anil Bhandari
 */

import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {JobProvider} from '../screens';
import Create from '../screens/Job_provider/Create';
import Message from '../screens/Job_provider/Message';
import Notifications from '../screens/Job_seeker/Notifications';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import People from '../screens/Job_provider/Search';
import OtherProfile from '../screens/Job_provider/OtherProfile';
import ActualMessage from '../screens/Job_seeker/ActualMessage';
import {useMessageStore} from '../global/MessageCount';
import {useNotificationCount} from '../global/NotificationCount';

const Tab = createBottomTabNavigator();
/**
 *
 * @returns {JSX.Element} - Returns the bottom tab navigator with the screens.
 * @description This component contains the bottom tab navigator for the app. It includes the following screens:
 * 1. Home (JobProvider)
 * 2. Peoples (People)
 * 3. Create (Create)
 * 4. Message (Message)
 * 5. Notification (Notifications)
 * 6. Other_Profile (OtherProfile)
 * 7. Actual_Message (ActualMessage)
 * @note The tab bar is hidden for the Other_Profile and Actual_Message screens.
 * @note The tab bar badge is shown for the Message and Notification screens if there are unread messages or notifications.
 *
 */
const ButtonNavigator = () => {
  const messageCount = useMessageStore(state => state.messageCount);
  const notificationCount = useNotificationCount(
    state => state.notificationCount,
  );

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {backgroundColor: '#fff'},
        tabBarInactiveBackgroundColor: '#fff',
        tabBarActiveTintColor: '#79AC78',
      }}>
      <Tab.Screen
        name="Home_bottom"
        // component={JobProvider}
        options={{
          tabBarIcon: ({color}) => (
            <Ionicons name="home-outline" size={25} color={color} />
          ),
        }}>
        {props => (
          <JobProvider {...props} bottomNavigation={props.navigation} />
        )}
      </Tab.Screen>
      <Tab.Screen
        name="Peoples"
        component={People}
        options={{
          tabBarIcon: ({color}) => (
            <Ionicons name="people" size={25} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Create"
        component={Create}
        options={{
          tabBarIcon: ({color}) => (
            <Ionicons name="add-circle-sharp" size={40} color={'#79AC78'} />
          ),
        }}
      />
      <Tab.Screen
        name="Message"
        component={Message}
        options={{
          tabBarIcon: ({color}) => (
            <Feather name="message-circle" size={25} color={color} />
          ),
          tabBarBadge: messageCount > 0 ? messageCount : undefined,
        }}
      />
      <Tab.Screen
        name="Notification"
        component={Notifications}
        options={{
          tabBarIcon: ({color}) => (
            <Ionicons name="notifications-outline" size={25} color={color} />
          ),
          tabBarBadge: notificationCount > 0 ? notificationCount : undefined,
        }}
      />
      <Tab.Screen
        name="Other_Profile"
        component={OtherProfile}
        options={() => ({
          tabBarButton: () => null,
          tabBarVisible: false,
        })}
      />
      <Tab.Screen
        name="Actual_Message"
        component={ActualMessage}
        options={() => ({
          tabBarButton: () => null,
          tabBarVisible: false,
        })}
      />
    </Tab.Navigator>
  );
};

export default ButtonNavigator;
