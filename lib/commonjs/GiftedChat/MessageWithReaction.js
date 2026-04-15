"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MessageWithReaction = exports.EMOJI_REACTIONS = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _Color = _interopRequireDefault(require("./Color"));
var _reactNativeFastImage = _interopRequireDefault(require("react-native-fast-image"));
var _MessageText = require("./MessageText");
var _Time = require("./Time");
var _MessageFile = require("./MessageFile");
var _utils = require("../utils");
var _ButtonBase = require("../ButtonBase");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
// Constants for horizontal positioning
const HORIZONTAL_PADDING = 16;
const EMOJI_REACTIONS = exports.EMOJI_REACTIONS = ['❤️', '😂', '😮', '😢', '😠', '👍'];
const DIFFERENCE_LEVEL = 72;
const MessageWithReaction = ({
  isVisible,
  onClose,
  message,
  position,
  user,
  onReactionEmoji,
  onActionReaction,
  isShowEmoji = true
}) => {
  var _displayMessage$user, _displayMessage$user3, _displayMessage$user4;
  const {
    width: screenWidth,
    height: screenHeight
  } = (0, _reactNative.useWindowDimensions)();
  const MESSAGE_MAX_WIDTH = screenWidth * 0.8;
  const {
    quickReplies: _unused,
    ...safeMessage
  } = message;
  const displayMessage = safeMessage;
  const [isExceedsScreenHeight, setIsExceedsScreenHeight] = (0, _react.useState)(false);
  const [differenceLevel, setDifferenceLevel] = (0, _react.useState)(0);
  const [messageWidth, setMessageWidth] = (0, _react.useState)(0);
  const isMyMessage = ((_displayMessage$user = displayMessage.user) === null || _displayMessage$user === void 0 ? void 0 : _displayMessage$user._id) === (user === null || user === void 0 ? void 0 : user._id);

  // Helper function to get safe horizontal position
  const getSafeHorizontalPosition = (0, _react.useCallback)((basePosition, elementWidth) => {
    const leftBound = HORIZONTAL_PADDING;
    const rightBound = screenWidth - HORIZONTAL_PADDING - elementWidth;
    if (basePosition < leftBound) {
      return leftBound;
    }
    if (basePosition > rightBound) {
      return rightBound;
    }
    return basePosition;
  }, []);

  // Animation values
  const overlayOpacity = (0, _reactNativeReanimated.useSharedValue)(0);
  const messageScale = (0, _reactNativeReanimated.useSharedValue)(0.8);
  const messageOpacity = (0, _reactNativeReanimated.useSharedValue)(0);
  const reactionIconOpacity = (0, _reactNativeReanimated.useSharedValue)(0);
  const actionButtonsOpacity = (0, _reactNativeReanimated.useSharedValue)(0);

  // Animation effects
  (0, _react.useEffect)(() => {
    if (isVisible) {
      var _displayMessage$user2;
      // Start entrance animations
      overlayOpacity.value = (0, _reactNativeReanimated.withTiming)(0.9, {
        duration: 30
      });
      messageScale.value = (0, _reactNativeReanimated.withSpring)(1, {
        damping: 30,
        stiffness: 500
      });
      messageOpacity.value = (0, _reactNativeReanimated.withTiming)(1, {
        duration: 30
      });

      // Staggered animations for reaction icons
      if (isShowEmoji && (user === null || user === void 0 ? void 0 : user._id) !== (displayMessage === null || displayMessage === void 0 || (_displayMessage$user2 = displayMessage.user) === null || _displayMessage$user2 === void 0 ? void 0 : _displayMessage$user2._id)) {
        reactionIconOpacity.value = (0, _reactNativeReanimated.withDelay)(30, (0, _reactNativeReanimated.withTiming)(1, {
          duration: 30
        }));
      }

      // Staggered animations for action buttons
      actionButtonsOpacity.value = (0, _reactNativeReanimated.withDelay)(60, (0, _reactNativeReanimated.withTiming)(1, {
        duration: 30
      }));
    } else {
      // Reset animations when closing
      overlayOpacity.value = 0;
      messageScale.value = 0.8;
      messageOpacity.value = 0;
      reactionIconOpacity.value = 0;
      actionButtonsOpacity.value = 0;
    }
  }, [isVisible, isShowEmoji, user === null || user === void 0 ? void 0 : user._id, displayMessage === null || displayMessage === void 0 || (_displayMessage$user3 = displayMessage.user) === null || _displayMessage$user3 === void 0 ? void 0 : _displayMessage$user3._id, isMyMessage, overlayOpacity, messageScale, messageOpacity, reactionIconOpacity, actionButtonsOpacity]);

  // Animated styles
  const overlayAnimatedStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => ({
    opacity: overlayOpacity.value
  }));
  const messageAnimatedStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => ({
    transform: [{
      scale: messageScale.value
    }],
    opacity: messageOpacity.value
  }));
  const reactionIconAnimatedStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => ({
    opacity: reactionIconOpacity.value
  }));
  const actionButtonsAnimatedStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => ({
    opacity: actionButtonsOpacity.value
  }));
  const styleMessage = (0, _react.useCallback)(() => {
    let top = 0;
    if (position.pageY < 80) {
      top = 80 + (0, _utils.getScreenHeight)() * 0.05 + 8;
    } else if (!isExceedsScreenHeight) {
      top = position.pageY;
    } else {
      top = position.pageY - differenceLevel - DIFFERENCE_LEVEL;
    }
    if (isMyMessage) {
      // For my messages, calculate safe right position
      const baseRight = 16;
      const safeRight = getSafeHorizontalPosition(screenWidth - baseRight - messageWidth, messageWidth);
      return {
        top,
        right: screenWidth - safeRight - messageWidth,
        maxWidth: MESSAGE_MAX_WIDTH
      };
    } else {
      // For other messages, calculate safe left position
      const baseLeft = position.pageX;
      const safeLeft = getSafeHorizontalPosition(baseLeft, messageWidth);
      return {
        top,
        left: safeLeft,
        maxWidth: MESSAGE_MAX_WIDTH
      };
    }
  }, [isMyMessage, position.pageX, position.pageY, isExceedsScreenHeight, differenceLevel, messageWidth, getSafeHorizontalPosition]);
  const styleReactionIcon = (0, _react.useCallback)(() => {
    let top = 0;
    if (position.pageY < 80) {
      top = 80;
    } else if (!isExceedsScreenHeight) {
      top = position.pageY - (0, _utils.getScreenHeight)() * 0.05 - 8;
    } else {
      top = position.pageY - (0, _utils.getScreenHeight)() * 0.05 - differenceLevel - DIFFERENCE_LEVEL - 8;
    }
    const iconWidth = screenWidth * 0.75; // Width from styles

    if (isMyMessage) {
      const baseRight = 16;
      const safeRight = getSafeHorizontalPosition(screenWidth - baseRight - iconWidth, iconWidth);
      return {
        top,
        right: screenWidth - safeRight - iconWidth
      };
    } else {
      const baseLeft = position.pageX;
      const safeLeft = getSafeHorizontalPosition(baseLeft, iconWidth);
      return {
        top,
        left: safeLeft
      };
    }
  }, [isExceedsScreenHeight, differenceLevel, position.pageY, position.pageX, isMyMessage, getSafeHorizontalPosition]);
  const styleLayoutAction = (0, _react.useCallback)(() => {
    let top = 0;
    if (position.pageY < 80) {
      top = 80 + (0, _utils.getScreenHeight)() * 0.05 + 8 + position.height;
    } else if (!isExceedsScreenHeight) {
      top = position.pageY + position.height;
    } else {
      top = position.pageY + position.height - differenceLevel - DIFFERENCE_LEVEL;
    }
    const actionWidth = screenWidth * 0.5; // Approximate width of action buttons

    if (isMyMessage) {
      const baseRight = 16;
      const safeRight = getSafeHorizontalPosition(screenWidth - baseRight - actionWidth, actionWidth);
      return {
        top,
        right: screenWidth - safeRight - actionWidth
      };
    } else {
      const baseLeft = position.pageX;
      const safeLeft = getSafeHorizontalPosition(baseLeft, actionWidth);
      return {
        top,
        left: safeLeft
      };
    }
  }, [isMyMessage, position.pageX, position.pageY, position.height, isExceedsScreenHeight, differenceLevel, getSafeHorizontalPosition]);
  const onLayout = (0, _react.useCallback)(e => {
    const {
      height,
      width
    } = e.nativeEvent.layout;
    const isHeight = position.pageY + height + position.height + 139 > screenHeight;
    setDifferenceLevel(position.pageY + height + position.height - screenHeight);
    setIsExceedsScreenHeight(isHeight);
    setMessageWidth(width);
  }, [position.pageY, position.height]);
  const timeTextStyle = (0, _react.useMemo)(() => {
    return {
      left: {
        alignSelf: 'flex-start'
      },
      right: {
        alignSelf: 'flex-end',
        color: _Color.default.black
      }
    };
  }, []);
  const renderTime = (0, _react.useMemo)(() => /*#__PURE__*/_react.default.createElement(_Time.Time, {
    currentMessage: displayMessage,
    position: isMyMessage ? 'right' : 'left',
    timeTextStyle: timeTextStyle
  }), [displayMessage, timeTextStyle, isMyMessage]);
  const renderMessage = (0, _react.useMemo)(() => {
    if (displayMessage !== null && displayMessage !== void 0 && displayMessage.text) {
      return /*#__PURE__*/_react.default.createElement(_MessageText.MessageText, {
        currentMessage: displayMessage,
        position: "left"
      });
    } else {
      return null;
    }
  }, [displayMessage]);
  const renderFile = (0, _react.useMemo)(() => {
    var _displayMessage$file, _displayMessage$file2;
    if (displayMessage !== null && displayMessage !== void 0 && (_displayMessage$file = displayMessage.file) !== null && _displayMessage$file !== void 0 && _displayMessage$file.length && (displayMessage === null || displayMessage === void 0 || (_displayMessage$file2 = displayMessage.file) === null || _displayMessage$file2 === void 0 ? void 0 : _displayMessage$file2.length) > 0) {
      return /*#__PURE__*/_react.default.createElement(_MessageFile.MessageFile, {
        isReaction: true,
        currentMessage: displayMessage,
        messageWidth: {
          width: position.width + 36,
          _id: ''
        }
      });
    }
    return null;
  }, [position.width, displayMessage]);
  return /*#__PURE__*/_react.default.createElement(_reactNative.Modal, {
    visible: isVisible,
    style: styles.modal,
    transparent: true,
    animationType: "none"
  }, /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    style: _reactNative.StyleSheet.absoluteFill
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Pressable, {
    style: _reactNative.StyleSheet.absoluteFill,
    onPress: onClose
  }), /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    style: [_reactNative.StyleSheet.absoluteFill, styles.overlay, overlayAnimatedStyle],
    pointerEvents: "none"
  }), isShowEmoji && (user === null || user === void 0 ? void 0 : user._id) !== (displayMessage === null || displayMessage === void 0 || (_displayMessage$user4 = displayMessage.user) === null || _displayMessage$user4 === void 0 ? void 0 : _displayMessage$user4._id) && /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    style: [styles.reactionIcon, styleReactionIcon(), reactionIconAnimatedStyle]
  }, EMOJI_REACTIONS === null || EMOJI_REACTIONS === void 0 ? void 0 : EMOJI_REACTIONS.map(emoji => /*#__PURE__*/_react.default.createElement(_reactNative.Pressable, {
    key: emoji,
    onPress: () => {
      var _displayMessage$_id;
      onClose();
      onReactionEmoji === null || onReactionEmoji === void 0 || onReactionEmoji(emoji, displayMessage === null || displayMessage === void 0 || (_displayMessage$_id = displayMessage._id) === null || _displayMessage$_id === void 0 ? void 0 : _displayMessage$_id.toString());
    },
    style: styles.reactionIconItem
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.reactionIconText
  }, emoji)))), /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    onLayout: onLayout,
    style: [styles.message, styleMessage(), messageAnimatedStyle]
  }, renderFile, renderMessage, renderTime), /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    style: [styles.layout, styleLayoutAction(), actionButtonsAnimatedStyle]
  }, /*#__PURE__*/_react.default.createElement(_ButtonBase.ButtonBase, {
    style: [styles.btnAction, {
      width: (0, _utils.getScreenWidth)() * 0.5
    }, (message === null || message === void 0 ? void 0 : message.text) && styles.btnBorderAction],
    onPress: () => {
      onClose();
      onActionReaction === null || onActionReaction === void 0 || onActionReaction(displayMessage, 'reply');
    }
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.btnActionText
  }, "Reply"), /*#__PURE__*/_react.default.createElement(_reactNativeFastImage.default, {
    style: styles.icon,
    source: require('./assets/reply.png')
  })), (displayMessage === null || displayMessage === void 0 ? void 0 : displayMessage.text) && /*#__PURE__*/_react.default.createElement(_ButtonBase.ButtonBase, {
    style: [styles.btnAction],
    onPress: () => {
      onClose();
      onActionReaction === null || onActionReaction === void 0 || onActionReaction(displayMessage, 'copy');
    }
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.btnActionText
  }, "Copy"), /*#__PURE__*/_react.default.createElement(_reactNativeFastImage.default, {
    style: styles.icon,
    source: require('./assets/copy.png')
  })))));
};
exports.MessageWithReaction = MessageWithReaction;
const styles = _reactNative.StyleSheet.create({
  modal: {
    margin: 0
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)'
  },
  message: {
    position: 'absolute',
    zIndex: 1,
    borderRadius: 8,
    backgroundColor: _Color.default.white,
    minWidth: (0, _utils.getScreenWidth)() * 0.19,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8
  },
  layout: {
    backgroundColor: _Color.default.white,
    position: 'absolute',
    borderRadius: 16,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6
  },
  btnAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  btnActionOther: {
    borderTopWidth: 4,
    borderTopColor: _Color.default.defaultColor
  },
  icon: {
    width: 18,
    height: 18
  },
  btnActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: _Color.default.black
  },
  btnBorderAction: {
    borderBottomWidth: 1,
    borderBottomColor: _Color.default.defaultColor
  },
  time: {
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  reactionIcon: {
    position: 'absolute',
    backgroundColor: _Color.default.white,
    borderRadius: 16,
    zIndex: 1,
    height: (0, _utils.getScreenHeight)() * 0.05,
    width: (0, _utils.getScreenWidth)() * 0.75,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6
  },
  reactionIconItem: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    width: ((0, _utils.getScreenWidth)() * 0.75 - 56) / 6
  },
  reactionIconText: {
    fontSize: 24
  }
});
//# sourceMappingURL=MessageWithReaction.js.map