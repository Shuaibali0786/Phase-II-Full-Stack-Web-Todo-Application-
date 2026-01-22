'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { Modal } from '@/app/components/ui/Modal';
import { Button } from '@/app/components/ui/Button';
import { scaleIn } from '@/lib/animations';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title?: string;
  message?: string;
  itemName?: string;
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Task',
  message = 'Are you sure you want to delete this task? This action cannot be undone.',
  itemName,
}: DeleteConfirmationModalProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch {
      // Error handling is done by parent
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="sm"
      closeOnOverlayClick={!loading}
      showCloseButton={false}
    >
      <motion.div
        variants={scaleIn}
        initial="initial"
        animate="animate"
        className="text-center"
      >
        {/* Warning icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 20,
            delay: 0.1,
          }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-status-error/10 mb-4"
        >
          <AlertTriangle className="w-8 h-8 text-status-error" />
        </motion.div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-text-primary mb-2">
          {title}
        </h3>

        {/* Message */}
        <p className="text-text-secondary mb-2">
          {message}
        </p>

        {/* Item name if provided */}
        {itemName && (
          <p className="text-sm text-text-muted mb-6 px-4 py-2 bg-surface-hover rounded-lg">
            &ldquo;{itemName}&rdquo;
          </p>
        )}

        {/* Actions */}
        <div className="flex justify-center gap-3 mt-6">
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirm}
            loading={loading}
          >
            Delete
          </Button>
        </div>
      </motion.div>
    </Modal>
  );
}

export default DeleteConfirmationModal;
