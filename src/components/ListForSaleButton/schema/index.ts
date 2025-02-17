import { number, object, string, ref, date, mixed, array } from "yup";
import { formatCurrency } from "@/utils/utils";
import { BUY_FIELD, LIST_FOR_SALE_FIELD } from "@/constants/nft";

const { QUANTITY: buyQuantity } = BUY_FIELD;
const { QUANTITY: listForSaleQuantity, UNIT_PRICE: listForSaleUnitPrice } =
  LIST_FOR_SALE_FIELD;

export const getListForSaleSchema = (
  intl: any,
  maxQuantity: number,
  required: any
) => {
  return object().shape({
    [listForSaleQuantity]: number()
      .positive(
        intl.formatMessage({
          id: "NFT.quantity.error.positive",
        })
      )
      .test(
        "required",
        intl.formatMessage({
          id: "NFT.quantity.error.required",
        }),
        (value: string | any) => {
          return required?.requiredQuantity || value;
        }
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
    [listForSaleUnitPrice]: number()
      .positive(
        intl.formatMessage({
          id: "NFT.price.error.positive",
        })
      )
      .required(
        intl.formatMessage({
          id: "NFT.price.error.required",
        })
      ),
  });
};
