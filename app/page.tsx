import { MessageInput } from '@/components/message-input';

const Home = () => {
  return (
    <div className="home">
      <div className="absolute w-full h-auto top-12 left-12">
        <MessageInput />
      </div>
    </div>
  );
};

export default Home;
