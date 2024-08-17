import { Tag as AntdTag } from 'antd';

import classNames from '../../utils/classnames';

import type { TagProps } from 'antd';

export type TagType = Omit<TagProps, 'icon'> & {
  icon?: () => JSX.Element;
};

function Tag({ title, icon: Icon, className, ...props }: TagType) {
  const classes = classNames(
    'inline-flex items-center px-4 py-2 w-auto text-base',
    className || ''
  );

  return (
    <AntdTag
      className={classes}
      icon={
        Icon ? (
          <span className="inline-flex items-center pr-1">
            <Icon />
          </span>
        ) : undefined
      }
      {...props}
    >
      {title}
    </AntdTag>
  );
}

export default Tag;
