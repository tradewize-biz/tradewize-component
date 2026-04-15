import React, {
  forwardRef,
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
} from 'react';
import {
  Platform,
  StyleSheet,
  TextInput,
  type TextInputProps,
  type NativeSyntheticEvent,
  type TextInputContentSizeChangeEventData,
  View,
  Image,
} from 'react-native';
import {
  MIN_COMPOSER_HEIGHT,
  DEFAULT_PLACEHOLDER,
  MAX_COMPOSER_HEIGHT,
} from './Constant';
import Color from './Color';
import stylesCommon from './styles';
import { ButtonBase } from '../ButtonBase';

export interface ComposerProps {
  composerHeight?: number;
  text?: string;
  placeholder?: string;
  placeholderTextColor?: string;
  textInputProps?: Partial<TextInputProps>;
  textInputStyle?: TextInputProps['style'];
  textInputAutoFocus?: boolean;
  keyboardAppearance?: TextInputProps['keyboardAppearance'];
  multiline?: boolean;
  disableComposer?: boolean;
  onTextChanged?(text: string): void;
  onInputSizeChanged?(layout: { width: number; height: number }): void;
  onPressPickMedia?: (type: 'camera' | 'pick') => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

export const Composer = forwardRef(
  (
    {
      composerHeight = MIN_COMPOSER_HEIGHT,
      disableComposer = false,
      keyboardAppearance = 'default',
      multiline = true,
      onInputSizeChanged,
      onTextChanged,
      placeholder = DEFAULT_PLACEHOLDER,
      placeholderTextColor = Color.defaultColor,
      textInputAutoFocus = false,
      text,
      textInputProps,
      textInputStyle,
      onPressPickMedia,
      onFocus,
      onBlur,
    }: ComposerProps,
    ref: React.Ref<TextInput>
  ) => {
    const dimensionsRef: any = useRef<{ width: number; height: number }>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const [lineCount, setLineCount] = useState(1);

    // Reset lineCount khi text trống (đặc biệt hữu ích trên Android)
    useEffect(() => {
      if (!text || text.trim() === '') {
        setLineCount(1);
      }
    }, [text]);

    const determineInputSizeChange = useCallback(
      (dimensions: { width: number; height: number }) => {
        // Support earlier versions of React Native on Android.
        if (!dimensions) return;

        if (
          !dimensionsRef.current ||
          (dimensionsRef.current &&
            (dimensionsRef.current.width !== dimensions.width ||
              dimensionsRef.current.height !== dimensions.height))
        ) {
          dimensionsRef.current = dimensions;
          onInputSizeChanged?.(dimensions);
        }
      },
      [onInputSizeChanged]
    );

    const handleContentSizeChange = useCallback(
      ({
        nativeEvent: { contentSize },
      }: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => {
        determineInputSizeChange(contentSize);

        // Nếu text rỗng, luôn giữ lineCount = 1
        if (!text || text.trim() === '') {
          setLineCount(1);
          return;
        }

        // Tính số dòng dựa trên contentSize height, xử lý đặc biệt cho Android
        const lineHeight = 22;
        const androidPadding = Platform.OS === 'android' ? 6 : 12; // Android có padding khác
        const minHeightForOneLine = lineHeight + androidPadding;

        let lines = 1;
        if (contentSize.height > minHeightForOneLine) {
          lines = Math.max(
            1,
            Math.ceil((contentSize.height - androidPadding) / lineHeight)
          );
        }

        setLineCount(lines);
      },
      [determineInputSizeChange, text]
    );

    const borderRadiusByLineCount = useMemo(() => {
      if (lineCount === 1) {
        return 100;
      }
      return 16;
    }, [lineCount]);

    const heightInput = useMemo(() => {
      // Chiều cao mặc định cho 1 hàng
      const minHeight = composerHeight ?? 40;
      const lineHeight = 22;

      // Chỉ tăng chiều cao khi có nhiều hơn 1 hàng
      if (lineCount > 1) {
        const calculatedHeight = lineCount * lineHeight;
        const maxHeight = MAX_COMPOSER_HEIGHT;
        return Math.min(calculatedHeight + 12, maxHeight); // +12 cho padding
      }

      // Trả về chiều cao mặc định cho 1 hàng
      return minHeight;
    }, [lineCount, composerHeight]);

    return (
      <View style={[styles.container, { opacity: disableComposer ? 0.5 : 1 }]}>
        {isFocused && !isPickerOpen && (
          <ButtonBase onPress={() => setIsPickerOpen(true)}>
            <Image
              tintColor={Color.defaultBlue}
              resizeMode="contain"
              source={require('./assets/next.png')}
              style={{ width: 18, height: 18 }}
            />
          </ButtonBase>
        )}
        {(!isFocused || isPickerOpen) && (
          <>
            <ButtonBase
              disabled={disableComposer}
              onPress={() => onPressPickMedia?.('camera')}
            >
              <Image
                tintColor={Color.defaultBlue}
                resizeMode="contain"
                source={require('./assets/camera.png')}
                style={styles.iconPick}
              />
            </ButtonBase>
          </>
        )}

        <View
          style={[
            styles.textInputContainer,
            {
              borderRadius: borderRadiusByLineCount,
            },
          ]}
        >
          <TextInput
            ref={ref}
            testID={placeholder}
            accessible
            accessibilityLabel={placeholder}
            placeholder={placeholder}
            placeholderTextColor={placeholderTextColor}
            multiline={multiline}
            editable={!disableComposer}
            onContentSizeChange={handleContentSizeChange}
            onChangeText={(txt) => {
              onTextChanged?.(txt);
              setIsPickerOpen(false);
            }}
            style={[
              stylesCommon.fill,
              styles.textInput,
              textInputStyle,
              {
                height: heightInput,
                ...Platform.select({
                  web: {
                    outlineWidth: 0,
                    outlineColor: 'transparent',
                    outlineOffset: 0,
                  },
                }),
              },
            ]}
            autoFocus={textInputAutoFocus}
            value={text}
            enablesReturnKeyAutomatically
            underlineColorAndroid="transparent"
            keyboardAppearance={keyboardAppearance}
            onFocus={() => {
              setIsFocused(true);
              onFocus?.();
            }}
            onBlur={() => {
              setIsFocused(false);
              setIsPickerOpen(false);
              onBlur?.();
            }}
            {...textInputProps}
          />
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  textInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Color.leftBubbleBackground,
    paddingHorizontal: 8,
  },
  textInput: {
    paddingRight: 8,
    paddingLeft: 8,
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 22,
    ...Platform.select({
      web: {
        paddingTop: 6,
        paddingLeft: 4,
      },
    }),
    marginTop: Platform.select({
      ios: 6,
      android: 0,
      web: 6,
    }),
    marginBottom: Platform.select({
      ios: 5,
      android: 3,
      web: 4,
    }),
  },
  iconPick: {
    width: 24,
    height: 24,
  },
});
