import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface RatingProps {
  initialRating?: number;
  onRatingChange?: (rating: number) => void;
}

const Rating: React.FC<RatingProps> = ({ initialRating = 0, onRatingChange }) => {
  const [rating, setRating] = useState<number>(initialRating);

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
    if (onRatingChange) {
      onRatingChange(newRating);
    }
  };

  return (
    <View style={styles.container}>
      {[1, 2, 3, 4, 5].map((value) => (
        <Text
          key={value}
          style={[styles.star, rating >= value ? styles.filledStar : styles.emptyStar]}
          onPress={() => handleRatingChange(value)}
        >
          &#9733;
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    fontSize: 24,
    marginHorizontal: 2,
  },
  filledStar: {
    color: 'gold',
  },
  emptyStar: {
    color: 'gray',
  },
});

export default Rating;