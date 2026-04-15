import { StyleSheet } from 'react-native';
import Color from '../Color';

const styles = {
  left: StyleSheet.create({
    container: {
      alignItems: 'flex-start',
    },
    wrapper: {
      borderRadius: 15,
      backgroundColor: Color.leftBubbleBackground,
      marginRight: 60,
      minHeight: 20,
      justifyContent: 'flex-end',
    },
    containerToNext: {
      borderBottomLeftRadius: 3,
    },
    containerToPrevious: {
      borderTopLeftRadius: 3,
    },
    bottom: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
    },
  }),
  right: StyleSheet.create({
    container: {
      alignItems: 'flex-end',
    },
    wrapper: {
      borderRadius: 15,
      backgroundColor: Color.defaultBlue,
      marginLeft: 60,
      minHeight: 20,
      justifyContent: 'flex-end',
    },
    containerToNext: {
      borderBottomRightRadius: 3,
    },
    containerToPrevious: {
      borderTopRightRadius: 3,
    },
    bottom: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
  }),
  content: StyleSheet.create({
    tick: {
      fontSize: 10,
      backgroundColor: Color.backgroundTransparent,
      color: Color.white,
    },
    tickView: {
      flexDirection: 'row',
      marginRight: 10,
    },
    username: {
      top: -3,
      left: 0,
      fontSize: 12,
      backgroundColor: Color.backgroundTransparent,
      color: '#aaa',
    },
    usernameView: {
      flexDirection: 'row',
      marginHorizontal: 10,
    },
    layoutName: {
      paddingVertical: 2,
      width: '80%',
    },
    name: {
      fontSize: 12,
      color: Color.black,
      fontWeight: 'semibold',
    },
    reactionContainer: {
      backgroundColor: Color.white,
      position: 'absolute',
      minWidth: 36,
      height: 18,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: Color.leftBubbleBackground,
      bottom: -32,
      zIndex: 10,
      shadowColor: Color.leftBubbleBackground,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 3,
      flexDirection: 'row',
      gap: 2,
    },
    reactionEmojiText: {
      fontSize: 10,
    },
    reactionCountText: {
      fontSize: 12,
    },
    sendingIndicator: {
      height: 16,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 8,
    },
    errorContainer: {
      marginTop: 4,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    errorIcon: {
      width: 12,
      height: 12,
    },
    errorText: {
      fontSize: 12,
      fontWeight: '500',
      color: Color.alizarin,
    },
  }),
};

export default styles;
