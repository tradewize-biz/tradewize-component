import React, { useCallback, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, {
  Layout,
  SlideInDown,
  SlideOutUp,
} from 'react-native-reanimated';

import { Composer, type ComposerProps } from './Composer';
import { Send, type SendProps } from './Send';
import { Actions, type ActionsProps } from './Actions';
import Color from './Color';
import { type FileMessage, type IMessage } from './types';
import FastImage from 'react-native-fast-image';
import { formatDurationSmart } from './utils';
import { getScreenWidth } from '../utils';
import { ButtonBase } from '../ButtonBase';

export interface InputToolbarProps<TMessage extends IMessage> {
  options?: { [key: string]: () => void };
  optionTintColor?: string;
  containerStyle?: StyleProp<ViewStyle>;
  primaryStyle?: StyleProp<ViewStyle>;
  accessoryStyle?: StyleProp<ViewStyle>;
  renderAccessory?(props: InputToolbarProps<TMessage>): React.ReactNode;
  renderActions?(props: ActionsProps): React.ReactNode;
  renderSend?(props: SendProps<TMessage>): React.ReactNode;
  renderComposer?(props: ComposerProps): React.ReactNode;
  onPressActionButton?(): void;
  icon?: () => React.ReactNode;
  wrapperStyle?: StyleProp<ViewStyle>;
  inputRef?: React.RefObject<TextInput>;
  onPressPickMedia?: (type: 'camera' | 'pick') => void;
  fileMedia?: FileMessage[];
  onRemoveFile?: (file: FileMessage) => void;
  onPressFile?: (file: FileMessage) => void;
  messageReaction?: IMessage & { isReply: boolean };
  clearMessageReaction?: () => void;
  labelReaction?: string;
  onFocusInput?: () => void;
  onBlurInput?: () => void;
  messageContentReaction?: string;
  isMe?: boolean;
  onEditFileImage?: (file: FileMessage) => void;
}

export function InputToolbar<TMessage extends IMessage = IMessage>(
  props: InputToolbarProps<TMessage>
) {
  const {
    renderActions,
    onPressActionButton,
    renderComposer,
    renderSend,
    renderAccessory,
    options,
    optionTintColor,
    icon,
    wrapperStyle,
    containerStyle,
    onPressPickMedia,
    fileMedia,
    onRemoveFile,
    onPressFile,
    messageReaction,
    clearMessageReaction,
    labelReaction,
    onFocusInput,
    onBlurInput,
    messageContentReaction,
    isMe,
  } = props;

  const actionsFragment = useMemo(() => {
    const props = {
      onPressActionButton,
      options,
      optionTintColor,
      icon,
      wrapperStyle,
      containerStyle,
      onPressPickMedia,
    };

    return (
      renderActions?.(props) || (onPressActionButton && <Actions {...props} />)
    );
  }, [
    renderActions,
    onPressActionButton,
    options,
    optionTintColor,
    icon,
    wrapperStyle,
    containerStyle,
    onPressPickMedia,
  ]);

  const composerFragment = useMemo(() => {
    return (
      renderComposer?.(props as ComposerProps) || (
        <Composer
          ref={props?.inputRef}
          {...(props as ComposerProps)}
          onPressPickMedia={props.onPressPickMedia}
          onFocus={onFocusInput}
          onBlur={onBlurInput}
        />
      )
    );
  }, [renderComposer, props, onFocusInput, onBlurInput]);

  const renderFileMedia = useMemo(() => {
    if (!fileMedia?.length) return null;

    return (
      <View style={styles.previewFile}>
        {fileMedia?.map((item) => {
          return (
            <TouchableOpacity
              onPress={() => {
                onPressFile?.(item);
              }}
              key={item.id}
              style={[
                styles.previewFileItem,
                {
                  width: getScreenWidth() * 0.22,
                  height: getScreenWidth() * 0.22,
                },
              ]}
            >
              <TouchableOpacity
                onPress={() => {
                  onRemoveFile?.(item);
                }}
                style={[
                  styles.removeFile,
                  {
                    width: getScreenWidth() * 0.06,
                    height: getScreenWidth() * 0.06,
                  },
                ]}
              >
                <Text style={styles.removeFileText}>X</Text>
              </TouchableOpacity>

              <FastImage
                source={{ uri: item.thumbnailPreview }}
                style={styles.previewFileItemImage}
              />

              {item.typeFile === 'video' && (
                <View
                  style={[
                    styles.iconPlayContainer,
                    {
                      width: getScreenWidth() * 0.1,
                      height: getScreenWidth() * 0.1,
                      top:
                        (getScreenWidth() * 0.22) / 2 -
                        (getScreenWidth() * 0.1) / 2,
                      right:
                        (getScreenWidth() * 0.22) / 2 -
                        (getScreenWidth() * 0.1) / 2,
                    },
                  ]}
                >
                  <FastImage
                    source={require('./assets/play.png')}
                    style={styles.iconPlay}
                  />
                </View>
              )}

              {item.typeFile === 'video' && (
                <View style={styles.previewFileItemVideo}>
                  <Text style={styles.previewFileItemVideoText}>
                    {formatDurationSmart(item?.duration || 0)}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }, [fileMedia, onRemoveFile, onPressFile]);

  const renderMessageReaction = useCallback(() => {
    if (!messageReaction?.text && !messageReaction?.file) return null;
    if (
      messageReaction?.text &&
      (!messageReaction?.file || messageReaction?.file?.length <= 0)
    ) {
      return messageReaction?.text;
    }
    if (messageReaction?.file && messageReaction?.file?.length > 0) {
      if (messageContentReaction) {
        return messageContentReaction;
      }
      return 'File media';
    }
    return null;
  }, [messageReaction, messageContentReaction]);

  const renderFilePreview = useMemo(() => {
    if (!messageReaction?.file) return null;
    if (messageReaction?.file?.length <= 0) return null;
    if (messageReaction?.file?.length <= 3) {
      return (
        <>
          {messageReaction?.file?.map((item, index) => {
            return (
              <View
                style={styles.filePreview}
                key={`${item?.id} + ${item?.name} + ${index}`}
              >
                <FastImage
                  source={{ uri: item?.thumbnailPreview || item?.uri }}
                  style={styles.filePreviewImage}
                />
              </View>
            );
          })}
        </>
      );
    }
    return (
      <>
        {messageReaction?.file
          ?.filter((_item, index) => index < 2)
          ?.map((item, index) => {
            return (
              <View
                style={styles.filePreview}
                key={`${item?.id} + ${item?.name} + ${index}`}
              >
                <FastImage
                  source={{ uri: item?.thumbnailPreview || item?.uri }}
                  style={styles.filePreviewImage}
                />
              </View>
            );
          })}
        <View>
          <FastImage
            source={{
              uri:
                messageReaction?.file[2]?.thumbnailPreview ||
                messageReaction?.file[2]?.uri,
            }}
            style={[styles.filePreview, { opacity: 0.5 }]}
          />
          <View style={styles.filePreviewMore}>
            <Text style={styles.filePreviewMoreText}>
              +
              {messageReaction?.file?.length - 2 > 99
                ? '99'
                : messageReaction?.file?.length - 2}
            </Text>
          </View>
        </View>
      </>
    );
  }, [messageReaction]);

  return (
    <View style={[styles.container, containerStyle]}>
      {messageReaction && (
        <View style={styles.messageReaction}>
          <View style={styles.messageReactionContainer}>
            <Text style={styles.messageReactionText}>
              {labelReaction
                ? labelReaction
                : `Are replying ${isMe ? 'yourself' : messageReaction?.user?.name}`}
            </Text>
            <Text numberOfLines={2} style={styles.messageReactionContent}>
              {renderMessageReaction()}
            </Text>
          </View>

          {renderFilePreview}

          <ButtonBase
            activeOpacity={0.7}
            variant="ghost"
            title="X"
            onPress={() => {
              clearMessageReaction?.();
            }}
            style={styles.messageReactionCloseButton}
            textStyle={styles.messageReactionClose}
          />
        </View>
      )}
      <View style={[styles.primary, props.primaryStyle]}>
        {actionsFragment}
        {composerFragment}
        {renderSend?.(props) || <Send {...props} />}
      </View>
      {renderAccessory && (
        <View style={[styles.accessory, props.accessoryStyle]}>
          {renderAccessory(props)}
        </View>
      )}
      <Animated.View
        entering={SlideInDown.duration(300)}
        exiting={SlideOutUp.duration(300)}
        layout={Layout}
      >
        {renderFileMedia}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Color.defaultColor,
    backgroundColor: Color.white,
    paddingTop: 8,
    paddingHorizontal: 16,
  },
  primary: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accessory: {
    height: 44,
  },
  previewFile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  previewFileItem: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: Color.defaultColor,
    borderWidth: 1,
    borderColor: Color.defaultColor,
  },
  previewFileItemImage: {
    width: '100%',
    height: '100%',
  },
  previewFileItemVideo: {
    position: 'absolute',
    bottom: 2,
    right: 4,
  },
  previewFileItemVideoText: {
    color: Color.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  removeFile: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: Color.defaultColor,
    borderRadius: 100,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Color.white,
  },
  removeFileText: {
    color: Color.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  iconPlay: {
    width: 24,
    height: 24,
    marginLeft: 4,
  },
  iconPlayContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 100,
  },
  messageReactionContainer: {
    flex: 1,
  },
  messageReaction: {
    backgroundColor: Color.white,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  messageReactionText: {
    color: Color.black,
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 20,
  },
  messageReactionContent: {
    color: Color.black,
    fontSize: 14,
    lineHeight: 20,
  },
  messageReactionClose: {
    color: Color.black,
    fontSize: 18,
    fontWeight: '500',
  },
  messageReactionCloseButton: {
    width: getScreenWidth() * 0.07,
    height: getScreenWidth() * 0.07,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  filePreview: {
    width: getScreenWidth() * 0.1,
    height: getScreenWidth() * 0.1,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: Color.defaultColor,
    borderWidth: 1,
    borderColor: Color.defaultColor,
    marginLeft: 4,
  },
  filePreviewImage: {
    width: '100%',
    height: '100%',
  },
  filePreviewMore: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filePreviewMoreText: {
    color: Color.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
});
