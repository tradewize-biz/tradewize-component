import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { StyleSheet, Pressable, Text, Modal, useWindowDimensions } from 'react-native';

// Constants for horizontal positioning
const HORIZONTAL_PADDING = 16;
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring, withDelay } from 'react-native-reanimated';
import Color from './Color';
import FastImage from 'react-native-fast-image';
import { MessageText } from './MessageText';
import { Time } from './Time';
import { MessageFile } from './MessageFile';
import { getScreenHeight, getScreenWidth } from '../utils';
import { ButtonBase } from '../ButtonBase';
export const EMOJI_REACTIONS = ['❤️', '😂', '😮', '😢', '😠', '👍'];
const DIFFERENCE_LEVEL = 72;
export const MessageWithReaction = ({
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
  } = useWindowDimensions();
  const MESSAGE_MAX_WIDTH = screenWidth * 0.8;
  const {
    quickReplies: _unused,
    ...safeMessage
  } = message;
  const displayMessage = safeMessage;
  const [isExceedsScreenHeight, setIsExceedsScreenHeight] = useState(false);
  const [differenceLevel, setDifferenceLevel] = useState(0);
  const [messageWidth, setMessageWidth] = useState(0);
  const isMyMessage = ((_displayMessage$user = displayMessage.user) === null || _displayMessage$user === void 0 ? void 0 : _displayMessage$user._id) === (user === null || user === void 0 ? void 0 : user._id);

  // Helper function to get safe horizontal position
  const getSafeHorizontalPosition = useCallback((basePosition, elementWidth) => {
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
  const overlayOpacity = useSharedValue(0);
  const messageScale = useSharedValue(0.8);
  const messageOpacity = useSharedValue(0);
  const reactionIconOpacity = useSharedValue(0);
  const actionButtonsOpacity = useSharedValue(0);

  // Animation effects
  useEffect(() => {
    if (isVisible) {
      var _displayMessage$user2;
      // Start entrance animations
      overlayOpacity.value = withTiming(0.9, {
        duration: 30
      });
      messageScale.value = withSpring(1, {
        damping: 30,
        stiffness: 500
      });
      messageOpacity.value = withTiming(1, {
        duration: 30
      });

      // Staggered animations for reaction icons
      if (isShowEmoji && (user === null || user === void 0 ? void 0 : user._id) !== (displayMessage === null || displayMessage === void 0 || (_displayMessage$user2 = displayMessage.user) === null || _displayMessage$user2 === void 0 ? void 0 : _displayMessage$user2._id)) {
        reactionIconOpacity.value = withDelay(30, withTiming(1, {
          duration: 30
        }));
      }

      // Staggered animations for action buttons
      actionButtonsOpacity.value = withDelay(60, withTiming(1, {
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
  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value
  }));
  const messageAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{
      scale: messageScale.value
    }],
    opacity: messageOpacity.value
  }));
  const reactionIconAnimatedStyle = useAnimatedStyle(() => ({
    opacity: reactionIconOpacity.value
  }));
  const actionButtonsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: actionButtonsOpacity.value
  }));
  const styleMessage = useCallback(() => {
    let top = 0;
    if (position.pageY < 80) {
      top = 80 + getScreenHeight() * 0.05 + 8;
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
  const styleReactionIcon = useCallback(() => {
    let top = 0;
    if (position.pageY < 80) {
      top = 80;
    } else if (!isExceedsScreenHeight) {
      top = position.pageY - getScreenHeight() * 0.05 - 8;
    } else {
      top = position.pageY - getScreenHeight() * 0.05 - differenceLevel - DIFFERENCE_LEVEL - 8;
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
  const styleLayoutAction = useCallback(() => {
    let top = 0;
    if (position.pageY < 80) {
      top = 80 + getScreenHeight() * 0.05 + 8 + position.height;
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
  const onLayout = useCallback(e => {
    const {
      height,
      width
    } = e.nativeEvent.layout;
    const isHeight = position.pageY + height + position.height + 139 > screenHeight;
    setDifferenceLevel(position.pageY + height + position.height - screenHeight);
    setIsExceedsScreenHeight(isHeight);
    setMessageWidth(width);
  }, [position.pageY, position.height]);
  const timeTextStyle = useMemo(() => {
    return {
      left: {
        alignSelf: 'flex-start'
      },
      right: {
        alignSelf: 'flex-end',
        color: Color.black
      }
    };
  }, []);
  const renderTime = useMemo(() => /*#__PURE__*/React.createElement(Time, {
    currentMessage: displayMessage,
    position: isMyMessage ? 'right' : 'left',
    timeTextStyle: timeTextStyle
  }), [displayMessage, timeTextStyle, isMyMessage]);
  const renderMessage = useMemo(() => {
    if (displayMessage !== null && displayMessage !== void 0 && displayMessage.text) {
      return /*#__PURE__*/React.createElement(MessageText, {
        currentMessage: displayMessage,
        position: "left"
      });
    } else {
      return null;
    }
  }, [displayMessage]);
  const renderFile = useMemo(() => {
    var _displayMessage$file, _displayMessage$file2;
    if (displayMessage !== null && displayMessage !== void 0 && (_displayMessage$file = displayMessage.file) !== null && _displayMessage$file !== void 0 && _displayMessage$file.length && (displayMessage === null || displayMessage === void 0 || (_displayMessage$file2 = displayMessage.file) === null || _displayMessage$file2 === void 0 ? void 0 : _displayMessage$file2.length) > 0) {
      return /*#__PURE__*/React.createElement(MessageFile, {
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
  return /*#__PURE__*/React.createElement(Modal, {
    visible: isVisible,
    style: styles.modal,
    transparent: true,
    animationType: "none"
  }, /*#__PURE__*/React.createElement(Animated.View, {
    style: StyleSheet.absoluteFill
  }, /*#__PURE__*/React.createElement(Pressable, {
    style: StyleSheet.absoluteFill,
    onPress: onClose
  }), /*#__PURE__*/React.createElement(Animated.View, {
    style: [StyleSheet.absoluteFill, styles.overlay, overlayAnimatedStyle],
    pointerEvents: "none"
  }), isShowEmoji && (user === null || user === void 0 ? void 0 : user._id) !== (displayMessage === null || displayMessage === void 0 || (_displayMessage$user4 = displayMessage.user) === null || _displayMessage$user4 === void 0 ? void 0 : _displayMessage$user4._id) && /*#__PURE__*/React.createElement(Animated.View, {
    style: [styles.reactionIcon, styleReactionIcon(), reactionIconAnimatedStyle]
  }, EMOJI_REACTIONS === null || EMOJI_REACTIONS === void 0 ? void 0 : EMOJI_REACTIONS.map(emoji => /*#__PURE__*/React.createElement(Pressable, {
    key: emoji,
    onPress: () => {
      var _displayMessage$_id;
      onClose();
      onReactionEmoji === null || onReactionEmoji === void 0 || onReactionEmoji(emoji, displayMessage === null || displayMessage === void 0 || (_displayMessage$_id = displayMessage._id) === null || _displayMessage$_id === void 0 ? void 0 : _displayMessage$_id.toString());
    },
    style: styles.reactionIconItem
  }, /*#__PURE__*/React.createElement(Text, {
    style: styles.reactionIconText
  }, emoji)))), /*#__PURE__*/React.createElement(Animated.View, {
    onLayout: onLayout,
    style: [styles.message, styleMessage(), messageAnimatedStyle]
  }, renderFile, renderMessage, renderTime), /*#__PURE__*/React.createElement(Animated.View, {
    style: [styles.layout, styleLayoutAction(), actionButtonsAnimatedStyle]
  }, /*#__PURE__*/React.createElement(ButtonBase, {
    style: [styles.btnAction, {
      width: getScreenWidth() * 0.5
    }, (message === null || message === void 0 ? void 0 : message.text) && styles.btnBorderAction],
    onPress: () => {
      onClose();
      onActionReaction === null || onActionReaction === void 0 || onActionReaction(displayMessage, 'reply');
    }
  }, /*#__PURE__*/React.createElement(Text, {
    style: styles.btnActionText
  }, "Reply"), /*#__PURE__*/React.createElement(FastImage, {
    style: styles.icon,
    source: require('./assets/reply.png')
  })), (displayMessage === null || displayMessage === void 0 ? void 0 : displayMessage.text) && /*#__PURE__*/React.createElement(ButtonBase, {
    style: [styles.btnAction],
    onPress: () => {
      onClose();
      onActionReaction === null || onActionReaction === void 0 || onActionReaction(displayMessage, 'copy');
    }
  }, /*#__PURE__*/React.createElement(Text, {
    style: styles.btnActionText
  }, "Copy"), /*#__PURE__*/React.createElement(FastImage, {
    style: styles.icon,
    source: require('./assets/copy.png')
  })))));
};
const styles = StyleSheet.create({
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
    backgroundColor: Color.white,
    minWidth: getScreenWidth() * 0.19,
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
    backgroundColor: Color.white,
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
    borderTopColor: Color.defaultColor
  },
  icon: {
    width: 18,
    height: 18
  },
  btnActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: Color.black
  },
  btnBorderAction: {
    borderBottomWidth: 1,
    borderBottomColor: Color.defaultColor
  },
  time: {
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  reactionIcon: {
    position: 'absolute',
    backgroundColor: Color.white,
    borderRadius: 16,
    zIndex: 1,
    height: getScreenHeight() * 0.05,
    width: getScreenWidth() * 0.75,
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
    width: (getScreenWidth() * 0.75 - 56) / 6
  },
  reactionIconText: {
    fontSize: 24
  }
});
//# sourceMappingURL=MessageWithReaction.js.map