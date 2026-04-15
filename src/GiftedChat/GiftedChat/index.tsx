/* eslint-disable react-native/no-inline-styles */
import React, {
  createRef,
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
  type RefObject,
} from 'react';
import {
  ActionSheetProvider,
  type ActionSheetProviderRef,
} from '@expo/react-native-action-sheet';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import {
  Platform,
  TextInput,
  View,
  ScrollView,
  type LayoutChangeEvent,
} from 'react-native';
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
import MessageContainer, { type AnimatedList } from '../MessageContainer';
import { MessageText } from '../MessageText';
import { type FileMessage, type IMessage, type User } from '../types';
import { Send } from '../Send';
import { SystemMessage } from '../SystemMessage';
import { Time } from '../Time';
import * as utils from '../utils';
import Animated, {
  useAnimatedStyle,
  useAnimatedReaction,
  useSharedValue,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import {
  KeyboardProvider,
  useReanimatedKeyboardAnimation,
} from 'react-native-keyboard-controller';
import { type GiftedChatProps } from './types';
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

function GiftedChat<TMessage extends IMessage = IMessage>(
  props: GiftedChatProps<TMessage>
) {
  const {
    messages = [],
    initialText = '',
    isTyping,

    // "random" function from here: https://stackoverflow.com/a/8084248/3452513
    // we do not use uuid since it would add extra native dependency (https://www.npmjs.com/package/react-native-get-random-values)
    // lib's user can decide which algorithm to use and pass it as a prop
    messageIdGenerator = () =>
      (Math.random() + 1).toString(36).substring(7) + dayjs().valueOf(),

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
      default: 'never',
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
    useScrollView = false,
  } = props;

  const actionSheetRef = useRef<ActionSheetProviderRef>(null);

  const messageContainerRef = useMemo(
    () =>
      props.messageContainerRef ||
      createRef<AnimatedList<TMessage> | ScrollView>(),
    [props.messageContainerRef]
  ) as RefObject<AnimatedList<TMessage> | ScrollView>;

  const textInputRef = useMemo(
    () => props.textInputRef || createRef<TextInput>(),
    [props.textInputRef]
  );

  const isTextInputWasFocused = useRef(false);

  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [composerHeight, setComposerHeight] = useState<number>(
    (minComposerHeight ?? MIN_COMPOSER_HEIGHT) as number
  );
  const [text, setText] = useState<string | undefined>(() => props.text || '');
  const [isImageViewerVisible, setIsImageViewerVisible] =
    useState<boolean>(false);
  const [fileSelected, setFileSelected] = useState<{ uri: string } | null>(
    null
  );
  const [isShowVideoModal, setIsShowVideoModal] = useState<boolean>(false);
  const [isTypingDisabled, setIsTypingDisabled] = useState<boolean>(false);
  const [isShowCameraModal, setIsShowCameraModal] = useState<boolean>(false);

  const [isMediaAllShow, setIsMediaAllShow] = useState<boolean>(false);
  const [fileMediaAllLocal, setFileMediaAllLocal] = useState<IMessage | null>(
    null
  );
  const arrMessage = useMemo(
    () => (inverted ? messages : [...messages].reverse()),
    [messages, inverted]
  );
  const [messageReaction, setMessageReaction] = useState<
    (IMessage & { isReply: boolean }) | null
  >(null);

  const [isModalReaction, setIsModalReaction] = useState<boolean>(false);
  const [messageSelected, setMessageSelected] = useState<{
    message: TMessage;
    position: {
      x: number;
      y: number;
      width: number;
      height: number;
      pageX: number;
      pageY: number;
    };
  } | null>(null);
  const [fileMedia, setFileMedia] = useState<FileMessage[]>([]);
  const keyboard = useReanimatedKeyboardAnimation();
  const trackingKeyboardMovement = useSharedValue(false);
  const debounceEnableTypingTimeoutId =
    useRef<ReturnType<typeof setTimeout>>(undefined);
  const keyboardOffsetBottom = useSharedValue(0);

  const contentStyleAnim = useAnimatedStyle(
    () => ({
      transform: [
        { translateY: keyboard.height.value - keyboardOffsetBottom.value },
      ],
    }),
    [keyboard, keyboardOffsetBottom]
  );

  const getTextFromProp = useCallback(
    (fallback: string) => {
      if (props.text === undefined) return fallback;

      return props.text;
    },
    [props.text]
  );

  /**
   * Store text input focus status when keyboard hide to retrieve
   * it afterwards if needed.
   * `onKeyboardWillHide` may be called twice in sequence so we
   * make a guard condition (eg. showing image picker)
   */
  const handleTextInputFocusWhenKeyboardHide = useCallback(() => {
    if (!isTextInputWasFocused.current)
      isTextInputWasFocused.current =
        textInputRef.current?.isFocused() || false;
  }, [textInputRef]);

  /**
   * Refocus the text input only if it was focused before showing keyboard.
   * This is needed in some cases (eg. showing image picker).
   */
  const handleTextInputFocusWhenKeyboardShow = useCallback(() => {
    if (
      textInputRef.current &&
      isTextInputWasFocused.current &&
      !textInputRef.current.isFocused()
    )
      textInputRef.current.focus();

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

  const scrollToBottom = useCallback(
    (isAnimated = true) => {
      if (!messageContainerRef?.current) return;

      // Type-safe check for ScrollView
      if (
        'scrollTo' in messageContainerRef.current &&
        'scrollToEnd' in messageContainerRef.current
      ) {
        // ScrollView case
        const scrollViewRef = messageContainerRef.current as ScrollView;
        if (inverted) {
          scrollViewRef.scrollTo({
            y: 0,
            animated: isAnimated,
          });
        } else {
          scrollViewRef.scrollToEnd({ animated: isAnimated });
        }
      } else if ('scrollToOffset' in messageContainerRef.current) {
        // AnimatedList case
        const animatedListRef =
          messageContainerRef.current as AnimatedList<TMessage>;
        if (inverted) {
          animatedListRef.scrollToOffset({
            offset: 0,
            animated: isAnimated,
          });
        } else {
          if ('scrollToEnd' in animatedListRef) {
            animatedListRef.scrollToEnd({ animated: isAnimated });
          }
        }
      }
    },
    [inverted, messageContainerRef]
  );

  const handlePressFile = useCallback((file: FileMessage) => {
    const type = file?.typeFile;
    switch (type) {
      case 'video':
        setFileSelected({
          uri: file.uri,
        });
        setTimeout(() => {
          setIsShowVideoModal(true);
        }, 100);
        break;
      case 'image':
        setFileSelected({
          uri: file.uri,
        });
        setTimeout(() => {
          setIsImageViewerVisible(true);
        }, 100);
        break;
      default:
        break;
    }
  }, []);

  const onLongPressReaction = useCallback(
    (message: TMessage, position: { x: number; y: number; width: number; height: number; pageX: number; pageY: number }) => {
      setMessageSelected({ message, position });
      setTimeout(() => {
        setIsModalReaction(true);
      }, 100);
    },
    []
  );

  const onPressFile = useCallback(
    (file: FileMessage, isShowAll?: boolean, arrMedia?: IMessage) => {
      if (isShowAll) {
        setFileMediaAllLocal(arrMedia || ({} as IMessage));
        setTimeout(() => {
          setIsMediaAllShow(true);
        }, 100);
        return;
      }
      handlePressFile(file);
    },
    [handlePressFile]
  );

  const renderMessages = useMemo(() => {
    if (!isInitialized) return null;

    const { messagesContainerStyle, ...messagesContainerProps } = props;

    return (
      <View style={[stylesCommon.fill, messagesContainerStyle]}>
        <MessageContainer<TMessage>
          {...messagesContainerProps}
          invertibleScrollViewProps={{
            inverted,
            keyboardShouldPersistTaps,
          }}
          messages={arrMessage}
          forwardRef={messageContainerRef}
          isTyping={isTyping}
          useScrollView={useScrollView}
          onLongPressReaction={onLongPressReaction}
          onPressFile={onPressFile}
        />
        {renderChatFooter?.()}
      </View>
    );
  }, [
    isInitialized,
    isTyping,
    arrMessage,
    inverted,
    keyboardShouldPersistTaps,
    messageContainerRef,
    renderChatFooter,
    useScrollView,
    onLongPressReaction,
    onPressFile,
    props,
  ]);

  const notifyInputTextReset = useCallback(() => {
    onInputTextChanged?.('');
  }, [onInputTextChanged]);

  const resetInputToolbar = useCallback(() => {
    textInputRef.current?.clear();

    notifyInputTextReset();

    setComposerHeight(minComposerHeight!);
    setText(getTextFromProp(''));
    enableTyping();
  }, [
    minComposerHeight,
    getTextFromProp,
    textInputRef,
    notifyInputTextReset,
    enableTyping,
  ]);

  const _onSend = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-shadow
    (messages: TMessage[] = [], shouldResetInputToolbar = false) => {
      if (!Array.isArray(messages)) messages = [messages];

      if (!messages[0]?.text && fileMedia?.length <= 0) return;

      const convertFileMedia = fileMedia?.map((item) => {
        return {
          ...item,
          uri: item?.uri || '',
          thumbnailPreview: item?.thumbnailPreview || '',
          mine: utils.getFileTypeFromPath(item?.uri || ''),
        };
      });

      const newMessages: TMessage[] = messages?.map((message) => {
        return {
          ...message,
          user: user!,
          createdAt: new Date(),
          _id: messageIdGenerator?.(),
          file: convertFileMedia,
        };
      });

      if (shouldResetInputToolbar === true) {
        disableTyping();
        resetInputToolbar();
      }

      setFileMedia([]);
      let newMessagesWithReaction = newMessages;

      if (messageReaction && messageReaction?.isReply) {
        newMessagesWithReaction = newMessages.map((message) => {
          return { ...message, messageReply: messageReaction };
        });
      }

      setMessageReaction(null);
      onSend?.(newMessagesWithReaction);

      setTimeout(() => scrollToBottom(), 10);
    },
    [
      onSend,
      user,
      messageIdGenerator,
      fileMedia,
      disableTyping,
      resetInputToolbar,
      scrollToBottom,
      messageReaction,
    ]
  );

  const onInputSizeChanged = useCallback(
    (size: { height: number }) => {
      const newComposerHeight = Math.max(
        minComposerHeight!,
        Math.min(maxComposerHeight!, size.height)
      );

      setComposerHeight(newComposerHeight);
    },
    [maxComposerHeight, minComposerHeight]
  );

  const _onInputTextChanged = useCallback(
    (_text: string) => {
      if (isTypingDisabled) return;

      onInputTextChanged?.(_text);

      // Only set state if it's not being overridden by a prop.
      if (props.text === undefined) setText(_text);
    },
    [onInputTextChanged, isTypingDisabled, props.text]
  );

  const onPressPickMedia = useCallback(
    async (type: 'camera' | 'pick') => {
      if (type === 'camera') {
        setIsShowCameraModal(true);
      } else {
        const result = await ImageCropPicker.openPicker({
          multiple: true,
        });
        const fileMediaAll = result?.map((item) => {
          const uri = item.path || item.sourceURL;

          return {
            uri: uri,
            id: dayjs().valueOf().toString() + item?.filename,
            size: item?.size || 0,
            name: item?.filename || '',
            fileExtension: `.${uri?.split('.').pop()}` || '',
            typeFile: 'image',
            thumbnailPreview: uri,
            width: item?.width,
            height: item?.height,
          };
        });

        setFileMedia((prev) => [...prev, ...fileMediaAll] as FileMessage[]);
      }
    },
    []
  );

  const onInitialLayoutViewLayout = useCallback(
    (e: LayoutChangeEvent) => {
      if (isInitialized) return;

      const { layout } = e.nativeEvent;

      if (layout.height <= 0) return;

      notifyInputTextReset();

      setIsInitialized(true);
      setComposerHeight(minComposerHeight!);
      setText(getTextFromProp(initialText));
    },
    [
      isInitialized,
      initialText,
      minComposerHeight,
      notifyInputTextReset,
      getTextFromProp,
    ]
  );

  const handleRemoveFile = useCallback((file: FileMessage) => {
    setFileMedia((prev) => prev.filter((item) => item.id !== file.id));
  }, []);

  const clearMessageReaction = useCallback(() => {
    setMessageReaction(null);
  }, []);

  const inputToolbarFragment = useMemo(() => {
    if (!isInitialized) return null;

    const inputToolbarProps = {
      ...props,
      text: getTextFromProp(text!),
      composerHeight: Math.max((minComposerHeight ?? MIN_COMPOSER_HEIGHT) as number, composerHeight),
      onSend: _onSend,
      onInputSizeChanged,
      onTextChanged: _onInputTextChanged,
      textInputProps: {
        ...textInputProps,
        ref: textInputRef,
        maxLength: isTypingDisabled ? 0 : maxInputLength,
      },
    };

    if (renderInputToolbar) return renderInputToolbar(inputToolbarProps);

    return (
      <InputToolbar
        isMe={(user as User)?._id === messageReaction?.user?._id}
        onFocusInput={onFocusInput}
        onBlurInput={onBlurInput}
        labelReaction={labelReaction}
        messageReaction={messageReaction as IMessage & { isReply: boolean }}
        clearMessageReaction={clearMessageReaction}
        onRemoveFile={handleRemoveFile}
        onPressFile={handlePressFile}
        fileMedia={fileMedia}
        onPressPickMedia={onPressPickMedia}
        disableComposer={props.disableComposer}
        {...inputToolbarProps}
      />
    );
  }, [
    isInitialized,
    _onSend,
    getTextFromProp,
    maxInputLength,
    minComposerHeight,
    onInputSizeChanged,
    text,
    renderInputToolbar,
    composerHeight,
    isTypingDisabled,
    textInputRef,
    textInputProps,
    _onInputTextChanged,
    onPressPickMedia,
    fileMedia,
    handlePressFile,
    handleRemoveFile,
    clearMessageReaction,
    messageReaction,
    labelReaction,
    onFocusInput,
    onBlurInput,
    user,
    props,
  ]);

  const handleReactionEmoji = useCallback(
    (emoji: string, messageId: string) => {
      onReactionEmoji?.(emoji, messageId);
    },
    [onReactionEmoji]
  );

  const handleActionReaction = useCallback(
    (message: IMessage, action: string) => {
      switch (action) {
        case 'reply':
          setMessageReaction({ ...message, isReply: true });
          break;
        case 'copy':
          Clipboard.setString(message.text || '');
          break;
        case 'other':
          break;
        default:
          setMessageReaction(null);
      }
    },
    []
  );

  const contextValues = useMemo(
    () => ({
      actionSheet:
        actionSheet ||
        (() => ({
          showActionSheetWithOptions:
            actionSheetRef.current!.showActionSheetWithOptions,
        })),
      getLocale: () => locale,
    }),
    [actionSheet, locale]
  );

  useEffect(() => {
    if (props.text != null) setText(props.text);
  }, [props.text]);

  useAnimatedReaction(
    () => -keyboard.height.value,
    (value, prevValue) => {
      if (prevValue !== null && value !== prevValue) {
        const isKeyboardMovingUp = value > prevValue;
        if (isKeyboardMovingUp !== trackingKeyboardMovement.value) {
          trackingKeyboardMovement.value = isKeyboardMovingUp;
          keyboardOffsetBottom.value = withTiming(
            isKeyboardMovingUp ? bottomOffset : 0,
            {
              // If `bottomOffset` exists, we change the duration to a smaller value to fix the delay in the keyboard animation speed
              duration: bottomOffset ? 150 : 400,
            }
          );

          if (focusOnInputWhenOpeningKeyboard)
            if (isKeyboardMovingUp)
              runOnJS(handleTextInputFocusWhenKeyboardShow)();
            else runOnJS(handleTextInputFocusWhenKeyboardHide)();

          if (value === 0) {
            runOnJS(enableTyping)();
          } else {
            runOnJS(disableTyping)();
            runOnJS(debounceEnableTyping)();
          }
        }
      }
    },
    [
      keyboard,
      trackingKeyboardMovement,
      focusOnInputWhenOpeningKeyboard,
      handleTextInputFocusWhenKeyboardHide,
      handleTextInputFocusWhenKeyboardShow,
      enableTyping,
      disableTyping,
      debounceEnableTyping,
      bottomOffset,
    ]
  );

  return (
    <GiftedChatContext.Provider value={contextValues}>
      <ActionSheetProvider ref={actionSheetRef}>
        <View
          testID={TEST_ID.WRAPPER}
          style={[stylesCommon.fill, styles.contentContainer]}
          onLayout={onInitialLayoutViewLayout}
        >
          {isInitialized ? (
            <Animated.View
              style={[
                stylesCommon.fill,
                isKeyboardInternallyHandled && contentStyleAnim,
              ]}
            >
              {renderMessages}
              {inputToolbarFragment}
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  pointerEvents: 'box-none',
                  backgroundColor: 'transparent',
                }}
              >
                <ImageView
                  images={fileSelected ? [{ uri: fileSelected.uri }] : []}
                  imageIndex={0}
                  visible={isImageViewerVisible}
                  onRequestClose={() => setIsImageViewerVisible(false)}
                />
                <VideoModal
                  txtSkipButton={'X'}
                  visible={isShowVideoModal}
                  onClose={() => setIsShowVideoModal(false)}
                  subtitle={{}}
                  source={fileSelected?.uri || ''}
                  autoPlay={true}
                  isProgressBar={false}
                />
                <MessageWithReaction
                  isShowEmoji={isShowEmojiReaction}
                  onReactionEmoji={handleReactionEmoji}
                  onActionReaction={handleActionReaction}
                  user={user as User}
                  isVisible={isModalReaction}
                  onClose={() => setIsModalReaction(false)}
                  message={messageSelected?.message || ({} as TMessage)}
                  position={messageSelected?.position || ({} as any)}
                />
                <MediaAllShow
                  fileMediaAll={fileMediaAllLocal}
                  isVisible={isMediaAllShow}
                  onClose={() => setIsMediaAllShow(false)}
                  onPressFile={(file) => {
                    setIsMediaAllShow(false);
                    setTimeout(() => {
                      handlePressFile(file);
                    }, 350);
                  }}
                />
                <CameraModal
                  mode="both"
                  isCanPause={false}
                  onVideoRecorded={async (video) => {
                    const getThumbnail = await generateThumbnails([
                      {
                        uri: normalizeFileUri(video.path),
                        id: dayjs().valueOf().toString(),
                        size: video?.size || 0,
                      },
                    ]);
                    setIsShowCameraModal(false);
                    const videoFile = {
                      uri: normalizeFileUri(video.path),
                      id: dayjs().valueOf().toString(),
                      size: video?.size || 0,
                      name:
                        video?.path?.split('/').pop() ||
                        `video - ${dayjs().valueOf().toString()}`,
                      fileExtension: `.${video?.path?.split('.').pop()}`,
                      typeFile: 'video',
                      width: video?.width,
                      height: video?.height,
                      duration: video?.duration,
                      thumbnailPreview: getThumbnail[0]?.path || '',
                    };

                    setFileMedia((prev) => [...prev, videoFile as FileMessage]);
                  }}
                  onPhotoCaptured={(photo) => {
                    setIsShowCameraModal(false);

                    const img = {
                      uri: normalizeFileUri(photo.path),
                      id: dayjs().valueOf().toString(),
                      size: photo?.size || 0,
                      name:
                        photo?.path?.split('/').pop() ||
                        `image - ${dayjs().valueOf().toString()}`,
                      fileExtension: `.${photo?.path?.split('.').pop()}`,
                      typeFile: 'image',
                      thumbnailPreview: normalizeFileUri(photo?.path || ''),
                      width: photo?.width,
                      height: photo?.height,
                    };
                    setFileMedia((prev) => [...prev, img as FileMessage]);
                  }}
                  visible={isShowCameraModal}
                  onClose={() => setIsShowCameraModal(false)}
                />
              </View>
            </Animated.View>
          ) : (
            renderLoading?.()
          )}
        </View>
      </ActionSheetProvider>
    </GiftedChatContext.Provider>
  );
}

function GiftedChatWrapper<TMessage extends IMessage = IMessage>(
  props: GiftedChatProps<TMessage>
) {
  return (
    <KeyboardProvider>
      <GiftedChat<TMessage> {...props} />
    </KeyboardProvider>
  );
}

GiftedChatWrapper.append = <TMessage extends IMessage>(
  currentMessages: TMessage[] = [],
  messages: TMessage[],
  inverted = true
) => {
  if (!Array.isArray(messages)) messages = [messages];

  return inverted
    ? messages.concat(currentMessages)
    : currentMessages.concat(messages);
};

GiftedChatWrapper.prepend = <TMessage extends IMessage>(
  currentMessages: TMessage[] = [],
  messages: TMessage[],
  inverted = true
) => {
  if (!Array.isArray(messages)) messages = [messages];

  return inverted
    ? currentMessages.concat(messages)
    : messages.concat(currentMessages);
};

export * from '../types';

export {
  GiftedChatWrapper as GiftedChat,
  Actions,
  Avatar,
  Bubble,
  SystemMessage,
  MessageText,
  Composer,
  Day,
  InputToolbar,
  LoadEarlier,
  Message,
  MessageContainer,
  Send,
  Time,
  GiftedAvatar,
  utils,
};
