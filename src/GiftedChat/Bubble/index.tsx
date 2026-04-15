/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-shadow */
import React, { useCallback, useRef, useState, memo } from 'react';
import type { JSX } from 'react';
import {
  findNodeHandle,
  Text,
  TouchableWithoutFeedback,
  UIManager,
  View,
} from 'react-native';

import { useChatContext } from '../GiftedChatContext';
import { QuickReplies } from '../QuickReplies';
import { MessageText } from '../MessageText';
import { MessageAudio } from '../MessageAudio';
import { Time } from '../Time';

import { isSameUser, isSameDay } from '../utils';
import type { FileMessage, IMessage } from '../types';
import type { BubbleProps } from './types';

import stylesCommon from '../styles';
import styles from './styles';
import { MessageFile } from '../MessageFile';
import Color from '../Color';
import { MessageReply } from '../MessageReply';
import { MaterialIndicator } from '../../IndicatorsMaster';
import FastImage from 'react-native-fast-image';

export * from './types';

const BubbleComponent = <TMessage extends IMessage = IMessage>(
  props: BubbleProps<TMessage>
): JSX.Element => {
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
    onLongPressReaction,
  } = props;

  const context = useChatContext();
  const [messageWidth, setMessageWidth] = useState<{
    width: number;
    _id: string;
  } | null>(null);
  const innerRef = useRef<View>(null);
  const refArrThumbnail = useRef<FileMessage[]>([]);

  const onPress = useCallback(() => {
    if (props.onPress) props.onPress(context, currentMessage);
  }, [context, props, currentMessage]);

  const onLongPress = useCallback(() => {
    const { onLongPress, optionTitles } = props;

    if (onLongPress) {
      onLongPress(context, currentMessage);
      return;
    }

    if (!optionTitles?.length) return;

    const options = optionTitles;
    const cancelButtonIndex = options.length - 1;

    (context as any).actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      (_buttonIndex: number) => {
        // Action sheet button pressed
      }
    );
  }, [currentMessage, context, props]);

  const onLongPressItem = useCallback(() => {
    try {
      if (innerRef.current) {
        const node = findNodeHandle(innerRef.current);
        if (node) {
          UIManager.measure(
            node,
            (
              x: number,
              y: number,
              width: number,
              height: number,
              pageX: number,
              pageY: number
            ) => {
              onLongPressReaction?.(currentMessage, {
                x,
                y,
                width,
                height,
                pageX,
                pageY,
              });
            }
          );
        }
      }
    } catch (_error) {
      // Measurement failed silently
    }
  }, [currentMessage, onLongPressReaction]);

  const styledBubbleToPrevious = useCallback(() => {
    if (
      currentMessage &&
      previousMessage &&
      position &&
      isSameUser(currentMessage, previousMessage) &&
      isSameDay(currentMessage, previousMessage)
    )
      return [
        styles[position].containerToPrevious,
        containerToPreviousStyle && containerToPreviousStyle[position],
      ];

    return null;
  }, [currentMessage, previousMessage, position, containerToPreviousStyle]);

  const renderQuickReplies = useCallback(() => {
    if (currentMessage?.quickReplies) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { containerStyle, wrapperStyle, ...quickReplyProps } = props;

      if (props.renderQuickReplies)
        return props.renderQuickReplies(quickReplyProps);

      return (
        <QuickReplies
          currentMessage={currentMessage}
          onQuickReply={onQuickReply}
          renderQuickReplySend={renderQuickReplySend}
          quickReplyStyle={quickReplyStyle}
          quickReplyTextStyle={quickReplyTextStyle}
          quickReplyContainerStyle={quickReplyContainerStyle}
          nextMessage={nextMessage}
        />
      );
    }

    return null;
  }, [
    currentMessage,
    onQuickReply,
    renderQuickReplySend,
    quickReplyStyle,
    quickReplyTextStyle,
    quickReplyContainerStyle,
    nextMessage,
    props,
  ]);

  const onSaveThumbnail = useCallback((file: FileMessage[]) => {
    refArrThumbnail.current = file;
  }, []);

  const renderMessageText = useCallback(() => {
    if (currentMessage?.text) {
      const {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        containerStyle,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        wrapperStyle,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        optionTitles,
        ...messageTextProps
      } = props;

      if (props.renderMessageText)
        return props.renderMessageText(messageTextProps);

      return <MessageText {...messageTextProps} />;
    }
    return null;
  }, [props, currentMessage]);

  const renderMessageFile = useCallback(() => {
    if (!currentMessage?.file) return null;

    const {
      /* eslint-disable @typescript-eslint/no-unused-vars */
      containerStyle,
      wrapperStyle,
      /* eslint-enable @typescript-eslint/no-unused-vars */
      ...messageFileProps
    } = props;

    if (props.renderCustomMessageFile)
      return props.renderCustomMessageFile(messageFileProps);

    return (
      <MessageFile
        onLongPressFile={onLongPressItem}
        onSaveThumbnail={onSaveThumbnail}
        onPressFile={onPressFile}
        messageWidth={messageWidth}
        {...messageFileProps}
      />
    );
  }, [
    currentMessage,
    props,
    messageWidth,
    onPressFile,
    onSaveThumbnail,
    onLongPressItem,
  ]);

  const renderMessageAudio = useCallback(() => {
    if (!currentMessage?.audio) return null;

    const {
      /* eslint-disable @typescript-eslint/no-unused-vars */
      containerStyle,
      wrapperStyle,
      /* eslint-enable @typescript-eslint/no-unused-vars */
      ...messageAudioProps
    } = props;

    if (props.renderMessageAudio)
      return props.renderMessageAudio(messageAudioProps);

    return <MessageAudio />;
  }, [props, currentMessage]);

  const renderTicks = useCallback(() => {
    const { renderTicks, user } = props;

    if (renderTicks && currentMessage) return renderTicks(currentMessage);

    if (user && currentMessage?.user && currentMessage.user._id !== user._id)
      return null;

    if (
      currentMessage &&
      (currentMessage.sent || currentMessage.received || currentMessage.pending)
    )
      return (
        <View style={styles.content.tickView}>
          {!!currentMessage.sent && (
            <Text style={[styles.content.tick, props.tickStyle]}>{'✓'}</Text>
          )}
          {!!currentMessage.received && (
            <Text style={[styles.content.tick, props.tickStyle]}>{'✓'}</Text>
          )}
          {!!currentMessage.pending && (
            <Text style={[styles.content.tick, props.tickStyle]}>{'🕓'}</Text>
          )}
        </View>
      );

    return null;
  }, [props, currentMessage]);

  const renderTime = useCallback(() => {
    if (currentMessage?.createdAt) {
      const {
        /* eslint-disable @typescript-eslint/no-unused-vars */
        containerStyle,
        wrapperStyle,
        textStyle,
        /* eslint-enable @typescript-eslint/no-unused-vars */
        ...timeProps
      } = props;

      if (props.renderTime) return props.renderTime(timeProps);

      return <Time {...timeProps} />;
    }
    return null;
  }, [props, currentMessage]);

  const renderUsername = useCallback(() => {
    const { user, renderUsername } = props;

    if (props.renderUsernameOnMessage && currentMessage) {
      if (user && currentMessage.user._id === user._id) return null;

      if (renderUsername) return renderUsername(currentMessage.user);

      return (
        <View style={styles.content.usernameView}>
          <Text style={[styles.content.username, props.usernameStyle]}>
            {'~ '}
            {currentMessage.user.name}
          </Text>
        </View>
      );
    }

    return null;
  }, [currentMessage, props]);

  const renderCustomView = useCallback(() => {
    if (props.renderCustomView) return props.renderCustomView(props);

    return null;
  }, [props]);

  const renderReactionEmoji = useCallback(() => {
    const isCurrentUser = currentMessage.user._id === props?.user?._id;

    const reactionPosition = isCurrentUser ? 'right' : 'left';
    const reactionEmoji = [
      ...new Set(
        (Array.isArray(currentMessage?.reactionEmoji)
          ? currentMessage.reactionEmoji
          : []
        ).map((item) => item?.reaction)
      ),
    ];

    if (reactionEmoji && reactionEmoji?.length > 0) {
      return (
        <View
          style={[
            styles.content.reactionContainer,
            {
              width: 18 * reactionEmoji?.length + 12,
            },
            reactionPosition === 'right' && {
              left: reactionEmoji?.length
                ? -12 * (reactionEmoji?.length - 1)
                : -12,
            },
            reactionPosition === 'left' && {
              right: reactionEmoji?.length
                ? -12 * (reactionEmoji?.length - 1)
                : -12,
            },
          ]}
        >
          {reactionEmoji?.map((item, index) => (
            <Text key={index} style={styles.content.reactionEmojiText}>
              {item}
            </Text>
          ))}
          <Text style={styles.content.reactionCountText}>
            {currentMessage?.reactionEmoji?.length}
          </Text>
        </View>
      );
    }
    return null;
  }, [currentMessage.reactionEmoji, currentMessage.user._id, props?.user?._id]);

  const renderBubbleContent = useCallback(() => {
    return (
      <View>
        {!props.isCustomViewBottom && renderCustomView()}
        {renderMessageFile()}
        {renderMessageAudio()}
        {renderMessageText()}
        {renderReactionEmoji()}
        {props.isCustomViewBottom && renderCustomView()}
      </View>
    );
  }, [
    renderCustomView,
    renderMessageAudio,
    renderMessageText,
    props.isCustomViewBottom,
    renderMessageFile,
    renderReactionEmoji,
  ]);

  const renderMessageReply = useCallback(() => {
    if (currentMessage?.messageReply) {
      return (
        <MessageReply
          messageReply={currentMessage?.messageReply}
          onSaveThumbnail={onSaveThumbnail}
          onPressFile={onPressFile}
        />
      );
    }
    return null;
  }, [currentMessage, onSaveThumbnail, onPressFile]);

  return (
    <View
      style={[
        stylesCommon.fill,
        styles[position].container,
        containerStyle && containerStyle[position],
        { marginBottom: currentMessage?.isLast ? 12 : 8, maxWidth: '90%' },
      ]}
      onLayout={(e) => {
        if (currentMessage?._id) {
          setMessageWidth({
            width: e.nativeEvent.layout.width,
            _id: currentMessage?._id.toString(),
          });
        }
      }}
    >
      {currentMessage?.isShowName && (
        <View style={styles.content.layoutName}>
          <Text numberOfLines={1} style={styles.content.name}>
            {currentMessage?.user?.name}
          </Text>
        </View>
      )}

      {renderMessageReply()}
      <View
        style={[
          styles[position].wrapper,
          styledBubbleToPrevious(),
          wrapperStyle && wrapperStyle[position],
        ]}
      >
        <TouchableWithoutFeedback
          onPress={onPress}
          onLongPress={onLongPressItem || onLongPress}
          delayLongPress={100}
          {...props.touchableProps}
        >
          <View ref={innerRef}>
            {renderBubbleContent()}
            <View
              style={[
                styles[position].bottom,
                bottomContainerStyle?.[position],
                currentMessage?.reactionEmoji &&
                  currentMessage?.reactionEmoji?.length > 0 && {
                    marginBottom: 8,
                  },
              ]}
            >
              {renderUsername()}
              {renderTime()}
              {renderTicks()}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
      {renderQuickReplies()}
      {currentMessage?.isSending && (
        <View style={styles.content.sendingIndicator}>
          <MaterialIndicator
            color={Color.defaultColor}
            size={12}
            animationDuration={6000}
          />
        </View>
      )}
      {currentMessage?.errorMessage && !currentMessage?.isSending && (
        <View style={styles.content.errorContainer}>
          <FastImage
            source={require('../../assets/warning.png')}
            style={styles.content.errorIcon}
          />
          <Text style={styles.content.errorText}>
            {currentMessage?.errorMessage}
          </Text>
        </View>
      )}
    </View>
  );
};

const Bubble = memo(BubbleComponent) as typeof BubbleComponent;

export default Bubble;
