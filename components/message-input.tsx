'use client';
import { cn, TABLER_CONFIG } from '@/utils/general';
import {
  IconArrowUp,
  IconCornerDownLeft,
  IconPaperclip,
} from '@tabler/icons-react';
import { ChangeEvent, useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { ApplicationContext } from '@/contexts/application-context';

const MessageInput = () => {
  const { messageInput, setMessageInput } = useContext(ApplicationContext);
  const [focus, setFocus] = useState<boolean>(false);

  const handleMessageChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessageInput(e.target.value as string);
  };

  const handleMessageInputFocus = () => setFocus(true);
  const handleMessageInputBlur = () => setFocus(false);

  return (
    <div className="w-[90%] space-y-4">
      <div
        className={cn(
          'message-input border-b-4 border-t-2 border-x-2 rounded-xl overflow-hidden transition-all',
          focus ? 'ring-4' : '',
        )}>
        <textarea
          placeholder="Ask anything..."
          className="text-lg p-4 focus:outline-none w-full resize-none h-[80px]"
          onBlur={handleMessageInputBlur}
          onFocus={handleMessageInputFocus}
          onChange={handleMessageChange}
          value={messageInput}
        />
        <div className="p-4 border-t bg-neutral-50 flex items-center justify-between gap-2">
          <button className="px-4 py-2 bg-white border-b-4 border-t-2 border-x-2 border-black rounded-lg flex items-center justify-center gap-2 text-sm hover:brightness-95 active:brightness-90 active:border-b focus:ring focus:outline-none transition-all">
            <IconPaperclip {...TABLER_CONFIG} /> Attach files
          </button>
          {messageInput.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.2 }}
              animate={{ opacity: 1, scale: 1 }}>
              <button className="p-2 bg-blue-500 text-white border-b-4 border-t-2 border-x-2 border-blue-800 rounded-lg flex items-center justify-center gap-2 text-sm hover:brightness-95 active:brightness-90 focus:ring focus:outline-none transition-all">
                <IconArrowUp strokeWidth={2.5} size={16} />
              </button>
            </motion.div>
          ) : (
            <div />
          )}
        </div>
      </div>
      <div className="flex items-center justify-end h-12">
        {messageInput.length > 0 && (
          <motion.p
            className="flex items-center justify-end gap-2 text-sm text-neutral-400"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}>
            <IconCornerDownLeft {...TABLER_CONFIG} /> Press <kbd>shift</kbd> +
            <kbd>enter</kbd> to chat
          </motion.p>
        )}
      </div>
    </div>
  );
};

export { MessageInput };

// show me all projects with their respective teammates assigned.for "new year 2024 template" sprint.
