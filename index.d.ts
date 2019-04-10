import * as React from 'react';
import { StyleProp, ViewProps, ViewStyle } from 'react-native';

export interface CardStackProps {
  style?: StyleProp<ViewStyle>;
  secondCardZoom?: number;
  loop?: boolean;
  renderNoMoreCards?: boolean;
  disableTopSwipe?: boolean;
  disableBottomSwipe?: boolean;
  disableLeftSwipe?: boolean;
  disableRightSwipe?: boolean;
  verticalSwipe?: boolean;
  horizontalSwipe?: boolean;
  verticalThreshold?: boolean;
  horizontalThreshold?: boolean;
  outputRotationRange?: [string, string, string]
}

export interface CardStackEvents {
  onSwipeStart: (index: number) => void;
  onSwipeEnd: (index: number) => void; 
  onSwiped: (index: number) => void;
  onSwipedLeft: (index: number) => void;
  onSwipedRight: (index: number) => void;
  onSwipedTop: (index: number) => void;
  onSwipedBottom: (index: number) => void;
}

export default class CardStack extends React.Component<CardStackProps & CardStackEvents> {
  constructor(props: CardStackProps & CardStackEvents);
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