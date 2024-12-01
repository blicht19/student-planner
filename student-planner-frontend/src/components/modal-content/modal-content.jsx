import { useState } from 'react';
import { ModalMenu } from './modal-menu';
import { ModalForm } from './modal-form/modal-form.jsx';

export const ModalContent = props => {
  const { edit = false, itemType = '' } = props;
  const [selectedItemType, setSelectedItemType] = useState(itemType);

  return (
    <>
      {selectedItemType === '' && <ModalMenu onClick={setSelectedItemType} />}
      {selectedItemType !== '' && (
        <ModalForm edit={edit} itemType={selectedItemType} />
      )}
    </>
  );
};
