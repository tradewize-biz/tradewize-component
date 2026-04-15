function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* eslint-disable react-native/no-inline-styles */
import React, { createRef, useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { Platform, View } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { Actions } from '../Actions';
import { Avatar } from '../Avatar';
import Bubble from '../Bubble';
import { Composer } from '../Composer';
import { MAX_COMPOSER_HEIGHT, MIN_COMPOSER_HEIGHT, TEST_ID } from '../Constant';
import { Day } from '../Day';
import { GiftedAvatar } from '../GiftedAvatar';
import { GiftedChatContext } from '../GiftedChatContext';
import { InputToolbar } from '../InputToolbar';
import { LoadEarlier } from '../LoadEarlier';
import Message from '../Message';
import MessageContainer from '../MessageContainer';
import { MessageText } from '../MessageText';
import { Send } from '../Send';
import { SystemMessage } from '../SystemMessage';
import { Time } from '../Time';
import * as utils from '../utils';
import Animated, { useAnimatedStyle, useAnimatedReaction, useSharedValue, withTiming, runOnJS } from 'react-native-reanimated';
import { KeyboardProvider, useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller';
import ImageView from 'react-native-image-viewing';
import stylesCommon from '../styles';
import styles from './styles';
import { MessageWithReaction } from '../MessageWithReaction';
import { MediaAllShow } from '../MediaAllShow';
import { generateThumbnails, normalizeFileUri } from '../utils';
import ImageCropPicker from 'react-native-image-crop-picker';
import { VideoModal } from '../../VideoPlayer/VideoModal';
import { CameraModal } from '../../Camera';
dayjs.extend(localizedFormat);
function GiftedChat(props) {
  const {
    messages = [],
    initialText = '',
    isTyping,
    // "random" function from here: https://stackoverflow.com/a/8084248/3452513
    // we do not use uuid since it would add extra native dependency (https://www.npmjs.com/package/react-native-get-random-values)
    // lib's user can decide which algorithm to use and pass it as a prop
    messageIdGenerator = () => (Math.random() + 1).toString(36).substring(7) + dayjs().valueOf(),
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
    keyboardShouldPersistTaps = Platform.select({
      ios: 'never',
      android: 'always',
      default: 'never'
    }),
    onInputTextChanged = null,
    maxInputLength = null,
    inverted = true,
    minComposerHeight = MIN_COMPOSER_HEIGHT,
    maxComposerHeight = MAX_COMPOSER_HEIGHT,
    isKeyboardInternallyHandled = true,
    onReactionEmoji = null,
    labelReaction,
    onFocusInput,
    onBlurInput,
    isShowEmojiReaction = true,
    useScrollView = false
  } = props;
  const actionSheetRef = useRef(null);
  const messageContainerRef = useMemo(() => props.messageContainerRef || /*#__PURE__*/createRef(), [props.messageContainerRef]);
  const textInputRef = useMemo(() => props.textInputRef || /*#__PURE__*/createRef(), [props.textInputRef]);
  const isTextInputWasFocused = useRef(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [composerHeight, setComposerHeight] = useState(minComposerHeight ?? MIN_COMPOSER_HEIGHT);
  const [text, setText] = useState(() => props.text || '');
  const [isImageViewerVisible, setIsImageViewerVisible] = useState(false);
  const [fileSelected, setFileSelected] = useState(null);
  const [isShowVideoModal, setIsShowVideoModal] = useState(false);
  const [isTypingDisabled, setIsTypingDisabled] = useState(false);
  const [isShowCameraModal, setIsShowCameraModal] = useState(false);
  const [isMediaAllShow, setIsMediaAllShow] = useState(false);
  const [fileMediaAllLocal, setFileMediaAllLocal] = useState(null);
  const arrMessage = useMemo(() => inverted ? messages : [...messages].reverse(), [messages, inverted]);
  const [messageReaction, setMessageReaction] = useState(null);
  const [isModalReaction, setIsModalReaction] = useState(false);
  const [messageSelected, setMessageSelected] = useState(null);
  const [fileMedia, setFileMedia] = useState([]);
  const keyboard = useReanimatedKeyboardAnimation();
  const trackingKeyboardMovement = useSharedValue(false);
  const debounceEnableTypingTimeoutId = useRef(undefined);
  const keyboardOffsetBottom = useSharedValue(0);
  const contentStyleAnim = useAnimatedStyle(() => ({
    transform: [{
      translateY: keyboard.height.value - keyboardOffsetBottom.value
    }]
  }), [keyboard, keyboardOffsetBottom]);
  const getTextFromProp = useCallback(fallback => {
    if (props.text === undefined) return fallback;
    return props.text;
  }, [props.text]);

  /**
   * Store text input focus status when keyboard hide to retrieve
   * it afterwards if needed.
   * `onKeyboardWillHide` may be called twice in sequence so we
   * make a guard condition (eg. showing image picker)
   */
  const handleTextInputFocusWhenKeyboardHide = useCallback(() => {
    var _textInputRef$current;
    if (!isTextInputWasFocused.current) isTextInputWasFocused.current = ((_textInputRef$current = textInputRef.current) === null || _textInputRef$current === void 0 ? void 0 : _textInputRef$current.isFocused()) || false;
  }, [textInputRef]);

  /**
   * Refocus the text input only if it was focused before showing keyboard.
   * This is needed in some cases (eg. showing image picker).
   */
  const handleTextInputFocusWhenKeyboardShow = useCallback(() => {
    if (textInputRef.current && isTextInputWasFocused.current && !textInputRef.current.isFocused()) textInputRef.current.focus();

    // Reset the indicator since the keyboard is shown
    isTextInputWasFocused.current = false;
  }, [textInputRef]);
  const disableTyping = useCallback(() => {
    clearTimeout(debounceEnableTypingTimeoutId.current);
    setIsTypingDisabled(true);
  }, []);
  const enableTyping = useCallback(() => {
    clearTimeout(debounceEnableTypingTimeoutId.current);
    setIsTypingDisabled(false);
  }, []);
  const debounceEnableTyping = useCallback(() => {
    clearTimeout(debounceEnableTypingTimeoutId.current);
    debounceEnableTypingTimeoutId.current = setTimeout(() => {
      enableTyping();
    }, 50);
  }, [enableTyping]);
  const scrollToBottom = useCallback((isAnimated = true) => {
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
  const handlePressFile = useCallback(file => {
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
  const onLongPressReaction = useCallback((message, position) => {
    setMessageSelected({
      message,
      position
    });
    setTimeout(() => {
      setIsModalReaction(true);
    }, 100);
  }, []);
  const onPressFile = useCallback((file, isShowAll, arrMedia) => {
    if (isShowAll) {
      setFileMediaAllLocal(arrMedia || {});
      setTimeout(() => {
        setIsMediaAllShow(true);
      }, 100);
      return;
    }
    handlePressFile(file);
  }, [handlePressFile]);
  const renderMessages = useMemo(() => {
    if (!isInitialized) return null;
    const {
      messagesContainerStyle,
      ...messagesContainerProps
    } = props;
    return /*#__PURE__*/React.createElement(View, {
      style: [stylesCommon.fill, messagesContainerStyle]
    }, /*#__PURE__*/React.createElement(MessageContainer, _extends({}, messagesContainerProps, {
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
  const notifyInputTextReset = useCallback(() => {
    onInputTextChanged === null || onInputTextChanged === void 0 || onInputTextChanged('');
  }, [onInputTextChanged]);
  const resetInputToolbar = useCallback(() => {
    var _textInputRef$current2;
    (_textInputRef$current2 = textInputRef.current) === null || _textInputRef$current2 === void 0 || _textInputRef$current2.clear();
    notifyInputTextReset();
    setComposerHeight(minComposerHeight);
    setText(getTextFromProp(''));
    enableTyping();
  }, [minComposerHeight, getTextFromProp, textInputRef, notifyInputTextReset, enableTyping]);
  const _onSend = useCallback(
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
  const onInputSizeChanged = useCallback(size => {
    const newComposerHeight = Math.max(minComposerHeight, Math.min(maxComposerHeight, size.height));
    setComposerHeight(newComposerHeight);
  }, [maxComposerHeight, minComposerHeight]);
  const _onInputTextChanged = useCallback(_text => {
    if (isTypingDisabled) return;
    onInputTextChanged === null || onInputTextChanged === void 0 || onInputTextChanged(_text);

    // Only set state if it's not being overridden by a prop.
    if (props.text === undefined) setText(_text);
  }, [onInputTextChanged, isTypingDisabled, props.text]);
  const onPressPickMedia = useCallback(async type => {
    if (type === 'camera') {
      setIsShowCameraModal(true);
    } else {
      const result = await ImageCropPicker.openPicker({
        multiple: true
      });
      const fileMediaAll = result === null || result === void 0 ? void 0 : result.map(item => {
        const uri = item.path || item.sourceURL;
        return {
          uri: uri,
          id: dayjs().valueOf().toString() + (item === null || item === void 0 ? void 0 : item.filename),
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
  const onInitialLayoutViewLayout = useCallback(e => {
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
  const handleRemoveFile = useCallback(file => {
    setFileMedia(prev => prev.filter(item => item.id !== file.id));
  }, []);
  const clearMessageReaction = useCallback(() => {
    setMessageReaction(null);
  }, []);
  const inputToolbarFragment = useMemo(() => {
    var _messageReaction$user;
    if (!isInitialized) return null;
    const inputToolbarProps = {
      ...props,
      text: getTextFromProp(text),
      composerHeight: Math.max(minComposerHeight ?? MIN_COMPOSER_HEIGHT, composerHeight),
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
    return /*#__PURE__*/React.createElement(InputToolbar, _extends({
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
  const handleReactionEmoji = useCallback((emoji, messageId) => {
    onReactionEmoji === null || onReactionEmoji === void 0 || onReactionEmoji(emoji, messageId);
  }, [onReactionEmoji]);
  const handleActionReaction = useCallback((message, action) => {
    switch (action) {
      case 'reply':
        setMessageReaction({
          ...message,
          isReply: true
        });
        break;
      case 'copy':
        Clipboard.setString(message.text || '');
        break;
      case 'other':
        break;
      default:
        setMessageReaction(null);
    }
  }, []);
  const contextValues = useMemo(() => ({
    actionSheet: actionSheet || (() => ({
      showActionSheetWithOptions: actionSheetRef.current.showActionSheetWithOptions
    })),
    getLocale: () => locale
  }), [actionSheet, locale]);
  useEffect(() => {
    if (props.text != null) setText(props.text);
  }, [props.text]);
  useAnimatedReaction(() => -keyboard.height.value, (value, prevValue) => {
    if (prevValue !== null && value !== prevValue) {
      const isKeyboardMovingUp = value > prevValue;
      if (isKeyboardMovingUp !== trackingKeyboardMovement.value) {
        trackingKeyboardMovement.value = isKeyboardMovingUp;
        keyboardOffsetBottom.value = withTiming(isKeyboardMovingUp ? bottomOffset : 0, {
          // If `bottomOffset` exists, we change the duration to a smaller value to fix the delay in the keyboard animation speed
          duration: bottomOffset ? 150 : 400
        });
        if (focusOnInputWhenOpeningKeyboard) if (isKeyboardMovingUp) runOnJS(handleTextInputFocusWhenKeyboardShow)();else runOnJS(handleTextInputFocusWhenKeyboardHide)();
        if (value === 0) {
          runOnJS(enableTyping)();
        } else {
          runOnJS(disableTyping)();
          runOnJS(debounceEnableTyping)();
        }
      }
    }
  }, [keyboard, trackingKeyboardMovement, focusOnInputWhenOpeningKeyboard, handleTextInputFocusWhenKeyboardHide, handleTextInputFocusWhenKeyboardShow, enableTyping, disableTyping, debounceEnableTyping, bottomOffset]);
  return /*#__PURE__*/React.createElement(GiftedChatContext.Provider, {
    value: contextValues
  }, /*#__PURE__*/React.createElement(ActionSheetProvider, {
    ref: actionSheetRef
  }, /*#__PURE__*/React.createElement(View, {
    testID: TEST_ID.WRAPPER,
    style: [stylesCommon.fill, styles.contentContainer],
    onLayout: onInitialLayoutViewLayout
  }, isInitialized ? /*#__PURE__*/React.createElement(Animated.View, {
    style: [stylesCommon.fill, isKeyboardInternallyHandled && contentStyleAnim]
  }, renderMessages, inputToolbarFragment, /*#__PURE__*/React.createElement(View, {
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: 'box-none',
      backgroundColor: 'transparent'
    }
  }, /*#__PURE__*/React.createElement(ImageView, {
    images: fileSelected ? [{
      uri: fileSelected.uri
    }] : [],
    imageIndex: 0,
    visible: isImageViewerVisible,
    onRequestClose: () => setIsImageViewerVisible(false)
  }), /*#__PURE__*/React.createElement(VideoModal, {
    txtSkipButton: 'X',
    visible: isShowVideoModal,
    onClose: () => setIsShowVideoModal(false),
    subtitle: {},
    source: (fileSelected === null || fileSelected === void 0 ? void 0 : fileSelected.uri) || '',
    autoPlay: true,
    isProgressBar: false
  }), /*#__PURE__*/React.createElement(MessageWithReaction, {
    isShowEmoji: isShowEmojiReaction,
    onReactionEmoji: handleReactionEmoji,
    onActionReaction: handleActionReaction,
    user: user,
    isVisible: isModalReaction,
    onClose: () => setIsModalReaction(false),
    message: (messageSelected === null || messageSelected === void 0 ? void 0 : messageSelected.message) || {},
    position: (messageSelected === null || messageSelected === void 0 ? void 0 : messageSelected.position) || {}
  }), /*#__PURE__*/React.createElement(MediaAllShow, {
    fileMediaAll: fileMediaAllLocal,
    isVisible: isMediaAllShow,
    onClose: () => setIsMediaAllShow(false),
    onPressFile: file => {
      setIsMediaAllShow(false);
      setTimeout(() => {
        handlePressFile(file);
      }, 350);
    }
  }), /*#__PURE__*/React.createElement(CameraModal, {
    mode: "both",
    isCanPause: false,
    onVideoRecorded: async video => {
      var _video$path, _video$path2, _getThumbnail$;
      const getThumbnail = await generateThumbnails([{
        uri: normalizeFileUri(video.path),
        id: dayjs().valueOf().toString(),
        size: (video === null || video === void 0 ? void 0 : video.size) || 0
      }]);
      setIsShowCameraModal(false);
      const videoFile = {
        uri: normalizeFileUri(video.path),
        id: dayjs().valueOf().toString(),
        size: (video === null || video === void 0 ? void 0 : video.size) || 0,
        name: (video === null || video === void 0 || (_video$path = video.path) === null || _video$path === void 0 ? void 0 : _video$path.split('/').pop()) || `video - ${dayjs().valueOf().toString()}`,
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
        uri: normalizeFileUri(photo.path),
        id: dayjs().valueOf().toString(),
        size: (photo === null || photo === void 0 ? void 0 : photo.size) || 0,
        name: (photo === null || photo === void 0 || (_photo$path = photo.path) === null || _photo$path === void 0 ? void 0 : _photo$path.split('/').pop()) || `image - ${dayjs().valueOf().toString()}`,
        fileExtension: `.${photo === null || photo === void 0 || (_photo$path2 = photo.path) === null || _photo$path2 === void 0 ? void 0 : _photo$path2.split('.').pop()}`,
        typeFile: 'image',
        thumbnailPreview: normalizeFileUri((photo === null || photo === void 0 ? void 0 : photo.path) || ''),
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
  return /*#__PURE__*/React.createElement(KeyboardProvider, null, /*#__PURE__*/React.createElement(GiftedChat, props));
}
GiftedChatWrapper.append = (currentMessages = [], messages, inverted = true) => {
  if (!Array.isArray(messages)) messages = [messages];
  return inverted ? messages.concat(currentMessages) : currentMessages.concat(messages);
};
GiftedChatWrapper.prepend = (currentMessages = [], messages, inverted = true) => {
  if (!Array.isArray(messages)) messages = [messages];
  return inverted ? currentMessages.concat(messages) : messages.concat(currentMessages);
};
export * from '../types';
export { GiftedChatWrapper as GiftedChat, Actions, Avatar, Bubble, SystemMessage, MessageText, Composer, Day, InputToolbar, LoadEarlier, Message, MessageContainer, Send, Time, GiftedAvatar, utils };
//# sourceMappingURL=index.js.map