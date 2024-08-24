import { InteractableText } from '@/components/interactable-text';
import { MessageInput } from '@/components/message-input';

const Home = () => {
  return (
    <div className="home flex items-center justify-center h-screen w-full">
      <div className="space-y-12">
        <div className="flex flex-row items-center justify-end w-[90%]">
          <div className="font-medium w-[36ch] text-right border-b-4 border-black border-t-2 border-x-2 p-4 rounded-xl bg-neutral-100">
            show me all projects with their respective teammates assigned.for
            "new year 2024 template" sprint.
          </div>
        </div>
        <InteractableText />
        <MessageInput />
      </div>
    </div>
  );
};

export default Home;
