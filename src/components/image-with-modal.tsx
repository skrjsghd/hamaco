"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// Context for sharing dialog state
interface ImageModalContextValue {
  dialogRef: React.RefObject<HTMLDialogElement>;
  open: () => void;
  close: () => void;
}

const ImageModalContext = React.createContext<
  ImageModalContextValue | undefined
>(undefined);

function useImageModal() {
  const context = React.useContext(ImageModalContext);
  if (!context) {
    throw new Error("ImageModal components must be used within ImageModalRoot");
  }
  return context;
}

// Root component that provides context
interface ImageModalRootProps {
  children: React.ReactNode;
}

function ImageModal({ children }: ImageModalRootProps) {
  const dialogRef = React.useRef<HTMLDialogElement>(null);

  const open = React.useCallback(() => {
    dialogRef.current?.showModal();
  }, []);

  const close = React.useCallback(() => {
    dialogRef.current?.close();
  }, []);

  const value = React.useMemo(
    () => ({
      dialogRef: dialogRef as React.RefObject<HTMLDialogElement>,
      open,
      close,
    }),
    [open, close],
  );

  return (
    <ImageModalContext.Provider value={value}>
      {children}
    </ImageModalContext.Provider>
  );
}

// Trigger component
interface ImageModalTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

function ImageModalTrigger({
  children,
  className,
  ...props
}: ImageModalTriggerProps) {
  const { open } = useImageModal();

  return (
    <button type="button" onClick={open} className={className} {...props}>
      {children}
    </button>
  );
}

// Content component (the dialog itself)
interface ImageModalContentProps
  extends React.DialogHTMLAttributes<HTMLDialogElement> {
  children: React.ReactNode;
}

function ImageModalContent({
  children,
  className,
  ...props
}: ImageModalContentProps) {
  const { dialogRef, close } = useImageModal();

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const rect = dialog.getBoundingClientRect();
    const isInDialog =
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width;

    if (!isInDialog) {
      close();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDialogElement>) => {
    if (e.key === "Escape") {
      close();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      className={cn(
        "backdrop:bg-black/80 bg-transparent p-0 max-h-[90vh] max-w-[100vw] -translate-y-1/2 top-1/2 backdrop:backdrop-blur-sm left-1/2 -translate-x-1/2",
        className,
      )}
      {...props}
    >
      {children}
    </dialog>
  );
}

// Close button component
interface ImageModalCloseProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

function ImageModalClose({
  children,
  className,
  ...props
}: ImageModalCloseProps) {
  const { close } = useImageModal();

  return (
    <button type="button" onClick={close} className={className} {...props}>
      {children}
    </button>
  );
}

export {
  ImageModal,
  ImageModalTrigger,
  ImageModalContent,
  ImageModalClose,
  useImageModal,
};
