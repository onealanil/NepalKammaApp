/**
 * @format
 * @flow strict-local
 * @file App.tsx
 * @description Main entry point of the application. 
 * This file sets up the navigation, context providers, and other global configurations.
 * It initializes the app by requesting user permissions for notifications and ignoring specific log messages.
 * It also renders the main application stack and toast notifications.
 * @author Anil Bhandari
 * @date 2023-10-01
 */

import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import AppStack from './src/navigation/AppStack';
import AppProvider from './src/contexts/AppProvider';
import {requestUserPermission} from './src/utils/notificationService';
import {LogBox} from 'react-native';

/**
 * 
 * @returns {JSX.Element} The main App component.
 * This component sets up the navigation container and context providers.
  * It also requests user permissions for notifications and ignores specific log messages.
  * It renders the main application stack and toast notifications.
  * @description Main entry point of the application.
  * 
 */
function App(): JSX.Element {
  React.useEffect(() => {
    requestUserPermission();

    LogBox.ignoreAllLogs();
    LogBox.ignoreLogs(['ReactImageView']);
  }, []);

  return (
    <>
      {/* <SocketProvider> */}
      {/* <UserProvider> */}
      <AppProvider>
        <NavigationContainer>
          <AppStack />
          {/* <DrawerStack /> */}
        </NavigationContainer>
        <Toast />
      </AppProvider>
      {/* </UserProvider> */}
      {/* </SocketProvider> */}
    </>
  );
}

export default App;
