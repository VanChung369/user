"use client";
// import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useModal } from "./useModal";

export const useWarnIfUnsavedChanges = (unsavedChanges: boolean) => {
  const [isShow, setIsShow] = useState(false);
  const message = "You have unsaved change. Do you want to leaved?";
  useEffect(() => {
    const beforeunload = (e: any) => {
      if (unsavedChanges) {
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };

    window.addEventListener("beforeunload", beforeunload);

    return () => {
      window.removeEventListener("beforeunload", beforeunload);
    };
  }, [unsavedChanges, isShow]);

  return { isShow, setIsShow };
};

export const useWarnModalPage = (url: string) => {
  // const router = useRouter();
  const {
    visible: visibleModalUnsaved,
    onOpenModal: onOpenModalUnsaved,
    onCloseModal: onCloseModalUnsaved,
  } = useModal();

  const [clickBackBtn, setClickBackBtn] = useState(false);
  const [clickDiscardBtn, setClickDiscardBtn] = useState(false);
  const [clickSaveBtn, setClickSaveBtn] = useState(false);
  const [valueChange, setValueChange] = useState(false);

  const { isShow, setIsShow } = useWarnIfUnsavedChanges(valueChange);

  useEffect(() => {
    if (clickBackBtn || isShow || clickDiscardBtn) {
      if (valueChange) {
        onOpenModalUnsaved();
      } else {
        // router.push(url);
      }
    }
  }, [isShow, clickBackBtn, clickDiscardBtn]);

  const onBackClick = () => setClickBackBtn(true);

  const onDiscard = () => setClickDiscardBtn(true);

  const afterCloseModalUnsaved = () => {
    setClickBackBtn(false);
    setClickDiscardBtn(false);
    setIsShow(false);
  };

  return {
    visibleModalUnsaved,
    onOpenModalUnsaved,
    onCloseModalUnsaved,
    onBackClick,
    onDiscard,
    afterCloseModalUnsaved,
    setClickSaveBtn,
    setValueChange,
    valueChange,
    clickBackBtn,
    clickDiscardBtn,
    clickSaveBtn,
  };
};
