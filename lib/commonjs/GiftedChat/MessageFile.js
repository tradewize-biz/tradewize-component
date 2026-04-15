"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MessageFile = MessageFile;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _utils = require("./utils");
var _reactNativeFastImage = _interopRequireDefault(require("react-native-fast-image"));
var _Color = _interopRequireDefault(require("./Color"));
var _reactNativeCircularProgress = require("react-native-circular-progress");
var _utils2 = require("../utils");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const GAP_MEDIA = 3;
// ✅ tính toán size cố định dựa vào messageWidth + isShowAll
const calcSize = (isShowAll, messageWidth) => {
  const width = Number(messageWidth === null || messageWidth === void 0 ? void 0 : messageWidth.width) || (0, _utils2.getScreenWidth)(); // fallback an toàn

  const sizeMedia = width / 4.65 - GAP_MEDIA * 3.65;
  const sizeMediaShowAll = width / 4 - GAP_MEDIA * 3;
  if (isShowAll) return sizeMediaShowAll;
  if (sizeMedia < (0, _utils2.getScreenWidth)() * 0.1) return (0, _utils2.getScreenWidth)() * 0.15;
  return sizeMedia;
};
// ✅ MediaItem chỉ nhận size từ ngoài → ổn định layout
const MediaItem = /*#__PURE__*/(0, _react.memo)(({
  item,
  index,
  size,
  arrMedia,
  isShowAll,
  isReaction,
  currentMessage,
  onPressFile,
  onLongPressFile
}) => {
  const progressNum = Number(item === null || item === void 0 ? void 0 : item.progress);
  const safeProgress = Number.isFinite(progressNum) ? Math.max(0, Math.min(100, progressNum)) : 0;
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_reactNative.TouchableOpacity, {
    onLongPress: onLongPressFile,
    onPress: () => onPressFile === null || onPressFile === void 0 ? void 0 : onPressFile(item, (arrMedia === null || arrMedia === void 0 ? void 0 : arrMedia.length) > 8 && index === 7, {
      ...currentMessage,
      file: arrMedia
    }),
    disabled: isReaction || (item === null || item === void 0 ? void 0 : item.isLoading) && (item === null || item === void 0 ? void 0 : item.typeFile) === 'video',
    style: [styles.mediaItem, {
      width: size,
      height: size
    }]
  }, ((item === null || item === void 0 ? void 0 : item.thumbnailPreview) || (item === null || item === void 0 ? void 0 : item.uri) || (item === null || item === void 0 ? void 0 : item.url)) && /*#__PURE__*/_react.default.createElement(_reactNativeFastImage.default, {
    source: {
      uri: (item === null || item === void 0 ? void 0 : item.thumbnailPreview) || (item === null || item === void 0 ? void 0 : item.uri) || (item === null || item === void 0 ? void 0 : item.url),
      priority: _reactNativeFastImage.default.priority.low
    },
    style: styles.image
  }), (item === null || item === void 0 ? void 0 : item.typeFile) === 'video' && /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [styles.playIcon, (safeProgress <= 0 || safeProgress >= 100 || (item === null || item === void 0 ? void 0 : item.isLoading)) && {
      width: size * 0.5,
      height: size * 0.5,
      borderRadius: size * 0.5 / 2
    }]
  }, item !== null && item !== void 0 && item.isLoading ? /*#__PURE__*/_react.default.createElement(_reactNative.ActivityIndicator, {
    size: "small",
    color: _Color.default.defaultBlue
  }) : (safeProgress <= 0 || safeProgress >= 100) && /*#__PURE__*/_react.default.createElement(_reactNativeFastImage.default, {
    source: require('./assets/play.png'),
    resizeMode: _reactNativeFastImage.default.resizeMode.cover,
    style: {
      width: size * 0.5 / 2,
      height: size * 0.5 / 2
    }
  })), (arrMedia === null || arrMedia === void 0 ? void 0 : arrMedia.length) > 8 && index === 7 && !isShowAll && /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.reactionIcon
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.reactionIconText
  }, "+ ", (arrMedia === null || arrMedia === void 0 ? void 0 : arrMedia.length) - 8 > 99 ? '99+' : (arrMedia === null || arrMedia === void 0 ? void 0 : arrMedia.length) - 8))), !(item !== null && item !== void 0 && item.isLoading) && safeProgress > 0 && safeProgress < 100 && /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [styles.progress, {
      width: size,
      height: size
    }]
  }, /*#__PURE__*/_react.default.createElement(_reactNativeCircularProgress.AnimatedCircularProgress, {
    size: size * 0.3,
    width: 3,
    fill: safeProgress,
    tintColor: _Color.default.white,
    backgroundColor: _Color.default.defaultColor
  })));
}, (prev, next) => prev.item.uri === next.item.uri && prev.item.thumbnailPreview === next.item.thumbnailPreview && prev.item.progress === next.item.progress && prev.item.isLoading === next.item.isLoading && prev.size === next.size // ✅ so sánh luôn size
);
function MessageFile({
  onPressFile,
  messageWidth,
  currentMessage,
  isReaction,
  onLayout,
  onSaveThumbnail,
  isShowAll,
  onLongPressFile
}) {
  var _currentMessage$file;
  const [arrMedia, setArrMedia] = (0, _react.useState)((currentMessage === null || currentMessage === void 0 ? void 0 : currentMessage.file) || []);

  // ✅ Cache để tránh tạo lại thumbnail
  const thumbnailCache = (0, _react.useRef)(new Map());
  const processedFiles = (0, _react.useRef)(new Set());
  (0, _react.useEffect)(() => {
    const fetchData = async () => {
      try {
        const {
          file
        } = currentMessage;
        const getFileComplete = file === null || file === void 0 ? void 0 : file.filter(item => item.uri);
        if (!getFileComplete) return;

        // ✅ Chỉ xử lý những video chưa có thumbnail và chưa được xử lý
        const videosNeedThumbnail = getFileComplete.filter(item => item.typeFile === 'video' && !(item !== null && item !== void 0 && item.thumbnailPreview) && !processedFiles.current.has(item.uri));

        // ✅ Cập nhật loading state cho tất cả video chưa có thumbnail
        const newArrMediaLoading = getFileComplete.map(item => {
          if (item.typeFile === 'video' && !(item !== null && item !== void 0 && item.thumbnailPreview)) {
            const isProcessing = videosNeedThumbnail.some(v => v.uri === item.uri);
            return {
              ...item,
              isLoading: isProcessing
            };
          }
          return item;
        });
        setArrMedia(newArrMediaLoading);

        // ✅ Chỉ tạo thumbnail cho những video cần thiết
        if (videosNeedThumbnail.length > 0) {
          const result = await (0, _utils.generateThumbnails)(videosNeedThumbnail);

          // ✅ Cache thumbnail results
          result.forEach((res, index) => {
            const video = videosNeedThumbnail[index];
            if (video && res.path) {
              thumbnailCache.current.set(video.uri, res.path);
              processedFiles.current.add(video.uri);
            }
          });
        }

        // ✅ Cập nhật final state với thumbnail từ cache hoặc mới tạo
        const newArrMedia = getFileComplete.map(item => {
          if (item.typeFile === 'video') {
            const cachedThumbnail = thumbnailCache.current.get(item.uri);
            const thumbnail = (item === null || item === void 0 ? void 0 : item.thumbnailPreview) || cachedThumbnail || '';
            return {
              ...item,
              thumbnailPreview: thumbnail,
              isLoading: false
            };
          }
          return item;
        });
        onSaveThumbnail === null || onSaveThumbnail === void 0 || onSaveThumbnail(newArrMedia);
        setArrMedia(newArrMedia);
      } catch (_error) {
        // Thumbnail generation failed silently
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMessage._id, (_currentMessage$file = currentMessage.file) === null || _currentMessage$file === void 0 ? void 0 : _currentMessage$file.length, onSaveThumbnail]);
  const arrMediaShow = isShowAll ? arrMedia : arrMedia === null || arrMedia === void 0 ? void 0 : arrMedia.slice(0, 8);
  const size = calcSize(!!isShowAll, messageWidth);

  // Group items into rows of 4 for grid layout
  const rows = [];
  for (let i = 0; i < arrMediaShow.length; i += 4) {
    rows.push(arrMediaShow.slice(i, i + 4));
  }
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    onLayout: onLayout,
    style: [styles.container, {
      gap: GAP_MEDIA
    }]
  }, rows.map((row, rowIndex) => /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    key: rowIndex,
    style: {
      flexDirection: 'row',
      gap: GAP_MEDIA
    }
  }, row.map((item, colIndex) => {
    var _item$clientId, _item$uri;
    const index = rowIndex * 4 + colIndex;
    return /*#__PURE__*/_react.default.createElement(MediaItem, {
      key: (item === null || item === void 0 || (_item$clientId = item.clientId) === null || _item$clientId === void 0 ? void 0 : _item$clientId.toString()) || (item === null || item === void 0 || (_item$uri = item.uri) === null || _item$uri === void 0 ? void 0 : _item$uri.toString()),
      item: item,
      index: index,
      size: size,
      arrMedia: arrMedia,
      isShowAll: !!isShowAll,
      isReaction: isReaction,
      currentMessage: currentMessage,
      onPressFile: onPressFile,
      onLongPressFile: onLongPressFile
    });
  }))));
}
const styles = _reactNative.StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 4,
    paddingHorizontal: 4,
    borderRadius: 8
  },
  mediaItem: {
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4
  },
  playIcon: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)'
  },
  image: {
    width: '100%',
    height: '100%'
  },
  reactionIcon: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: '100%',
    height: '100%',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  reactionIconText: {
    color: _Color.default.white,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22
  },
  progress: {
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)'
  }
});
//# sourceMappingURL=MessageFile.js.map