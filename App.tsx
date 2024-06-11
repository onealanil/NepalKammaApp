import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import AppStack from './src/navigation/AppStack';
import AppProvider from './src/contexts/AppProvider';
import {requestUserPermission} from './src/utils/notificationService';
import {LogBox} from 'react-native';

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
