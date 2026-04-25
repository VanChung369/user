declare namespace FormatMessage {
  type MessageProps = {
    msgContent?: string;
    type: "success" | "error" | "info" | "warning" | "loading";
  };
}
