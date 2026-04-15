"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {};
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _GiftedChatContext = require("../GiftedChatContext");
var _QuickReplies = require("../QuickReplies");
var _MessageText = require("../MessageText");
var _MessageAudio = require("../MessageAudio");
var _Time = require("../Time");
var _utils = require("../utils");
var _styles = _interopRequireDefault(require("../styles"));
var _styles2 = _interopRequireDefault(require("./styles"));
var _MessageFile = require("../MessageFile");
var _Color = _interopRequireDefault(require("../Color"));
var _MessageReply = require("../MessageReply");
var _IndicatorsMaster = require("../../IndicatorsMaster");
var _reactNativeFastImage = _interopRequireDefault(require("react-native-fast-image"));
var _types = require("./types");
Object.keys(_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _types[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _types[key];
    }
  });
});
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); } /* eslint-disable react-native/no-inline-styles */ /* eslint-disable @typescript-eslint/no-shadow */
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
  const context = (0, _GiftedChatContext.useChatContext)();
  const [messageWidth, setMessageWidth] = (0, _react.useState)(null);
  const innerRef = (0, _react.useRef)(null);
  const refArrThumbnail = (0, _react.useRef)([]);
  const onPress = (0, _react.useCallback)(() => {
    if (props.onPress) props.onPress(context, currentMessage);
  }, [context, props, currentMessage]);
  const onLongPress = (0, _react.useCallback)(() => {
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
  const onLongPressItem = (0, _react.useCallback)(() => {
    try {
      if (innerRef.current) {
        const node = (0, _reactNative.findNodeHandle)(innerRef.current);
        if (node) {
          _reactNative.UIManager.measure(node, (x, y, width, height, pageX, pageY) => {
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
  const styledBubbleToPrevious = (0, _react.useCallback)(() => {
    if (currentMessage && previousMessage && position && (0, _utils.isSameUser)(currentMessage, previousMessage) && (0, _utils.isSameDay)(currentMessage, previousMessage)) return [_styles2.default[position].containerToPrevious, containerToPreviousStyle && containerToPreviousStyle[position]];
    return null;
  }, [currentMessage, previousMessage, position, containerToPreviousStyle]);
  const renderQuickReplies = (0, _react.useCallback)(() => {
    if (currentMessage !== null && currentMessage !== void 0 && currentMessage.quickReplies) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {
        containerStyle,
        wrapperStyle,
        ...quickReplyProps
      } = props;
      if (props.renderQuickReplies) return props.renderQuickReplies(quickReplyProps);
      return /*#__PURE__*/_react.default.createElement(_QuickReplies.QuickReplies, {
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
  const onSaveThumbnail = (0, _react.useCallback)(file => {
    refArrThumbnail.current = file;
  }, []);
  const renderMessageText = (0, _react.useCallback)(() => {
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
      return /*#__PURE__*/_react.default.createElement(_MessageText.MessageText, messageTextProps);
    }
    return null;
  }, [props, currentMessage]);
  const renderMessageFile = (0, _react.useCallback)(() => {
    if (!(currentMessage !== null && currentMessage !== void 0 && currentMessage.file)) return null;
    const {
      /* eslint-disable @typescript-eslint/no-unused-vars */
      containerStyle,
      wrapperStyle,
      /* eslint-enable @typescript-eslint/no-unused-vars */
      ...messageFileProps
    } = props;
    if (props.renderCustomMessageFile) return props.renderCustomMessageFile(messageFileProps);
    return /*#__PURE__*/_react.default.createElement(_MessageFile.MessageFile, _extends({
      onLongPressFile: onLongPressItem,
      onSaveThumbnail: onSaveThumbnail,
      onPressFile: onPressFile,
      messageWidth: messageWidth
    }, messageFileProps));
  }, [currentMessage, props, messageWidth, onPressFile, onSaveThumbnail, onLongPressItem]);
  const renderMessageAudio = (0, _react.useCallback)(() => {
    if (!(currentMessage !== null && currentMessage !== void 0 && currentMessage.audio)) return null;
    const {
      /* eslint-disable @typescript-eslint/no-unused-vars */
      containerStyle,
      wrapperStyle,
      /* eslint-enable @typescript-eslint/no-unused-vars */
      ...messageAudioProps
    } = props;
    if (props.renderMessageAudio) return props.renderMessageAudio(messageAudioProps);
    return /*#__PURE__*/_react.default.createElement(_MessageAudio.MessageAudio, null);
  }, [props, currentMessage]);
  const renderTicks = (0, _react.useCallback)(() => {
    const {
      renderTicks,
      user
    } = props;
    if (renderTicks && currentMessage) return renderTicks(currentMessage);
    if (user && currentMessage !== null && currentMessage !== void 0 && currentMessage.user && currentMessage.user._id !== user._id) return null;
    if (currentMessage && (currentMessage.sent || currentMessage.received || currentMessage.pending)) return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
      style: _styles2.default.content.tickView
    }, !!currentMessage.sent && /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
      style: [_styles2.default.content.tick, props.tickStyle]
    }, '✓'), !!currentMessage.received && /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
      style: [_styles2.default.content.tick, props.tickStyle]
    }, '✓'), !!currentMessage.pending && /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
      style: [_styles2.default.content.tick, props.tickStyle]
    }, '🕓'));
    return null;
  }, [props, currentMessage]);
  const renderTime = (0, _react.useCallback)(() => {
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
      return /*#__PURE__*/_react.default.createElement(_Time.Time, timeProps);
    }
    return null;
  }, [props, currentMessage]);
  const renderUsername = (0, _react.useCallback)(() => {
    const {
      user,
      renderUsername
    } = props;
    if (props.renderUsernameOnMessage && currentMessage) {
      if (user && currentMessage.user._id === user._id) return null;
      if (renderUsername) return renderUsername(currentMessage.user);
      return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
        style: _styles2.default.content.usernameView
      }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
        style: [_styles2.default.content.username, props.usernameStyle]
      }, '~ ', currentMessage.user.name));
    }
    return null;
  }, [currentMessage, props]);
  const renderCustomView = (0, _react.useCallback)(() => {
    if (props.renderCustomView) return props.renderCustomView(props);
    return null;
  }, [props]);
  const renderReactionEmoji = (0, _react.useCallback)(() => {
    var _props$user;
    const isCurrentUser = currentMessage.user._id === (props === null || props === void 0 || (_props$user = props.user) === null || _props$user === void 0 ? void 0 : _props$user._id);
    const reactionPosition = isCurrentUser ? 'right' : 'left';
    const reactionEmoji = [...new Set((Array.isArray(currentMessage === null || currentMessage === void 0 ? void 0 : currentMessage.reactionEmoji) ? currentMessage.reactionEmoji : []).map(item => item === null || item === void 0 ? void 0 : item.reaction))];
    if (reactionEmoji && (reactionEmoji === null || reactionEmoji === void 0 ? void 0 : reactionEmoji.length) > 0) {
      var _currentMessage$react;
      return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
        style: [_styles2.default.content.reactionContainer, {
          width: 18 * (reactionEmoji === null || reactionEmoji === void 0 ? void 0 : reactionEmoji.length) + 12
        }, reactionPosition === 'right' && {
          left: reactionEmoji !== null && reactionEmoji !== void 0 && reactionEmoji.length ? -12 * ((reactionEmoji === null || reactionEmoji === void 0 ? void 0 : reactionEmoji.length) - 1) : -12
        }, reactionPosition === 'left' && {
          right: reactionEmoji !== null && reactionEmoji !== void 0 && reactionEmoji.length ? -12 * ((reactionEmoji === null || reactionEmoji === void 0 ? void 0 : reactionEmoji.length) - 1) : -12
        }]
      }, reactionEmoji === null || reactionEmoji === void 0 ? void 0 : reactionEmoji.map((item, index) => /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
        key: index,
        style: _styles2.default.content.reactionEmojiText
      }, item)), /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
        style: _styles2.default.content.reactionCountText
      }, currentMessage === null || currentMessage === void 0 || (_currentMessage$react = currentMessage.reactionEmoji) === null || _currentMessage$react === void 0 ? void 0 : _currentMessage$react.length));
    }
    return null;
  }, [currentMessage.reactionEmoji, currentMessage.user._id, props === null || props === void 0 || (_props$user2 = props.user) === null || _props$user2 === void 0 ? void 0 : _props$user2._id]);
  const renderBubbleContent = (0, _react.useCallback)(() => {
    return /*#__PURE__*/_react.default.createElement(_reactNative.View, null, !props.isCustomViewBottom && renderCustomView(), renderMessageFile(), renderMessageAudio(), renderMessageText(), renderReactionEmoji(), props.isCustomViewBottom && renderCustomView());
  }, [renderCustomView, renderMessageAudio, renderMessageText, props.isCustomViewBottom, renderMessageFile, renderReactionEmoji]);
  const renderMessageReply = (0, _react.useCallback)(() => {
    if (currentMessage !== null && currentMessage !== void 0 && currentMessage.messageReply) {
      return /*#__PURE__*/_react.default.createElement(_MessageReply.MessageReply, {
        messageReply: currentMessage === null || currentMessage === void 0 ? void 0 : currentMessage.messageReply,
        onSaveThumbnail: onSaveThumbnail,
        onPressFile: onPressFile
      });
    }
    return null;
  }, [currentMessage, onSaveThumbnail, onPressFile]);
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [_styles.default.fill, _styles2.default[position].container, containerStyle && containerStyle[position], {
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
  }, (currentMessage === null || currentMessage === void 0 ? void 0 : currentMessage.isShowName) && /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: _styles2.default.content.layoutName
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    numberOfLines: 1,
    style: _styles2.default.content.name
  }, currentMessage === null || currentMessage === void 0 || (_currentMessage$user = currentMessage.user) === null || _currentMessage$user === void 0 ? void 0 : _currentMessage$user.name)), renderMessageReply(), /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [_styles2.default[position].wrapper, styledBubbleToPrevious(), wrapperStyle && wrapperStyle[position]]
  }, /*#__PURE__*/_react.default.createElement(_reactNative.TouchableWithoutFeedback, _extends({
    onPress: onPress,
    onLongPress: onLongPressItem || onLongPress,
    delayLongPress: 100
  }, props.touchableProps), /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    ref: innerRef
  }, renderBubbleContent(), /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [_styles2.default[position].bottom, bottomContainerStyle === null || bottomContainerStyle === void 0 ? void 0 : bottomContainerStyle[position], (currentMessage === null || currentMessage === void 0 ? void 0 : currentMessage.reactionEmoji) && (currentMessage === null || currentMessage === void 0 || (_currentMessage$react2 = currentMessage.reactionEmoji) === null || _currentMessage$react2 === void 0 ? void 0 : _currentMessage$react2.length) > 0 && {
      marginBottom: 8
    }]
  }, renderUsername(), renderTime(), renderTicks())))), renderQuickReplies(), (currentMessage === null || currentMessage === void 0 ? void 0 : currentMessage.isSending) && /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: _styles2.default.content.sendingIndicator
  }, /*#__PURE__*/_react.default.createElement(_IndicatorsMaster.MaterialIndicator, {
    color: _Color.default.defaultColor,
    size: 12,
    animationDuration: 6000
  })), (currentMessage === null || currentMessage === void 0 ? void 0 : currentMessage.errorMessage) && !(currentMessage !== null && currentMessage !== void 0 && currentMessage.isSending) && /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: _styles2.default.content.errorContainer
  }, /*#__PURE__*/_react.default.createElement(_reactNativeFastImage.default, {
    source: require('../../assets/warning.png'),
    style: _styles2.default.content.errorIcon
  }), /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: _styles2.default.content.errorText
  }, currentMessage === null || currentMessage === void 0 ? void 0 : currentMessage.errorMessage)));
};
const Bubble = /*#__PURE__*/(0, _react.memo)(BubbleComponent);
var _default = exports.default = Bubble;
//# sourceMappingURL=index.js.map