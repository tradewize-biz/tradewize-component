function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-shadow */
import React, { useCallback, useRef, useState, memo } from 'react';
import { findNodeHandle, Text, TouchableWithoutFeedback, UIManager, View } from 'react-native';
import { useChatContext } from '../GiftedChatContext';
import { QuickReplies } from '../QuickReplies';
import { MessageText } from '../MessageText';
import { MessageAudio } from '../MessageAudio';
import { Time } from '../Time';
import { isSameUser, isSameDay } from '../utils';
import stylesCommon from '../styles';
import styles from './styles';
import { MessageFile } from '../MessageFile';
import Color from '../Color';
import { MessageReply } from '../MessageReply';
import { MaterialIndicator } from '../../IndicatorsMaster';
import FastImage from 'react-native-fast-image';
export * from './types';
const BubbleComponent = props => {
  var _props$user2, _currentMessage$user, _currentMessage$react2;
  const {
    currentMessage,
    nextMessage,
    position,
    // containerToNextStyle,
    previousMessage,
    containerToPreviousStyle,
    onQuickReply,
    renderQuickReplySend,
    quickReplyStyle,
    quickReplyTextStyle,
    quickReplyContainerStyle,
    containerStyle,
    wrapperStyle,
    bottomContainerStyle,
    onPressFile,
    onLongPressReaction
  } = props;
  const context = useChatContext();
  const [messageWidth, setMessageWidth] = useState(null);
  const innerRef = useRef(null);
  const refArrThumbnail = useRef([]);
  const onPress = useCallback(() => {
    if (props.onPress) props.onPress(context, currentMessage);
  }, [context, props, currentMessage]);
  const onLongPress = useCallback(() => {
    const {
      onLongPress,
      optionTitles
    } = props;
    if (onLongPress) {
      onLongPress(context, currentMessage);
      return;
    }
    if (!(optionTitles !== null && optionTitles !== void 0 && optionTitles.length)) return;
    const options = optionTitles;
    const cancelButtonIndex = options.length - 1;
    context.actionSheet().showActionSheetWithOptions({
      options,
      cancelButtonIndex
    }, _buttonIndex => {
      // Action sheet button pressed
    });
  }, [currentMessage, context, props]);
  const onLongPressItem = useCallback(() => {
    try {
      if (innerRef.current) {
        const node = findNodeHandle(innerRef.current);
        if (node) {
          UIManager.measure(node, (x, y, width, height, pageX, pageY) => {
            onLongPressReaction === null || onLongPressReaction === void 0 || onLongPressReaction(currentMessage, {
              x,
              y,
              width,
              height,
              pageX,
              pageY
            });
          });
        }
      }
    } catch (_error) {
      // Measurement failed silently
    }
  }, [currentMessage, onLongPressReaction]);
  const styledBubbleToPrevious = useCallback(() => {
    if (currentMessage && previousMessage && position && isSameUser(currentMessage, previousMessage) && isSameDay(currentMessage, previousMessage)) return [styles[position].containerToPrevious, containerToPreviousStyle && containerToPreviousStyle[position]];
    return null;
  }, [currentMessage, previousMessage, position, containerToPreviousStyle]);
  const renderQuickReplies = useCallback(() => {
    if (currentMessage !== null && currentMessage !== void 0 && currentMessage.quickReplies) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {
        containerStyle,
        wrapperStyle,
        ...quickReplyProps
      } = props;
      if (props.renderQuickReplies) return props.renderQuickReplies(quickReplyProps);
      return /*#__PURE__*/React.createElement(QuickReplies, {
        currentMessage: currentMessage,
        onQuickReply: onQuickReply,
        renderQuickReplySend: renderQuickReplySend,
        quickReplyStyle: quickReplyStyle,
        quickReplyTextStyle: quickReplyTextStyle,
        quickReplyContainerStyle: quickReplyContainerStyle,
        nextMessage: nextMessage
      });
    }
    return null;
  }, [currentMessage, onQuickReply, renderQuickReplySend, quickReplyStyle, quickReplyTextStyle, quickReplyContainerStyle, nextMessage, props]);
  const onSaveThumbnail = useCallback(file => {
    refArrThumbnail.current = file;
  }, []);
  const renderMessageText = useCallback(() => {
    if (currentMessage !== null && currentMessage !== void 0 && currentMessage.text) {
      const {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        containerStyle,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        wrapperStyle,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        optionTitles,
        ...messageTextProps
      } = props;
      if (props.renderMessageText) return props.renderMessageText(messageTextProps);
      return /*#__PURE__*/React.createElement(MessageText, messageTextProps);
    }
    return null;
  }, [props, currentMessage]);
  const renderMessageFile = useCallback(() => {
    if (!(currentMessage !== null && currentMessage !== void 0 && currentMessage.file)) return null;
    const {
      /* eslint-disable @typescript-eslint/no-unused-vars */
      containerStyle,
      wrapperStyle,
      /* eslint-enable @typescript-eslint/no-unused-vars */
      ...messageFileProps
    } = props;
    if (props.renderCustomMessageFile) return props.renderCustomMessageFile(messageFileProps);
    return /*#__PURE__*/React.createElement(MessageFile, _extends({
      onLongPressFile: onLongPressItem,
      onSaveThumbnail: onSaveThumbnail,
      onPressFile: onPressFile,
      messageWidth: messageWidth
    }, messageFileProps));
  }, [currentMessage, props, messageWidth, onPressFile, onSaveThumbnail, onLongPressItem]);
  const renderMessageAudio = useCallback(() => {
    if (!(currentMessage !== null && currentMessage !== void 0 && currentMessage.audio)) return null;
    const {
      /* eslint-disable @typescript-eslint/no-unused-vars */
      containerStyle,
      wrapperStyle,
      /* eslint-enable @typescript-eslint/no-unused-vars */
      ...messageAudioProps
    } = props;
    if (props.renderMessageAudio) return props.renderMessageAudio(messageAudioProps);
    return /*#__PURE__*/React.createElement(MessageAudio, null);
  }, [props, currentMessage]);
  const renderTicks = useCallback(() => {
    const {
      renderTicks,
      user
    } = props;
    if (renderTicks && currentMessage) return renderTicks(currentMessage);
    if (user && currentMessage !== null && currentMessage !== void 0 && currentMessage.user && currentMessage.user._id !== user._id) return null;
    if (currentMessage && (currentMessage.sent || currentMessage.received || currentMessage.pending)) return /*#__PURE__*/React.createElement(View, {
      style: styles.content.tickView
    }, !!currentMessage.sent && /*#__PURE__*/React.createElement(Text, {
      style: [styles.content.tick, props.tickStyle]
    }, '✓'), !!currentMessage.received && /*#__PURE__*/React.createElement(Text, {
      style: [styles.content.tick, props.tickStyle]
    }, '✓'), !!currentMessage.pending && /*#__PURE__*/React.createElement(Text, {
      style: [styles.content.tick, props.tickStyle]
    }, '🕓'));
    return null;
  }, [props, currentMessage]);
  const renderTime = useCallback(() => {
    if (currentMessage !== null && currentMessage !== void 0 && currentMessage.createdAt) {
      const {
        /* eslint-disable @typescript-eslint/no-unused-vars */
        containerStyle,
        wrapperStyle,
        textStyle,
        /* eslint-enable @typescript-eslint/no-unused-vars */
        ...timeProps
      } = props;
      if (props.renderTime) return props.renderTime(timeProps);
      return /*#__PURE__*/React.createElement(Time, timeProps);
    }
    return null;
  }, [props, currentMessage]);
  const renderUsername = useCallback(() => {
    const {
      user,
      renderUsername
    } = props;
    if (props.renderUsernameOnMessage && currentMessage) {
      if (user && currentMessage.user._id === user._id) return null;
      if (renderUsername) return renderUsername(currentMessage.user);
      return /*#__PURE__*/React.createElement(View, {
        style: styles.content.usernameView
      }, /*#__PURE__*/React.createElement(Text, {
        style: [styles.content.username, props.usernameStyle]
      }, '~ ', currentMessage.user.name));
    }
    return null;
  }, [currentMessage, props]);
  const renderCustomView = useCallback(() => {
    if (props.renderCustomView) return props.renderCustomView(props);
    return null;
  }, [props]);
  const renderReactionEmoji = useCallback(() => {
    var _props$user;
    const isCurrentUser = currentMessage.user._id === (props === null || props === void 0 || (_props$user = props.user) === null || _props$user === void 0 ? void 0 : _props$user._id);
    const reactionPosition = isCurrentUser ? 'right' : 'left';
    const reactionEmoji = [...new Set((Array.isArray(currentMessage === null || currentMessage === void 0 ? void 0 : currentMessage.reactionEmoji) ? currentMessage.reactionEmoji : []).map(item => item === null || item === void 0 ? void 0 : item.reaction))];
    if (reactionEmoji && (reactionEmoji === null || reactionEmoji === void 0 ? void 0 : reactionEmoji.length) > 0) {
      var _currentMessage$react;
      return /*#__PURE__*/React.createElement(View, {
        style: [styles.content.reactionContainer, {
          width: 18 * (reactionEmoji === null || reactionEmoji === void 0 ? void 0 : reactionEmoji.length) + 12
        }, reactionPosition === 'right' && {
          left: reactionEmoji !== null && reactionEmoji !== void 0 && reactionEmoji.length ? -12 * ((reactionEmoji === null || reactionEmoji === void 0 ? void 0 : reactionEmoji.length) - 1) : -12
        }, reactionPosition === 'left' && {
          right: reactionEmoji !== null && reactionEmoji !== void 0 && reactionEmoji.length ? -12 * ((reactionEmoji === null || reactionEmoji === void 0 ? void 0 : reactionEmoji.length) - 1) : -12
        }]
      }, reactionEmoji === null || reactionEmoji === void 0 ? void 0 : reactionEmoji.map((item, index) => /*#__PURE__*/React.createElement(Text, {
        key: index,
        style: styles.content.reactionEmojiText
      }, item)), /*#__PURE__*/React.createElement(Text, {
        style: styles.content.reactionCountText
      }, currentMessage === null || currentMessage === void 0 || (_currentMessage$react = currentMessage.reactionEmoji) === null || _currentMessage$react === void 0 ? void 0 : _currentMessage$react.length));
    }
    return null;
  }, [currentMessage.reactionEmoji, currentMessage.user._id, props === null || props === void 0 || (_props$user2 = props.user) === null || _props$user2 === void 0 ? void 0 : _props$user2._id]);
  const renderBubbleContent = useCallback(() => {
    return /*#__PURE__*/React.createElement(View, null, !props.isCustomViewBottom && renderCustomView(), renderMessageFile(), renderMessageAudio(), renderMessageText(), renderReactionEmoji(), props.isCustomViewBottom && renderCustomView());
  }, [renderCustomView, renderMessageAudio, renderMessageText, props.isCustomViewBottom, renderMessageFile, renderReactionEmoji]);
  const renderMessageReply = useCallback(() => {
    if (currentMessage !== null && currentMessage !== void 0 && currentMessage.messageReply) {
      return /*#__PURE__*/React.createElement(MessageReply, {
        messageReply: currentMessage === null || currentMessage === void 0 ? void 0 : currentMessage.messageReply,
        onSaveThumbnail: onSaveThumbnail,
        onPressFile: onPressFile
      });
    }
    return null;
  }, [currentMessage, onSaveThumbnail, onPressFile]);
  return /*#__PURE__*/React.createElement(View, {
    style: [stylesCommon.fill, styles[position].container, containerStyle && containerStyle[position], {
      marginBottom: currentMessage !== null && currentMessage !== void 0 && currentMessage.isLast ? 12 : 8,
      maxWidth: '90%'
    }],
    onLayout: e => {
      if (currentMessage !== null && currentMessage !== void 0 && currentMessage._id) {
        setMessageWidth({
          width: e.nativeEvent.layout.width,
          _id: currentMessage === null || currentMessage === void 0 ? void 0 : currentMessage._id.toString()
        });
      }
    }
  }, (currentMessage === null || currentMessage === void 0 ? void 0 : currentMessage.isShowName) && /*#__PURE__*/React.createElement(View, {
    style: styles.content.layoutName
  }, /*#__PURE__*/React.createElement(Text, {
    numberOfLines: 1,
    style: styles.content.name
  }, currentMessage === null || currentMessage === void 0 || (_currentMessage$user = currentMessage.user) === null || _currentMessage$user === void 0 ? void 0 : _currentMessage$user.name)), renderMessageReply(), /*#__PURE__*/React.createElement(View, {
    style: [styles[position].wrapper, styledBubbleToPrevious(), wrapperStyle && wrapperStyle[position]]
  }, /*#__PURE__*/React.createElement(TouchableWithoutFeedback, _extends({
    onPress: onPress,
    onLongPress: onLongPressItem || onLongPress,
    delayLongPress: 100
  }, props.touchableProps), /*#__PURE__*/React.createElement(View, {
    ref: innerRef
  }, renderBubbleContent(), /*#__PURE__*/React.createElement(View, {
    style: [styles[position].bottom, bottomContainerStyle === null || bottomContainerStyle === void 0 ? void 0 : bottomContainerStyle[position], (currentMessage === null || currentMessage === void 0 ? void 0 : currentMessage.reactionEmoji) && (currentMessage === null || currentMessage === void 0 || (_currentMessage$react2 = currentMessage.reactionEmoji) === null || _currentMessage$react2 === void 0 ? void 0 : _currentMessage$react2.length) > 0 && {
      marginBottom: 8
    }]
  }, renderUsername(), renderTime(), renderTicks())))), renderQuickReplies(), (currentMessage === null || currentMessage === void 0 ? void 0 : currentMessage.isSending) && /*#__PURE__*/React.createElement(View, {
    style: styles.content.sendingIndicator
  }, /*#__PURE__*/React.createElement(MaterialIndicator, {
    color: Color.defaultColor,
    size: 12,
    animationDuration: 6000
  })), (currentMessage === null || currentMessage === void 0 ? void 0 : currentMessage.errorMessage) && !(currentMessage !== null && currentMessage !== void 0 && currentMessage.isSending) && /*#__PURE__*/React.createElement(View, {
    style: styles.content.errorContainer
  }, /*#__PURE__*/React.createElement(FastImage, {
    source: require('../../assets/warning.png'),
    style: styles.content.errorIcon
  }), /*#__PURE__*/React.createElement(Text, {
    style: styles.content.errorText
  }, currentMessage === null || currentMessage === void 0 ? void 0 : currentMessage.errorMessage)));
};
const Bubble = /*#__PURE__*/memo(BubbleComponent);
export default Bubble;
//# sourceMappingURL=index.js.map