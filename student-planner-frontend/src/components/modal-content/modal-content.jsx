import { ModalMenu } from './modal-menu';
import { ModalForm } from './modal-form/modal-form.jsx';
import { useModalContext } from '../../hooks';

/**
 * Either displays a form for creating/updating an item if an item type is selected or a menu for choosing which type of item to create
 * @returns {JSX.Element}
 * @constructor
 */
export const ModalContent = () => {
  const { itemType } = useModalContext();

  return (
    <>
      {itemType === '' && <ModalMenu />}
      {itemType !== '' && <ModalForm />}
    </>
  );
};
