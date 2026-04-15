import React, { useEffect, useState, memo, useRef } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { generateThumbnails } from './utils';
import FastImage from 'react-native-fast-image';
import Color from './Color';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { getScreenWidth } from '../utils';
const GAP_MEDIA = 3;
// ✅ tính toán size cố định dựa vào messageWidth + isShowAll
const calcSize = (isShowAll, messageWidth) => {
  const width = Number(messageWidth === null || messageWidth === void 0 ? void 0 : messageWidth.width) || getScreenWidth(); // fallback an toàn

  const sizeMedia = width / 4.65 - GAP_MEDIA * 3.65;
  const sizeMediaShowAll = width / 4 - GAP_MEDIA * 3;
  if (isShowAll) return sizeMediaShowAll;
  if (sizeMedia < getScreenWidth() * 0.1) return getScreenWidth() * 0.15;
  return sizeMedia;
};
// ✅ MediaItem chỉ nhận size từ ngoài → ổn định layout
const MediaItem = /*#__PURE__*/memo(({
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
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(TouchableOpacity, {
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
  }, ((item === null || item === void 0 ? void 0 : item.thumbnailPreview) || (item === null || item === void 0 ? void 0 : item.uri) || (item === null || item === void 0 ? void 0 : item.url)) && /*#__PURE__*/React.createElement(FastImage, {
    source: {
      uri: (item === null || item === void 0 ? void 0 : item.thumbnailPreview) || (item === null || item === void 0 ? void 0 : item.uri) || (item === null || item === void 0 ? void 0 : item.url),
      priority: FastImage.priority.low
    },
    style: styles.image
  }), (item === null || item === void 0 ? void 0 : item.typeFile) === 'video' && /*#__PURE__*/React.createElement(View, {
    style: [styles.playIcon, (safeProgress <= 0 || safeProgress >= 100 || (item === null || item === void 0 ? void 0 : item.isLoading)) && {
      width: size * 0.5,
      height: size * 0.5,
      borderRadius: size * 0.5 / 2
    }]
  }, item !== null && item !== void 0 && item.isLoading ? /*#__PURE__*/React.createElement(ActivityIndicator, {
    size: "small",
    color: Color.defaultBlue
  }) : (safeProgress <= 0 || safeProgress >= 100) && /*#__PURE__*/React.createElement(FastImage, {
    source: require('./assets/play.png'),
    resizeMode: FastImage.resizeMode.cover,
    style: {
      width: size * 0.5 / 2,
      height: size * 0.5 / 2
    }
  })), (arrMedia === null || arrMedia === void 0 ? void 0 : arrMedia.length) > 8 && index === 7 && !isShowAll && /*#__PURE__*/React.createElement(View, {
    style: styles.reactionIcon
  }, /*#__PURE__*/React.createElement(Text, {
    style: styles.reactionIconText
  }, "+ ", (arrMedia === null || arrMedia === void 0 ? void 0 : arrMedia.length) - 8 > 99 ? '99+' : (arrMedia === null || arrMedia === void 0 ? void 0 : arrMedia.length) - 8))), !(item !== null && item !== void 0 && item.isLoading) && safeProgress > 0 && safeProgress < 100 && /*#__PURE__*/React.createElement(View, {
    style: [styles.progress, {
      width: size,
      height: size
    }]
  }, /*#__PURE__*/React.createElement(AnimatedCircularProgress, {
    size: size * 0.3,
    width: 3,
    fill: safeProgress,
    tintColor: Color.white,
    backgroundColor: Color.defaultColor
  })));
}, (prev, next) => prev.item.uri === next.item.uri && prev.item.thumbnailPreview === next.item.thumbnailPreview && prev.item.progress === next.item.progress && prev.item.isLoading === next.item.isLoading && prev.size === next.size // ✅ so sánh luôn size
);
export function MessageFile({
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
  const [arrMedia, setArrMedia] = useState((currentMessage === null || currentMessage === void 0 ? void 0 : currentMessage.file) || []);

  // ✅ Cache để tránh tạo lại thumbnail
  const thumbnailCache = useRef(new Map());
  const processedFiles = useRef(new Set());
  useEffect(() => {
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
          const result = await generateThumbnails(videosNeedThumbnail);

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
  return /*#__PURE__*/React.createElement(View, {
    onLayout: onLayout,
    style: [styles.container, {
      gap: GAP_MEDIA
    }]
  }, rows.map((row, rowIndex) => /*#__PURE__*/React.createElement(View, {
    key: rowIndex,
    style: {
      flexDirection: 'row',
      gap: GAP_MEDIA
    }
  }, row.map((item, colIndex) => {
    var _item$clientId, _item$uri;
    const index = rowIndex * 4 + colIndex;
    return /*#__PURE__*/React.createElement(MediaItem, {
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
const styles = StyleSheet.create({
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
    color: Color.white,
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