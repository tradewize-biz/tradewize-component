"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MessageText = MessageText;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _reactNativeParsedText = _interopRequireDefault(require("react-native-parsed-text"));
var _GiftedChatContext = require("./GiftedChatContext");
var _logging = require("./logging");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const WWW_URL_PATTERN = /^www\./i;
const {
  textStyle
} = _reactNative.StyleSheet.create({
  textStyle: {
    fontSize: 16,
    lineHeight: 20,
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 10
  }
});
const styles = {
  left: _reactNative.StyleSheet.create({
    container: {},
    text: {
      color: 'black',
      ...textStyle
    },
    link: {
      color: 'black',
      textDecorationLine: 'underline'
    }
  }),
  right: _reactNative.StyleSheet.create({
    container: {},
    text: {
      color: 'white',
      ...textStyle
    },
    link: {
      color: 'white',
      textDecorationLine: 'underline'
    }
  })
};
const DEFAULT_OPTION_TITLES = ['Call', 'Text', 'Cancel'];
function MessageText({
  currentMessage = {},
  optionTitles = DEFAULT_OPTION_TITLES,
  position = 'left',
  containerStyle,
  textStyle,
  linkStyle: linkStyleProp,
  customTextStyle,
  parsePatterns,
  textProps
}) {
  const {
    actionSheet
  } = (0, _GiftedChatContext.useChatContext)();
  const onUrlPress = url => {
    // When someone sends a message that includes a website address beginning with "www." (omitting the scheme),
    // react-native-parsed-text recognizes it as a valid url, but Linking fails to open due to the missing scheme.
    if (WWW_URL_PATTERN.test(url)) onUrlPress(`https://${url}`);else _reactNative.Linking.openURL(url).catch(e => {
      (0, _logging.error)(e, 'No handler for URL:', url);
    });
  };
  const onPhonePress = phone => {
    const options = optionTitles && optionTitles.length > 0 ? optionTitles.slice(0, 3) : DEFAULT_OPTION_TITLES;
    const cancelButtonIndex = options.length - 1;
    actionSheet().showActionSheetWithOptions({
      options,
      cancelButtonIndex
    }, buttonIndex => {
      switch (buttonIndex) {
        case 0:
          _reactNative.Linking.openURL(`tel:${phone}`).catch(e => {
            (0, _logging.error)(e, 'No handler for telephone');
          });
          break;
        case 1:
          _reactNative.Linking.openURL(`sms:${phone}`).catch(e => {
            (0, _logging.error)(e, 'No handler for text');
          });
          break;
      }
    });
  };
  const onEmailPress = email => _reactNative.Linking.openURL(`mailto:${email}`).catch(e => (0, _logging.error)(e, 'No handler for mailto'));
  const linkStyle = [styles[position].link, linkStyleProp === null || linkStyleProp === void 0 ? void 0 : linkStyleProp[position]];
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [styles[position].container, containerStyle === null || containerStyle === void 0 ? void 0 : containerStyle[position]]
  }, /*#__PURE__*/_react.default.createElement(_reactNativeParsedText.default, {
    style: [styles[position].text, textStyle === null || textStyle === void 0 ? void 0 : textStyle[position], customTextStyle],
    parse: [...(parsePatterns ? parsePatterns(linkStyle) : []), {
      type: 'url',
      style: linkStyle,
      onPress: onUrlPress
    }, {
      type: 'phone',
      style: linkStyle,
      onPress: onPhonePress
    }, {
      type: 'email',
      style: linkStyle,
      onPress: onEmailPress
    }],
    childrenProps: {
      ...textProps
    }
  }, currentMessage.text));
}
//# sourceMappingURL=MessageText.js.map