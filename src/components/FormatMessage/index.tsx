import { message } from "antd";

export default function formatMessage({
  type,
  msgContent,
}: FormatMessage.MessageProps) {
  message.config({
    maxCount: 2,
    duration: 3,
  });

  return message[type]({
    content: msgContent,
  });
}
