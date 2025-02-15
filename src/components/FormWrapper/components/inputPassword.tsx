import { FC } from "react";
import { FieldInputProps, FormikProps } from "formik";
import { passwordValidate } from "@/utils/schema";
import cx from "classnames";
import { Input } from "antd";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { useIntl } from "react-intl";

const levelPassword = [
  { level: 0, text: "password.low" },
  { level: 1, text: "password.low" },
  { level: 2, text: "password.medium" },
  { level: 3, text: "password.high" },
  { level: 4, text: "password.high" },
];

const { Password } = Input;

const InputPassword: FC<{
  field: FieldInputProps<any>;
  props: any;
  showLevelPassword?: boolean;
  label?: any;
  labelClassName?: string;
  required?: boolean;
  form: FormikProps<any>;
}> = ({
  required,
  field,
  showLevelPassword,
  label,
  labelClassName,
  form,
  ...props
}) => {
  const fieldVal = field.value;
  const intl = useIntl();
  const addClassLevel =
    passwordValidate(fieldVal) < 2
      ? "input__label--low"
      : passwordValidate(fieldVal) < 3
      ? "input__label--medium"
      : passwordValidate(fieldVal) < 5
      ? "input__label--high"
      : "";

  return (
    <>
      {label && showLevelPassword && (
        <div className={cx("form-item__label", labelClassName)}>
          {!!fieldVal && !!showLevelPassword && (
            <div className="input__label--level">
              {levelPassword.map((item) => (
                <span
                  className={`input__label--level-item ${
                    item.level <= passwordValidate(fieldVal) && addClassLevel
                  }`}
                  key={item.level}
                />
              ))}
              <span className={`input__label--level-title ${addClassLevel}`}>
                {intl.formatMessage({
                  id: levelPassword.filter(
                    (item) => item.level === passwordValidate(fieldVal)
                  )[0]?.text,
                })}
              </span>
            </div>
          )}
        </div>
      )}
      <Password
        iconRender={(visible) =>
          !visible ? <EyeInvisibleOutlined /> : <EyeOutlined />
        }
        {...field}
        {...props}
      />
    </>
  );
};

export default InputPassword;
