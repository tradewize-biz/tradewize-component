import React, { useCallback, useMemo, useState, useEffect } from 'react';
import {
  StyleSheet,
  Pressable,
  Text,
  Modal,
  type LayoutChangeEvent,
  type TextStyle,
  useWindowDimensions,
} from 'react-native';

// Constants for horizontal positioning
const HORIZONTAL_PADDING = 16;
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
} from 'react-native-reanimated';

import { type IMessage, type LeftRightStyle, type User } from './types';
import Color from './Color';
import FastImage from 'react-native-fast-image';
import { MessageText } from './MessageText';
import { Time } from './Time';
import { MessageFile } from './MessageFile';
import { getScreenHeight, getScreenWidth } from '../utils';
import { ButtonBase } from '../ButtonBase';
export const EMOJI_REACTIONS = ['❤️', '😂', '😮', '😢', '😠', '👍'];

export interface MessageWithReactionProps {
  isVisible: boolean;
  onClose: () => void;
  message: IMessage;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
    pageX: number;
    pageY: number;
  };
  user: User;
  isShowEmoji?: boolean;
  onReactionEmoji?: (emoji: string, messageId: string) => void;
  onActionReaction?: (message: IMessage, action: string) => void;
}

const DIFFERENCE_LEVEL = 72;

export const MessageWithReaction = ({
  isVisible,
  onClose,
  message,
  position,
  user,
  onReactionEmoji,
  onActionReaction,
  isShowEmoji = true,
}: MessageWithReactionProps) => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const MESSAGE_MAX_WIDTH = screenWidth * 0.8;
  const { quickReplies: _unused, ...safeMessage } = message;
  const displayMessage = safeMessage as IMessage;
  const [isExceedsScreenHeight, setIsExceedsScreenHeight] = useState(false);
  const [differenceLevel, setDifferenceLevel] = useState(0);
  const [messageWidth, setMessageWidth] = useState(0);

  const isMyMessage = displayMessage.user?._id === user?._id;

  // Helper function to get safe horizontal position
  const getSafeHorizontalPosition = useCallback((basePosition: number, elementWidth: number) => {
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
      // Start entrance animations
      overlayOpacity.value = withTiming(0.9, { duration: 30 });
      messageScale.value = withSpring(1, {
        damping: 30,
        stiffness: 500,
      });
      messageOpacity.value = withTiming(1, { duration: 30 });

      // Staggered animations for reaction icons
      if (isShowEmoji && user?._id !== displayMessage?.user?._id) {
        reactionIconOpacity.value = withDelay(
          30,
          withTiming(1, { duration: 30 })
        );
      }

      // Staggered animations for action buttons
      actionButtonsOpacity.value = withDelay(
        60,
        withTiming(1, { duration: 30 })
      );
    } else {
      // Reset animations when closing
      overlayOpacity.value = 0;
      messageScale.value = 0.8;
      messageOpacity.value = 0;
      reactionIconOpacity.value = 0;
      actionButtonsOpacity.value = 0;
    }
  }, [
    isVisible,
    isShowEmoji,
    user?._id,
    displayMessage?.user?._id,
    isMyMessage,
    overlayOpacity,
    messageScale,
    messageOpacity,
    reactionIconOpacity,
    actionButtonsOpacity,
  ]);

  // Animated styles
  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const messageAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: messageScale.value }],
    opacity: messageOpacity.value,
  }));

  const reactionIconAnimatedStyle = useAnimatedStyle(() => ({
    opacity: reactionIconOpacity.value,
  }));

  const actionButtonsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: actionButtonsOpacity.value,
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
        maxWidth: MESSAGE_MAX_WIDTH,
      };
    } else {
      // For other messages, calculate safe left position
      const baseLeft = position.pageX;
      const safeLeft = getSafeHorizontalPosition(baseLeft, messageWidth);
      return {
        top,
        left: safeLeft,
        maxWidth: MESSAGE_MAX_WIDTH,
      };
    }
  }, [
    isMyMessage,
    position.pageX,
    position.pageY,
    isExceedsScreenHeight,
    differenceLevel,
    messageWidth,
    getSafeHorizontalPosition,
  ]);

  const styleReactionIcon = useCallback(() => {
    let top = 0;

    if (position.pageY < 80) {
      top = 80;
    } else if (!isExceedsScreenHeight) {
      top = position.pageY - getScreenHeight() * 0.05 - 8;
    } else {
      top =
        position.pageY -
        getScreenHeight() * 0.05 -
        differenceLevel -
        DIFFERENCE_LEVEL -
        8;
    }

    const iconWidth = screenWidth * 0.75; // Width from styles
    
    if (isMyMessage) {
      const baseRight = 16;
      const safeRight = getSafeHorizontalPosition(screenWidth - baseRight - iconWidth, iconWidth);
      return {
        top,
        right: screenWidth - safeRight - iconWidth,
      };
    } else {
      const baseLeft = position.pageX;
      const safeLeft = getSafeHorizontalPosition(baseLeft, iconWidth);
      return {
        top,
        left: safeLeft,
      };
    }
  }, [
    isExceedsScreenHeight,
    differenceLevel,
    position.pageY,
    position.pageX,
    isMyMessage,
    getSafeHorizontalPosition,
  ]);

  const styleLayoutAction = useCallback(() => {
    let top = 0;
    if (position.pageY < 80) {
      top = 80 + getScreenHeight() * 0.05 + 8 + position.height;
    } else if (!isExceedsScreenHeight) {
      top = position.pageY + position.height;
    } else {
      top =
        position.pageY + position.height - differenceLevel - DIFFERENCE_LEVEL;
    }

    const actionWidth = screenWidth * 0.5; // Approximate width of action buttons
    
    if (isMyMessage) {
      const baseRight = 16;
      const safeRight = getSafeHorizontalPosition(screenWidth - baseRight - actionWidth, actionWidth);
      return {
        top,
        right: screenWidth - safeRight - actionWidth,
      };
    } else {
      const baseLeft = position.pageX;
      const safeLeft = getSafeHorizontalPosition(baseLeft, actionWidth);
      return {
        top,
        left: safeLeft,
      };
    }
  }, [
    isMyMessage,
    position.pageX,
    position.pageY,
    position.height,
    isExceedsScreenHeight,
    differenceLevel,
    getSafeHorizontalPosition,
  ]);

  const onLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const {height, width} = e.nativeEvent.layout;
      const isHeight =
         position.pageY + height + position.height + 139 >
         screenHeight;

      setDifferenceLevel(
         position.pageY +
           height +
           position.height -
           screenHeight
       );
      setIsExceedsScreenHeight(isHeight);
      setMessageWidth(width);
    },
    [position.pageY, position.height]
  );
  const timeTextStyle: LeftRightStyle<TextStyle> = useMemo(() => {
    return {
      left: {
        alignSelf: 'flex-start',
      },
      right: {
        alignSelf: 'flex-end',
        color: Color.black,
      },
    };
  }, []);

  const renderTime = useMemo(
    () => (
      <Time
        currentMessage={displayMessage}
        position={isMyMessage ? 'right' : 'left'}
        timeTextStyle={timeTextStyle}
      />
    ),
    [displayMessage, timeTextStyle, isMyMessage]
  );

  const renderMessage = useMemo(() => {
    if (displayMessage?.text) {
      return <MessageText currentMessage={displayMessage} position="left" />;
    } else {
      return null;
    }
  }, [displayMessage]);

  const renderFile = useMemo(() => {
    if (displayMessage?.file?.length && displayMessage?.file?.length > 0) {
      return (
        <MessageFile
          isReaction
          currentMessage={displayMessage}
          messageWidth={{ width: position.width + 36, _id: '' }}
        />
      );
    }
    return null;
  }, [position.width, displayMessage]);

  return (
    <Modal
      visible={isVisible}
      style={styles.modal}
      transparent={true}
      animationType="none"
    >
      {/* Pressable bắt sự kiện bấm nền */}
      <Animated.View style={StyleSheet.absoluteFill}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        {/* Overlay màu đen đậm */}
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            styles.overlay,
            overlayAnimatedStyle,
          ]}
          pointerEvents="none"
        />

        {isShowEmoji && user?._id !== displayMessage?.user?._id && (
          <Animated.View
            style={[
              styles.reactionIcon,
              styleReactionIcon(),
              reactionIconAnimatedStyle,
            ]}
          >
            {EMOJI_REACTIONS?.map((emoji) => (
              <Pressable
                key={emoji}
                onPress={() => {
                  onClose();
                  onReactionEmoji?.(emoji, displayMessage?._id?.toString());
                }}
                style={styles.reactionIconItem}
              >
                <Text style={styles.reactionIconText}>{emoji}</Text>
              </Pressable>
            ))}
          </Animated.View>
        )}

        {/* Hiển thị message ở vị trí đã đo */}
        <Animated.View
          onLayout={onLayout}
          style={[styles.message, styleMessage(), messageAnimatedStyle]}
        >
          {renderFile}
          {renderMessage}
          {renderTime}
        </Animated.View>

        <Animated.View
          style={[
            styles.layout,
            styleLayoutAction(),
            actionButtonsAnimatedStyle,
          ]}
        >
          <ButtonBase
            style={[
              styles.btnAction,
              { width: getScreenWidth() * 0.5 },
              message?.text && styles.btnBorderAction,
            ]}
            onPress={() => {
              onClose();
              onActionReaction?.(displayMessage, 'reply');
            }}
          >
            <Text style={styles.btnActionText}>Reply</Text>
            <FastImage
              style={styles.icon}
              source={require('./assets/reply.png')}
            />
          </ButtonBase>
          {displayMessage?.text && (
            <ButtonBase
              style={[styles.btnAction]}
              onPress={() => {
                onClose();
                onActionReaction?.(displayMessage, 'copy');
              }}
            >
              <Text style={styles.btnActionText}>Copy</Text>
              <FastImage
                style={styles.icon}
                source={require('./assets/copy.png')}
              />
            </ButtonBase>
          )}
          {/* <ButtonBase
            style={[styles.btnAction, styles.btnActionOther]}
            onPress={() => {
              onClose();
              onActionReaction?.(displayMessage, 'other');
            }}
          >
            <Text style={styles.btnActionText}>Other</Text>
            <FastImage style={styles.icon} source={require('../assets/more-information.png')} />
          </ButtonBase> */}
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
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
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  layout: {
    backgroundColor: Color.white,
    position: 'absolute',
    borderRadius: 16,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  btnAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  btnActionOther: {
    borderTopWidth: 4,
    borderTopColor: Color.defaultColor,
  },
  icon: {
    width: 18,
    height: 18,
  },
  btnActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: Color.black,
  },
  btnBorderAction: {
    borderBottomWidth: 1,
    borderBottomColor: Color.defaultColor,
  },
  time: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
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
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  reactionIconItem: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    width: (getScreenWidth() * 0.75 - 56) / 6,
  },
  reactionIconText: {
    fontSize: 24,
  },
});
