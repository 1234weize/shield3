import React, { Component } from 'react';
import styles from './index.less';
import ShakaPlayer from './ShakaPlayer';
import 'shaka-player/dist/controls.css';

class MicroPage extends Component {
  player = React.createRef();
  widevineLA = 'https://drm-widevine-licensing.axtest.net/AcquireLicense';
  playreadyLA = 'https://drm-playready-licensing.axtest.net/AcquireLicense';
  fpsLA = 'https://drm-fairplay-licensing.axtest.net/AcquireLicense';
  fpsCer = 'https://vtb.axinom.com/FPScert/fairplay.cer';

  state = {
    mpdUrl: 'https://media.axprod.net/TestVectors/v9-MultiFormat/Encrypted_Cbcs/Manifest.mpd',
    hlsUrl: 'https://media.axprod.net/TestVectors/v9-MultiFormat/Encrypted_Cbcs/Manifest.m3u8',
    entitlementToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJzaW9uIjogMSwiY29tX2tleV9pZCI6ICIwYmE0ZmE0Ny01NjUzLTRkMjAtOTZkYy1hY2EyMDA1NmQ5YzIiLCJtZXNzYWdlIjogeyAgInR5cGUiOiAiZW50aXRsZW1lbnRfbWVzc2FnZSIsICAidmVyc2lvbiI6IDIsICAiY29udGVudF9rZXlzX3NvdXJjZSI6IHsgICAgImlubGluZSI6IFsgICAgICB7ICAgICAgICAiaWQiOiAiZjhjODBjMjUtNjkwZi00NzM2LTgxMzItNDMwZTVjNjk5NGNlIiAgICAgIH0gICAgXSAgfX19.oe0nMW2Bh1NkjdKqtSQFZGnwk1zeXF8KSiJshmh8Egk'
  }

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

    const req = await fetch(this.fpsCer)
    const cert = await req.arrayBuffer();

    const support = await this.player.current.getSupport();
    console.log(support);
    player.configure({
      drm: {
        servers: {
          'com.widevine.alpha': this.getLAUrl('widevine', this.state.entitlementToken),
          'com.microsoft.playready': this.getLAUrl('playready', this.state.entitlementToken),
          'com.apple.fps.1_0': this.getLAUrl('fairplay', this.state.entitlementToken)
        },
        advanced:{
          'com.apple.fps.1_0':{
            'serverCertificate': new Uint8Array(cert),
          }
        },
      }
    });


    // player.configure('drm.initDataTransform', (initData, initDataType) => {
    //   if (initDataType != 'skd')
    //     return initData;
    //
    //   // 'initData' is a buffer containing an 'skd://' URL as a UTF-8 string.
    //   const skdUri = shaka.util.StringUtils.fromBytesAutoDetect(initData);
    //   const contentId = getMyContentId(sdkUri);
    //   const cert = player.drmInfo().serverCertificate;
    //   return shaka.util.FairPlayUtils.initDataTransform(initData, contentId, cert);
    // });
    //
    // player.getNetworkingEngine().registerRequestFilter((type, request) => {
    //   if (type != shaka.net.NetworkingEngine.RequestType.LICENSE) {
    //     return;
    //   }
    //
    //   const originalPayload = new Uint8Array(request.body);
    //   const base64Payload =
    //     shaka.util.Uint8ArrayUtils.toStandardBase64(originalPayload);
    //   const params = 'spc=' + base64Payload;
    //   request.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    //   request.body = shaka.util.StringUtils.toUTF8(encodeURIComponent(params));
    // });
    //
    // player.getNetworkingEngine().registerResponseFilter((type, response) => {
    //   if (type != shaka.net.NetworkingEngine.RequestType.LICENSE) {
    //     return;
    //   }
    //
    //   let responseText = shaka.util.StringUtils.fromUTF8(response.data);
    //   // Trim whitespace.
    //   responseText = responseText.trim();
    //
    //   // Look for <ckc> wrapper and remove it.
    //   if (responseText.substr(0, 5) === '<ckc>' &&
    //     responseText.substr(-6) === '</ckc>') {
    //     responseText = responseText.slice(5, -6);
    //   }
    //
    //   // Decode the base64-encoded data into the format the browser expects.
    //   response.data = shaka.util.Uint8ArrayUtils.fromBase64(responseText).buffer;
    // });

    if(support.drm['com.apple.fps.1_0']) {
      await player.load(this.state.hlsUrl);
    } else if(support.manifest.mpd){
      await player.load(this.state.mpdUrl);
    }
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
