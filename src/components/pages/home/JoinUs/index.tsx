"use client";
import style from "./index.module.scss";
import React from "react";
import { useIntl } from "react-intl";
import classNames from "classnames";
import ButtonWrapper from "@/components/ButtonWrapper";
import JoinUsImage from "@public/images/join-us.png";
import EmailIcon from "@public/svg/email-icon.svg";
import { init } from "next/dist/compiled/webpack/webpack";

const JoinUs = () => {
  const intl = useIntl();

  return (
    <div className={classNames("container", style.join_us)}>
      <div className={style.join_us_subscribe_widget}>
        <img
          className={style.join_us_subscribe_photo}
          src={JoinUsImage.src}
          alt="Photo"
        />
        <div className={style.join_us_subscribe_widget_frame}>
          <div className={style.join_us_subscribe_widget_frame_headline}>
            <div
              className={style.join_us_subscribe_widget_frame_headline_title}
            >
              {intl.formatMessage({ id: "home.banner.join.our.weekly.digest" })}
            </div>
            <p
              className={style.join_us_subscribe_widget_frame_headline_content}
            >
              {intl.formatMessage({ id: "home.banner.join.content" })}
            </p>
          </div>
          <div className={style.join_us_subscribe_widget_frame_subscribe}>
            <input
              className={style.join_us_subscribe_widget_frame_subscribe_email}
              name="email"
              placeholder={intl.formatMessage({
                id: "home.banner.email.placeholder",
              })}
              type="email"
            />
            <ButtonWrapper
              className={style.join_us_subscribe_widget_frame_subscribe_button}
              text={intl.formatMessage({ id: "home.banner.subscribe" })}
              prefixIcon={
                <img
                  className={
                    style.join_us_subscribe_widget_frame_subscribe_button_icon
                  }
                  src={EmailIcon.src}
                  alt="icon-mail"
                />
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinUs;
