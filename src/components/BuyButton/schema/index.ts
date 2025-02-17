import { number, object, string, ref, date, mixed, array } from "yup";
import { formatCurrency, isAddress } from "@/utils/utils";
import { BUY_FIELD, LIST_FOR_SALE_FIELD } from "@/constants/nft";

const { QUANTITY: buyQuantity } = BUY_FIELD;
const { QUANTITY: listForSaleQuantity, UNIT_PRICE: listForSaleUnitPrice } =
  LIST_FOR_SALE_FIELD;

export const getBuySchema = (intl: any, maxQuantity: number) => {
  return object().shape({
    [buyQuantity]: number()
      .positive(
        intl.formatMessage({
          id: "NFT.quantity.error.positive",
        })
      )
      .required(
        intl.formatMessage({
          id: "NFT.quantity.error.required",
        })
      )
      .max(
        maxQuantity,
        intl.formatMessage(
          {
            id: "NFT.quantity.error.max",
          },
          { number: formatCurrency(maxQuantity) }
        )
      ),
  });
};
