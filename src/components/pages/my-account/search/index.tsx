import { Fragment, memo, useRef } from "react";
import { Form, Formik } from "formik";
import isString from "lodash/isString";
import { useIntl } from "react-intl";
import { LENGTH_CONSTANTS } from "@/constants";
import { Col, Row } from "antd";
import { TYPE_INPUT } from "@/constants/input";
import FormWrapper from "@/components/FormWrapper";
import { useChangeAddress } from "@/hooks/hook-customs/useChangeAddress";
import { trim } from "lodash";
import style from "./index.module.scss";
import { ReloadOutlined } from "@ant-design/icons";
import { NFT_ACTIVITIES_FIELDS, NFT_STANDARD } from "@/constants/nft";
import { initFormValues } from "..";
import { disabledFromDate, disabledUntilDate } from "@/utils/utils";

type SearchProps = {
  onSubmit: (values: any) => void;
  params?: any;
};

const { DEFAULT_PAGE } = LENGTH_CONSTANTS;
const { TYPE, FROM, UNTIL, KEYWORD, PAGE } = NFT_ACTIVITIES_FIELDS;

const Search = ({ onSubmit, params }: SearchProps) => {
  const intl = useIntl();
  const formRef = useRef<any>(null);

  const handleFieldChange =
    (setFieldValue: any, name: string) => (value: any) => {
      setFieldValue(name, isString(value) ? trim(value) : value);
      onSubmit({
        ...params,
        [name]: isString(value) ? trim(value) : value,
        [PAGE]: DEFAULT_PAGE,
      });
    };
  const handleResetForm = () => {
    formRef?.current?.resetForm();
    onSubmit({
      ...initFormValues,
      [PAGE]: DEFAULT_PAGE,
    });
  };

  const nftTypes = NFT_STANDARD.map((type) => ({
    ...type,
    name: intl.formatMessage({ id: type?.label || "common.null.text" }),
  }));

  useChangeAddress({ callback: handleResetForm });

  return (
    <Fragment>
      <Formik
        initialValues={initFormValues}
        onSubmit={onSubmit}
        innerRef={formRef}
      >
        {({ setFieldValue, values }) => (
          <Form className={style.nft_search}>
            <Row gutter={20} className={style.nft_search__row} align="middle">
              <Col lg={9} sm={12} xs={24}>
                <FormWrapper
                  name={KEYWORD}
                  placeholder={intl.formatMessage({
                    id: "account.search.nft",
                  })}
                  onSearch={handleFieldChange(setFieldValue, KEYWORD)}
                  typeInput={TYPE_INPUT.SEARCH_DEBOUNCE}
                />
              </Col>
              <Col lg={4} sm={12} xs={24} className="col-date">
                <FormWrapper
                  name={FROM}
                  placeholder={intl.formatMessage({
                    id: "account.search.start.date",
                  })}
                  onChange={handleFieldChange(setFieldValue, FROM)}
                  disabledDate={disabledFromDate(values?.[UNTIL])}
                  typeInput={TYPE_INPUT.DATE}
                />
              </Col>
              <Col lg={4} sm={12} xs={24}>
                <FormWrapper
                  name={UNTIL}
                  placeholder={intl.formatMessage({
                    id: "account.search.end.date",
                  })}
                  onChange={handleFieldChange(setFieldValue, UNTIL)}
                  disabledDate={disabledUntilDate(values?.[FROM])}
                  typeInput={TYPE_INPUT.DATE}
                />
              </Col>
              <Col lg={3} sm={12} xs={24}>
                <FormWrapper
                  name={TYPE}
                  placeholder={intl.formatMessage({ id: "account.sales.type" })}
                  onChange={handleFieldChange(setFieldValue, TYPE)}
                  typeInput={TYPE_INPUT.SELECT}
                  options={nftTypes}
                  allowClear
                />
              </Col>
              <Col lg={4} sm={24} xs={24}>
                <ReloadOutlined
                  onClick={handleResetForm}
                  className={style.reset_btn}
                />
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
    </Fragment>
  );
};

export default memo(Search);
