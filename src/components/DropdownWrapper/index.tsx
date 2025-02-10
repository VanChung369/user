import { ReactNode } from 'react';
import { Dropdown } from 'antd';

type DropdownWrapperProps = {
  children?: ReactNode;
  menu: any;
  placement?: string | any;
  trigger?: string | any;
  open?: boolean;
  onOpenChange?: any;
  className?: string;
  [key: string]: any;
};

const DropdownWrapper = ({
  children,
  trigger = ['click'],
  placement = 'bottomRight',
  className,
  menu,
  ...props
}: DropdownWrapperProps) => {
  return (
    <Dropdown
      menu={menu}
      placement={placement}
      overlayClassName={className}
      trigger={trigger}
      getPopupContainer={(trigger: any) => trigger.parentElement}
      {...props}
    >
      {children}
    </Dropdown>
  );
};

export default DropdownWrapper;
