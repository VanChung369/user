import LayoutPublic from "@/components/Layout/Public";
import style from "./index.module.scss";
import Banner from "@/components/pages/home/Banner";
import Collections from "@/components/pages/home/Collections";
import Tag from "@/components/pages/home/Tag";
import NFTs from "@/components/pages/home/NFTs";
import Work from "@/components/pages/home/Works";
import JoinUs from "@/components/pages/home/JoinUs";

export default function Home() {
  return (
    <LayoutPublic>
      <div className={style.home_page}>
        <Banner />
        <Collections />
        <Tag />
        <NFTs />
        <Work />
        <JoinUs />
      </div>
    </LayoutPublic>
  );
}
