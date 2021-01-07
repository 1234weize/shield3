import shaka from 'shaka-player/dist/shaka-player.ui';
import React from 'react';
import PropTypes from 'prop-types';

export default class ShakaPlayer extends React.PureComponent {
  uiContainerRef = React.createRef();
  videoRef = React.createRef();

  controller = {};

  async componentDidMount() {
    const player = new shaka.Player(this.videoRef.current);
    const ui = new shaka.ui.Overlay(
      player,
      this.uiContainerRef.current,
      this.videoRef.current,
    );

    // Store Shaka's API in order to expose it as a handle.
    this.controller = { player, ui, videoElement: this.videoRef.current };

    if(this.props.src !== '') {
      this.load(this.props.src, this.props.config);
    }
  }

  async load(src, config) {
    const {
      player
    } = this.controller;
    if(player) {
      player.configure(config);
      try {
        await player.load(src);
      }
      catch (e){
        console.log(e)
      }
    }
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if(prevProps.src !== this.props.src || prevProps.config !== this.props.config) {
      this.load(this.props.src, this.props.config);
    }
  }


  componentWillUnmount() {
    const {
      player,
      ui
    } = this.controller;
    player.destroy();
    ui.destroy();
  }

  getController() {
    return this.controller;
  }

  async getSupport() {
    const support = await shaka.Player.probeSupport();
    return support;
  }

  render() {
    const {
      autoPlay,
      width,
      height,
      ...extraProps
    } = this.props;
    return (
      <div ref={this.uiContainerRef} {...extraProps}>
        <video
          ref={this.videoRef}
          autoPlay={autoPlay}
          width={width}
          //height={height}
          style={{ width: '100%' }}
        />
      </div>
    )
  }
}

ShakaPlayer.propTypes={
  src: PropTypes.string,
  config: PropTypes.object,
  autoPlay: PropTypes.bool,
  width: PropTypes.number,
  height: PropTypes.number
};


ShakaPlayer.defaultProps={
  src: '',
  config: {},
  autoPlay: false,
  width:undefined,
  height:undefined,
};

