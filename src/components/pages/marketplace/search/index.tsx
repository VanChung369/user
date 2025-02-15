import { Fragment, memo, useRef } from "react";
import { Form, Formik } from "formik";
import classNames from "classnames";
import isString from "lodash/isString";
import { useIntl } from "react-intl";
import { LENGTH_CONSTANTS } from "@/constants";
import { Col, Row } from "antd";
import { TYPE_INPUT } from "@/constants/input";
import FormWrapper from "@/components/FormWrapper";
import { useChangeAddress } from "@/hooks/hook-customs/useChangeAddress";
import { trim } from "lodash";
import style from "./index.module.scss";
import { NFTS_SORTER } from "@/constants/marketplace";
import { initialValues, KEY_SEARCH } from "..";

type SearchProps = {
  onSubmit: (values: any) => void;
  params?: any;
};

const { DEFAULT_PAGE } = LENGTH_CONSTANTS;

const Search = ({ onSubmit, params }: SearchProps) => {
  const intl = useIntl();

  const formRef = useRef<any>(null);

  const handleChangeField =
    (
      setFieldValue: (
        field: string,
        value: any,
        shouldValidate?: boolean
      ) => void,
      field: string
    ) =>
    (value: string) => {
      setFieldValue(field, isString(value) ? trim(value) : value);
      onSubmit({
        ...params,
        [field]: isString(value) ? trim(value) : value,
        [KEY_SEARCH.PAGE]: DEFAULT_PAGE,
      });
    };

  const handleResetForm = () => {
    formRef?.current?.resetForm();
    onSubmit({
      ...initialValues,
      [KEY_SEARCH.PAGE]: DEFAULT_PAGE,
    });
  };

  useChangeAddress({ callback: handleResetForm });

  return (
    <Fragment>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        innerRef={formRef}
      >
        {({ setFieldValue }) => (
          <Form>
            <Row gutter={24} align="middle">
              <Col lg={24} sm={24} xs={24} className={style.search}>
                <FormWrapper
                  className={style.search_keyword}
                  name={KEY_SEARCH.KEYWORD}
                  placeholder={intl.formatMessage({
                    id: "tag.management.search.placeholder",
                  })}
                  onSearch={handleChangeField(
                    setFieldValue,
                    KEY_SEARCH.KEYWORD
                  )}
                  typeInput={TYPE_INPUT.SEARCH_DEBOUNCE}
                  autoComplete="off"
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
