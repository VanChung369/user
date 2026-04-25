import { MenuProps, Space } from "antd";
import DropdownIcon from "@public/svg/dropdown-icon.svg";
import AppLink from "@/components/AppLink";
import DropdownWrapper from "@/components/DropdownWrapper";
import { useIntl } from "react-intl";
import styles from "./index.module.scss";
import classNames from "classnames";
import Image from "next/image";

const DocsDropdown = () => {
  const intl = useIntl();

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <div className={styles.docs_menu}>
          <AppLink href={"#"}>
            <div className={styles.item}>
              <span className="ml-0">
                {intl.formatMessage({ id: "header.docs.whitepaper" })}
              </span>
            </div>
          </AppLink>
          <AppLink href={"#"}>
            <div className={styles.item}>
              <span className="ml-0">
                {intl.formatMessage({ id: "header.docs.terms.of.service" })}
              </span>
            </div>
          </AppLink>
          <AppLink href={"#"}>
            <div className={styles.item}>
              <span className="ml-0">
                {intl.formatMessage({ id: "header.docs.privacy.policy" })}
              </span>
            </div>
          </AppLink>
          <AppLink href={"#"}>
            <div className={classNames(styles.item, " border-bottom-none")}>
              <span className="ml-0">
                {intl.formatMessage({ id: "header.docs.faqs" })}
              </span>
            </div>
          </AppLink>
        </div>
      ),
    },
  ];

  return (
    <DropdownWrapper menu={{ items }}>
      <Space style={{ cursor: "pointer" }} className={styles.docs}>
        {intl.formatMessage({ id: "header.docs" })}
        <Image src={DropdownIcon} alt={"dropdown icon"} />
      </Space>
    </DropdownWrapper>
  );
};

export default DocsDropdown;
