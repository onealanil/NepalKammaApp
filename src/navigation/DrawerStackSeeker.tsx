/**
 * @file DrawerStackSeeker.tsx
 * @description This file contains the DrawerStackSeeker component, which is a React Navigation drawer navigator for the job seeker. It includes various screens such as Home, My Profile, My Review, Top Buyer, Completed Jobs, and Saved Jobs. The component uses custom icons from Ionicons, Octicons, FontAwesome, and MaterialCommunityIcons.
 * @author Anil Bhandari
 */

import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomDrawerSeeker from '../screens/Job_seeker/custom_drawer/CustomDrawerSeeker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MyProfile from '../screens/Job_seeker/MyProfile';
import TopBuyer from '../screens/Job_seeker/TopBuyer';
import PhoneVerification from '../screens/Job_seeker/phone_verification/PhoneVerification';
import CompletedJobs from '../screens/Job_seeker/CompletedJobs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SavedJobs from '../screens/Job_seeker/SavedJobs';
import MyReview from '../screens/Job_provider/MyReview';
import ButtonNavigatorSeeker from './ButtonNavigatorSeeker';
import {savedJobsProps} from '../types/interfaces/ISavedJobsProps';

const Drawer = createDrawerNavigator();

/**
 *
 * @param {bottomNavigation} - The bottom navigation prop passed to the component.
 * @returns {JSX.Element} - The DrawerStackSeeker component.
 * @description This component sets up a drawer navigator for the job seeker. It contains the following screens:
 * - Home: ButtonNavigatorSeeker
 * - My_Profile: MyProfile
 * - My_Review: MyReview
 * - Top_Buyer: TopBuyer
 * - Completed Jobs: CompletedJobs
 * - Saved Jobs: SavedJobs
 * - Phone_Verify: PhoneVerification (invisible)
 *
 */
const DrawerStackSeeker = ({bottomNavigation}: savedJobsProps) => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={props => <CustomDrawerSeeker {...props} />}
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
        component={ButtonNavigatorSeeker}
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
          title: 'Profile',
        }}
      />
      <Drawer.Screen
        name="My_Review"
        component={MyReview}
        options={{
          drawerIcon: ({color}) => (
            <Octicons name="code-review" size={22} color={color} />
          ),
          title: 'Review',
        }}
      />
      <Drawer.Screen
        name="Top_Buyer"
        // component={TopBuyer}
        options={{
          drawerIcon: ({color}) => (
            <FontAwesome name="buysellads" size={22} color={color} />
          ),
          title: 'Top Buyer',
        }}>
        {props => <TopBuyer {...props} bottomNavigation={props.navigation} />}
      </Drawer.Screen>
      <Drawer.Screen
        name="Completed Jobs"
        component={CompletedJobs}
        options={{
          drawerIcon: ({color}) => (
            <Octicons name="workflow" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Saved Jobs"
        // component={SavedJobs}
        options={{
          drawerIcon: ({color}) => (
            <MaterialCommunityIcons
              className="w-[30%] mt-2"
              name="content-save-all"
              size={20}
              color={color}
            />
          ),
        }}>
        {props => <SavedJobs {...props} bottomNavigation={props.navigation} />}
      </Drawer.Screen>

      {/*  invisible  */}
      <Drawer.Screen
        name="Phone_Verify"
        children={props => (
          <PhoneVerification
            {...props}
            route={{
              ...props.route,
              params: {id: 'default-id'},
            }}
          />
        )}
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

export default DrawerStackSeeker;
