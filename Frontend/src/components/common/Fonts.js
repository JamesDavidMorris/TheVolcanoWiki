import { createGlobalStyle } from 'styled-components';

import WCManoNegraBta from '../../assets/fonts/WCManoNegraBta-webfont.woff';
import Foxbot from '../../assets/fonts/Foxbot.woff';

export default createGlobalStyle`
    @font-face {
        font-family: 'WC MANO NEGRA';
        src: local('WC MANO NEGRA'), local('WCMANONEGRA'),
        url(${WCManoNegraBta}) format('woff');
        font-weight: 300;
        font-style: normal;
    }

    @font-face {
      font-family: 'Foxbot';
      src: local('Foxbot'), local('Foxbot'),
      url(${Foxbot}) format('woff');
      font-weight: 300;
      font-style: normal;
    }
`;