import LayoutPublic from "@/components/Layout/Public";
import style from "./index.module.scss";
import Banner from "@/components/pages/home/Banner";
import dynamic from "next/dynamic";

const Collections = dynamic(
  () => import("@/components/pages/home/Collections"),
);
const Tag = dynamic(() => import("@/components/pages/home/Tag"));
const NFTs = dynamic(() => import("@/components/pages/home/NFTs"));
const Work = dynamic(() => import("@/components/pages/home/Works"));
const JoinUs = dynamic(() => import("@/components/pages/home/JoinUs"));

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
