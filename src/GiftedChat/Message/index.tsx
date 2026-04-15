/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-shadow */
import React, { memo, useCallback } from 'react';
import { View } from 'react-native';

import { Avatar } from '../Avatar';
import Bubble from '../Bubble';
import { SystemMessage } from '../SystemMessage';

import { isSameUser } from '../utils';
import { type IMessage } from '../types';
import { type MessageProps } from './types';
import styles from './styles';

export * from './types';

/** Shallow comparison of message properties that affect rendering */
function shallowMessageEqual(
  a: IMessage | undefined,
  b: IMessage | undefined
): boolean {
  if (a === b) return true;
  if (!a || !b) return false;

  return (
    a._id === b._id &&
    a.text === b.text &&
    a.sent === b.sent &&
    a.received === b.received &&
    a.pending === b.pending &&
    a.isSending === b.isSending &&
    a.errorMessage === b.errorMessage &&
    a.isShowName === b.isShowName &&
    a.isLast === b.isLast &&
    a.system === b.system &&
    a.file?.length === b.file?.length &&
    a.reactionEmoji?.length === b.reactionEmoji?.length &&
    a.messageReply?._id === b.messageReply?._id
  );
}

let Message: React.FC<MessageProps<IMessage>> = (
  props: MessageProps<IMessage>
) => {
  const {
    currentMessage,
    renderBubble: renderBubbleProp,
    renderSystemMessage: renderSystemMessageProp,
    onMessageLayout,
    nextMessage,
    position,
    containerStyle,
    user,
    showUserAvatar,
    onPressFile,
    onLongPressReaction,
  } = props;

  const renderBubble = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { containerStyle, onMessageLayout, ...rest } = props;

    if (renderBubbleProp) return renderBubbleProp(rest);

    return (
      <Bubble
        {...rest}
        onPressFile={onPressFile}
        onLongPressReaction={onLongPressReaction}
      />
    );
  }, [props, renderBubbleProp, onPressFile, onLongPressReaction]);

  const renderSystemMessage = useCallback(() => {
    const {
      /* eslint-disable @typescript-eslint/no-unused-vars */
      containerStyle,
      onMessageLayout,
      /* eslint-enable @typescript-eslint/no-unused-vars */
      ...rest
    } = props;

    if (renderSystemMessageProp) return renderSystemMessageProp(rest);

    return <SystemMessage {...rest} />;
  }, [props, renderSystemMessageProp]);

  const renderAvatar = useCallback(() => {
    if (
      user?._id &&
      currentMessage?.user &&
      user._id === currentMessage.user._id &&
      !showUserAvatar
    )
      return null;

    if (currentMessage?.user?.avatar === null) return null;

    const {
      /* eslint-disable @typescript-eslint/no-unused-vars */
      containerStyle,
      onMessageLayout,
      /* eslint-enable @typescript-eslint/no-unused-vars */
      ...rest
    } = props;

    return <Avatar {...rest} />;
  }, [props, user, currentMessage, showUserAvatar]);

  if (!currentMessage) return null;

  const sameUser = isSameUser(currentMessage, nextMessage!);

  return (
    <View onLayout={onMessageLayout}>
      {currentMessage.system ? (
        renderSystemMessage()
      ) : (
        <View
          style={[
            styles[position].container,
            { marginBottom: sameUser ? 2 : 10 },
            !props.inverted && { marginBottom: 2 },
            containerStyle?.[position],
          ]}
        >
          {position === 'left' ? renderAvatar() : null}
          {renderBubble()}
          {position === 'right' ? renderAvatar() : null}
        </View>
      )}
    </View>
  );
};

Message = memo(Message, (props, nextProps) => {
  const shouldUpdate =
    props.shouldUpdateMessage?.(props, nextProps) ||
    !shallowMessageEqual(props.currentMessage, nextProps.currentMessage) ||
    !shallowMessageEqual(
      props.previousMessage as IMessage | undefined,
      nextProps.previousMessage as IMessage | undefined
    ) ||
    !shallowMessageEqual(
      props.nextMessage as IMessage | undefined,
      nextProps.nextMessage as IMessage | undefined
    );

  if (shouldUpdate) return false;

  return true;
});

export default Message;
