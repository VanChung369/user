import React, { ReactNode } from "react";
import NodataIcon from "@public/images/no-data.png";
import { useIntl } from "react-intl";
import Image from "next/image";
import styles from "./index.module.scss";

type NodataProps = {
  emptyText?: string;
  emptySrc?: ReactNode | string | any;
};

const Nodata = ({ emptyText, emptySrc }: NodataProps) => {
  const intl = useIntl();
  return (
    <div className={styles.no_data}>
      <Image
        src={emptySrc || NodataIcon}
        className={styles.no_data_image}
        alt="no data icon"
      />
      <p className={styles.no_data_text}>
        {emptyText || intl.formatMessage({ id: "common.text.no.data" })}
      </p>
    </div>
  );
};

export default Nodata;
