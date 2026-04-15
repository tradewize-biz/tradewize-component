"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  GiftedChat: true,
  Actions: true,
  Avatar: true,
  Bubble: true,
  Composer: true,
  Day: true,
  GiftedAvatar: true,
  InputToolbar: true,
  LoadEarlier: true,
  Message: true,
  MessageContainer: true,
  MessageText: true,
  Send: true,
  SystemMessage: true,
  Time: true,
  utils: true
};
Object.defineProperty(exports, "Actions", {
  enumerable: true,
  get: function () {
    return _Actions.Actions;
  }
});
Object.defineProperty(exports, "Avatar", {
  enumerable: true,
  get: function () {
    return _Avatar.Avatar;
  }
});
Object.defineProperty(exports, "Bubble", {
  enumerable: true,
  get: function () {
    return _Bubble.default;
  }
});
Object.defineProperty(exports, "Composer", {
  enumerable: true,
  get: function () {
    return _Composer.Composer;
  }
});
Object.defineProperty(exports, "Day", {
  enumerable: true,
  get: function () {
    return _Day.Day;
  }
});
Object.defineProperty(exports, "GiftedAvatar", {
  enumerable: true,
  get: function () {
    return _GiftedAvatar.GiftedAvatar;
  }
});
exports.GiftedChat = GiftedChatWrapper;
Object.defineProperty(exports, "InputToolbar", {
  enumerable: true,
  get: function () {
    return _InputToolbar.InputToolbar;
  }
});
Object.defineProperty(exports, "LoadEarlier", {
  enumerable: true,
  get: function () {
    return _LoadEarlier.LoadEarlier;
  }
});
Object.defineProperty(exports, "Message", {
  enumerable: true,
  get: function () {
    return _Message.default;
  }
});
Object.defineProperty(exports, "MessageContainer", {
  enumerable: true,
  get: function () {
    return _MessageContainer.default;
  }
});
Object.defineProperty(exports, "MessageText", {
  enumerable: true,
  get: function () {
    return _MessageText.MessageText;
  }
});
Object.defineProperty(exports, "Send", {
  enumerable: true,
  get: function () {
    return _Send.Send;
  }
});
Object.defineProperty(exports, "SystemMessage", {
  enumerable: true,
  get: function () {
    return _SystemMessage.SystemMessage;
  }
});
Object.defineProperty(exports, "Time", {
  enumerable: true,
  get: function () {
    return _Time.Time;
  }
});
exports.utils = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNativeActionSheet = require("@expo/react-native-action-sheet");
var _dayjs = _interopRequireDefault(require("dayjs"));
var _localizedFormat = _interopRequireDefault(require("dayjs/plugin/localizedFormat"));
var _reactNative = require("react-native");
var _clipboard = _interopRequireDefault(require("@react-native-clipboard/clipboard"));
var _Actions = require("../Actions");
var _Avatar = require("../Avatar");
var _Bubble = _interopRequireDefault(require("../Bubble"));
var _Composer = require("../Composer");
var _Constant = require("../Constant");
var _Day = require("../Day");
var _GiftedAvatar = require("../GiftedAvatar");
var _GiftedChatContext = require("../GiftedChatContext");
var _InputToolbar = require("../InputToolbar");
var _LoadEarlier = require("../LoadEarlier");
var _Message = _interopRequireDefault(require("../Message"));
var _MessageContainer = _interopRequireDefault(require("../MessageContainer"));
var _MessageText = require("../MessageText");
var _Send = require("../Send");
var _SystemMessage = require("../SystemMessage");
var _Time = require("../Time");
var _utils = _interopRequireWildcard(require("../utils"));
var utils = _utils;
exports.utils = _utils;
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _reactNativeKeyboardController = require("react-native-keyboard-controller");
var _reactNativeImageViewing = _interopRequireDefault(require("react-native-image-viewing"));
var _styles = _interopRequireDefault(require("../styles"));
var _styles2 = _interopRequireDefault(require("./styles"));
var _MessageWithReaction = require("../MessageWithReaction");
var _MediaAllShow = require("../MediaAllShow");
var _reactNativeImageCropPicker = _interopRequireDefault(require("react-native-image-crop-picker"));
var _VideoModal = require("../../VideoPlayer/VideoModal");
var _Camera = require("../../Camera");
var _types = require("../types");
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
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); } /* eslint-disable react-native/no-inline-styles */
_dayjs.default.extend(_localizedFormat.default);
function GiftedChat(props) {
  const {
    messages = [],
    initialText = '',
    isTyping,
    // "random" function from here: https://stackoverflow.com/a/8084248/3452513
    // we do not use uuid since it would add extra native dependency (https://www.npmjs.com/package/react-native-get-random-values)
    // lib's user can decide which algorithm to use and pass it as a prop
    messageIdGenerator = () => (Math.random() + 1).toString(36).substring(7) + (0, _dayjs.default)().valueOf(),
    user = {},
    onSend,
    locale = 'en',
    renderLoading,
    actionSheet = null,
    textInputProps,
    renderChatFooter = null,
    renderInputToolbar = null,
    bottomOffset = 0,
    focusOnInputWhenOpeningKeyboard = true,
    keyboardShouldPersistTaps = _reactNative.Platform.select({
      ios: 'never',
      android: 'always',
      default: 'never'
    }),
    onInputTextChanged = null,
    maxInputLength = null,
    inverted = true,
    minComposerHeight = _Constant.MIN_COMPOSER_HEIGHT,
    maxComposerHeight = _Constant.MAX_COMPOSER_HEIGHT,
    isKeyboardInternallyHandled = true,
    onReactionEmoji = null,
    labelReaction,
    onFocusInput,
    onBlurInput,
    isShowEmojiReaction = true,
    useScrollView = false
  } = props;
  const actionSheetRef = (0, _react.useRef)(null);
  const messageContainerRef = (0, _react.useMemo)(() => props.messageContainerRef || /*#__PURE__*/(0, _react.createRef)(), [props.messageContainerRef]);
  const textInputRef = (0, _react.useMemo)(() => props.textInputRef || /*#__PURE__*/(0, _react.createRef)(), [props.textInputRef]);
  const isTextInputWasFocused = (0, _react.useRef)(false);
  const [isInitialized, setIsInitialized] = (0, _react.useState)(false);
  const [composerHeight, setComposerHeight] = (0, _react.useState)(minComposerHeight ?? _Constant.MIN_COMPOSER_HEIGHT);
  const [text, setText] = (0, _react.useState)(() => props.text || '');
  const [isImageViewerVisible, setIsImageViewerVisible] = (0, _react.useState)(false);
  const [fileSelected, setFileSelected] = (0, _react.useState)(null);
  const [isShowVideoModal, setIsShowVideoModal] = (0, _react.useState)(false);
  const [isTypingDisabled, setIsTypingDisabled] = (0, _react.useState)(false);
  const [isShowCameraModal, setIsShowCameraModal] = (0, _react.useState)(false);
  const [isMediaAllShow, setIsMediaAllShow] = (0, _react.useState)(false);
  const [fileMediaAllLocal, setFileMediaAllLocal] = (0, _react.useState)(null);
  const arrMessage = (0, _react.useMemo)(() => inverted ? messages : [...messages].reverse(), [messages, inverted]);
  const [messageReaction, setMessageReaction] = (0, _react.useState)(null);
  const [isModalReaction, setIsModalReaction] = (0, _react.useState)(false);
  const [messageSelected, setMessageSelected] = (0, _react.useState)(null);
  const [fileMedia, setFileMedia] = (0, _react.useState)([]);
  const keyboard = (0, _reactNativeKeyboardController.useReanimatedKeyboardAnimation)();
  const trackingKeyboardMovement = (0, _reactNativeReanimated.useSharedValue)(false);
  const debounceEnableTypingTimeoutId = (0, _react.useRef)(undefined);
  const keyboardOffsetBottom = (0, _reactNativeReanimated.useSharedValue)(0);
  const contentStyleAnim = (0, _reactNativeReanimated.useAnimatedStyle)(() => ({
    transform: [{
      translateY: keyboard.height.value - keyboardOffsetBottom.value
    }]
  }), [keyboard, keyboardOffsetBottom]);
  const getTextFromProp = (0, _react.useCallback)(fallback => {
    if (props.text === undefined) return fallback;
    return props.text;
  }, [props.text]);

  /**
   * Store text input focus status when keyboard hide to retrieve
   * it afterwards if needed.
   * `onKeyboardWillHide` may be called twice in sequence so we
   * make a guard condition (eg. showing image picker)
   */
  const handleTextInputFocusWhenKeyboardHide = (0, _react.useCallback)(() => {
    var _textInputRef$current;
    if (!isTextInputWasFocused.current) isTextInputWasFocused.current = ((_textInputRef$current = textInputRef.current) === null || _textInputRef$current === void 0 ? void 0 : _textInputRef$current.isFocused()) || false;
  }, [textInputRef]);

  /**
   * Refocus the text input only if it was focused before showing keyboard.
   * This is needed in some cases (eg. showing image picker).
   */
  const handleTextInputFocusWhenKeyboardShow = (0, _react.useCallback)(() => {
    if (textInputRef.current && isTextInputWasFocused.current && !textInputRef.current.isFocused()) textInputRef.current.focus();

    // Reset the indicator since the keyboard is shown
    isTextInputWasFocused.current = false;
  }, [textInputRef]);
  const disableTyping = (0, _react.useCallback)(() => {
    clearTimeout(debounceEnableTypingTimeoutId.current);
    setIsTypingDisabled(true);
  }, []);
  const enableTyping = (0, _react.useCallback)(() => {
    clearTimeout(debounceEnableTypingTimeoutId.current);
    setIsTypingDisabled(false);
  }, []);
  const debounceEnableTyping = (0, _react.useCallback)(() => {
    clearTimeout(debounceEnableTypingTimeoutId.current);
    debounceEnableTypingTimeoutId.current = setTimeout(() => {
      enableTyping();
    }, 50);
  }, [enableTyping]);
  const scrollToBottom = (0, _react.useCallback)((isAnimated = true) => {
    if (!(messageContainerRef !== null && messageContainerRef !== void 0 && messageContainerRef.current)) return;

    // Type-safe check for ScrollView
    if ('scrollTo' in messageContainerRef.current && 'scrollToEnd' in messageContainerRef.current) {
      // ScrollView case
      const scrollViewRef = messageContainerRef.current;
      if (inverted) {
        scrollViewRef.scrollTo({
          y: 0,
          animated: isAnimated
        });
      } else {
        scrollViewRef.scrollToEnd({
          animated: isAnimated
        });
      }
    } else if ('scrollToOffset' in messageContainerRef.current) {
      // AnimatedList case
      const animatedListRef = messageContainerRef.current;
      if (inverted) {
        animatedListRef.scrollToOffset({
          offset: 0,
          animated: isAnimated
        });
      } else {
        if ('scrollToEnd' in animatedListRef) {
          animatedListRef.scrollToEnd({
            animated: isAnimated
          });
        }
      }
    }
  }, [inverted, messageContainerRef]);
  const handlePressFile = (0, _react.useCallback)(file => {
    const type = file === null || file === void 0 ? void 0 : file.typeFile;
    switch (type) {
      case 'video':
        setFileSelected({
          uri: file.uri
        });
        setTimeout(() => {
          setIsShowVideoModal(true);
        }, 100);
        break;
      case 'image':
        setFileSelected({
          uri: file.uri
        });
        setTimeout(() => {
          setIsImageViewerVisible(true);
        }, 100);
        break;
      default:
        break;
    }
  }, []);
  const onLongPressReaction = (0, _react.useCallback)((message, position) => {
    setMessageSelected({
      message,
      position
    });
    setTimeout(() => {
      setIsModalReaction(true);
    }, 100);
  }, []);
  const onPressFile = (0, _react.useCallback)((file, isShowAll, arrMedia) => {
    if (isShowAll) {
      setFileMediaAllLocal(arrMedia || {});
      setTimeout(() => {
        setIsMediaAllShow(true);
      }, 100);
      return;
    }
    handlePressFile(file);
  }, [handlePressFile]);
  const renderMessages = (0, _react.useMemo)(() => {
    if (!isInitialized) return null;
    const {
      messagesContainerStyle,
      ...messagesContainerProps
    } = props;
    return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
      style: [_styles.default.fill, messagesContainerStyle]
    }, /*#__PURE__*/_react.default.createElement(_MessageContainer.default, _extends({}, messagesContainerProps, {
      invertibleScrollViewProps: {
        inverted,
        keyboardShouldPersistTaps
      },
      messages: arrMessage,
      forwardRef: messageContainerRef,
      isTyping: isTyping,
      useScrollView: useScrollView,
      onLongPressReaction: onLongPressReaction,
      onPressFile: onPressFile
    })), renderChatFooter === null || renderChatFooter === void 0 ? void 0 : renderChatFooter());
  }, [isInitialized, isTyping, arrMessage, inverted, keyboardShouldPersistTaps, messageContainerRef, renderChatFooter, useScrollView, onLongPressReaction, onPressFile, props]);
  const notifyInputTextReset = (0, _react.useCallback)(() => {
    onInputTextChanged === null || onInputTextChanged === void 0 || onInputTextChanged('');
  }, [onInputTextChanged]);
  const resetInputToolbar = (0, _react.useCallback)(() => {
    var _textInputRef$current2;
    (_textInputRef$current2 = textInputRef.current) === null || _textInputRef$current2 === void 0 || _textInputRef$current2.clear();
    notifyInputTextReset();
    setComposerHeight(minComposerHeight);
    setText(getTextFromProp(''));
    enableTyping();
  }, [minComposerHeight, getTextFromProp, textInputRef, notifyInputTextReset, enableTyping]);
  const _onSend = (0, _react.useCallback)(
  // eslint-disable-next-line @typescript-eslint/no-shadow
  (messages = [], shouldResetInputToolbar = false) => {
    var _messages$, _messages;
    if (!Array.isArray(messages)) messages = [messages];
    if (!((_messages$ = messages[0]) !== null && _messages$ !== void 0 && _messages$.text) && (fileMedia === null || fileMedia === void 0 ? void 0 : fileMedia.length) <= 0) return;
    const convertFileMedia = fileMedia === null || fileMedia === void 0 ? void 0 : fileMedia.map(item => {
      return {
        ...item,
        uri: (item === null || item === void 0 ? void 0 : item.uri) || '',
        thumbnailPreview: (item === null || item === void 0 ? void 0 : item.thumbnailPreview) || '',
        mine: utils.getFileTypeFromPath((item === null || item === void 0 ? void 0 : item.uri) || '')
      };
    });
    const newMessages = (_messages = messages) === null || _messages === void 0 ? void 0 : _messages.map(message => {
      return {
        ...message,
        user: user,
        createdAt: new Date(),
        _id: messageIdGenerator === null || messageIdGenerator === void 0 ? void 0 : messageIdGenerator(),
        file: convertFileMedia
      };
    });
    if (shouldResetInputToolbar === true) {
      disableTyping();
      resetInputToolbar();
    }
    setFileMedia([]);
    let newMessagesWithReaction = newMessages;
    if (messageReaction && messageReaction !== null && messageReaction !== void 0 && messageReaction.isReply) {
      newMessagesWithReaction = newMessages.map(message => {
        return {
          ...message,
          messageReply: messageReaction
        };
      });
    }
    setMessageReaction(null);
    onSend === null || onSend === void 0 || onSend(newMessagesWithReaction);
    setTimeout(() => scrollToBottom(), 10);
  }, [onSend, user, messageIdGenerator, fileMedia, disableTyping, resetInputToolbar, scrollToBottom, messageReaction]);
  const onInputSizeChanged = (0, _react.useCallback)(size => {
    const newComposerHeight = Math.max(minComposerHeight, Math.min(maxComposerHeight, size.height));
    setComposerHeight(newComposerHeight);
  }, [maxComposerHeight, minComposerHeight]);
  const _onInputTextChanged = (0, _react.useCallback)(_text => {
    if (isTypingDisabled) return;
    onInputTextChanged === null || onInputTextChanged === void 0 || onInputTextChanged(_text);

    // Only set state if it's not being overridden by a prop.
    if (props.text === undefined) setText(_text);
  }, [onInputTextChanged, isTypingDisabled, props.text]);
  const onPressPickMedia = (0, _react.useCallback)(async type => {
    if (type === 'camera') {
      setIsShowCameraModal(true);
    } else {
      const result = await _reactNativeImageCropPicker.default.openPicker({
        multiple: true
      });
      const fileMediaAll = result === null || result === void 0 ? void 0 : result.map(item => {
        const uri = item.path || item.sourceURL;
        return {
          uri: uri,
          id: (0, _dayjs.default)().valueOf().toString() + (item === null || item === void 0 ? void 0 : item.filename),
          size: (item === null || item === void 0 ? void 0 : item.size) || 0,
          name: (item === null || item === void 0 ? void 0 : item.filename) || '',
          fileExtension: `.${uri === null || uri === void 0 ? void 0 : uri.split('.').pop()}` || '',
          typeFile: 'image',
          thumbnailPreview: uri,
          width: item === null || item === void 0 ? void 0 : item.width,
          height: item === null || item === void 0 ? void 0 : item.height
        };
      });
      setFileMedia(prev => [...prev, ...fileMediaAll]);
    }
  }, []);
  const onInitialLayoutViewLayout = (0, _react.useCallback)(e => {
    if (isInitialized) return;
    const {
      layout
    } = e.nativeEvent;
    if (layout.height <= 0) return;
    notifyInputTextReset();
    setIsInitialized(true);
    setComposerHeight(minComposerHeight);
    setText(getTextFromProp(initialText));
  }, [isInitialized, initialText, minComposerHeight, notifyInputTextReset, getTextFromProp]);
  const handleRemoveFile = (0, _react.useCallback)(file => {
    setFileMedia(prev => prev.filter(item => item.id !== file.id));
  }, []);
  const clearMessageReaction = (0, _react.useCallback)(() => {
    setMessageReaction(null);
  }, []);
  const inputToolbarFragment = (0, _react.useMemo)(() => {
    var _messageReaction$user;
    if (!isInitialized) return null;
    const inputToolbarProps = {
      ...props,
      text: getTextFromProp(text),
      composerHeight: Math.max(minComposerHeight ?? _Constant.MIN_COMPOSER_HEIGHT, composerHeight),
      onSend: _onSend,
      onInputSizeChanged,
      onTextChanged: _onInputTextChanged,
      textInputProps: {
        ...textInputProps,
        ref: textInputRef,
        maxLength: isTypingDisabled ? 0 : maxInputLength
      }
    };
    if (renderInputToolbar) return renderInputToolbar(inputToolbarProps);
    return /*#__PURE__*/_react.default.createElement(_InputToolbar.InputToolbar, _extends({
      isMe: (user === null || user === void 0 ? void 0 : user._id) === (messageReaction === null || messageReaction === void 0 || (_messageReaction$user = messageReaction.user) === null || _messageReaction$user === void 0 ? void 0 : _messageReaction$user._id),
      onFocusInput: onFocusInput,
      onBlurInput: onBlurInput,
      labelReaction: labelReaction,
      messageReaction: messageReaction,
      clearMessageReaction: clearMessageReaction,
      onRemoveFile: handleRemoveFile,
      onPressFile: handlePressFile,
      fileMedia: fileMedia,
      onPressPickMedia: onPressPickMedia,
      disableComposer: props.disableComposer
    }, inputToolbarProps));
  }, [isInitialized, _onSend, getTextFromProp, maxInputLength, minComposerHeight, onInputSizeChanged, text, renderInputToolbar, composerHeight, isTypingDisabled, textInputRef, textInputProps, _onInputTextChanged, onPressPickMedia, fileMedia, handlePressFile, handleRemoveFile, clearMessageReaction, messageReaction, labelReaction, onFocusInput, onBlurInput, user, props]);
  const handleReactionEmoji = (0, _react.useCallback)((emoji, messageId) => {
    onReactionEmoji === null || onReactionEmoji === void 0 || onReactionEmoji(emoji, messageId);
  }, [onReactionEmoji]);
  const handleActionReaction = (0, _react.useCallback)((message, action) => {
    switch (action) {
      case 'reply':
        setMessageReaction({
          ...message,
          isReply: true
        });
        break;
      case 'copy':
        _clipboard.default.setString(message.text || '');
        break;
      case 'other':
        break;
      default:
        setMessageReaction(null);
    }
  }, []);
  const contextValues = (0, _react.useMemo)(() => ({
    actionSheet: actionSheet || (() => ({
      showActionSheetWithOptions: actionSheetRef.current.showActionSheetWithOptions
    })),
    getLocale: () => locale
  }), [actionSheet, locale]);
  (0, _react.useEffect)(() => {
    if (props.text != null) setText(props.text);
  }, [props.text]);
  (0, _reactNativeReanimated.useAnimatedReaction)(() => -keyboard.height.value, (value, prevValue) => {
    if (prevValue !== null && value !== prevValue) {
      const isKeyboardMovingUp = value > prevValue;
      if (isKeyboardMovingUp !== trackingKeyboardMovement.value) {
        trackingKeyboardMovement.value = isKeyboardMovingUp;
        keyboardOffsetBottom.value = (0, _reactNativeReanimated.withTiming)(isKeyboardMovingUp ? bottomOffset : 0, {
          // If `bottomOffset` exists, we change the duration to a smaller value to fix the delay in the keyboard animation speed
          duration: bottomOffset ? 150 : 400
        });
        if (focusOnInputWhenOpeningKeyboard) if (isKeyboardMovingUp) (0, _reactNativeReanimated.runOnJS)(handleTextInputFocusWhenKeyboardShow)();else (0, _reactNativeReanimated.runOnJS)(handleTextInputFocusWhenKeyboardHide)();
        if (value === 0) {
          (0, _reactNativeReanimated.runOnJS)(enableTyping)();
        } else {
          (0, _reactNativeReanimated.runOnJS)(disableTyping)();
          (0, _reactNativeReanimated.runOnJS)(debounceEnableTyping)();
        }
      }
    }
  }, [keyboard, trackingKeyboardMovement, focusOnInputWhenOpeningKeyboard, handleTextInputFocusWhenKeyboardHide, handleTextInputFocusWhenKeyboardShow, enableTyping, disableTyping, debounceEnableTyping, bottomOffset]);
  return /*#__PURE__*/_react.default.createElement(_GiftedChatContext.GiftedChatContext.Provider, {
    value: contextValues
  }, /*#__PURE__*/_react.default.createElement(_reactNativeActionSheet.ActionSheetProvider, {
    ref: actionSheetRef
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    testID: _Constant.TEST_ID.WRAPPER,
    style: [_styles.default.fill, _styles2.default.contentContainer],
    onLayout: onInitialLayoutViewLayout
  }, isInitialized ? /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    style: [_styles.default.fill, isKeyboardInternallyHandled && contentStyleAnim]
  }, renderMessages, inputToolbarFragment, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: 'box-none',
      backgroundColor: 'transparent'
    }
  }, /*#__PURE__*/_react.default.createElement(_reactNativeImageViewing.default, {
    images: fileSelected ? [{
      uri: fileSelected.uri
    }] : [],
    imageIndex: 0,
    visible: isImageViewerVisible,
    onRequestClose: () => setIsImageViewerVisible(false)
  }), /*#__PURE__*/_react.default.createElement(_VideoModal.VideoModal, {
    txtSkipButton: 'X',
    visible: isShowVideoModal,
    onClose: () => setIsShowVideoModal(false),
    subtitle: {},
    source: (fileSelected === null || fileSelected === void 0 ? void 0 : fileSelected.uri) || '',
    autoPlay: true,
    isProgressBar: false
  }), /*#__PURE__*/_react.default.createElement(_MessageWithReaction.MessageWithReaction, {
    isShowEmoji: isShowEmojiReaction,
    onReactionEmoji: handleReactionEmoji,
    onActionReaction: handleActionReaction,
    user: user,
    isVisible: isModalReaction,
    onClose: () => setIsModalReaction(false),
    message: (messageSelected === null || messageSelected === void 0 ? void 0 : messageSelected.message) || {},
    position: (messageSelected === null || messageSelected === void 0 ? void 0 : messageSelected.position) || {}
  }), /*#__PURE__*/_react.default.createElement(_MediaAllShow.MediaAllShow, {
    fileMediaAll: fileMediaAllLocal,
    isVisible: isMediaAllShow,
    onClose: () => setIsMediaAllShow(false),
    onPressFile: file => {
      setIsMediaAllShow(false);
      setTimeout(() => {
        handlePressFile(file);
      }, 350);
    }
  }), /*#__PURE__*/_react.default.createElement(_Camera.CameraModal, {
    mode: "both",
    isCanPause: false,
    onVideoRecorded: async video => {
      var _video$path, _video$path2, _getThumbnail$;
      const getThumbnail = await (0, _utils.generateThumbnails)([{
        uri: (0, _utils.normalizeFileUri)(video.path),
        id: (0, _dayjs.default)().valueOf().toString(),
        size: (video === null || video === void 0 ? void 0 : video.size) || 0
      }]);
      setIsShowCameraModal(false);
      const videoFile = {
        uri: (0, _utils.normalizeFileUri)(video.path),
        id: (0, _dayjs.default)().valueOf().toString(),
        size: (video === null || video === void 0 ? void 0 : video.size) || 0,
        name: (video === null || video === void 0 || (_video$path = video.path) === null || _video$path === void 0 ? void 0 : _video$path.split('/').pop()) || `video - ${(0, _dayjs.default)().valueOf().toString()}`,
        fileExtension: `.${video === null || video === void 0 || (_video$path2 = video.path) === null || _video$path2 === void 0 ? void 0 : _video$path2.split('.').pop()}`,
        typeFile: 'video',
        width: video === null || video === void 0 ? void 0 : video.width,
        height: video === null || video === void 0 ? void 0 : video.height,
        duration: video === null || video === void 0 ? void 0 : video.duration,
        thumbnailPreview: ((_getThumbnail$ = getThumbnail[0]) === null || _getThumbnail$ === void 0 ? void 0 : _getThumbnail$.path) || ''
      };
      setFileMedia(prev => [...prev, videoFile]);
    },
    onPhotoCaptured: photo => {
      var _photo$path, _photo$path2;
      setIsShowCameraModal(false);
      const img = {
        uri: (0, _utils.normalizeFileUri)(photo.path),
        id: (0, _dayjs.default)().valueOf().toString(),
        size: (photo === null || photo === void 0 ? void 0 : photo.size) || 0,
        name: (photo === null || photo === void 0 || (_photo$path = photo.path) === null || _photo$path === void 0 ? void 0 : _photo$path.split('/').pop()) || `image - ${(0, _dayjs.default)().valueOf().toString()}`,
        fileExtension: `.${photo === null || photo === void 0 || (_photo$path2 = photo.path) === null || _photo$path2 === void 0 ? void 0 : _photo$path2.split('.').pop()}`,
        typeFile: 'image',
        thumbnailPreview: (0, _utils.normalizeFileUri)((photo === null || photo === void 0 ? void 0 : photo.path) || ''),
        width: photo === null || photo === void 0 ? void 0 : photo.width,
        height: photo === null || photo === void 0 ? void 0 : photo.height
      };
      setFileMedia(prev => [...prev, img]);
    },
    visible: isShowCameraModal,
    onClose: () => setIsShowCameraModal(false)
  }))) : renderLoading === null || renderLoading === void 0 ? void 0 : renderLoading())));
}
function GiftedChatWrapper(props) {
  return /*#__PURE__*/_react.default.createElement(_reactNativeKeyboardController.KeyboardProvider, null, /*#__PURE__*/_react.default.createElement(GiftedChat, props));
}
GiftedChatWrapper.append = (currentMessages = [], messages, inverted = true) => {
  if (!Array.isArray(messages)) messages = [messages];
  return inverted ? messages.concat(currentMessages) : currentMessages.concat(messages);
};
GiftedChatWrapper.prepend = (currentMessages = [], messages, inverted = true) => {
  if (!Array.isArray(messages)) messages = [messages];
  return inverted ? currentMessages.concat(messages) : messages.concat(currentMessages);
};
//# sourceMappingURL=index.js.map