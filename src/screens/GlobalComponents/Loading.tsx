import {View, Image} from 'react-native';
import React, {useEffect, useRef} from 'react';
import LottieView from 'lottie-react-native';

const Loading = () => {
  const animationRef = useRef<LottieView>(null);

  useEffect(() => {
    // Or set a specific startFrame and endFrame with:
    animationRef.current?.play(5, 50);
  }, []);

  return (
    <View className="flex items-center justify-center h-[100%] bg-white">
      <Image
        source={require('../../../assets/images/NepalKamma.png')}
        style={{width: 300, height: 50}}
        className="mt-11"
      />
      <View className="mt-[-30px]">
        <LottieView
          source={require('../../../assets/animation/P2P9GT0Xpl.json')}
          ref={animationRef}
          style={{width: 500, height: 200}}
        />
      </View>
    </View>
  );
};

export default Loading;
