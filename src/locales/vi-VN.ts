import codeMessage from '@/locales/vi-VN/codeMessage';
import statusResponse from '@/locales/vi-VN/statusResponse';
import common from './vi-VN/common';
import component from './vi-VN/component';
import globalHeader from './vi-VN/globalHeader';
import menu from './vi-VN/menu';
import pages from './vi-VN/pages';
import pwa from './vi-VN/pwa';
import settingDrawer from './vi-VN/settingDrawer';
import settings from './vi-VN/settings';
import login from './vi-VN/login';
import nft from './vi-VN//NFT';
import password from './vi-VN/password';
import revenue from './vi-VN/revenue';
import collection from './vi-VN/collection';
import tag from './vi-VN/tag';
import dashboard from './vi-VN/dashboard';
import notification from './vi-VN/notification';
import modal from './vi-VN/modal';
import saleOrder from './vi-VN/saleOrder';

export default {
  'navBar.lang': 'ngôn ngữ',
  'layout.user.link.help': 'giúp đỡ',
  'layout.user.link.privacy': 'sự riêng tư',
  'layout.user.link.terms': 'điều kiện',
  'app.name': 'NFTTreasure',
  'app.copyright.produced': 'Copyright NFTTreasure',
  'app.preview.down.block': 'Tải trang này xuống một dự án địa phương',
  'app.welcome.link.fetch-blocks': 'lấy tất cả các khối',
  'app.welcome.link.block-list':
    'Dựa trên sự phát triển của khối, nhanh chóng xây dựng các trang tiêu chuẩn',
  ...pages,
  ...globalHeader,
  ...menu,
  ...settingDrawer,
  ...settings,
  ...pwa,
  ...component,
  ...common,
  ...statusResponse,
  ...codeMessage,
  ...login,
  ...nft,
  ...password,
  ...revenue,
  ...collection,
  ...dashboard,
  ...tag,
  ...notification,
  ...modal,
  ...saleOrder,
};
