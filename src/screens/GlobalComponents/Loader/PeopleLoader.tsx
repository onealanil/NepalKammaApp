import React from 'react';
import {View, StyleSheet} from 'react-native';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import {responsiveHeight} from 'react-native-responsive-dimensions';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const PeopleLoader = () => {
  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        <View style={styles.profileContainer}>
          <ShimmerPlaceholder style={styles.profilePicPlaceholder} />
          <View style={styles.detailsContainer}>
            <View style={styles.nameContainer}>
              <ShimmerPlaceholder style={styles.namePlaceholder} />
              <ShimmerPlaceholder style={styles.verifiedIconPlaceholder} />
            </View>
            <ShimmerPlaceholder style={styles.titlePlaceholder} />
          </View>
        </View>
        <ShimmerPlaceholder style={styles.viewButtonPlaceholder} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: responsiveHeight(2),
    width: '100%',
    paddingHorizontal: responsiveHeight(2),
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePicPlaceholder: {
    width: responsiveHeight(8),
    height: responsiveHeight(8),
    borderRadius: responsiveHeight(4),
  },
  detailsContainer: {
    marginLeft: responsiveHeight(3),
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsiveHeight(0.5),
  },
  namePlaceholder: {
    width: responsiveHeight(6),
    height: responsiveHeight(2.5),
    borderRadius: responsiveHeight(1.25),
    marginRight: responsiveHeight(1),
  },
  verifiedIconPlaceholder: {
    width: responsiveHeight(2.5),
    height: responsiveHeight(2.5),
    borderRadius: responsiveHeight(1.25),
  },
  titlePlaceholder: {
    width: responsiveHeight(8),
    height: responsiveHeight(2),
    borderRadius: responsiveHeight(1),
  },
  viewButtonPlaceholder: {
    width: responsiveHeight(5),
    height: responsiveHeight(2.5),
    borderRadius: responsiveHeight(1.25),
  },
});

export default PeopleLoader;
