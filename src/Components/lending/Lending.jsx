/* React */
import React from 'react';

import LendingMobile from './LendingMobile';
import LendingPC from './LendingPC';
import { request } from "../../tools/apiRequest/apiRequest";

/* Component */
export default class Lending extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {

    /* find device */
    const devices = new RegExp('Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini', "i");

    if (devices.test(navigator.userAgent)) {

      /* redirect to main page */
      request(`/api/get_user`, {})
        .then(res => res.json()).then(body => {
          if (body.status === 'ok') {
            window.location.pathname = 'main';
          }
        }).catch(err => {});

      return <LendingMobile/>;
    }
    return <LendingPC/>
  }
}