"use client";
import { Dispatch, SetStateAction, useState } from "react";

export const useModal = (
  defaultState = false
): {
  visible: boolean;
  onOpenModal: () => void;
  onCloseModal: () => void;
  onToggleModal: () => void;
  setVisible: Dispatch<SetStateAction<boolean>>;
} => {
  const [visible, setVisible] = useState(defaultState);

  const onOpenModal = () => setVisible(true);

  const onCloseModal = () => setVisible(false);

  const onToggleModal = () => setVisible(!visible);

  return {
    visible,
    onOpenModal,
    onCloseModal,
    setVisible,
    onToggleModal,
  };
};
