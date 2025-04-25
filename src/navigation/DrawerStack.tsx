/**
 * @file DrawerStack.tsx
 * @description This file contains the DrawerStack component which is used to create a drawer navigator for the app.
 * @author Anil Bhandari
 */

import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomDrawer from '../screens/Job_provider/custom_drawer/CustomDrawer';
import MyMileStone from '../screens/Job_provider/MyMileStone';
import MyReview from '../screens/Job_provider/MyReview';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ButtonNavigator from './ButtonNavigator';
import MyProfile from '../screens/Job_seeker/MyProfile';
import MyJobs from '../screens/Job_provider/MyJobs';
import CompletedJobs from '../screens/Job_provider/CompletedJobs';
import PhoneVerification from '../screens/Job_seeker/phone_verification/PhoneVerification';

const Drawer = createDrawerNavigator();

/**
 * 
 * @returns {JSX.Element} - Returns the DrawerStack component which contains the drawer navigator.
 * @description This component is used to create a drawer navigator for the app. It contains the following screens:
 * - Home: ButtonNavigator
 * - My_Profile: MyProfile
 * - My_Jobs: MyJobs
 * - Payment: CompletedJobs
 * - Milestone: MyMileStone
 * - Review: MyReview
 * - Phone_Verify: PhoneVerification (invisible)
 */
const DrawerStack = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: '#79AC78',
        drawerActiveTintColor: '#fff',
        drawerInactiveTintColor: '#333',
        drawerLabelStyle: {
          marginLeft: -20,
          fontFamily: 'Montserrat-SemiBold',
          fontSize: 15,
        },
      }}>
      <Drawer.Screen
        name="Home"
        component={ButtonNavigator}
        options={{
          drawerIcon: ({color}) => (
            <Ionicons name="home-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="My_Profile"
        component={MyProfile}
        options={{
          drawerIcon: ({color}) => (
            <Ionicons name="person-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="My_Jobs"
        component={MyJobs}
        options={{
          drawerIcon: ({color}) => (
            <Octicons name="workflow" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Payment"
        component={CompletedJobs}
        options={{
          drawerIcon: ({color}) => (
            <MaterialIcons name="payment" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Milestone"
        component={MyMileStone}
        options={{
          drawerIcon: ({color}) => (
            <Octicons name="milestone" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Review"
        component={MyReview}
        options={{
          drawerIcon: ({color}) => (
            <Octicons name="code-review" size={22} color={color} />
          ),
        }}
      />
      {/*  invisible  */}
      <Drawer.Screen
        name="Phone_Verify"
        component={PhoneVerification}
        options={{
          drawerLabel: () => null,
          drawerIcon: () => null,
          drawerItemStyle: {
            display: 'none',
          },
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerStack;
