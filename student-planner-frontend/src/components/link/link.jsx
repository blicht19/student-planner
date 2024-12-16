import { Link as ReactRouterLink } from 'react-router-dom';
import styles from './link.module.css';

/**
 * Wrapper for a React Router Link with added CSS styling
 * @param {Object} props props
 * @param {string} props.to The URL that this link should navigate to
 * @param {string} props.text The text display for this link
 * @param {string} [props.className] An optional CSS class name
 * @returns {JSX.Element}
 * @constructor
 */
export const Link = props => {
  const { to, text, className } = props;

  return (
    <ReactRouterLink to={to} className={`${styles.link} ${className}`}>
      {text}
    </ReactRouterLink>
  );
};
