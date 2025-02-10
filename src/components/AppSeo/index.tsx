"use client";
import React from "react";
import { NextSeo } from "next-seo";
import { LENGTH_CONSTANTS } from "@/constants";
import { AppSeoProps } from "./typings";

const { MAX_LENGTH_DESCRIPTION } = LENGTH_CONSTANTS;

const AppSeo = ({
  title,
  metaDescription,
  socialImageUrl,
  faviconImageUrl,
}: AppSeoProps) => {
  const metaDescriptionSeo = metaDescription?.substring(
    0,
    MAX_LENGTH_DESCRIPTION
  );
  const defaultPreviewImage =
    "https://firebasestorage.googleapis.com/v0/b/nft-marketplace-85e49.appspot.com/o/logo%2Flogo.png?alt=media&token=816341a7-b54e-4594-93a1-3055234af723";
  const defaultTitle = "NFT treasure";
  const defaultMetaDescription =
    "The pioneering minting platform for trusted NFTs with incredible benefits";

  return (
    <NextSeo
      title={title || defaultTitle}
      description={metaDescriptionSeo || defaultMetaDescription}
      twitter={{
        cardType: "summary_large_image",
      }}
      openGraph={{
        title: title,
        description: metaDescriptionSeo || defaultMetaDescription,
        images: [
          {
            url: socialImageUrl ? socialImageUrl : defaultPreviewImage,
            alt: title,
            width: 600,
            height: 600,
            type: "image/jpeg",
          },
        ],
      }}
      additionalLinkTags={[
        {
          rel: "icon",
          type: "image/png",
          href: (faviconImageUrl || undefined) as any,
        },
      ]}
      additionalMetaTags={[
        {
          name: "viewport",
          content: "initial-scale=1.0, width=device-width, user-scalable=no",
        },
        {
          name: "keywords",
          content: "",
        },
        {
          name: "author",
          content: "",
        },
      ]}
      robotsProps={{
        maxSnippet: 320,
      }}
    />
  );
};

export default AppSeo;
