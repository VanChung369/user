import { Image } from "antd";
import { useIntl } from "react-intl";
import EllipsisText from "@/components/EllipsisText";
import ModalWrapper from "@/components/ModalWrapper";
import styles from "./index.module.scss";
import NumberFormatWrapper from "@/components/NumberFormatWrapper";
import { NFT_STATUS } from "@/constants/nft";
import TagWrapper from "@/components/TagWrapper";

interface NftDetailModalProps {
  visible: boolean;
  onClose: () => void;
  nft?: any;
}
const NftDetailModal = ({ visible, onClose, nft }: NftDetailModalProps) => {
  const intl = useIntl();
  const status: any = NFT_STATUS.find((item) => item?.value === nft?.status);

  return (
    <ModalWrapper
      open={visible}
      width={500}
      onClose={onClose}
      className={styles.nft_detail}
      centered={true}
    >
      <div>
        <EllipsisText text={nft?.name} className={styles.nft_detail_name} />
        <Image src={nft?.image?.mediumUrl} alt="Image Nft" preview={false} />
        <div className={styles.nft_detail_content}>
          <div className={styles.nft_detail_content_item}>
            <span className={styles.nft_detail_content_item_label}>
              {intl.formatMessage({ id: "home.banner.nft.status" })}
            </span>
            <span className={styles.nft_detail_content_item_value}>
              {status && (
                <TagWrapper
                  color={status?.color}
                  text={intl.formatMessage({ id: status?.name })}
                  className={styles.nft_detail_content_item_value_status}
                />
              )}
            </span>
          </div>
          <div className={styles.nft_detail_content_item}>
            <span className={styles.nft_detail_content_item_label}>
              {intl.formatMessage({ id: "home.banner.nft.total.sale" })}
            </span>
            <span className={styles.nft_detail_content_item_value}>
              <NumberFormatWrapper value={nft?.totalForSale} />
            </span>
          </div>
        </div>
        <div className={styles.nft_detail_content}>
          <div className={styles.nft_detail_content_item}>
            <span className={styles.nft_detail_content_item_label}>
              {intl.formatMessage({ id: "home.banner.nft.price" })}
            </span>
            <span className={styles.nft_detail_content_item_value}>
              {nft?.unitPrice ? (
                <EllipsisText
                  text={`${nft?.unitPrice} ${nft?.currency?.symbol}`}
                  tooltipText={nft?.unitPrice}
                />
              ) : (
                "---"
              )}
            </span>
          </div>
          <div className={styles.nft_detail_content_item}>
            <span className={styles.nft_detail_content_item_label}>
              {intl.formatMessage({ id: "home.banner.nft.total.suply" })}
            </span>
            <span className={styles.nft_detail_content_item_value}>
              <NumberFormatWrapper value={nft?.totalSupply} />
            </span>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default NftDetailModal;
