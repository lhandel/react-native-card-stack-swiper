import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { polyfill } from 'react-lifecycles-compat';
import {
  View,
  Animated,
  PanResponder,
  Dimensions,
  Text,
  Platform
} from 'react-native';

const { height, width } = Dimensions.get('window');

class CardStack extends Component {

  static distance(x, y) {
    return Math.hypot(x, y);
  }

  constructor(props) {
    super(props);
    this.state = {
      drag: new Animated.ValueXY({ x: 0, y: 0 }),
      dragDistance: new Animated.Value(0),
      sindex: 0, // index to the next card to be renderd mod card.length
      cardA: null,
      cardB: null,
      topCard: 'cardA',
      cards: [],
      touchStart: 0,
    };
    this.distance = this.constructor.distance;
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => false,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        const isVerticalSwipe = Math.sqrt(
          Math.pow(gestureState.dx, 2) < Math.pow(gestureState.dy, 2)
        )
        if (!this.props.verticalSwipe && isVerticalSwipe) {
          return false
        }
        return Math.sqrt(Math.pow(gestureState.dx, 2) + Math.pow(gestureState.dy, 2)) > 10
      },
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        const isVerticalSwipe = Math.sqrt(
          Math.pow(gestureState.dx, 2) < Math.pow(gestureState.dy, 2)
        )
        if (!this.props.verticalSwipe && isVerticalSwipe) {
          return false
        }
        return Math.sqrt(Math.pow(gestureState.dx, 2) + Math.pow(gestureState.dy, 2)) > 10
      },
      onPanResponderGrant: (evt, gestureState) => {
        this.props.onSwipeStart();
        this.setState({ touchStart: new Date().getTime() });
      },
      onPanResponderMove: (evt, gestureState) => {
        const movedX = gestureState.moveX - gestureState.x0;
        const movedY = gestureState.moveY - gestureState.y0;
        this.props.onSwipe(movedX, movedY);
        const { verticalSwipe, horizontalSwipe } = this.props;
        const dragDistance = this.distance((horizontalSwipe) ? gestureState.dx : 0, (verticalSwipe) ? gestureState.dy : 0);
        this.state.dragDistance.setValue(dragDistance);
        this.state.drag.setValue({ x: (horizontalSwipe) ? gestureState.dx : 0, y: (verticalSwipe) ? gestureState.dy : 0 });
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        this.props.onSwipeEnd();
        const currentTime = new Date().getTime();
        const swipeDuration = currentTime - this.state.touchStart;
        const {
          verticalThreshold,
          horizontalThreshold,
          disableTopSwipe,
          disableLeftSwipe,
          disableRightSwipe,
          disableBottomSwipe,
        } = this.props;

        if (((Math.abs(gestureState.dx) > horizontalThreshold) ||
          (Math.abs(gestureState.dx) > horizontalThreshold * 0.6 &&
            swipeDuration < 150)
        ) && this.props.horizontalSwipe) {

          const swipeDirection = (gestureState.dx < 0) ? width * -1.5 : width * 1.5;
          if (swipeDirection < 0 && !disableLeftSwipe) {
            this._nextCard('left', swipeDirection, gestureState.dy, this.props.duration);
          }
          else if (swipeDirection > 0 && !disableRightSwipe) {
            this._nextCard('right', swipeDirection, gestureState.dy, this.props.duration);
          }
          else {
            this.props.onSwipeCancel()
            this._resetCard();
          }
        } else if (((Math.abs(gestureState.dy) > verticalThreshold) ||
          (Math.abs(gestureState.dy) > verticalThreshold * 0.8 &&
            swipeDuration < 150)
        ) && this.props.verticalSwipe) {

          const swipeDirection = (gestureState.dy < 0) ? height * -1 : height;
          if (swipeDirection < 0 && !disableTopSwipe) {

            this._nextCard('top', gestureState.dx, swipeDirection, this.props.duration);
          }
          else if (swipeDirection > 0 && !disableBottomSwipe) {
            this._nextCard('bottom', gestureState.dx, swipeDirection, this.props.duration);
          }
          else {
            this.props.onSwipeCancel()
            this._resetCard();
          }
        }
        else {
          this.props.onSwipeCancel()
          this._resetCard();
        }
      },
      onPanResponderTerminate: (evt, gestureState) => {
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        return true;
      },
    });
  }

  componentDidUpdate(prevProps) {
    if (typeof this.props.children === 'undefined') return;
    if (!this._isSameChildren(this.props.children, prevProps.children)) {
      const children = Array.isArray(this.props.children) ? this.props.children : [this.props.children];
      let aIndex = (this.state.topCard == 'cardA') ?
        this._getIndex(this.state.sindex - 2, children.length) :
        this._getIndex(this.state.sindex - 1, children.length);
      let bIndex = (this.state.topCard == 'cardB') ?
        this._getIndex(this.state.sindex - 2, children.length) :
        this._getIndex(this.state.sindex - 1, children.length);
      this.setState({
        cards: children,
        cardA: children[aIndex] || null,
        cardB: children[bIndex] || null
      });
    }
  }

  _getIndex(index, cards){
    return this.props.loop ?
      this.mod(index, cards):
      index;
  }

  componentDidMount() {
    this.initDeck();
  }

  _isSameChildren(a, b) {
    if (typeof a != typeof b) return false;
    if (typeof a === 'undefined') return false;
    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length != b.length) return false;
      for (let i in a) {
        if (a[i].key != b[i].key) { return false }
      }
      return true;
    }
    if (a.key !== b.key) return false;

    return true
  }

  initDeck() {
    if (typeof this.props.children === 'undefined') return;
    const { children, loop } = this.props;
    const cards = Array.isArray(children) ? children : [children];
    const initialIndexA = this.props.initialIndex < cards.length ? this.props.initialIndex : 0;
    const initialIndexB = loop ? this.mod(initialIndexA + 1, cards.length) : initialIndexA + 1;
    const cardA = cards[initialIndexA] || null;
    const cardB = cards[initialIndexB] || null;
    this.setState({
      cards,
      cardA,
      cardB,
      sindex: initialIndexB + 1,
    });
  }

  _resetCard() {
    Animated.timing(
      this.state.dragDistance,
      {
        toValue: 0,
        duration: this.props.duration,
        useNativeDriver: this.props.useNativeDriver || false,
      }
    ).start();
    Animated.spring(
      this.state.drag,
      {
        toValue: { x: 0, y: 0 },
        duration: this.props.duration,
        useNativeDriver: this.props.useNativeDriver || false,
      }
    ).start();
  }

  goBackFromTop() {
    this._goBack('top');
  }

  goBackFromRight() {
    this._goBack('right');
  }

  goBackFromLeft() {
    this._goBack('left');
  }

  goBackFromBottom() {
    this._goBack('bottom');
  }

  mod(n, m) {
    return ((n % m) + m) % m;
  }

  _goBack(direction) {
    const { cards, sindex, topCard } = this.state;

    if ((sindex - 3) < 0 && !this.props.loop) return;

    const previusCardIndex = this.mod(sindex - 3, cards.length)
    let update = {};
    if (topCard === 'cardA') {
      update = {
        ...update,
        cardB: cards[previusCardIndex]

      }
    } else {
      update = {
        ...update,
        cardA: cards[previusCardIndex],
      }
    }

    this.setState({
      ...update,
      topCard: (topCard === 'cardA') ? 'cardB' : 'cardA',
      sindex: sindex - 1
    }, () => {

      switch (direction) {
        case 'top':
          this.state.drag.setValue({ x: 0, y: -height });
          this.state.dragDistance.setValue(height);
          break;
        case 'left':
          this.state.drag.setValue({ x: -width, y: 0 });
          this.state.dragDistance.setValue(width);
          break;
        case 'right':
          this.state.drag.setValue({ x: width, y: 0 });
          this.state.dragDistance.setValue(width);
          break;
        case 'bottom':
          this.state.drag.setValue({ x: 0, y: height });
          this.state.dragDistance.setValue(width);
          break;
        default:

      }

      Animated.spring(
        this.state.dragDistance,
        {
          toValue: 0,
          duration: this.props.duration,
          useNativeDriver: this.props.useNativeDriver || false,
        }
      ).start();

      Animated.spring(
        this.state.drag,
        {
          toValue: { x: 0, y: 0 },
          duration: this.props.duration,
          useNativeDriver: this.props.useNativeDriver || false,
        }
      ).start();
    })
  }

  swipeTop(d = null) {
    this._nextCard('top', 0, -height, d || this.props.duration);
  }

  swipeBottom(d = null) {
    this._nextCard('bottom', 0, height, d || this.props.duration);
  }

  swipeRight(d = null) {
    this._nextCard('right', width * 1.5, 0, d || this.props.duration);
  }

  swipeLeft(d = null) {
    this._nextCard('left', -width * 1.5, 0, d || this.props.duration);
  }

  _nextCard(direction, x, y, duration = 400) {
    const { verticalSwipe, horizontalSwipe, loop } = this.props;
    const { sindex, cards, topCard } = this.state;

    // index for the next card to be renderd
    const nextCard = (loop) ? (Math.abs(sindex) % cards.length) : sindex;

    // index of the swiped card
    const index = (loop) ? this.mod(nextCard - 2, cards.length) : nextCard - 2;

    if (index === cards.length - 1) {
      this.props.onSwipedAll();
    }

    if ((sindex - 2 < cards.length) || (loop)) {
      Animated.spring(
        this.state.dragDistance,
        {
          toValue: 220,
          duration,
          useNativeDriver: this.props.useNativeDriver || false,
        }
      ).start();

      Animated.timing(
        this.state.drag,
        {
          toValue: { x: (horizontalSwipe) ? x : 0, y: (verticalSwipe) ? y : 0 },
          duration,
          useNativeDriver: this.props.useNativeDriver || false,
        }
      ).start(() => {

        const newTopCard = (topCard === 'cardA') ? 'cardB' : 'cardA';

        let update = {};
        if (newTopCard === 'cardA') {
          update = {
            ...update,
            cardB: cards[nextCard]
          };
        }
        if (newTopCard === 'cardB') {
          update = {
            ...update,
            cardA: cards[nextCard],
          };
        }
        this.state.drag.setValue({ x: 0, y: 0 });
        this.state.dragDistance.setValue(0);
        this.setState({
          ...update,
          topCard: newTopCard,
          sindex: nextCard + 1
        });

        this.props.onSwiped(index);
        switch (direction) {
          case 'left':
            this.props.onSwipedLeft(index);
            if (this.state.cards[index] && this.state.cards[index].props.onSwipedLeft)
              this.state.cards[index] && this.state.cards[index].props.onSwipedLeft();
            break;
          case 'right':
            this.props.onSwipedRight(index);
            if (this.state.cards[index] && this.state.cards[index].props.onSwipedRight)
              this.state.cards[index].props.onSwipedRight();
            break;
          case 'top':
            this.props.onSwipedTop(index);
            if (this.state.cards[index] && this.state.cards[index].props.onSwipedTop)
              this.state.cards[index].props.onSwipedTop();
            break;
          case 'bottom':
            this.props.onSwipedBottom(index);
            if (this.state.cards[index] && this.state.cards[index].props.onSwipedBottom)
              this.state.cards[index].props.onSwipedBottom();
            break;
          default:
        }
      });

    }
  }


  /**
   * @description CardB’s click feature is trigger the CardA on the card stack. (Solved on Android)
   * @see https://facebook.github.io/react-native/docs/view#pointerevents
   */
  _setPointerEvents(topCard, topCardName) {
    return { pointerEvents: topCard === topCardName ? "auto" : "none" }
  }

  render() {

    const { secondCardZoom, renderNoMoreCards } = this.props;
    const { drag, dragDistance, cardA, cardB, topCard, sindex } = this.state;

    const scale = dragDistance.interpolate({
      inputRange: [0, 10, 220],
      outputRange: [secondCardZoom, secondCardZoom, 1],
      extrapolate: 'clamp',
    });
    const rotate = drag.x.interpolate({
      inputRange: [width * -1.5, 0, width * 1.5],
      outputRange: this.props.outputRotationRange,
      extrapolate: 'clamp',
    });

    return (
      <View {...this._panResponder.panHandlers} style={[{ position: 'relative' }, this.props.style]}>

        {renderNoMoreCards()}

        <Animated.View
          {...this._setPointerEvents(topCard, 'cardB')}
          style={[{
            position: 'absolute',
            zIndex: (topCard === 'cardB') ? 3 : 2,
            ...Platform.select({
              android: {
                elevation: (topCard === 'cardB') ? 3 : 2,
              }
            }),
            transform: [
              { rotate: (topCard === 'cardB') ? rotate : '0deg' },
              { translateX: (topCard === 'cardB') ? drag.x : 0 },
              { translateY: (topCard === 'cardB') ? drag.y : 0 },
              { scale: (topCard === 'cardB') ? 1 : scale },
            ]
          }, this.props.cardContainerStyle]}>
          {cardB}
        </Animated.View>
        <Animated.View
          {...this._setPointerEvents(topCard, 'cardA')}
          style={[{
            position: 'absolute',
            zIndex: (topCard === 'cardA') ? 3 : 2,
            ...Platform.select({
              android: {
                elevation: (topCard === 'cardA') ? 3 : 2,
              }
            }),
            transform: [
              { rotate: (topCard === 'cardA') ? rotate : '0deg' },
              { translateX: (topCard === 'cardA') ? drag.x : 0 },
              { translateY: (topCard === 'cardA') ? drag.y : 0 },
              { scale: (topCard === 'cardA') ? 1 : scale },
            ]
          }, this.props.cardContainerStyle]}>
          {cardA}
        </Animated.View>

      </View>
    );
  }
}

CardStack.propTypes = {

  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,

  style: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
  cardContainerStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
  secondCardZoom: PropTypes.number,
  loop: PropTypes.bool,
  initialIndex: PropTypes.number,
  renderNoMoreCards: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
  onSwipeStart: PropTypes.func,
  onSwipeEnd: PropTypes.func,
  onSwipeCancel: PropTypes.func,
  onSwiped: PropTypes.func,
  onSwipedLeft: PropTypes.func,
  onSwipedRight: PropTypes.func,
  onSwipedTop: PropTypes.func,
  onSwipedBottom: PropTypes.func,
  onSwiped: PropTypes.func,
  onSwipedAll: PropTypes.func,
  onSwipe: PropTypes.func,

  disableBottomSwipe: PropTypes.bool,
  disableLeftSwipe: PropTypes.bool,
  disableRightSwipe: PropTypes.bool,
  disableTopSwipe: PropTypes.bool,
  verticalSwipe: PropTypes.bool,
  verticalThreshold: PropTypes.number,

  horizontalSwipe: PropTypes.bool,
  horizontalThreshold: PropTypes.number,
  outputRotationRange: PropTypes.array,
  duration: PropTypes.number
}

CardStack.defaultProps = {

  style: {},
  cardContainerStyle: {},
  secondCardZoom: 0.95,
  loop: false,
  initialIndex: 0,
  renderNoMoreCards: () => { return (<Text>No More Cards</Text>) },
  onSwipeStart: () => null,
  onSwipeEnd: () => null,
  onSwipeCancel: () => null,
  onSwiped: () => { },
  onSwipedLeft: () => { },
  onSwipedRight: () => { },
  onSwipedTop: () => { },
  onSwipedBottom: () => { },
  onSwipedAll: async () => { },
  onSwipe: () => { },

  disableBottomSwipe: false,
  disableLeftSwipe: false,
  disableRightSwipe: false,
  disableTopSwipe: false,
  verticalSwipe: true,
  verticalThreshold: height / 4,
  horizontalSwipe: true,
  horizontalThreshold: width / 2,
  outputRotationRange: ['-15deg', '0deg', '15deg'],
  duration: 300
}
polyfill(CardStack);
export default CardStack;
