import type { JSX } from 'react';
import type { IMessage } from '../types';
import type { BubbleProps } from './types';
export * from './types';
declare const BubbleComponent: <TMessage extends IMessage = IMessage>(props: BubbleProps<TMessage>) => JSX.Element;
declare const Bubble: typeof BubbleComponent;
export default Bubble;
