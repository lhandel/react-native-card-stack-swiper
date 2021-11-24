import React, { Component } from 'react';
import PropTypes from 'prop-types'
import {
	ScrollView, View
} from 'react-native';

const Card = ({ style, children, isScrollable, ...props }) => {
	if (isScrollable) {
		return (
			<View style={style}>
				<ScrollView {...props}>
					{children}
				</ScrollView>
			</View>
		);
	}
	return (
		<View style={style} >
			{children}
		</View>
	);
}

Card.propTypes = {
	children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
	style: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
	onSwipedLeft: PropTypes.func,
	onSwipedRight: PropTypes.func,
	onSwipedTop: PropTypes.func,
	onSwipedBottom: PropTypes.func,
	onSwiped: PropTypes.func,
}
Card.defaultProps = {
	style: {},
	onSwiped: () => { },
	onSwipedLeft: () => { },
	onSwipedRight: () => { },
	onSwipedTop: () => { },
	onSwipedBottom: () => { },
}

export default Card;
