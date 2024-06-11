import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import IonIcons from 'react-native-vector-icons/Ionicons';

const UserItem = ({ profilePic, username, selected, onSelect }:any) => {
  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        <Image source={{ uri: profilePic }} style={styles.profilePic} />
        <Text style={styles.username}>{username}</Text>
      </View>
      <TouchableOpacity style={styles.selectButton} onPress={onSelect}>
        <IonIcons
          name={selected ? 'checkmark-circle' : 'checkmark-circle-outline'}
          size={24}
          color={selected ? '#007AFF' : '#8D8D8D'}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#D9D9D9',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  username: {
    fontSize: 16,
    color: '#333333',
  },
  selectButton: {
    marginLeft: 12,
  },
});

export default UserItem;