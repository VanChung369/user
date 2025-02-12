import { useIntl } from "react-intl";
import style from "./index.module.scss";

const WorkItem = ({ work }: any) => {
  const intl = useIntl();

  return (
    <div className={style.work_card}>
      <img className={style.work_card_icon} src={work.icon.src} alt="Icon" />
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
