import React, { useEffect, useState, memo, useRef } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import type { FileMessage, IMessage } from './types';
import { generateThumbnails } from './utils';
import FastImage from 'react-native-fast-image';
import Color from './Color';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { getScreenWidth } from '../utils';

const GAP_MEDIA = 3;

interface MessageFileProps {
  onPressFile?: (
    file: FileMessage,
    isShowAll?: boolean,
    arrMedia?: IMessage
  ) => void;
  messageWidth?: { width: number; _id: string } | null;
  currentMessage: IMessage;
  isReaction?: boolean;
  onLayout?: (event: LayoutChangeEvent) => void;
  onSaveThumbnail?: (file: FileMessage[]) => void;
  isShowAll?: boolean;
  onLongPressFile?: () => void;
}

// ✅ tính toán size cố định dựa vào messageWidth + isShowAll
const calcSize = (
  isShowAll: boolean | undefined,
  messageWidth?: { width: number } | null
) => {
  const width = Number(messageWidth?.width) || getScreenWidth(); // fallback an toàn

  const sizeMedia = width / 4.65 - GAP_MEDIA * 3.65;
  const sizeMediaShowAll = width / 4 - GAP_MEDIA * 3;

  if (isShowAll) return sizeMediaShowAll;
  if (sizeMedia < getScreenWidth() * 0.1) return getScreenWidth() * 0.15;
  return sizeMedia;
};

interface MediaItemProps {
  item: FileMessage;
  index: number;
  size: number;
  arrMedia: FileMessage[];
  isShowAll?: boolean;
  isReaction?: boolean;
  currentMessage: IMessage;
  onPressFile?: (
    file: FileMessage,
    isShowAll?: boolean,
    arrMedia?: IMessage
  ) => void;
  onLongPressFile?: () => void;
}

// ✅ MediaItem chỉ nhận size từ ngoài → ổn định layout
const MediaItem = memo(
  ({
    item,
    index,
    size,
    arrMedia,
    isShowAll,
    isReaction,
    currentMessage,
    onPressFile,
    onLongPressFile,
  }: MediaItemProps) => {
    const progressNum = Number(item?.progress);
    const safeProgress = Number.isFinite(progressNum)
      ? Math.max(0, Math.min(100, progressNum))
      : 0;

    return (
      <>
        <TouchableOpacity
          onLongPress={onLongPressFile}
          onPress={() =>
            onPressFile?.(item, arrMedia?.length > 8 && index === 7, {
              ...currentMessage,
              file: arrMedia,
            })
          }
          disabled={
            isReaction || (item?.isLoading && item?.typeFile === 'video')
          }
          style={[
            styles.mediaItem,
            {
              width: size,
              height: size,
            },
          ]}
        >
          {(item?.thumbnailPreview || item?.uri || item?.url) && (
            <FastImage
              source={{
                uri: item?.thumbnailPreview || item?.uri || item?.url,
                priority: FastImage.priority.low,
              }}
              style={styles.image}
            />
          )}

          {item?.typeFile === 'video' && (
            <View
              style={[
                styles.playIcon,
                (safeProgress <= 0 ||
                  safeProgress >= 100 ||
                  item?.isLoading) && {
                  width: size * 0.5,
                  height: size * 0.5,
                  borderRadius: (size * 0.5) / 2,
                },
              ]}
            >
              {item?.isLoading ? (
                <ActivityIndicator size="small" color={Color.defaultBlue} />
              ) : (
                (safeProgress <= 0 || safeProgress >= 100) && (
                  <FastImage
                    source={require('./assets/play.png')}
                    resizeMode={FastImage.resizeMode.cover}
                    style={{
                      width: (size * 0.5) / 2,
                      height: (size * 0.5) / 2,
                    }}
                  />
                )
              )}
            </View>
          )}

          {arrMedia?.length > 8 && index === 7 && !isShowAll && (
            <View style={styles.reactionIcon}>
              <Text style={styles.reactionIconText}>
                + {arrMedia?.length - 8 > 99 ? '99+' : arrMedia?.length - 8}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {!item?.isLoading && safeProgress > 0 && safeProgress < 100 && (
          <View style={[styles.progress, { width: size, height: size }]}>
            <AnimatedCircularProgress
              size={size * 0.3}
              width={3}
              fill={safeProgress}
              tintColor={Color.white}
              backgroundColor={Color.defaultColor}
            />
          </View>
        )}
      </>
    );
  },
  (prev, next) =>
    prev.item.uri === next.item.uri &&
    prev.item.thumbnailPreview === next.item.thumbnailPreview &&
    prev.item.progress === next.item.progress &&
    prev.item.isLoading === next.item.isLoading &&
    prev.size === next.size // ✅ so sánh luôn size
);

export function MessageFile({
  onPressFile,
  messageWidth,
  currentMessage,
  isReaction,
  onLayout,
  onSaveThumbnail,
  isShowAll,
  onLongPressFile,
}: MessageFileProps) {
  const [arrMedia, setArrMedia] = useState<FileMessage[]>(
    currentMessage?.file || []
  );

  // ✅ Cache để tránh tạo lại thumbnail
  const thumbnailCache = useRef<Map<string, string>>(new Map());
  const processedFiles = useRef<Set<string>>(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { file } = currentMessage;
        const getFileComplete = file?.filter((item) => item.uri);
        if (!getFileComplete) return;

        // ✅ Chỉ xử lý những video chưa có thumbnail và chưa được xử lý
        const videosNeedThumbnail = getFileComplete.filter(
          (item) =>
            item.typeFile === 'video' &&
            !item?.thumbnailPreview &&
            !processedFiles.current.has(item.uri)
        );

        // ✅ Cập nhật loading state cho tất cả video chưa có thumbnail
        const newArrMediaLoading = getFileComplete.map((item) => {
          if (item.typeFile === 'video' && !item?.thumbnailPreview) {
            const isProcessing = videosNeedThumbnail.some(
              (v) => v.uri === item.uri
            );
            return { ...item, isLoading: isProcessing };
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
        const newArrMedia = getFileComplete.map((item) => {
          if (item.typeFile === 'video') {
            const cachedThumbnail = thumbnailCache.current.get(item.uri);
            const thumbnail = item?.thumbnailPreview || cachedThumbnail || '';
            return {
              ...item,
              thumbnailPreview: thumbnail,
              isLoading: false,
            };
          }
          return item;
        });

        onSaveThumbnail?.(newArrMedia);
        setArrMedia(newArrMedia);
      } catch (_error) {
        // Thumbnail generation failed silently
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMessage._id, currentMessage.file?.length, onSaveThumbnail]);

  const arrMediaShow = isShowAll ? arrMedia : arrMedia?.slice(0, 8);
  const size = calcSize(!!isShowAll, messageWidth);

  // Group items into rows of 4 for grid layout
  const rows: FileMessage[][] = [];
  for (let i = 0; i < arrMediaShow.length; i += 4) {
    rows.push(arrMediaShow.slice(i, i + 4));
  }

  return (
    <View onLayout={onLayout} style={[styles.container, { gap: GAP_MEDIA }]}>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={{ flexDirection: 'row', gap: GAP_MEDIA }}>
          {row.map((item, colIndex) => {
            const index = rowIndex * 4 + colIndex;
            return (
              <MediaItem
                key={item?.clientId?.toString() || item?.uri?.toString()}
                item={item}
                index={index}
                size={size}
                arrMedia={arrMedia}
                isShowAll={!!isShowAll}
                isReaction={isReaction}
                currentMessage={currentMessage}
                onPressFile={onPressFile}
                onLongPressFile={onLongPressFile}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 4,
    paddingHorizontal: 4,
    borderRadius: 8,
  },
  mediaItem: {
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  playIcon: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  reactionIcon: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: '100%',
    height: '100%',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reactionIconText: {
    color: Color.white,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  progress: {
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
});
