import { modalMenuOptions } from '../modal-menu-options.js';
import styles from './modal-menu.module.css';

export const ModalMenu = props => {
  const { onClick } = props;
  return (
    <div className={styles.modalMenu}>
      {Object.values(modalMenuOptions).map(menuOption => {
        return (
          <li
            onClick={() => {
              onClick(menuOption);
            }}
            key={menuOption}
            className={styles.modalMenuItem}
          >
            {menuOption}
          </li>
        );
      })}
    </div>
  );
};
