import { Button, Tooltip } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

import type { ButtonProps } from 'antd';

export type TableActionType = ButtonProps & {
  container?: React.ComponentType<any>;
  keepButtonContainer?: boolean;
  title?: string;
  href?: string;
  icon: () => JSX.Element;
  color?: ColorType;
};

export type TableActionComponentType = {
  component: React.ComponentType<unknown>;
  title?: string;
};

type ColorType = 'success' | 'error' | 'warning' | 'info' | 'primary';

function getColor(color: ColorType | undefined) {
  switch (color) {
    case 'success':
      return 'text-green-600';
    case 'error':
      return 'text-red-600';
    case 'info':
      return 'text-gray-600';
    case 'warning':
      return 'text-yellow-600';
    case 'primary':
      return 'text-primary-500';
    default:
      return 'text-primary-500';
  }
}

export function TableActionsCell({
  actions,
}: {
  actions: (TableActionType | TableActionComponentType | null)[];
}) {
  const ctas = React.useMemo(() => actions.filter((item) => item !== null), [actions]);

  return (
    <div className="flex items-center whitespace-nowrap">
      {(ctas as TableActionType[]).map((action, index: number) => {
        if ('component' in action) {
          const { component: Action, title = 'Button' } = action as TableActionComponentType;
          return (
            <span className="px-2" key={index}>
              <Tooltip title={title || 'Button'}>
                <div>
                  <Action />
                </div>
              </Tooltip>
            </span>
          );
        }
        const {
          container: Container,
          keepButtonContainer = true,
          title,
          href,
          icon: Icon,
          color,
          ...props
        } = action;
        return (
          <span className="px-2" key={index}>
            <Tooltip title={title || 'Button'}>
              <div>
                {Container ? (
                  keepButtonContainer ? (
                    <Container>
                      <Button shape="circle" type="default" {...props}>
                        <span className={`${getColor(color)} text-sm md:text-base`}>
                          <Icon />
                        </span>
                      </Button>
                    </Container>
                  ) : (
                    <Container>
                      <span className={`${getColor(color)} text-sm md:text-base`}>
                        <Icon />
                      </span>
                    </Container>
                  )
                ) : href ? (
                  <Link to={href}>
                    <Button shape="circle" type="default" {...props}>
                      <span className={`${getColor(color)} text-sm md:text-base`}>
                        <Icon />
                      </span>
                    </Button>
                  </Link>
                ) : (
                  <Button shape="circle" type="default" {...props}>
                    <span className={`${getColor(color)} text-sm md:text-base`}>
                      <Icon />
                    </span>
                  </Button>
                )}
              </div>
            </Tooltip>
          </span>
        );
      })}
    </div>
  );
}

export function TableAvatarTitleSubCell({
  icon: Icon,
  image,
  subtitle,
  title,
}: {
  image?: string;
  icon?: React.ComponentType<any>;
  title: string;
  subtitle?: React.ReactNode;
}) {
  return (
    <div className="table-avatar-title-sub-cell">
      {image ? (
        <section className="table-avatar-title-sub-cell-image">
          <div>
            <img alt={title} src={image} />
          </div>
        </section>
      ) : Icon ? (
        <span className="table-avatar-title-sub-cell-image-placeholder">
          <Icon />
        </span>
      ) : (
        <span className="table-avatar-title-sub-cell-image-placeholder image-icon">
          <span>{title[0]}</span>
        </span>
      )}
      <section className="table-avatar-title-sub-cell-title">
        <p className="title">{title}</p>
        <p className="subtitle">{subtitle}</p>
      </section>
    </div>
  );
}
