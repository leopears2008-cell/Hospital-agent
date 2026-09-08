import React from 'react';
import { SignIn, SignUp } from '@clerk/react';
import {
  Dialog,
  DialogContent,
} from './ui/dialog';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: 'login' | 'signup';
}

export function AuthModal({ isOpen, onClose, initialView = 'login' }: AuthModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md w-full p-0 border-0 bg-transparent shadow-none [&>button]:hidden">
        <div className="flex justify-center w-full">
          {initialView === 'login' ? (
            <SignIn routing="virtual" />
          ) : (
            <SignUp routing="virtual" />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
