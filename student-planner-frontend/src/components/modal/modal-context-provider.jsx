import { useCallback, useState } from 'react';
import { modalContext } from '../../hooks';

export const ModalContextProvider = ({ children }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [item, setItem] = useState({});
  const [itemType, setItemType] = useState('');

  const clearItem = useCallback(() => {
    setItem({});
  }, []);

  const updateItemProperty = useCallback((key, value) => {
    setItem(previousItem => {
      const newItem = { ...previousItem };
      newItem[key] = value;
      return newItem;
    });
  }, []);

  const openNewItemModal = useCallback(() => {
    setEditMode(false);
    setItemType('');
    clearItem();
    setModalVisible(true);
  }, [clearItem]);

  const openEditModal = useCallback((itemType, existingItem) => {
    setEditMode(true);
    setItem(existingItem);
    setItemType(itemType);
    setModalVisible(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalVisible(false);
    clearItem();
    setItemType('');
  }, [clearItem]);

  return (
    <modalContext.Provider
      value={{
        modalVisible,
        editMode,
        item,
        setItem,
        updateItemProperty,
        openNewItemModal,
        openEditModal,
        closeModal,
        itemType,
        setItemType,
      }}
    >
      {children}
    </modalContext.Provider>
  );
};
