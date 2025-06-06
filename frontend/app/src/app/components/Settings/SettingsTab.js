// components/Settings/SettingsTab.js
"use client";
import { motion } from 'framer-motion';
import clsx from 'clsx';

export default function SettingsTab({ tab, activeTab, setActiveTab }) {
  const { id, label, icon: Icon } = tab;
  return (
    <button
      onClick={() => setActiveTab(id)}
      className={clsx(
        "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative",
        activeTab === id ? "text-orange-400" : "text-slate-400 hover:text-white"
      )}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
      {activeTab === id && (
        <motion.div
          layoutId="active-settings-tab-underline"
          className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-orange-500 rounded-full"
        />
      )}
    </button>
  );
}