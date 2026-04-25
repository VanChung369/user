import { number, object } from "yup";
import { formatCurrency } from "@/utils/utils";
import { BUY_FIELD } from "@/constants/nft";

const { QUANTITY: buyQuantity } = BUY_FIELD;

export const getBuySchema = (intl: any, maxQuantity: number) => {
  return object().shape({
    [buyQuantity]: number()
      .positive(
        intl.formatMessage({
          id: "NFT.quantity.error.positive",
        }),
      )
      .required(
        intl.formatMessage({
          id: "NFT.quantity.error.required",
        }),
      )
      .max(
        maxQuantity,
        intl.formatMessage(
          {
            id: "NFT.quantity.error.max",
          },
          { number: formatCurrency(maxQuantity) },
        ),
      ),
  });
};
