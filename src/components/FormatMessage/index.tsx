"use client";
import { MessageDescriptor, useIntl } from "react-intl";
import { message } from "antd";

export default function formatMessage({
  descriptor,
  type,
  value,
  textMessage,
}: FormatMessage.MessageProps) {
  const intl = useIntl();

  message.config({
    maxCount: 2,
    duration: 3,
  });

  if (type) {
    return message[type]({
      content: intl.formatMessage(descriptor as MessageDescriptor, value),
    });
  }

  return descriptor
    ? intl.formatMessage(descriptor as MessageDescriptor, value)
    : "";
}
