import dayjs from 'dayjs';

import { type FileMessage, type IMessage } from './types';
import { createThumbnail } from 'react-native-create-thumbnail';
import mime from 'mime';

export function isSameDay(
  currentMessage: IMessage,
  diffMessage: IMessage | null | undefined
) {
  if (!diffMessage || !diffMessage.createdAt) return false;

  const currentCreatedAt = dayjs(currentMessage.createdAt);
  const diffCreatedAt = dayjs(diffMessage.createdAt);

  if (!currentCreatedAt.isValid() || !diffCreatedAt.isValid()) return false;

  return currentCreatedAt.isSame(diffCreatedAt, 'day');
}

export function isSameUser(
  currentMessage: IMessage,
  diffMessage: IMessage | null | undefined
) {
  return !!(
    diffMessage &&
    diffMessage.user &&
    currentMessage.user &&
    diffMessage.user._id === currentMessage.user._id
  );
}

export function chunkArray<T>(array: T[], size: number): T[][] {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

export const generateThumbnails = async (videoList: FileMessage[]) => {
  const results = await Promise.all(
    videoList.map(async (video, index) => {
      try {
        const result = await createThumbnail({
          url: video.uri,
          timeStamp: 500,
        });
        return { index, path: result.path };
      } catch (e) {
        console.error(`Lỗi với video ${video.id}`, e);
        return { index, path: '' };
      }
    })
  );

  return results;
};

export const formatDurationSmart = (seconds: number) => {
  const totalSeconds = Math.ceil(seconds);

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secondsLeft = totalSeconds % 60;

  const padSeconds = (n: number) => String(n).padStart(2, '0');

  const parts: string[] = [];

  if (days) parts.push(String(days));
  if (days || hours) parts.push(String(hours)); // chỉ show giờ nếu có ngày hoặc giờ
  parts.push(String(minutes));
  parts.push(padSeconds(secondsLeft));

  return parts.join(':');
};

export const normalizeFileUri = (uri: string): string => {
  if (!uri) return uri;

  // Remove any 'file://' prefix if present (prevent duplicates)
  const cleaned = uri.replace(/^file:\/+/, '');

  return `file://${cleaned}`;
};

export function getFileTypeFromPath(path: string): string | null {
  if (!path) return null;

  const mimeType = mime.getType(path);
  return mimeType || null;
}
