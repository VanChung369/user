import { FUNCTION, NUMBER, OBJECT, STRING, UNDEFINED } from "@/constants/type";
import { parse } from "querystring";
import {
  DEFAULT_UNIT_PRESETS,
  IS_WINDOW,
  OPEN_CLOSED_CHARACTERS,
  TINY_NUM,
} from "./consts";
import {
  FlattedElement,
  IArrayFormat,
  IObject,
  OpenCloseCharacter,
  SplitOptions,
} from "./typings";
import HTTP_STATUS_CONTSTANTS from "@/constants/status";
import {
  EXTENSION_3D_SUPPORT_ARRAY,
  IMAGE_TYPE,
  MEDIA,
} from "@/constants/file";
import {
  EMPTY_DEFAULT_TEXT,
  MAX_LENGTH_PRICE,
  MAX_NFT_CODE_LENGTH,
  NFT_DECIMAL_SCALE,
  ZERO_VALUE,
} from "@/constants/input";
import {
  EMPTY_TEXT,
  LENGTH_CONSTANTS,
  MAX_CODE_LENGTH,
  TOKEN_SUPPORT,
} from "@/constants";
import { shortenIfAddress } from "@thirdweb-dev/react";
import moment from "moment";
import { DATE_FORMAT } from "@/constants/date";
import BigNumber from "bignumber.js";
// import { NFT_ATTRIBUTE_CREATED_FIELD, NFT_CREATE_FIELD } from '@/pages/nft/constants';
import { ethers } from "ethers";
import { SALE_STATUS_ORDER_VALUE } from "@/constants/saleOrder";

// const {
//   FILE,
//   FILE_PREVIEW,
//   TOTAL_SUPPLY,
//   CURRENCY,
//   IMAGE_MEDIUM,
//   IMAGE_SMALL,
//   TAG,
//   COLLECTION_ID,
//   TYPE,
// } = NFT_CREATE_FIELD;

const { MIN_VALUE } = LENGTH_CONSTANTS;

/* eslint-disable */

export const getIpfsLink = async (url: string) => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Access the IPFS link from the data object
    const ipfsLink = data.data; // This is your IPFS link
    const cleanedipfsLink = ipfsLink.replace("ipfs://", "");
    console.log("IPFS Link:", ipfsLink);
    return cleanedipfsLink; // Return the IPFS link or handle it as needed
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// export const getFieldValues = (values: any, objectField: any = NFT_ATTRIBUTE_CREATED_FIELD) => {
//   return Object.values(objectField).reduce((acc: any, field: string | any) => {
//     if (field === NFT_CREATE_FIELD.FILE || field === NFT_CREATE_FIELD.FILE_PREVIEW) {
//       acc[field] = values?.[field]?.previewContent;
//     } else {
//       acc[field] = values?.[field];
//     }
//     return acc;
//   }, {});
// };

export const isAddress = (address: string) => {
  try {
    return ethers.utils.isAddress(address?.trim());
  } catch (error) {
    return false;
  }
};

// export const checkValueNftChange = (preVal: object, newVal: object, isEditing?: boolean) => {
//   let newPrevNft = { ...preVal };

//   if (isEditing) {
//     newPrevNft = {
//       ...getDefaultFieldNFTValues(preVal),
//       ...(getAttributeFieldNFTValues(preVal) || {}),
//     };
//   }

//   const NFT_ATTRIBUTE = (preVal as any)?.attributes
//     ? Object?.keys((preVal as any)?.attributes)?.reduce((acc: any, key) => {
//         acc[key.toUpperCase()] = key;
//         return acc;
//       }, {})
//     : {};

//   const defaultPrevValues = getFieldValues(newPrevNft, NFT_CREATE_FIELD) as object;
//   const attributePrevValues = getFieldValues(newPrevNft, NFT_ATTRIBUTE) as object;

//   const defaultNewValues = getFieldValues(newVal, NFT_CREATE_FIELD) as object;
//   const attributeNewValues = getFieldValues(newVal, NFT_ATTRIBUTE) as object;

//   const prevNft = { ...defaultPrevValues, ...attributePrevValues };
//   const newNft = { ...defaultNewValues, ...attributeNewValues };

//   return JSON.stringify(prevNft) !== JSON.stringify(newNft);
// };

export const compareDate = (date1: any, date2: any) => {
  if (moment(date1).isBefore(date2)) {
    return -1;
  }
  if (moment(date1).isAfter(date2)) {
    return 1;
  }
  return 0;
};

export const compareSaleOrder = (firstSaleOrder: any, secondSaleOrder: any) => {
  if (firstSaleOrder.status === secondSaleOrder.status) {
    const sortDate =
      firstSaleOrder.status === SALE_STATUS_ORDER_VALUE.COMING_SOON
        ? compareDate(firstSaleOrder?.startDate, secondSaleOrder?.startDate)
        : compareDate(firstSaleOrder?.endDate, secondSaleOrder?.endDate);
    if (sortDate === 0) {
      return firstSaleOrder?.name?.localeCompare(secondSaleOrder?.name);
    }
    return sortDate;
  }

  if (firstSaleOrder.status === SALE_STATUS_ORDER_VALUE.LISTED) {
    return -1;
  }

  if (firstSaleOrder.status === SALE_STATUS_ORDER_VALUE.LISTED) {
    return 1;
  }

  if (firstSaleOrder.status === SALE_STATUS_ORDER_VALUE.COMING_SOON) {
    return -1;
  }

  if (firstSaleOrder.status === SALE_STATUS_ORDER_VALUE.COMING_SOON) {
    return 1;
  }
};

export const checkValueChange = (preVal: object, newVal: object) => {
  return JSON.stringify(preVal) !== JSON.stringify(newVal);
};

export const getAttributeFieldNFTValues = (values: any) => {
  if (!values?.attributes || typeof values.attributes !== "object") {
    return {};
  }

  const NFT_ATTRIBUTE = Object?.keys(values?.attributes)?.reduce(
    (acc: any, key) => {
      acc[key.toUpperCase()] = key;
      return acc;
    },
    {}
  );

  return Object.values(NFT_ATTRIBUTE).reduce(
    (acc: any, field: string | any) => {
      acc[field] =
        values?.attributes?.[field]?.text || values?.attributes?.[field];
      return acc;
    },
    {}
  );
};

export const getDuration = (from: any, until: any) => {
  const duration = moment.duration(until.diff(from));
  return duration;
};

export const transformDataProprety = (data: any) => {
  const transformed = [];

  for (const key in data) {
    const item = data[key];
    const newItem = {
      type: item.type,
      value: [],
      required: item.required,
      name: key,
      typeUser: item.typeUser || "",
    };

    if (item.type === "select") {
      newItem.value = item.value.map((v: any) => ({
        text: v.text,
      }));
    } else {
      newItem.value = item.value;
    }

    transformed.push(newItem);
  }

  return transformed;
};

// export const getDefaultFieldNFTValues = (values: any) => {
//   return Object.values(NFT_CREATE_FIELD).reduce((acc: any, field: string | any) => {
//     switch (field) {
//       case FILE:
//         acc[FILE] = {
//           fileList: [{ type: values?.media?.type || IMAGE_TYPE }],
//           previewContent: values?.media?.url || values?.image?.url || '',
//         };
//         break;
//       case FILE_PREVIEW:
//         acc[FILE_PREVIEW] = {
//           fileList: [],
//           previewContent: values?.image?.url || '',
//         };
//         break;
//       case IMAGE_MEDIUM:
//         acc[IMAGE_MEDIUM] = values?.image?.mediumUrl;
//         break;
//       case IMAGE_SMALL:
//         acc[IMAGE_SMALL] = values?.image?.smallUrl;
//         break;
//       case TOTAL_SUPPLY:
//         acc[TOTAL_SUPPLY] = values?.token?.[TOTAL_SUPPLY]?.toString();
//         break;
//       case CURRENCY:
//         acc[CURRENCY] = TOKEN_SUPPORT.value;
//         break;
//       case TAG:
//         acc[TAG] = values?.[TAG]?.map((tag: any) => tag.id);
//         break;
//       case COLLECTION_ID:
//         acc[COLLECTION_ID] = values?.[COLLECTION_ID];
//         break;
//       case TYPE:
//         acc[TYPE] = values?.token?.standard;
//         break;
//       default:
//         acc[field] = values?.[field]?.toString() || '';
//         break;
//     }
//     return acc;
//   }, {});
// };

const reg =
  /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const getPageQuery = () => parse(window.location.href.split("?")[1]);

export function isUndefined(value: any): value is undefined {
  return typeof value === UNDEFINED;
}

export const getStartDateTimestamp = (value: any) => {
  if (!value) {
    return;
  }
  return moment(value).clone().startOf("days").toISOString();
};

export const getEndDateTimestamp = (value: any) => {
  if (!value) {
    return;
  }
  return moment(value).clone().endOf("days").toISOString();
};

export const disabledFromDate = (date: any) => (current: moment.Moment) => {
  return (
    (date && current?.clone()?.endOf("day") > date?.clone()?.endOf("day")) ||
    current > moment()
  );
};

export const disabledUntilDate = (date: any) => (current: moment.Moment) => {
  return (
    (date &&
      current?.clone()?.startOf("day") < date?.clone()?.startOf("day")) ||
    current > moment()
  );
};

export const disabledSaleOrderStartDate =
  (date: any) => (current: moment.Moment) => {
    return (
      (date && current?.clone()?.endOf("day") > date?.clone()?.endOf("day")) ||
      current < moment().startOf("day")
    );
  };

export const disabledSaleOrderEndDate =
  (date: any) => (current: moment.Moment) => {
    return (
      (date &&
        current?.clone()?.startOf("day") < date?.clone()?.startOf("day")) ||
      current < moment().startOf("day")
    );
  };

export const getValueAttribute = (attributes: any, field: string) =>
  attributes?.[field]?.text || attributes?.[field];

export const formatCurrency = (
  value: any,
  options: {
    isNotCompare?: boolean;
    decimal?: number;
    isNotFormatDecimal?: boolean;
  } = {}
) => {
  BigNumber.config({
    EXPONENTIAL_AT: 100,
  });

  const {
    isNotCompare,
    decimal = NFT_DECIMAL_SCALE,
    isNotFormatDecimal,
  } = options;

  const formatDecimal = isNotFormatDecimal ? undefined : decimal;

  if (!value) {
    return ZERO_VALUE;
  }
  if (isNotCompare) {
    return new BigNumber(value).toFormat();
  }

  return new BigNumber(value).isLessThan(new BigNumber(MIN_VALUE))
    ? new BigNumber(MIN_VALUE).toFormat()
    : new BigNumber(value).toFormat(formatDecimal);
};

export const getNumber = (value?: number) => {
  return value ?? ZERO_VALUE;
};

export const clearRequestParams = (params?: any) => {
  const newParams = {} as any;
  const cloneParams = { ...params };
  for (const field in cloneParams) {
    if (
      cloneParams?.[field] ||
      cloneParams?.[field] === 0 ||
      cloneParams?.[field] === false
    ) {
      newParams[field] = cloneParams?.[field];
    }
  }
  return newParams;
};

export const formatNumberWithSuffix = (num: any, digits: any = 2) => {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "K" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "B" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  const item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item?.value;
    });
  return item
    ? (num / item?.value)?.toFixed(digits)?.replace(rx, "$1") + item?.symbol
    : num?.toFixed(8);
};

export const get3DFileType = (fileName: string) => {
  const extension =
    fileName?.slice(fileName?.lastIndexOf(".") + 1)?.toLowerCase() || "";
  const type = `3d/${extension}`;
  if (EXTENSION_3D_SUPPORT_ARRAY.includes(type)) {
    return type;
  }
  return "";
};

export const getFullFormatedFile = (value: any) => {
  return (
    value?.fileList?.[0]?.type ||
    get3DFileType(value?.fileList?.[0]?.name) ||
    IMAGE_TYPE
  );
};

export const getFormatedFile = (value: any) => {
  const fullFormat = getFullFormatedFile(value);
  return fullFormat?.split("/")[0] || MEDIA.IMAGE;
};

export const formatAddress = (value: any) => {
  if (!value) {
    return EMPTY_TEXT;
  }
  return value.length > MAX_CODE_LENGTH ? shortenIfAddress(value, true) : value;
};

export const limitPercentage = (inputObj: any) => {
  const MAX_PERCENT = 100;
  const { value } = inputObj;
  if (Number(value) > MAX_PERCENT) {
    return false;
  }
  return true;
};

export const limitMaxlengNumber =
  (maxLength: number = MAX_LENGTH_PRICE) =>
  (inputObj: any) => {
    const { value } = inputObj;
    const integerPath = (value || "").split(".")[0];
    return integerPath.length <= maxLength;
  };

export function throttle(num: number, unit?: number) {
  if (!unit) {
    return num;
  }
  const reverseUnit = 1 / unit;
  return Math.round(num / unit) / reverseUnit;
}

export function findIndex<T>(
  arr: T[],
  callback: (element: T, index: number, arr: T[]) => any,
  defaultIndex: number = -1
): number {
  const length = arr.length;

  for (let i = 0; i < length; ++i) {
    if (callback(arr[i], i, arr)) {
      return i;
    }
  }
  return defaultIndex;
}

export const shortenText = (text: string, number = -4) => {
  if (text) {
    const first = text.slice(0, 6);
    const last = text.slice(number);
    return `${first}...${last}`;
  }
  return EMPTY_DEFAULT_TEXT;
};

export const formatText = (value: any) => {
  if (!value) {
    return EMPTY_DEFAULT_TEXT;
  }
  return value.length > MAX_NFT_CODE_LENGTH ? shortenText(value) : value;
};

/**
    find([{a: 1}, {a: 2}, {a: 3}, {a: 4}], ({ a }) => a === 2); // {a: 2}
  */
export function find<T>(
  arr: T[],
  callback: (element: T, index: number, arr: T[]) => any,
  defalutValue?: T
): T | undefined {
  const index = findIndex(arr, callback);

  return index > -1 ? arr[index] : defalutValue;
}

export function isObject(value: any): value is IObject<any> {
  return value && typeof value === OBJECT;
}

export function isArray(value: any): value is any[] {
  return Array.isArray(value);
}

export function isString(value: any): value is string {
  return typeof value === STRING;
}

export function isNumber(value: any): value is number {
  return typeof value === NUMBER;
}

export function isFunction(value: any): value is (...args: any[]) => any {
  return typeof value === FUNCTION;
}

function isEqualSeparator(character: string, separator: string) {
  const isCharacterSpace = character === "" || character == " ";
  const isSeparatorSpace = separator === "" || separator == " ";

  return (isSeparatorSpace && isCharacterSpace) || character === separator;
}

function findIgnore(
  character: OpenCloseCharacter,
  texts: string[],
  index: number
) {
  if (!character.ignore) {
    return null;
  }
  const otherText = texts.slice(Math.max(index - 3, 0), index + 3).join("");

  return new RegExp(character.ignore).exec(otherText);
}

function findOpen(
  openCharacter: OpenCloseCharacter,
  texts: string[],
  index: number,
  length: number,
  openCloseCharacters: OpenCloseCharacter[]
) {
  const isIgnore = findIgnore(openCharacter, texts, index);

  if (!isIgnore) {
    return findClose(
      openCharacter,
      texts,
      index + 1,
      length,
      openCloseCharacters
    );
  }
  return index;
}

function findClose(
  closeCharacter: OpenCloseCharacter,
  texts: string[],
  index: number,
  length: number,
  openCloseCharacters: OpenCloseCharacter[]
) {
  for (let i = index; i < length; ++i) {
    const character = texts[i].trim();

    if (
      character === closeCharacter.close &&
      !findIgnore(closeCharacter, texts, i)
    ) {
      return i;
    }
    let nextIndex = i;
    // re open
    const openCharacter = find(
      openCloseCharacters,
      ({ open }) => open === character
    );

    if (openCharacter) {
      nextIndex = findOpen(
        openCharacter,
        texts,
        i,
        length,
        openCloseCharacters
      );
    }
    if (nextIndex === -1) {
      break;
    }
    i = nextIndex;
  }
  return -1;
}

export function splitText(
  text: string,
  splitOptions: string | SplitOptions
): string[] {
  const {
    separator = ",",
    isSeparateFirst,
    isSeparateOnlyOpenClose,
    isSeparateOpenClose = isSeparateOnlyOpenClose,
    openCloseCharacters = OPEN_CLOSED_CHARACTERS,
  } = isString(splitOptions)
    ? ({
        separator: splitOptions,
      } as SplitOptions)
    : splitOptions;
  const openClosedText = openCloseCharacters
    .map(({ open, close }) => {
      if (open === close) {
        return open;
      }
      return `${open}|${close}`;
    })
    .join("|");
  const regexText = `(\\s*${separator}\\s*|${openClosedText}|\\s+)`;
  const regex = new RegExp(regexText, "g");
  const texts = text.split(regex).filter(Boolean);
  const length = texts.length;
  const values: string[] = [];
  let tempValues: string[] = [];

  function resetTemp() {
    if (tempValues.length) {
      values.push(tempValues.join(""));
      tempValues = [];

      return true;
    }
    return false;
  }
  for (let i = 0; i < length; ++i) {
    const character = texts[i].trim();
    let nextIndex = i;

    const openCharacter = find(
      openCloseCharacters,
      ({ open }) => open === character
    );
    const closeCharacter = find(
      openCloseCharacters,
      ({ close }) => close === character
    );

    if (openCharacter) {
      nextIndex = findOpen(
        openCharacter,
        texts,
        i,
        length,
        openCloseCharacters
      );

      if (nextIndex !== -1 && isSeparateOpenClose) {
        if (resetTemp() && isSeparateFirst) {
          break;
        }
        values.push(texts.slice(i, nextIndex + 1).join(""));
        i = nextIndex;

        if (isSeparateFirst) {
          break;
        }
        continue;
      }
    } else if (closeCharacter && !findIgnore(closeCharacter, texts, i)) {
      const nextOpenCloseCharacters = [...openCloseCharacters];

      nextOpenCloseCharacters.splice(
        openCloseCharacters.indexOf(closeCharacter),
        1
      );

      return splitText(text, {
        separator,
        isSeparateFirst,
        isSeparateOnlyOpenClose,
        isSeparateOpenClose,
        openCloseCharacters: nextOpenCloseCharacters,
      });
    } else if (
      isEqualSeparator(character, separator) &&
      !isSeparateOnlyOpenClose
    ) {
      resetTemp();
      if (isSeparateFirst) {
        break;
      }
      continue;
    }

    if (nextIndex === -1) {
      nextIndex = length - 1;
    }
    tempValues.push(texts.slice(i, nextIndex + 1).join(""));
    i = nextIndex;
  }
  if (tempValues.length) {
    values.push(tempValues.join(""));
  }
  return values;
}

export function splitSpace(text: string) {
  return splitText(text, "");
}

export function splitComma(text: string): string[] {
  return splitText(text, ",");
}

export function splitBracket(text: string) {
  const matches = /([^(]*)\(([\s\S]*)\)([\s\S]*)/g.exec(text);

  if (!matches || matches.length < 4) {
    return {};
  } else {
    return { prefix: matches[1], value: matches[2], suffix: matches[3] };
  }
}

export function splitUnit(text: string): {
  prefix: string;
  unit: string;
  value: number;
} {
  const matches = /^([^\d|e|\-|\+]*)((?:\d|\.|-|e-|e\+)+)(\S*)$/g.exec(text);

  if (!matches) {
    return { prefix: "", unit: "", value: NaN };
  }
  const prefix = matches[1];
  const value = matches[2];
  const unit = matches[3];

  return { prefix, unit, value: parseFloat(value) };
}

export function camelize(str: string) {
  return str.replace(/[\s-_]([a-z])/g, (all, letter) => letter.toUpperCase());
}

export function decamelize(str: string, separator: string = "-") {
  //eslint-disable-line
  return str.replace(
    /([a-z])([A-Z])/g,
    (all, letter, letter2) => `${letter}${separator}${letter2.toLowerCase()}`
  );
}

export function toArray<T>(value: IArrayFormat<T>): T[] {
  return [].slice.call(value);
}

export function now() {
  return Date.now ? Date.now() : new Date().getTime();
}

export const formatDate = (
  date: moment.MomentInput | any,
  type = DATE_FORMAT
) => {
  return moment(date).format(type);
};

export function findLastIndex<T>(
  arr: T[],
  callback: (element: T, index: number, arr: T[]) => any,
  defaultIndex: number = -1
): number {
  const length = arr.length;

  for (let i = length - 1; i >= 0; --i) {
    if (callback(arr[i], i, arr)) {
      return i;
    }
  }
  return defaultIndex;
}

export function findLast<T>(
  arr: T[],
  callback: (element: T, index: number, arr: T[]) => any,
  defalutValue?: T
): T | undefined {
  const index = findLastIndex(arr, callback);

  return index > -1 ? arr[index] : defalutValue;
}

/**
requestAnimationFrame((timestamp) => {
  console.log(timestamp);
});
*/
export const requestAnimationFrame = (() => {
  const firstTime = now();

  const raf =
    IS_WINDOW &&
    (window.requestAnimationFrame ||
      (window as any).webkitRequestAnimationFrame ||
      (window as any).mozRequestAnimationFrame ||
      (window as any).msRequestAnimationFrame);

  return raf
    ? (raf.bind(window) as (callback: FrameRequestCallback) => number)
    : (callback: FrameRequestCallback) => {
        const currTime = now();
        const id = setTimeout(() => {
          callback(currTime - firstTime);
        }, 1000 / 60);

        return id as any as number;
      };
})();

/**
const id = requestAnimationFrame((timestamp) => {
  console.log(timestamp);
});
cancelAnimationFrame(id);
*/
export const cancelAnimationFrame = (() => {
  const caf =
    IS_WINDOW &&
    (window.cancelAnimationFrame ||
      (window as any).webkitCancelAnimationFrame ||
      (window as any).mozCancelAnimationFrame ||
      (window as any).msCancelAnimationFrame);

  return caf
    ? (caf.bind(window) as (handle: number) => void)
    : (handle: number) => {
        clearTimeout(handle);
      };
})();

export function getKeys(obj: IObject<any>): string[] {
  return Object.keys(obj);
}

export function getValues(obj: IObject<any>): any[] {
  const keys = getKeys(obj);

  return keys.map((key) => obj[key]);
}

export function getEntries(obj: IObject<any>): [string, any][] {
  const keys = getKeys(obj);

  return keys.map((key) => [key, obj[key]]);
}

export function sortOrders(
  keys: Array<string | number>,
  orders: Array<string | number> = []
) {
  keys.sort((a, b) => {
    const index1 = orders.indexOf(a);
    const index2 = orders.indexOf(b);

    if (index2 === -1 && index1 === -1) {
      return 0;
    }
    if (index1 === -1) {
      return 1;
    }
    if (index2 === -1) {
      return -1;
    }
    return index1 - index2;
  });
}

export function convertUnitSize(
  pos: string,
  size: number | IObject<((pos: number) => number) | number>
) {
  const { value, unit } = splitUnit(pos);

  if (isObject(size)) {
    const sizeFunction = size[unit];
    if (sizeFunction) {
      if (isFunction(sizeFunction)) {
        return sizeFunction(value);
      } else if (DEFAULT_UNIT_PRESETS[unit]) {
        return DEFAULT_UNIT_PRESETS[unit](value, sizeFunction);
      }
    }
  } else if (unit === "%") {
    return (value * size) / 100;
  }
  if (DEFAULT_UNIT_PRESETS[unit]) {
    return DEFAULT_UNIT_PRESETS[unit](value);
  }
  return value;
}

export function between(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max));
}

export function checkBoundSize(
  targetSize: number[],
  compareSize: number[],
  isMax: boolean,
  ratio = targetSize[0] / targetSize[1]
) {
  return (
    [
      [
        throttle(compareSize[0], TINY_NUM),
        throttle(compareSize[0] / ratio, TINY_NUM),
      ],
      [
        throttle(compareSize[1] * ratio, TINY_NUM),
        throttle(compareSize[1], TINY_NUM),
      ],
    ].filter((size) =>
      size.every((value, i) => {
        const defaultSize = compareSize[i];
        const throttledSize = throttle(defaultSize, TINY_NUM);

        return isMax
          ? value <= defaultSize || value <= throttledSize
          : value >= defaultSize || value >= throttledSize;
      })
    )[0] || targetSize
  );
}

export function calculateBoundSize(
  size: number[],
  minSize: number[],
  maxSize: number[],
  keepRatio?: number | boolean
): number[] {
  if (!keepRatio) {
    return size.map((value, i) => between(value, minSize[i], maxSize[i]));
  }
  let [width, height] = size;

  const ratio = keepRatio === true ? width / height : keepRatio;
  // width : height = minWidth : minHeight;
  const [minWidth, minHeight] = checkBoundSize(size, minSize, false, ratio);
  const [maxWidth, maxHeight] = checkBoundSize(size, maxSize, true, ratio);

  if (width < minWidth || height < minHeight) {
    width = minWidth;
    height = minHeight;
  } else if (width > maxWidth || height > maxHeight) {
    width = maxWidth;
    height = maxHeight;
  }
  return [width, height];
}

export function removeNullProperties(obj: any): { [key: string]: any } {
  Object.keys(obj).forEach((key: string) => {
    let value = obj[key];
    let hasProperties = value && Object.keys(value).length > 0;
    if (value === null || value === "" || value === undefined) {
      delete obj[key];
    } else if (typeof value !== "string" && hasProperties) {
      removeNullProperties(value);
    }
  });
  return obj;
}

export function flattenObject(obj: any, objPath = "", flatObject: any = {}) {
  if (obj === null || obj === undefined) return flatObject;

  let hasProperties = obj && Object.keys(obj).length > 0;
  if (typeof obj === "string" || !hasProperties) {
    flatObject[objPath || "''"] = obj;
    return flatObject;
  }

  Object.keys(obj).forEach((key) => {
    let value = obj[key];
    let currentPath = (objPath.length > 0 ? objPath + "." : "") + key;
    if (isArray(value) && value?.length > 0) {
      value.forEach((arrayEntry, index) => {
        flattenObject(arrayEntry, currentPath + "[" + index + "]", flatObject);
      });
      return;
    }
    flattenObject(value, currentPath, flatObject);
  });
  return flatObject;
}

export const checkSusscessRequest = (response: any) => {
  return response?.status < HTTP_STATUS_CONTSTANTS.ERROR;
};
