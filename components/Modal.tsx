"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { createPortal } from "react-dom";

// ─── 컨텍스트 ─────────────────────────────────────────────────────────────────

type ModalContextType = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const ModalContext = createContext<ModalContextType | null>(null);

export function useModalContext(): ModalContextType {
  const ctx = useContext(ModalContext);
  if (!ctx) {
    throw new Error("Modal 서브 컴포넌트는 <Modal> 내부에서만 사용할 수 있습니다.");
  }
  return ctx;
}

// ─── Root ─────────────────────────────────────────────────────────────────────

type ModalRootProps = {
  children: React.ReactNode;
  defaultOpen?: boolean;
};

function ModalRoot({ children, defaultOpen = false }: ModalRootProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <ModalContext.Provider value={{ isOpen, open, close }}>
      {children}
    </ModalContext.Provider>
  );
}

// ─── Trigger ──────────────────────────────────────────────────────────────────

type ModalTriggerProps = {
  children: React.ReactNode;
  /** true면 children을 래핑하지 않고 onClick을 주입합니다 */
  asChild?: boolean;
};

function ModalTrigger({ children, asChild = false }: ModalTriggerProps) {
  const { open } = useModalContext();

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<{
      onClick?: React.MouseEventHandler;
    }>;
    return React.cloneElement(child, {
      onClick: (e: React.MouseEvent) => {
        child.props.onClick?.(e);
        open();
      },
    });
  }

  return (
    <button type="button" onClick={open}>
      {children}
    </button>
  );
}

// ─── Overlay ──────────────────────────────────────────────────────────────────

function ModalOverlay() {
  const { isOpen, close } = useModalContext();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={close}
      aria-hidden="true"
    />,
    document.body
  );
}

// ─── Content ──────────────────────────────────────────────────────────────────

type ModalContentProps = {
  children: React.ReactNode;
  className?: string;
};

function ModalContent({ children, className = "" }: ModalContentProps) {
  const { isOpen, close } = useModalContext();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ESC 키로 닫기
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, close]);

  // 배경 스크롤 잠금
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className={[
          "relative w-full max-w-sm max-h-[90vh] overflow-y-auto",
          "bg-white rounded-3xl shadow-2xl animate-slide-up",
          className,
        ].join(" ")}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

// ─── Close ────────────────────────────────────────────────────────────────────

type ModalCloseProps = {
  children?: React.ReactNode;
  className?: string;
};

function ModalClose({ children, className = "" }: ModalCloseProps) {
  const { close } = useModalContext();

  return (
    <button
      type="button"
      onClick={close}
      aria-label="모달 닫기"
      className={className}
    >
      {children ?? (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      )}
    </button>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────

type ModalHeaderProps = {
  children: React.ReactNode;
  className?: string;
};

function ModalHeader({ children, className = "" }: ModalHeaderProps) {
  return <div className={className}>{children}</div>;
}

// ─── Body ─────────────────────────────────────────────────────────────────────

type ModalBodyProps = {
  children: React.ReactNode;
  className?: string;
};

function ModalBody({ children, className = "" }: ModalBodyProps) {
  return <div className={className}>{children}</div>;
}

// ─── 복합 컴포넌트 조합 ───────────────────────────────────────────────────────

export const Modal = Object.assign(ModalRoot, {
  Trigger: ModalTrigger,
  Overlay: ModalOverlay,
  Content: ModalContent,
  Close: ModalClose,
  Header: ModalHeader,
  Body: ModalBody,
});
