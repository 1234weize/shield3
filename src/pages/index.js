import React, { Component } from 'react';
import { stringify } from 'qs';
import styles from './index.less';
import ShakaPlayer from './ShakaPlayer';
import 'shaka-player/dist/controls.css';
import shaka from 'shaka-player/dist/shaka-player.ui';

const certStr = "MIIE+zCCA+OgAwIBAgIIcRN6MJCE8HEwDQYJKoZIhvcNAQEFBQAwfzELMAkGA1UEBhMCVVMxEzARBgNVBAoMCkFwcGxlIEluYy4xJjAkBgNVBAsMHUFwcGxlIENlcnRpZmljYXRpb24gQXV0aG9yaXR5MTMwMQYDVQQDDCpBcHBsZSBLZXkgU2VydmljZXMgQ2VydGlmaWNhdGlvbiBBdXRob3JpdHkwHhcNMjAxMDI1MTA1ODUyWhcNMjEwMTIzMTEwODUyWjB0MQswCQYDVQQGEwJVUzEUMBIGA1UECgwLQXhpbm9tIEdtYkgxEzARBgNVBAsMCjUzVDU1RjdENjYxOjA4BgNVBAMMMUZhaXJQbGF5IFN0cmVhbWluZyBUZXN0OiBBeGlub20gR21iSCAoNTNUNTVGN0Q2NikwgZ8wDQYJKoZIhvcNAQEBBQADgY0AMIGJAoGBAJow56XHFClQqYkCD1AGnZPrwojuy38zM32eA6rRdZl9rBnyD2d6JeLW3AqUJAg5l4igAgLtJtZFFuLdqYaKecGnNnTpPms+9jqMrYcNHRPD7ArjWgkQxPFVruHwgibElwpvyUPa3aOBNn3kJzJYguQXgtP2wFNnXVgQPVO3lastAgMBAAGjggIIMIICBDAMBgNVHRMBAf8EAjAAMB8GA1UdIwQYMBaAFGPkR1TLhXFZRiyDrMxEMWRnAyy+MIHqBgNVHSAEgeIwgd8wgdwGCSqGSIb3Y2QFATCBzjCBywYIKwYBBQUHAgIwgb4MgbtJc3N1YW5jZSBvZiB0aGlzIGNlcnRpZmljYXRlIGFuZCByZWxpYW5jZSB0aGVyZW9uIGJ5IGFueSBwYXJ0eSBpcyBzdWJqZWN0IHRvIHRoZSBhcHBsaWNhYmxlIGNlcnRpZmljYXRpb24gcHJhY3RpY2Ugc3RhdGVtZW50IHdoaWNoIGlzIGF2YWlsYWJsZSB1cG9uIHJlcXVlc3QgdG8gcG9saWN5X2F1dGhvcml0eUBhcHBsZS5jb20uMDUGA1UdHwQuMCwwKqAooCaGJGh0dHA6Ly9jcmwuYXBwbGUuY29tL2tleXNlcnZpY2VzLmNybDAdBgNVHQ4EFgQUVhtHxiNQ4Gs7gC+i7VkBgCTcjdwwDgYDVR0PAQH/BAQDAgUgMBQGCyqGSIb3Y2QGDQEIAQH/BAIFADAxBgsqhkiG92NkBg0BAwEB/wQfATMwc3k4MnoyYXF3bDBvaDdocXBhZHhwdXBkYWhuejA3BgsqhkiG92NkBg0BBAEB/wQlAWVtNWVueWRrMnRkbjlka2RrdHhqbXlqd3pzamoxcnJ6Ym9hcDANBgkqhkiG9w0BAQUFAAOCAQEAjJibxPCUDH5jeqabh7HOmkzo0glCAHQaNP2cyYMEFPcCpOsUnWZl711Y6EwE3QhcocXQb7H9PNvxuh0KbeTlYSwvEf/B1nkC3OOtcVAjpUkvdJ7ESiAFS7vDO9RHkQoVW9Sd0hCv8rN2QNSe2F7L/QJPx1sBMP0YqhIM/yxjsGJ2kzYlexDylJoME8OYaO3j/Pyiq7WWEBiH6KzITUZ6XA80ftQErlToE/1izi42TZdAt7ppJjB+gkpzcrzwrbftZtQ4uEjbkEzbZgVAxTIsLBFGs8e9pA9B062A0ao/pAl8/c4eYCyi/DcMjndVq6PLbu6Cq7uS2+j4F7rBwY2UTA=="
import Ab2Str from 'arraybuffer-to-string';
import B642Ab from 'base64-to-uint8array';

function arrayToString(array) {
  var uint16array = new Uint16Array(array.buffer);
  return String.fromCharCode.apply(null, uint16array);
}
class MicroPage extends Component {
  player = React.createRef();
  path = 'https://shielddemo.xiaogu-tech.com/demo'

  componentDidMount = async () => {
    const {
      player,
      ui,
      videoElement,
    } = this.player.current.getController();

    const defaultOptions = {
      method: 'GET',
      mode: "cors",
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      }
    };
    const params = {
      fileId: '_Rux4RMT',
      ips: '',
      persistent: 0,
      duration: -1,
      rtExp: 0,
      hwSecurity: 0,
    };

    const newUrl = `${this.path}?${stringify({ ...params })}`;
    const resp = await fetch(newUrl,defaultOptions);
    const respData = JSON.parse(await resp.text());
    const {
      mpd,
      hls,
      spriteWebvtt,
      drmLA
    } = respData;
    console.log(respData)
    // const req = await fetch(this.fpsCer);
    // const cert = await req.arrayBuffer();
    // const serverCertificate = new Uint8Array(cert);
    // console.log('serverCertificate', serverCertificate)
    // console.log(B642Ab(certStr))

    const support = await this.player.current.getSupport();
    console.log('support',support);

    player.configure({
      drm: {
        servers: {
          'com.widevine.alpha': drmLA.widevine,
          'com.microsoft.playready': drmLA.playready,
          'com.apple.fps.1_0': drmLA.fairplay,
        },
        advanced:{
          'com.apple.fps.1_0':{
            'serverCertificate': B642Ab(certStr),
          }
        },
      }
    });


    player.configure('drm.initDataTransform', (initData, initDataType) => {
      if (initDataType != 'skd') {
        return initData;
      }

      // 'initData' is a buffer containing an 'skd://' URL as a UTF-8 string.
      const skdUri = shaka.util.StringUtils.fromBytesAutoDetect(initData);
      // const contentId = getMyContentId(sdkUri);
      const contentId = arrayToString(initData).replace(/^.*:\/\//, '');
      console.log(contentId);
      console.log(skdUri);
      const cert = player.drmInfo().serverCertificate;
      return shaka.util.FairPlayUtils.initDataTransform(initData, contentId, cert);
    });

    if(support.drm['com.apple.fps.1_0']) {
      await player.load(hls);
    } else if(support.manifest.mpd){
      await player.load(mpd);
    } else {
      console.log('play failed!')
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
