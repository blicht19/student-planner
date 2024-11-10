import { Link as ReactRouterLink } from 'react-router-dom';
import styles from './link.module.css';

export const Link = props => {
  const { to, text, className } = props;

  return (
    <ReactRouterLink
      to={to}
      className={`${styles.link} ${className}`}
      {...props}
    >
      {text}
    </ReactRouterLink>
  );
};
