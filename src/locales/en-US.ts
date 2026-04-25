import codeMessage from "@/locales/en-US/codeMessage";
import statusResponse from "@/locales/en-US/statusResponse";
import common from "./en-US/common";
import component from "./en-US/component";
import pwa from "./en-US/pwa";
import login from "./en-US/login";
import nft from "./en-US/NFT";
import modal from "./en-US/modal";
import saleOrder from "./en-US/saleOrder";
import notification from "./en-US/notification";
import header from "./en-US/header";
import footer from "./en-US/footer";
import home from "./en-US/home";
import marketplace from "./en-US/marketplace";
import account from "./en-US/account";

export default {
  "navBar.lang": "Languages",
  "layout.user.link.help": "Help",
  "layout.user.link.privacy": "Privacy",
  "layout.user.link.terms": "Terms",
  "app.name": "NFTTreasure",
  "app.copyright.produced": "Copyright NFTTreasure",
  "app.preview.down.block": "Download this page to your local project",
  "app.welcome.link.fetch-blocks": "Get all block",
  "app.welcome.link.block-list":
    "Quickly build standard, pages based on `block` development",
  ...pwa,
  ...component,
  ...common,
  ...statusResponse,
  ...codeMessage,
  ...login,
  ...nft,
  ...modal,
  ...saleOrder,
  ...notification,
  ...header,
  ...footer,
  ...home,
  ...marketplace,
  ...account,
};
