# react-native-card-stack-swiper
Tinder like react-native card stack swiper

[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/dwyl/react-native-card-stack-swiper/issues)
[![npm version](https://badge.fury.io/js/react-native-card-stack-swiper)](https://badge.fury.io/js/react-native-card-stack-swiper)

## Preview

![App preview](/animation.gif)
![App preview2](/animation2.gif)

## Installation

```
  npm install --save react-native-card-stack-swiper
```

```javascript
import CardStack, { Card } from 'react-native-card-stack-swiper';
```

```javascript
  <CardStack style={styles.content} ref={swiper => { this.swiper = swiper }}>
    <Card style={[styles.card, styles.card1]}><Text style={styles.label}>A</Text></Card>
    <Card style={[styles.card, styles.card2]}><Text style={styles.label}>B</Text></Card>
    <Card style={[styles.card, styles.card1]}><Text style={styles.label}>C</Text></Card>
  </CardStack>
```

# CardStack

## CardStack props
| Props               | type          | description                     | required      | default       |
| --------------------| ------------- | --------------------------------| ------------- | ------------- |
| style               | object        | container style                 |               | {}            |
| secondCardZoom      | number        | second card zoom                |               | 0.95          |
| loop                | bool          | keep swiping indefinitely       |               | false         |
| renderNoMoreCards   | func          |                                 |               | false         |
| disableTopSwipe     | bool          | disable top swipe               |               | false         |
| disableBottomSwipe  | bool          | disable bottom swipe            |               | false         |
| disableLeftSwipe    | bool          | disable left swipe              |               | false         |
| disableRightSwipe   | bool          | disable right swipe             |               | false         |
| verticalSwipe       | bool          | enable/disable vertical swiping |               | true          |
| horizontalSwipe     | bool          | enable/disable horizont swiping |               | true          |
| horizontalSwipe     | bool          | enable/disable horizont swiping |               | true          |
| verticalThreshold   | bool          | vertical swipe threshold        |               | height/4      |
| horizontalThreshold | bool          | horizontal swipe threshold      |               | width/2       |
| outputRotationRange | array         | rotation values for the x values|               | ['-15deg', '0deg', '15deg'] |


## CardStack events
| Props             | type          | description                 |
| ----------------- | ------------- | --------------------------- |
| onSwiped          | func           | function to be called when a card is swiped. it receives the swiped card index   |
| onSwipedLeft      | func           | function to be called when a card is swiped left. it receives the swiped card index   |
| onSwipedRight     | func           | function to be called when a card is swiped right. it receives the swiped card index   |
| onSwipedTop       | func           | function to be called when a card is swiped top. it receives the swiped card index  |
| onSwipedBottom    | func           | function to be called when a card is swiped bottom. it receives the swiped card index |


## CardStack actions
| Props             | type          |
| ----------------- | ------------- |
| swipeLeft         | func          |
| swipeRight        | func          |
| swipeBottom       | func          |
| swipeTop          | func          |
| goBackFromLeft    | func          |
| goBackFromRight   | func          |
| goBackFromBottom  | func          |
| goBackFromTop     | func          |

```javascript
  <CardStack style={styles.content} ref={swiper => { this.swiper = swiper }}>
    <Card style={[styles.card, styles.card1]}><Text style={styles.label}>A</Text></Card>
    <Card style={[styles.card, styles.card2]}><Text style={styles.label}>B</Text></Card>
  </CardStack>

  <TouchableOpacity onPress={ () => { this.swiper.swipeLeft() }}>
    <Text>Left</Text>
  </TouchableOpacity>
```


# Card

## Card props
| Props               | type          | description                     | required      | default       |
| --------------------| ------------- | --------------------------------| ------------- | ------------- |
| style               | object        | container style                 |               | {}            |

## Card events
| Props             | type          | description                 |
| ----------------- | ------------- | --------------------------- |
| onSwiped          | func          | function to be called when a card is swiped. it receives the swiped card index   |
| onSwipedLeft      | func          | function to be called when a card is swiped left. it receives the swiped card index   |
| onSwipedRight     | func          | function to be called when a card is swiped right. it receives the swiped card index   |
| onSwipedTop       | func          | function to be called when a card is swiped top. it receives the swiped card index  |
| onSwipedBottom    | func          | function to be called when a card is swiped bottom. it receives the swiped card index |
