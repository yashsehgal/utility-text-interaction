'use client';
import {
  ApplicationContext,
  INITIAL_APP_CONTEXT_DATA,
  UIStateType,
} from '@/contexts/application-context';
import { useState } from 'react';

export default function ApplicationContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [messageInput, setMessageInput] = useState<string>(
    INITIAL_APP_CONTEXT_DATA.messageInput,
  );
  const [UIState, setUIState] = useState<UIStateType>(
    INITIAL_APP_CONTEXT_DATA.UIState,
  );

  const ProviderCollection = {
    messageInput,
    setMessageInput,
    UIState,
    setUIState,
  };

  return (
    <ApplicationContext.Provider value={ProviderCollection}>
      {children}
    </ApplicationContext.Provider>
  );
}
