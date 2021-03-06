import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import { polyfill } from 'react-lifecycles-compat';

import SceneView from './SceneView';

const FAR_FAR_AWAY = 3000; // this should be big enough to move the whole view out of its container

class ResourceSavingSceneView extends React.PureComponent {
  constructor(props) {
    super();

    this.state = {
      awake: props.lazy ? props.isFocused : true,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.isFocused && !prevState.awake) {
      return { awake: true };
    }

    return null;
  }

  render() {
    const { awake } = this.state;
    const {
      isFocused,
      childNavigation,
      navigation,
      removeClippedSubviews,
      lazy,
      ...rest
    } = this.props;

    return (
      <View
        style={styles.container}
        collapsable={false}
        removeClippedSubviews={
          Platform.OS === 'android'
            ? removeClippedSubviews
            : !isFocused && removeClippedSubviews
        }
      >
        <View
          style={
            this._mustAlwaysBeVisible() || isFocused
              ? styles.innerAttached
              : styles.innerDetached
          }
        >
          {awake ? <SceneView {...rest} navigation={childNavigation} /> : null}
        </View>
      </View>
    );
  }

  _mustAlwaysBeVisible = () => {
    return this.props.animationEnabled || this.props.swipeEnabled;
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  innerAttached: {
    flex: 1,
  },
  innerDetached: {
    flex: 1,
    top: FAR_FAR_AWAY,
  },
});

export default polyfill(ResourceSavingSceneView);
