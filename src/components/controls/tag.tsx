import { Tag as AntdTag } from 'antd';
import React from 'react';

import classNames from '../../utils/classnames';

import type { TagProps } from 'antd';

export type TagType = Omit<TagProps, 'icon'> & {
  icon?: React.ComponentType<any>;
};

function Tag({ title, icon: Icon, className, ...props }: TagType) {
  const classes = classNames(
    'inline-flex items-center px-2 py-1 w-auto text-sm md:px-4 md:py-2 md:text-base',
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
