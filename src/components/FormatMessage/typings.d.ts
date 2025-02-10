declare namespace FormatMessage {
  type MessageProps = {
    descriptor: {
      id: string | number;
      description?: string | object;
      defaultMessage?: string;
    };
    value?: any;
    textMessage?: string;
    type?: "success" | "error" | "info" | "warning" | "loading";
  };
}
