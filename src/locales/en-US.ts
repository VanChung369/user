import codeMessage from "@/locales/en-US/codeMessage";
import statusResponse from "@/locales/en-US/statusResponse";
import common from "./en-US/common";
import component from "./en-US/component";
import globalHeader from "./en-US/globalHeader";
import menu from "./en-US/menu";
import pages from "./en-US/pages";
import pwa from "./en-US/pwa";
import settingDrawer from "./en-US/settingDrawer";
import settings from "./en-US/settings";
import login from "./en-US/login";
import nft from "./en-US/NFT";
import password from "./en-US/password";
import modal from "./en-US/modal";
import saleOrder from "./en-US/saleOrder";
import revenue from "./en-US/revenue";
import dashboard from "./en-US/dashboard";
import notification from "./en-US/notification";
import tag from "./en-US/tag";
import collection from "./en-US/collection";
import header from "./en-US/header";
import footer from "./en-US/footer";
import home from "./en-US/home";

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
  ...globalHeader,
  ...menu,
  ...settingDrawer,
  ...settings,
  ...pwa,
  ...component,
  ...pages,
  ...common,
  ...statusResponse,
  ...codeMessage,
  ...login,
  ...nft,
  ...password,
  ...modal,
  ...saleOrder,
  ...revenue,
  ...dashboard,
  ...notification,
  ...tag,
  ...collection,
  ...header,
  ...footer,
  ...home,
};
