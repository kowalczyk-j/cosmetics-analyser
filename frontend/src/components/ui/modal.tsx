import React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footerButtonLabel?: string;
  onFooterButtonClick?: () => void;
  footerButtonIcon?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footerButtonLabel,
  onFooterButtonClick,
  footerButtonIcon,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg shadow-lg max-w-sm w-full relative">
        <div className="flex justify-between items-center p-6 pb-0">
          <h2 className="text-xl font-bold">{title}</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        <div className="p-6 pt-0">
          <div className="space-y-3 mb-8">{children}</div>
          {footerButtonLabel && onFooterButtonClick && (
            <div className="flex justify-end space-x-2">
              <Button onClick={onFooterButtonClick} className="w-full">
                {footerButtonIcon && (
                  <span className="mr-2">{footerButtonIcon}</span>
                )}
                {footerButtonLabel}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
