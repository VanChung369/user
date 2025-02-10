import Logo_icon from "@public/images/logo.png";
import { useMobile } from "@/hooks/hook-customs/useWindowSize";
import { useAppSelector } from "@/hooks";
import selectedConnection from "@/redux/connection/selector";
import { useGetConfig } from "@/hooks/hook-customs/useGetConfig";
import AppLink from "@/components/AppLink";
import ROUTES_PATH from "@/constants/routesPath";
import style from "./index.module.scss";
import DocsDropdown from "./DocsDropdown";
import classNames from "classnames";
import Notice from "@/components/Notice";
import { SelectLang } from "@/components/SelectLang";
import Mobile from "./Mobile";
import Desktop from "./Desktop";

type HeaderProps = Record<string, never>;

const Header: React.FC<HeaderProps> = () => {
  const isMobile = useMobile();
  const { isConnected } = useAppSelector(selectedConnection.getConnection);
  const { isMaintenance } = useGetConfig();

  return (
    <header className={style.header}>
      <div className={classNames(style.container, "container")}>
        <div className={style.menu}>
          <div>
            <AppLink href={ROUTES_PATH.HOME}>
              <div className={style.menu__icon}>
                <div className={style.menu__icon_img}>
                  <img src={Logo_icon.src} alt="Logo" className={style.logo} />
                </div>
                <div className={style.menu__icon_title}>
                  NFT <span>T</span>reasure
                </div>
              </div>
            </AppLink>
          </div>
          {!isMobile ? (
            <div className={style.items}>
              <AppLink href={"#"}>Marketplace</AppLink>
              <AppLink href={"#"}>Rankings</AppLink>
              <AppLink href={"#"}>landing page</AppLink>
              <DocsDropdown />
            </div>
          ) : (
            <></>
          )}
        </div>
        {!isMaintenance && (
          <div className={style.header__toogle}>
            <SelectLang />
            {isConnected && <Notice />}
            {isMobile ? <Mobile /> : <Desktop />}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
