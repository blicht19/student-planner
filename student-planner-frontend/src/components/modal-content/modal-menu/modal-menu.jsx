import { modalMenuOptions } from '../modal-menu-options.js';
import styles from './modal-menu.module.css';
import { useModalContext } from '../../../hooks';

/**
 * Displayed in the modal when the plus button is clicked to allow the user to choose what type of item to create
 * @returns {JSX.Element}
 * @constructor
 */
export const ModalMenu = () => {
  const { setItemType } = useModalContext();
  return (
    <div className={styles.modalMenu}>
      {Object.values(modalMenuOptions).map(menuOption => {
        return (
          <li
            onClick={() => {
              setItemType(menuOption);
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
