// components/Settings/ConfirmModal.js
"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiKey, FiLoader } from 'react-icons/fi';

const inputBase = "w-full px-4 py-3 pl-12 bg-slate-800 text-slate-100 rounded-xl border border-slate-700 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500";
const buttonConfirm = "font-semibold py-2 px-5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg disabled:opacity-50";

export default function ConfirmModal({ isOpen, onClose, onConfirm, isSubmitting }) {
  const [currentPassword, setCurrentPassword] = useState('');

  const handleConfirm = () => {
    onConfirm(currentPassword);
    // Não limpa a senha aqui para que o usuário veja o que digitou em caso de erro.
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md bg-slate-900 rounded-2xl border border-slate-700 p-6 space-y-4"
        >
          <h2 className="text-xl font-bold text-orange-400">Confirmação de Segurança</h2>
          <p className="text-slate-400 text-sm">Para salvar suas alterações, por favor, digite sua senha atual.</p>
          <div>
            <label htmlFor="currentPasswordModal" className="sr-only">Senha Atual</label>
            <div className="relative">
              <FiKey className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                id="currentPasswordModal"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Sua senha atual"
                className={inputBase}
                autoFocus
              />
            </div>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="font-semibold py-2 px-5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200">
              Cancelar
            </button>
            <motion.button
              type="button"
              onClick={handleConfirm}
              disabled={isSubmitting || !currentPassword}
              className={buttonConfirm}
              whileTap={{ scale: 0.95 }}
            >
              {isSubmitting ? <FiLoader className="animate-spin" /> : 'Confirmar e Salvar'}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}