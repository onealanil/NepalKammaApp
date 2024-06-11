import React from 'react';
import {View, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

const CompletedJobLoader = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.amountContainer}>
          <ShimmerPlaceHolder style={styles.amountPlaceholder} />
        </View>
        <View style={styles.userInfo}>
          <ShimmerPlaceHolder style={styles.avatarPlaceholder} />
          <View style={styles.textPlaceholders}>
            <ShimmerPlaceHolder style={styles.titlePlaceholder} />
            <ShimmerPlaceHolder style={styles.usernamePlaceholder} />
          </View>
        </View>
      </View>
      <ShimmerPlaceHolder style={styles.descriptionPlaceholder} />
      <View style={styles.paymentInfo}>
        <ShimmerPlaceHolder style={styles.paymentPlaceholder} />
      </View>
      <ShimmerPlaceHolder style={styles.actionPlaceholder} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  amountContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginRight: 16,
  },
  amountPlaceholder: {
    width: 100,
    height: responsiveHeight(1.5),
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  textPlaceholders: {
    marginLeft: 8,
  },
  titlePlaceholder: {
    width: 150,
    height: responsiveHeight(2.5),
    marginBottom: 4,
  },
  usernamePlaceholder: {
    width: 100,
    height: responsiveHeight(1.5),
  },
  descriptionPlaceholder: {
    width: responsiveWidth(82.75),
    height: responsiveHeight(21.85),
    marginVertical: 8,
  },
  paymentInfo: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginBottom: 8,
  },
  paymentPlaceholder: {
    width: 150,
    height: responsiveHeight(1.5),
  },
  actionPlaceholder: {
    width: '100%',
    height: responsiveHeight(4),
    borderRadius: 4,
  },
});

export default CompletedJobLoader;
