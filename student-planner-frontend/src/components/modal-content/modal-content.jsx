import { ModalMenu } from './modal-menu';
import { ModalForm } from './modal-form/modal-form.jsx';
import { useModalContext } from '../../hooks';

export const ModalContent = () => {
  const { itemType } = useModalContext();

  return (
    <>
      {itemType === '' && <ModalMenu />}
      {itemType !== '' && <ModalForm />}
    </>
  );
};
