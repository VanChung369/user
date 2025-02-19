import codeMessage from "@/locales/vi-VN/codeMessage";
import statusResponse from "@/locales/vi-VN/statusResponse";
import common from "./vi-VN/common";
import component from "./vi-VN/component";
import pwa from "./vi-VN/pwa";
import login from "./vi-VN/login";
import nft from "./vi-VN//NFT";
import notification from "./vi-VN/notification";
import modal from "./vi-VN/modal";
import saleOrder from "./vi-VN/saleOrder";
import account from "./vi-VN/account";
import footer from "./vi-VN/footer";
import header from "./vi-VN/header";
import home from "./vi-VN/home";
import marketplace from "./vi-VN/marketplace";

export default {
  "navBar.lang": "ngôn ngữ",
  "layout.user.link.help": "giúp đỡ",
  "layout.user.link.privacy": "sự riêng tư",
  "layout.user.link.terms": "điều kiện",
  "app.name": "NFTTreasure",
  "app.copyright.produced": "Copyright NFTTreasure",
  "app.preview.down.block": "Tải trang này xuống một dự án địa phương",
  "app.welcome.link.fetch-blocks": "lấy tất cả các khối",
  "app.welcome.link.block-list":
    "Dựa trên sự phát triển của khối, nhanh chóng xây dựng các trang tiêu chuẩn",
  ...pwa,
  ...component,
  ...common,
  ...statusResponse,
  ...codeMessage,
  ...login,
  ...nft,
  ...notification,
  ...modal,
  ...saleOrder,
  ...account,
  ...footer,
  ...header,
  ...home,
  ...marketplace,
};
