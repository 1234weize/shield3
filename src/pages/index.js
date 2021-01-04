import React, { Component } from 'react';
import styles from './index.less';
import ShakaPlayer from './ShakaPlayer';
import 'shaka-player/dist/controls.css';

class MicroPage extends Component {
  player = React.createRef();
  widevineLA = 'https://drm-widevine-licensing.axtest.net/AcquireLicense';
  playreadyLA = 'https://drm-playready-licensing.axtest.net/AcquireLicense';
  fpsLA = 'https://drm-fairplay-licensing.axtest.net/AcquireLicense';

  state = {
    mpdUrl: 'https://media.axprod.net/TestVectors/v7-MultiDRM-SingleKey/Manifest_1080p.mpd',
    entitlementToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJzaW9uIjogMSwiY29tX2tleV9pZCI6ICIwYmE0ZmE0Ny01NjUzLTRkMjAtOTZkYy1hY2EyMDA1NmQ5YzIiLCJtZXNzYWdlIjogeyAgInR5cGUiOiAiZW50aXRsZW1lbnRfbWVzc2FnZSIsICAidmVyc2lvbiI6IDIsICAiY29udGVudF9rZXlzX3NvdXJjZSI6IHsgICAgImlubGluZSI6IFsgICAgICB7ICAgICAgICAiaWQiOiAiOWViNDA1MGQtZTQ0Yi00ODAyLTkzMmUtMjdkNzUwODNlMjY2IiAgICAgIH0gICAgXSAgfX19.lds7hxqluHGnU71JKLtTM50gJ8vm7WKXK11AuBnyN9Y',
  };

  getLAUrl(provider, token) {
    switch (provider) {
      case 'widevine':
        return this.widevineLA + '?AxDrmMessage=' + token;
      case 'playready':
        return this.playreadyLA +  '?AxDrmMessage=' + token;
      case 'fairplay':
        return this.fpsLA + '?AxDrmMessage=' + token;
      default:
        return this.widevineLA + '?AxDrmMessage=' + token;
    }
  }

  componentDidMount = async () => {
    const {
      player,
      ui,
      videoElement,
    } = this.player.current.getController();

    console.log('player',player);
    const support = await this.player.current.getSupport();
    console.log('support',support);

    player.configure({
      drm: {
        servers: {
          'com.widevine.alpha': this.getLAUrl('widevine', this.state.entitlementToken),
          // 'com.microsoft.playready': this.getLAUrl('playready', this.state.entitlementToken),
        }
      }
    });

    await player.load(this.state.mpdUrl);
    // Trigger play.
    videoElement.play();
  };

  render() {
    return (
      <div className={styles.body}>
        <ShakaPlayer className={styles.shaka} width={750} ref={this.player} autoPlay />
      </div>
    )
  }
}

export default MicroPage;
