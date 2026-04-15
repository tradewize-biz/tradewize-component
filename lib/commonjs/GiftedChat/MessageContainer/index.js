"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {};
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _DayAnimated = _interopRequireDefault(require("./components/DayAnimated"));
var _Item = _interopRequireDefault(require("./components/Item"));
var _LoadEarlier = require("../LoadEarlier");
var _TypingIndicator = _interopRequireDefault(require("../TypingIndicator"));
var _logging = require("../logging");
var _styles = _interopRequireDefault(require("../styles"));
var _styles2 = _interopRequireDefault(require("./styles"));
var _utils = require("../utils");
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
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const AnimatedFlatList = _reactNativeReanimated.default.createAnimatedComponent(_reactNative.FlatList);
function MessageContainer(props) {
  const {
    messages = [],
    user,
    isTyping = false,
    renderChatEmpty: renderChatEmptyProp,
    onLoadEarlier,
    inverted = true,
    loadEarlier = false,
    listViewProps,
    invertibleScrollViewProps,
    extraData = null,
    isScrollToBottomEnabled = false,
    scrollToBottomOffset = 200,
    alignTop = false,
    scrollToBottomStyle,
    infiniteScroll = false,
    isLoadingEarlier = false,
    renderTypingIndicator: renderTypingIndicatorProp,
    renderFooter: renderFooterProp,
    renderLoadEarlier: renderLoadEarlierProp,
    forwardRef,
    handleOnScroll: handleOnScrollProp,
    scrollToBottomComponent: scrollToBottomComponentProp,
    renderDay: renderDayProp,
    onPressFile,
    onLongPressReaction,
    useScrollView = false
  } = props;
  const scrollToBottomOpacity = (0, _reactNativeReanimated.useSharedValue)(0);
  const [isScrollToBottomVisible, setIsScrollToBottomVisible] = (0, _react.useState)(false);
  const [isAtBottom, setIsAtBottom] = (0, _react.useState)(true);
  const scrollToBottomStyleAnim = (0, _reactNativeReanimated.useAnimatedStyle)(() => ({
    opacity: scrollToBottomOpacity.value
  }), [scrollToBottomOpacity]);
  const daysPositions = (0, _reactNativeReanimated.useSharedValue)({});
  const listHeight = (0, _reactNativeReanimated.useSharedValue)(0);
  const scrolledY = (0, _reactNativeReanimated.useSharedValue)(0);

  // Scroll position tracking refs for ScrollView load more functionality
  const scrollPosition = (0, _react.useRef)(0);
  const contentHeight = (0, _react.useRef)(0);
  const scrollViewHeight = (0, _react.useRef)(0);
  const hasInitiallyRendered = (0, _react.useRef)(false);

  // Auto-scroll tracking refs (similar to ChatScrollView and VirtualizedChatList)
  const previousLengthRef = (0, _react.useRef)(messages.length);
  const lastMessageIdRef = (0, _react.useRef)(null);
  const hasScrolledToBottomRef = (0, _react.useRef)(false);
  const isFirstTimeAccess = (0, _react.useRef)(true);
  const hasScrolledOnFirstAccess = (0, _react.useRef)(false);

  // Track all setTimeout IDs for cleanup on unmount
  const timeoutIdsRef = (0, _react.useRef)([]);
  const safeSetTimeout = (0, _react.useCallback)((fn, delay) => {
    const id = setTimeout(fn, delay);
    timeoutIdsRef.current.push(id);
    return id;
  }, []);

  // Cleanup all timeouts on unmount
  (0, _react.useEffect)(() => {
    return () => {
      timeoutIdsRef.current.forEach(clearTimeout);
      timeoutIdsRef.current = [];
    };
  }, []);
  const renderTypingIndicator = (0, _react.useCallback)(() => {
    if (renderTypingIndicatorProp) return renderTypingIndicatorProp();
    return /*#__PURE__*/_react.default.createElement(_TypingIndicator.default, {
      isTyping: isTyping
    });
  }, [isTyping, renderTypingIndicatorProp]);
  const ListFooterComponent = (0, _react.useMemo)(() => {
    if (renderFooterProp) return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, renderFooterProp(props));
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, renderTypingIndicator());
  }, [renderFooterProp, renderTypingIndicator, props]);
  const renderLoadEarlier = (0, _react.useCallback)(() => {
    if (loadEarlier) {
      if (renderLoadEarlierProp) return renderLoadEarlierProp(props);
      return /*#__PURE__*/_react.default.createElement(_LoadEarlier.LoadEarlier, props);
    }
    return null;
  }, [loadEarlier, renderLoadEarlierProp, props]);
  const scrollTo = (0, _react.useCallback)(options => {
    if (forwardRef !== null && forwardRef !== void 0 && forwardRef.current && options) {
      if (useScrollView) {
        // ScrollView uses scrollTo method
        const scrollViewRef = forwardRef.current;
        if ('scrollTo' in scrollViewRef) {
          scrollViewRef.scrollTo({
            x: 0,
            y: options.offset,
            animated: options.animated ?? true
          });
        }
      } else {
        // FlatList uses scrollToOffset method
        const flatListRef = forwardRef.current;
        if ('scrollToOffset' in flatListRef) {
          flatListRef.scrollToOffset(options);
        }
      }
    }
  }, [forwardRef, useScrollView]);

  // Check if user is at bottom (similar to ChatScrollView)
  const checkIsAtBottom = (0, _react.useCallback)((contentOffset, contentSize, layoutHeight) => {
    const threshold = 100; // 100 px threshold
    return contentOffset + layoutHeight >= contentSize - threshold;
  }, []);
  const doScrollToBottom = (0, _react.useCallback)((animated = true) => {
    if (forwardRef !== null && forwardRef !== void 0 && forwardRef.current) {
      if (useScrollView) {
        // ScrollView uses scrollToEnd method
        const scrollViewRef = forwardRef.current;
        if (inverted) {
          if ('scrollTo' in scrollViewRef) {
            scrollViewRef.scrollTo({
              x: 0,
              y: 0,
              animated
            });
          }
        } else {
          if ('scrollToEnd' in scrollViewRef) {
            scrollViewRef.scrollToEnd({
              animated
            });
          }
        }
      } else {
        // FlatList logic
        const flatListRef = forwardRef.current;
        if (inverted) {
          scrollTo({
            offset: 0,
            animated
          });
        } else {
          if ('scrollToEnd' in flatListRef) {
            flatListRef.scrollToEnd({
              animated
            });
          }
        }
      }
    }
  }, [forwardRef, inverted, scrollTo, useScrollView]);
  const handleOnScroll = (0, _react.useCallback)(event => {
    handleOnScrollProp === null || handleOnScrollProp === void 0 || handleOnScrollProp(event);
    const {
      contentOffset: {
        y: contentOffsetY
      },
      contentSize: {
        height: contentSizeHeight
      },
      layoutMeasurement: {
        height: layoutMeasurementHeight
      }
    } = event;
    const atBottom = checkIsAtBottom(contentOffsetY, contentSizeHeight, layoutMeasurementHeight);
    (0, _reactNativeReanimated.runOnJS)(setIsAtBottom)(atBottom);
    const duration = 250;
    const makeScrollToBottomVisible = () => {
      setIsScrollToBottomVisible(true);
      scrollToBottomOpacity.value = (0, _reactNativeReanimated.withTiming)(1, {
        duration
      });
    };
    const makeScrollToBottomHidden = () => {
      scrollToBottomOpacity.value = (0, _reactNativeReanimated.withTiming)(0, {
        duration
      }, isFinished => {
        if (isFinished) (0, _reactNativeReanimated.runOnJS)(setIsScrollToBottomVisible)(false);
      });
    };
    if (inverted) {
      if (contentOffsetY > scrollToBottomOffset) makeScrollToBottomVisible();else makeScrollToBottomHidden();
    } else if (contentOffsetY < scrollToBottomOffset && contentSizeHeight - layoutMeasurementHeight > scrollToBottomOffset) makeScrollToBottomVisible();else makeScrollToBottomHidden();
  }, [handleOnScrollProp, inverted, scrollToBottomOffset, scrollToBottomOpacity, checkIsAtBottom]);
  const renderItem = (0, _react.useCallback)(({
    item,
    index
  }) => {
    const messageItem = item;
    if (!messageItem._id && messageItem._id !== 0) (0, _logging.warning)('GiftedChat: `_id` is missing for message', JSON.stringify(item));
    if (!messageItem.user) {
      if (!messageItem.system) (0, _logging.warning)('GiftedChat: `user` is missing for message', JSON.stringify(messageItem));
      messageItem.user = {
        _id: 0
      };
    }
    if (messages && user) {
      const previousMessage = (inverted ? messages[index + 1] : messages[index - 1]) || {};
      const nextMessage = (inverted ? messages[index - 1] : messages[index + 1]) || {};
      const messageProps = {
        ...props,
        currentMessage: messageItem,
        previousMessage,
        nextMessage,
        position: messageItem.user._id === user._id ? 'right' : 'left',
        scrolledY,
        daysPositions,
        listHeight,
        onPressFile,
        onLongPressReaction
      };
      return /*#__PURE__*/_react.default.createElement(_Item.default, messageProps);
    }
    return null;
  }, [props, inverted, scrolledY, daysPositions, listHeight, user, onPressFile, onLongPressReaction, messages]);
  const renderChatEmpty = (0, _react.useCallback)(() => {
    if (renderChatEmptyProp) return inverted ? renderChatEmptyProp() : /*#__PURE__*/_react.default.createElement(_reactNative.View, {
      style: [_styles.default.fill, _styles2.default.emptyChatContainer]
    }, renderChatEmptyProp());
    return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
      style: _styles.default.fill
    });
  }, [inverted, renderChatEmptyProp]);
  const ListHeaderComponent = (0, _react.useMemo)(() => {
    const content = renderLoadEarlier();
    if (!content) return null;
    return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
      style: _styles.default.fill
    }, content);
  }, [renderLoadEarlier]);
  const renderScrollBottomComponent = (0, _react.useCallback)(() => {
    if (scrollToBottomComponentProp) return scrollToBottomComponentProp();
    return /*#__PURE__*/_react.default.createElement(_reactNative.Text, null, 'V');
  }, [scrollToBottomComponentProp]);
  const renderScrollToBottomWrapper = (0, _react.useCallback)(() => {
    if (!isScrollToBottomVisible) return null;
    return /*#__PURE__*/_react.default.createElement(_reactNative.TouchableOpacity, {
      onPress: () => doScrollToBottom()
    }, /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
      style: [_styles.default.centerItems, _styles2.default.scrollToBottomStyle, scrollToBottomStyle, scrollToBottomStyleAnim]
    }, renderScrollBottomComponent()));
  }, [scrollToBottomStyle, renderScrollBottomComponent, doScrollToBottom, scrollToBottomStyleAnim, isScrollToBottomVisible]);
  const isFirstRender = (0, _react.useRef)({
    scrollToBottom: true
  });
  const onLayoutList = (0, _react.useCallback)(event => {
    var _listViewProps$onLayo;
    listHeight.value = event.nativeEvent.layout.height;
    if (!inverted && isFirstRender.current.scrollToBottom) {
      safeSetTimeout(() => {
        doScrollToBottom(false);
        isFirstRender.current.scrollToBottom = false;
      }, 500);
    }
    listViewProps === null || listViewProps === void 0 || (_listViewProps$onLayo = listViewProps.onLayout) === null || _listViewProps$onLayo === void 0 || _listViewProps$onLayo.call(listViewProps, event);
  }, [inverted, doScrollToBottom, listHeight, listViewProps, safeSetTimeout]);
  const onEndReached = (0, _react.useCallback)(() => {
    if (infiniteScroll && loadEarlier && onLoadEarlier && !isLoadingEarlier && _reactNative.Platform.OS !== 'web') onLoadEarlier();
  }, [infiniteScroll, loadEarlier, onLoadEarlier, isLoadingEarlier]);

  // Handle scroll to the top for loading more messages (ScrollView version)
  const handleScrollToTop = (0, _react.useCallback)(() => {
    if (infiniteScroll && loadEarlier && onLoadEarlier && !isLoadingEarlier && hasInitiallyRendered.current && _reactNative.Platform.OS !== 'web') {
      // Record the current position before loading more
      const currentPosition = scrollPosition.current;
      const currentContentHeight = contentHeight.current;

      // Call load more
      onLoadEarlier();

      // After loading more, try to maintain the scroll position
      safeSetTimeout(() => {
        if (forwardRef !== null && forwardRef !== void 0 && forwardRef.current && contentHeight.current > currentContentHeight) {
          // Calculate new position to maintain relative view
          const heightDiff = contentHeight.current - currentContentHeight;
          const scrollViewRef = forwardRef.current;
          if ('scrollTo' in scrollViewRef) {
            scrollViewRef.scrollTo({
              y: currentPosition + heightDiff,
              animated: false
            });
          }
        }
      }, 300);
    }
  }, [infiniteScroll, loadEarlier, onLoadEarlier, isLoadingEarlier, forwardRef, safeSetTimeout]);
  const keyExtractor = (0, _react.useCallback)(item => item._id.toString(), []);
  const renderCell = (0, _react.useCallback)(props => {
    const handleOnLayout = event => {
      var _props$onLayout, _props$item;
      (_props$onLayout = props.onLayout) === null || _props$onLayout === void 0 || _props$onLayout.call(props, event);
      const {
        y,
        height
      } = event.nativeEvent.layout;
      const newValue = {
        y,
        height,
        createdAt: new Date(props === null || props === void 0 || (_props$item = props.item) === null || _props$item === void 0 ? void 0 : _props$item.createdAt).getTime()
      };
      daysPositions.modify(value => {
        'worklet';

        const isSameDay = (date1, date2) => {
          const d1 = new Date(date1);
          const d2 = new Date(date2);
          return d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();
        };
        for (const [key, item] of Object.entries(value)) if (isSameDay(newValue.createdAt, item.createdAt) && (inverted ? item.y <= newValue.y : item.y >= newValue.y)) {
          delete value[key];
          break;
        }

        // @ts-expect-error: https://docs.swmansion.com/react-native-reanimated/docs/core/useSharedValue#remarks
        value[props.item._id] = newValue;
        return value;
      });
    };
    return /*#__PURE__*/_react.default.createElement(_reactNative.View, _extends({}, props, {
      onLayout: handleOnLayout
    }), props.children);
  }, [daysPositions, inverted]);
  const scrollHandler = (0, _reactNativeReanimated.useAnimatedScrollHandler)({
    onScroll: event => {
      scrolledY.value = event.contentOffset.y;
      (0, _reactNativeReanimated.runOnJS)(handleOnScroll)(event);
    }
  }, [handleOnScroll]);
  const scrollHandlerForScrollView = (0, _react.useCallback)(event => {
    const {
      contentOffset,
      contentSize,
      layoutMeasurement
    } = event.nativeEvent;
    const currentOffset = contentOffset.y;
    const currentContentHeight = contentSize.height;
    const currentScrollViewHeight = layoutMeasurement.height;

    // Update refs for scroll position tracking
    scrollPosition.current = currentOffset;
    contentHeight.current = currentContentHeight;
    scrollViewHeight.current = currentScrollViewHeight;

    // Check if at the bottom and update state
    const atBottom = checkIsAtBottom(currentOffset, currentContentHeight, currentScrollViewHeight);
    setIsAtBottom(atBottom);

    // Update animated value for existing functionality
    scrolledY.value = currentOffset;
  }, [checkIsAtBottom, scrolledY]);

  // Update scroll-to-bottom button visibility based on isAtBottom state
  (0, _react.useEffect)(() => {
    if (!isAtBottom && !isScrollToBottomVisible) {
      setIsScrollToBottomVisible(true);
      scrollToBottomOpacity.value = (0, _reactNativeReanimated.withTiming)(1, {
        duration: 200
      });
    } else if (isAtBottom && isScrollToBottomVisible) {
      scrollToBottomOpacity.value = (0, _reactNativeReanimated.withTiming)(0, {
        duration: 200
      }, () => {
        (0, _reactNativeReanimated.runOnJS)(setIsScrollToBottomVisible)(false);
      });
    }
  }, [isAtBottom, isScrollToBottomVisible, scrollToBottomOpacity]);

  // Handle scroll begin drag to detect scrolling to top
  const onScrollBeginDrag = (0, _react.useCallback)(() => {
    // If user scrolls near the top (less than 100 pixels from top) and has more messages to load
    if (scrollPosition.current < 100 && loadEarlier) {
      handleScrollToTop();
    }
  }, [handleScrollToTop, loadEarlier]);

  // Prevent early load more calls during initial render
  (0, _react.useEffect)(() => {
    const timer = setTimeout(() => {
      hasInitiallyRendered.current = true;
    }, 1000); // Wait 1 second before allowing load more calls

    return () => clearTimeout(timer);
  }, []);

  // Enhanced auto-scroll to the bottom when new messages arrive (only if user is at bottom)
  (0, _react.useEffect)(() => {
    const currentLength = messages.length;
    const previousLength = previousLengthRef.current;

    // Get the last message ID
    const lastMessage = messages[messages.length - 1];
    const currentLastMessageId = (lastMessage === null || lastMessage === void 0 ? void 0 : lastMessage._id) || null;
    const previousLastMessageId = lastMessageIdRef.current;

    // Only auto-scroll if:
    // 1. User is at the bottom (or this is an initial load)
    // 2. AND (new messages were added OR last message changed OR first time with messages)
    // 3. AND not loading (if loading prop exists)
    const hasNewContent = currentLength > previousLength || currentLastMessageId !== previousLastMessageId && currentLastMessageId !== null;
    const isFirstTimeWithMessages = currentLength > 0 && !hasScrolledToBottomRef.current;
    const shouldScroll = (isAtBottom || isFirstTimeWithMessages) && (hasNewContent || isFirstTimeWithMessages) && currentLength > 0;
    if (shouldScroll) {
      doScrollToBottom();
      hasScrolledToBottomRef.current = true;
    }

    // Update refs
    previousLengthRef.current = currentLength;
    lastMessageIdRef.current = currentLastMessageId;
  }, [messages, doScrollToBottom, isAtBottom]);

  // Enhanced initial scroll to the bottom when messages first load
  (0, _react.useEffect)(() => {
    if (messages.length > 0 && isFirstTimeAccess.current && !hasScrolledOnFirstAccess.current) {
      // Mark that we've attempted the first scroll
      hasScrolledOnFirstAccess.current = true;

      // Multiple scroll attempts with increasing delays to ensure messages are fully rendered
      const scrollAttempts = [100, 300, 500, 800, 1200];
      scrollAttempts.forEach((delay, index) => {
        safeSetTimeout(() => {
          if (messages.length > 0) {
            doScrollToBottom(index > 0); // First attempt immediate, rest animated
          }
        }, delay);
      });

      // Mark as no longer first time after all attempts
      safeSetTimeout(() => {
        isFirstTimeAccess.current = false;
        hasScrolledToBottomRef.current = true;
      }, 1500);
    } else if (messages.length > 0 && !hasScrolledToBottomRef.current && !isFirstTimeAccess.current) {
      // Regular initial scroll for subsequent loads
      safeSetTimeout(() => doScrollToBottom(), 100);
      hasScrolledToBottomRef.current = true;
    }
  }, [messages.length, doScrollToBottom, safeSetTimeout]);

  // Reset scroll flag when messages are cleared (e.g., when switching chats)
  (0, _react.useEffect)(() => {
    if (messages.length === 0) {
      hasScrolledToBottomRef.current = false;
      isFirstTimeAccess.current = true;
      hasScrolledOnFirstAccess.current = false;
      setIsAtBottom(true);
    }
  }, [messages.length]);

  // Auto-scroll when typing indicator appears (only if user is truly at bottom)
  (0, _react.useEffect)(() => {
    if (isTyping && isAtBottom && hasScrolledToBottomRef.current) {
      // Small delay to ensure typing indicator is rendered
      safeSetTimeout(() => {
        doScrollToBottom(true);
      }, 100);
    }
  }, [isTyping, isAtBottom, doScrollToBottom, safeSetTimeout]);

  // removes unrendered days positions when messages are added/removed
  (0, _react.useEffect)(() => {
    Object.keys(daysPositions.value).forEach(key => {
      const messageIndex = messages.findIndex(m => m._id.toString() === key);
      let shouldRemove = messageIndex === -1;
      if (!shouldRemove) {
        const prevMessage = messages[messageIndex + (inverted ? 1 : -1)];
        const message = messages[messageIndex];
        shouldRemove = !!prevMessage && (0, _utils.isSameDay)(message, prevMessage);
      }
      if (shouldRemove) daysPositions.modify(value => {
        'worklet';

        delete value[key];
        return value;
      });
    });
  }, [messages, daysPositions, inverted]);
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [_styles2.default.contentContainerStyle, alignTop ? _styles2.default.containerAlignTop : _styles.default.fill]
  }, useScrollView ? /*#__PURE__*/_react.default.createElement(_reactNative.ScrollView, _extends({
    ref: forwardRef,
    style: _styles.default.fill,
    automaticallyAdjustContentInsets: false
  }, invertibleScrollViewProps, {
    onScroll: scrollHandlerForScrollView,
    onScrollBeginDrag: onScrollBeginDrag,
    scrollEventThrottle: 1,
    onLayout: onLayoutList,
    nestedScrollEnabled: true
  }), inverted ? ListHeaderComponent : null, messages.length === 0 ? renderChatEmpty() : null, messages.map((item, index) => {
    const renderedItem = renderItem({
      item,
      index
    });
    return renderedItem ? /*#__PURE__*/_react.default.createElement(_reactNative.View, {
      key: keyExtractor(item),
      onLayout: event => {
        var _renderCell$props$onL, _renderCell$props;
        return (_renderCell$props$onL = (_renderCell$props = renderCell({
          item,
          index,
          onLayout: () => {},
          children: renderedItem
        }).props).onLayout) === null || _renderCell$props$onL === void 0 ? void 0 : _renderCell$props$onL.call(_renderCell$props, event);
      }
    }, renderedItem) : null;
  }), inverted ? null : ListFooterComponent) : /*#__PURE__*/_react.default.createElement(AnimatedFlatList, _extends({
    extraData: extraData,
    ref: forwardRef,
    keyExtractor: keyExtractor,
    data: messages,
    renderItem: renderItem,
    inverted: inverted,
    automaticallyAdjustContentInsets: false,
    style: _styles.default.fill
  }, invertibleScrollViewProps, {
    ListEmptyComponent: renderChatEmpty,
    ListFooterComponent: inverted ? ListHeaderComponent : ListFooterComponent,
    ListHeaderComponent: inverted ? ListFooterComponent : ListHeaderComponent,
    onScroll: scrollHandler,
    scrollEventThrottle: 1,
    onEndReached: onEndReached,
    onEndReachedThreshold: 0.1
  }, listViewProps, {
    onLayout: onLayoutList,
    CellRendererComponent: renderCell,
    maintainVisibleContentPosition: {
      minIndexForVisible: 0,
      autoscrollToTopThreshold: 10
    }
  })), isScrollToBottomEnabled ? renderScrollToBottomWrapper() : null, /*#__PURE__*/_react.default.createElement(_DayAnimated.default, {
    scrolledY: scrolledY,
    daysPositions: daysPositions,
    listHeight: listHeight,
    renderDay: renderDayProp,
    messages: messages,
    isLoadingEarlier: isLoadingEarlier
  }));
}
var _default = exports.default = MessageContainer;
//# sourceMappingURL=index.js.map