import * as React from 'react';
import { StyleProp, ViewProps, ViewStyle } from 'react-native';

export interface CardStackProps {
  style?: StyleProp<ViewStyle>;
  secondCardZoom?: number;
  loop?: boolean;
  renderNoMoreCards?: () => React.ReactNode;
  disableTopSwipe?: boolean;
  disableBottomSwipe?: boolean;
  disableLeftSwipe?: boolean;
  disableRightSwipe?: boolean;
  verticalSwipe?: boolean;
  horizontalSwipe?: boolean;
  verticalThreshold?: number;
  horizontalThreshold?: number;
  outputRotationRange?: [string, string, string]
  onSwipeStart?: (index: number) => void;
  onSwipeEnd?: (index: number) => void;
  onSwipeCancel?: () => void; 
  onSwiped?: (index: number) => void;
  onSwipedLeft?: (index: number) => void;
  onSwipedRight?: (index: number) => void;
  onSwipedTop?: (index: number) => void;
  onSwipedBottom?: (index: number) => void;
  onSwipe?: (x: number, y: number) => void;
}

export default class CardStack extends React.Component<CardStackProps> {
  constructor(props: CardStackProps);
  swipeLeft(): void;
  swipeRight(): void;
  swipeBottom(): void;
  swipeTop(): void;
  goBackFromLeft(): void;
  goBackFromRight(): void;
  goBackFromBottom(): void;
  goBackFromTop(): void;
}

export interface CardProps {
  style?: StyleProp<ViewStyle>;
  onSwiped?: () => void;
  onSwipedLeft?: () => void;
  onSwipedRight?: () => void;
  onSwipedTop?: () => void;
  onSwipedBottom?: () => void;
}

export class Card extends React.Component<CardProps> {
  constructor(props: CardProps);
}
