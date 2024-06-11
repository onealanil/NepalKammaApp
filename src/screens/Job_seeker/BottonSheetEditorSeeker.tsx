import React, {useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ScrollView,
} from 'react-native';
import RenderHtml, {defaultSystemFonts} from 'react-native-render-html';
import {useWindowDimensions} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import AntDesign from 'react-native-vector-icons/AntDesign';
const systemFonts = [
  ...defaultSystemFonts,
  'Montserrat-Regular',
  'Montserrat-SemiBold',
  'Montserrat-Bold',
  'Montserrat-Medium',
];

const BottonSheetEditorSeeker = ({
  bottomSheetModalRef,
  setGigDescription,
  gig_description,
}: any) => {
  const [text, setText] = useState(gig_description);
  const [bold, setBold] = useState(false);
  const [color, setColor] = useState('black');
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);
  const {width} = useWindowDimensions();

  const handleSubmitOkay = () => {
    setGigDescription(text);
    bottomSheetModalRef.current?.close();
  };

  const handleBold = () => {
    if (selectionStart !== selectionEnd) {
      const newText =
        text.substring(0, selectionStart) +
        `<b>${text.substring(selectionStart, selectionEnd)}</b>` +
        text.substring(selectionEnd);
      setText(newText);
    }
    setBold(!bold);
  };

  const handleColor = (newColor: any) => {
    setColor(newColor);
    if (selectionStart !== selectionEnd) {
      const newText =
        text.substring(0, selectionStart) +
        `<span style="color:${newColor}">${text.substring(
          selectionStart,
          selectionEnd,
        )}</span>` +
        text.substring(selectionEnd);
      setText(newText);
    }
  };

  const handleSelectionChange = (event: any) => {
    const {selection} = event.nativeEvent;
    if (selection) {
      setSelectionStart(selection.start);
      setSelectionEnd(selection.end);
    }
  };

  const generateHtmlPreview = () => {
    let html = `<p style="color: black;">${text}</p>`;
    html = html.replace(/\n/g, '<br/>');
    return html;
  };

  return (
    <ScrollView>
      <View className="w-[100%] flex flex-row items-center justify-between">
        <View
          className="flex flex-row"
          style={{
            marginLeft: responsiveWidth(5),
            marginBottom: responsiveHeight(2),
          }}>
          <TouchableOpacity
            className="px-3 py-1 border border-black"
            onPress={handleBold}
            style={{marginRight: 10}}>
            <Text
              className="text-black"
              style={{fontWeight: bold ? 'bold' : 'normal'}}>
              Bold
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="px-3 py-1 border border-red-500"
            onPress={() => handleColor('red')}
            style={{marginRight: 10}}>
            <Text style={{color: 'red'}}>Red</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="px-3 py-1 border border-orange-500"
            onPress={() => handleColor('orange')}
            style={{marginRight: 10}}>
            <Text style={{color: 'orange'}}>Orange</Text>
          </TouchableOpacity>
        </View>
        <View
          className=""
          style={{
            marginRight: responsiveWidth(5),
            marginBottom: responsiveHeight(2),
          }}>
          <TouchableOpacity
            onPress={() => bottomSheetModalRef.current?.close()}>
            <AntDesign
              name="closecircle"
              size={20}
              color="red"
              className="p-5"
            />
          </TouchableOpacity>
        </View>
      </View>
      <TextInput
        multiline={true}
        numberOfLines={4}
        style={{
          borderColor: 'gray',
          borderWidth: 1,
          marginBottom: 10,
          paddingHorizontal: 10,
          paddingVertical: 5,
          fontSize: 16,
          color: 'black',
        }}
        onChangeText={text => setText(text)}
        onSelectionChange={handleSelectionChange}
        value={text}
        placeholder="Type Job Description here..."
        placeholderTextColor="gray"
      />

      <Text
        className="text-black"
        style={{
          marginTop: 10,
          fontFamily: 'Montserrat-SemiBold',
          fontSize: responsiveFontSize(1.75),
          marginLeft: 10,
          marginBottom: 10,
        }}>
        Live Preview:
        <Text
          style={{
            color: 'red',
            fontFamily: 'Montserrat-SemiBold',
            fontSize: responsiveFontSize(1.5),
            paddingLeft: responsiveWidth(2),
          }}>
          {'  '} Click Above Text area and scroll Up
        </Text>
      </Text>
      <RenderHtml
        contentWidth={width}
        source={{html: generateHtmlPreview()}}
        baseStyle={{color: 'black', fontFamily: 'Montserrat-SemiBold'}}
        // tagsStyles={{
        //   p: {color: 'red', fontFamily: 'Montserrat-Bold'},
        // }}
        systemFonts={systemFonts}
      />
      <View className="w-[80%] flex items-center">
        <TouchableOpacity
          className="w-[90%] bg-color2 flex items-center justify-center rounded-md"
          onPress={() => handleSubmitOkay()}
          activeOpacity={0.8}>
          <View>
            <Text
              className="text-white"
              style={{
                paddingVertical: responsiveHeight(1.75),
                paddingHorizontal: responsiveWidth(2),
                fontFamily: 'Montserrat-Bold',
                fontSize: responsiveFontSize(2.25),
              }}>
              Done
              {/* {isSubmitting ? 'Signing Up...' : 'Sign Up'} */}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default BottonSheetEditorSeeker;
