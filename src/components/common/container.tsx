import { LeftOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { IconButton } from '../controls';
import { useThemeContext } from '../../store/contexts';

export type ContainerType = {
  children?: React.ReactNode;
  loading?: boolean;
  title?: React.ReactNode;
  description?: React.ReactNode;
  backButton?: boolean | string;
  stretch?: boolean;
};

function Container({
  children,
  loading = false,
  title,
  description,
  backButton = false,
  stretch,
}: ContainerType) {
  const navigate = useNavigate();
  const { theme } = useThemeContext();

  return (
    <div className={`container-wrapper ${stretch ? 'lg:max-w-4xl' : ''}`}>
      {(backButton || title || description) && (
        <div className="flex">
          {backButton && (
            <div className="mr-4">
              {typeof backButton === 'string' ? (
                <Link to={backButton}>
                  <IconButton icon={() => <LeftOutlined className="text-xs" />} />
                </Link>
              ) : (
                <IconButton
                  onClick={() => navigate(-1)}
                  icon={() => <LeftOutlined className="text-xs" />}
                />
              )}
            </div>
          )}
          {(title || description) && (
            <div>
              {title && (
                <h1 className="dark-text font-semibold mb-2 text-base dark:text-gray-300 md:text-lg">
                  {title}
                </h1>
              )}
              {description && (
                <p className="dark-text leading-6 text-sm dark:text-gray-200 md:text-base">
                  {description}
                </p>
              )}
            </div>
          )}
        </div>
      )}
      <div className="relative my-4">
        {loading && (
          <div
            className="container-content absolute top-0 left-0 h-full w-full flex items-center justify-center"
            style={{
              backgroundColor:
                theme === 'dark' ? 'rgba(0, 0, 0, 0.25)' : 'hsla(40, 100%, 95%, 0.7)',
            }}
          >
            <Spin spinning className="text-secondary-500" size="large" />
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

export default Container;
