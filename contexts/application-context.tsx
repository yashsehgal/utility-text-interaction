import { createContext } from 'react';

export type InteractionState = 'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR';

export type UIStateType = {
  responseInteractionState: InteractionState;
  suggestionBlockInteractionState: InteractionState;
  interactableResponseString: string;
};

export type ApplicationContextType = {
  messageInput: string;
  setMessageInput: React.Dispatch<React.SetStateAction<string>>;
  UIState: UIStateType;
  setUIState: React.Dispatch<React.SetStateAction<UIStateType>>;
};

export const INITIAL_APP_CONTEXT_DATA: ApplicationContextType = {
  messageInput: '',
  setMessageInput: () => {},
  UIState: {
    responseInteractionState: 'IDLE',
    suggestionBlockInteractionState: 'IDLE',
    interactableResponseString:
      'Resuls for <[DROPDOWN](default=all)(options=tony,bruce,steve,peter)> for projects with file name <[INPUT](placeholder=file name)(defaultValue=new yeat 2024 template)>',
  },
  setUIState: () => {},
};

export const ApplicationContext = createContext<ApplicationContextType>({
  ...INITIAL_APP_CONTEXT_DATA,
});
