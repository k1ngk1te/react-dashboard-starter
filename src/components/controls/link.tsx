import { Link as RouterLink, LinkProps } from 'react-router-dom';

type LinkType = Omit<LinkProps, 'to'> & {
  href?: string | null;
  to?: string | null;
};

function Link({ href, to, ...props }: LinkType) {
  return <RouterLink to={to || href || '#'} {...props} />;
}

export default Link;
