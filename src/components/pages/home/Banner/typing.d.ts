export type DashboardItem = {
  label?: string;
  value?: any;
  subLabel?: string;
  className?: string;
  icon?: string;
};

type SubSequentProps = {
  quantity: number;
  sold: number;
  startDate?: string;
  endDate?: string;
  status: string;
  nftId: any;
};
