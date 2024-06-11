import React from 'react';
import {View, StyleSheet} from 'react-native';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import LinearGradient from 'react-native-linear-gradient';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const OtherScreenLoader = () => {
  return (
    <View style={styles.container}>
      <View style={styles.backButtonContainer}>
        <ShimmerPlaceholder style={styles.backButtonPlaceholder} />
      </View>

      <View style={styles.profileContainer}>
        <View style={styles.profilePicContainer}>
          <ShimmerPlaceholder style={styles.profilePicPlaceholder} />
        </View>

        <View style={styles.detailsContainer}>
          <ShimmerPlaceholder style={styles.namePlaceholder} />
          <View style={styles.ratingContainer}>
            <ShimmerPlaceholder style={styles.ratingIconPlaceholder} />
            <ShimmerPlaceholder style={styles.ratingTextPlaceholder} />
          </View>
          <ShimmerPlaceholder style={styles.bioPlaceholder} />
          <View style={styles.locationContainer}>
            <ShimmerPlaceholder style={styles.locationIconPlaceholder} />
            <ShimmerPlaceholder style={styles.locationTextPlaceholder} />
          </View>
        </View>
      </View>

      <View style={styles.buttonsContainer}>
        <ShimmerPlaceholder style={styles.buttonPlaceholder} />
        <ShimmerPlaceholder style={styles.buttonPlaceholder} />
        <ShimmerPlaceholder style={styles.buttonPlaceholder} />
      </View>

      <View style={styles.detailsSection}>
        <ShimmerPlaceholder style={styles.sectionTitlePlaceholder} />
        <ShimmerPlaceholder style={styles.sectionContentPlaceholder} />
      </View>

      <View style={styles.jobsSection}>
        <ShimmerPlaceholder style={styles.sectionTitlePlaceholder} />
        <View style={styles.jobsContainer}>
          <ShimmerPlaceholder style={styles.jobPlaceholder} />
        </View>
        <ShimmerPlaceholder style={styles.buttonPlaceholder} />
      </View>
      <View style={styles.jobsSection}>
        <ShimmerPlaceholder style={styles.sectionTitlePlaceholder} />
        <View style={styles.jobsContainer}>
          <ShimmerPlaceholder style={styles.jobPlaceholder} />
        </View>
        <ShimmerPlaceholder style={styles.buttonPlaceholder} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: responsiveHeight(2),
    backgroundColor: 'white',
  },
  backButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsiveHeight(2),
  },
  backButtonPlaceholder: {
    width: responsiveWidth(20),
    height: responsiveHeight(3),
    borderRadius: responsiveHeight(1),
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsiveHeight(4),
  },
  profilePicContainer: {
    marginRight: responsiveWidth(5),
  },
  profilePicPlaceholder: {
    width: responsiveHeight(10),
    height: responsiveHeight(10),
    borderRadius: responsiveHeight(5),
  },
  detailsContainer: {
    flex: 1,
  },
  namePlaceholder: {
    width: responsiveWidth(60),
    height: responsiveHeight(3),
    borderRadius: responsiveHeight(1.5),
    marginBottom: responsiveHeight(1),
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsiveHeight(1),
  },
  ratingIconPlaceholder: {
    width: responsiveHeight(2),
    height: responsiveHeight(2),
    borderRadius: responsiveHeight(1),
    marginRight: responsiveWidth(1),
  },
  ratingTextPlaceholder: {
    width: responsiveWidth(10),
    height: responsiveHeight(2),
    borderRadius: responsiveHeight(1),
  },
  bioPlaceholder: {
    width: responsiveWidth(60),
    height: responsiveHeight(4),
    borderRadius: responsiveHeight(2),
    marginBottom: responsiveHeight(1),
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIconPlaceholder: {
    width: responsiveHeight(2),
    height: responsiveHeight(2),
    borderRadius: responsiveHeight(1),
    marginRight: responsiveWidth(1),
  },
  locationTextPlaceholder: {
    width: responsiveWidth(20),
    height: responsiveHeight(2),
    borderRadius: responsiveHeight(1),
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: responsiveHeight(4),
  },
  buttonPlaceholder: {
    width: responsiveWidth(25),
    height: responsiveHeight(4),
    borderRadius: responsiveHeight(2),
  },
  detailsSection: {
    marginTop: responsiveHeight(4),
  },
  sectionTitlePlaceholder: {
    width: responsiveWidth(30),
    height: responsiveHeight(2.5),
    borderRadius: responsiveHeight(1.25),
    marginBottom: responsiveHeight(1),
  },
  sectionContentPlaceholder: {
    width: responsiveWidth(90),
    height: responsiveHeight(6),
    borderRadius: responsiveHeight(3),
  },
  jobsSection: {
    marginTop: responsiveHeight(2),
  },
  jobsContainer: {
    marginVertical: responsiveHeight(1),
  },
  jobPlaceholder: {
    width: responsiveWidth(90),
    height: responsiveHeight(20),
    borderRadius: responsiveHeight(2),
  },
});

export default OtherScreenLoader;
