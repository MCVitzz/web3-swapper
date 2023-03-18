import { useCallback, useState } from "react";

const useToggle = (initialValue?: boolean) => {
  const [isOpen, setIsOpen] = useState(initialValue || false);

  const toggle = useCallback(() => {
    setIsOpen((value) => !value);
  }, [setIsOpen]);

  const onOpen = useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  const onClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  return {
    isOpen,
    toggle,
    onOpen,
    onClose,
  } as const;
};

export default useToggle;
