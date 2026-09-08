import React from 'react';
import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WhatsAppButton() {
  return (
    <motion.a
      href="https://wa.me/31614966756"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat met DENRA via WhatsApp"
          className="fixed bottom-4 right-4 z-30 h-14 w-14 bg-[#e7dfd2] border border-[#5c5147]/16 rounded-sm flex items-center justify-center hover:border-[#5c5147]/32 hover:scale-105 transition-all duration-300 sm:bottom-6 sm:right-6"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5, type: 'spring', stiffness: 200 }}
    >
          <MessageCircle size={26} className="text-[#3c342c]" />
    </motion.a>
  );
}