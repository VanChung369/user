import { useIntl } from "react-intl";
import style from "./index.module.scss";
import Image from "next/image";

const WorkItem = ({ work }: any) => {
  const intl = useIntl();

  return (
    <div className={style.work_card}>
      <Image className={style.work_card_icon} src={work.icon} alt="Icon" />
      <div className={style.work_card_detail}>
        <div className={style.work_card_detail_title}>
          {intl.formatMessage({ id: work.title })}
        </div>
        <p className={style.work_card_detail_content}>
          {intl.formatMessage({ id: work.description })}
        </p>
      </div>
    </div>
  );
};

export default WorkItem;
