import React, { Fragment } from "react";
import { Col, Row } from "antd";
import InstagramIcon from "@public/svg/instagram_contact_icon.svg";
import TwitterIcon from "@public/svg/twitter_contact_icon.svg";
import YoutubeIcon from "@public/svg/youtube_contact_icon.svg";
import FacebookIcon from "@public/svg/facebook_contact_icon.svg";
import AppLink from "@/components/AppLink";
import { useIntl } from "react-intl";
import ROUTES_PATH from "@/constants/routesPath";
import classNames from "classnames";
import style from "./index.module.scss";
import Image from "next/image";

type FooterProps = Record<string, never>;

type FooterInfoItem = {
  href: string;
  text?: string;
  icon?: string;
  prefixIcon?: string;
};

const Footer: React.FC<FooterProps> = ({}) => {
  const intl = useIntl();

  const infoAbout = [
    {
      text: intl.formatMessage({ id: "footer.about.terms.of.service" }),
      href: "#",
    },
    {
      text: intl.formatMessage({ id: "footer.about.privacy.policy" }),
      href: "#",
    },
    {
      text: intl.formatMessage({ id: "footer.about.faqs" }),
      href: "#",
    },
  ];

  const infoEcosystem = [
    {
      text: intl.formatMessage({ id: "footer.ecosystem.landing.page" }),
      href: "#",
    },
    {
      text: intl.formatMessage({ id: "footer.ecosystem.minting" }),
      href: "#",
    },
    {
      text: intl.formatMessage({ id: "footer.ecosystem.rankings" }),
      href: "#",
    },
  ];

  const infoContact = [
    {
      text: intl.formatMessage({ id: "footer.contact.email" }),
      href: `mailto:${intl.formatMessage({ id: "footer.contact.email" })}`,
    },
    {
      text: `+ ${intl.formatMessage({ id: "footer.contact.phone" })}`,
      href: `tel:+${intl.formatMessage({ id: "footer.contact.phone" })}`,
    },
    {
      text: `${intl.formatMessage({ id: "footer.join.our" })}`,
      href: "#",
    },
  ];

  const groupIcon = [
    { icon: TwitterIcon, href: "#" },
    { icon: FacebookIcon, href: "#" },
    { icon: YoutubeIcon, href: "#" },
    { icon: InstagramIcon, href: "#" },
  ];

  const renderFooterItem = ({
    href,
    text,
    icon,
    prefixIcon,
  }: FooterInfoItem) => {
    return (
      <AppLink href={href}>
        {prefixIcon && (
          <Image
            src={prefixIcon}
            className={style.footer__contact}
            alt={"prefix icon"}
          />
        )}
        {text && <span className={style.footer__contact_button}>{text}</span>}
        {icon && (
          <Image
            className={style.footer__contact_icon}
            src={icon}
            alt={"contact icon"}
          />
        )}
      </AppLink>
    );
  };

  return (
    <footer id="footer" className={style.footer}>
      <div className="container">
        <Row className={style.footer__body}>
          <Col md={6}>
            <AppLink href={ROUTES_PATH.HOME}>
              <div className={style.footer__body__logo}>
                {intl.formatMessage({ id: "footer.nft.treasure" })}
              </div>
            </AppLink>
            <div className={style.footer__body__logo_title}>
              {intl.formatMessage({ id: "footer.title" })}
            </div>
          </Col>
          <Col md={6} xs={12}>
            <div className={style.footer__body__title}>
              {intl.formatMessage({ id: "footer.about" })}
            </div>
            {infoAbout.map((item, index) => (
              <div key={index} className={style.footer__body__contact}>
                {renderFooterItem(item)}
              </div>
            ))}
          </Col>
          <Col md={6} xs={12}>
            <div className={style.footer__body__title}>
              {intl.formatMessage({ id: "footer.ecosystem" })}{" "}
            </div>
            {infoEcosystem.map((item, index) => (
              <div key={index} className={style.footer__body__ecosystem}>
                {renderFooterItem(item)}
              </div>
            ))}
          </Col>
          <Col md={6}>
            <div className={style.footer__body__title}>
              {intl.formatMessage({ id: "footer.about" })}
            </div>
            {infoContact.map((item, index) => (
              <div key={index} className={style.footer__body__contact}>
                {renderFooterItem(item)}
              </div>
            ))}
            <div className={style.footer__body__description}>
              {groupIcon.map((item, index) => (
                <Fragment key={index}>{renderFooterItem(item)}</Fragment>
              ))}
            </div>
          </Col>
        </Row>
      </div>
      <div className={style.footer__copy_right}>
        {intl.formatMessage({ id: "footer.copy.right" })}
      </div>
    </footer>
  );
};

export default Footer;
