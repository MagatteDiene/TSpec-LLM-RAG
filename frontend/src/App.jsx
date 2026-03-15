import React from 'react';
import MainLayout from './components/layout/MainLayout';
import ChatContainer from './components/chat/ChatContainer';
import useChat from './hooks/useChat';

function App() {
    const chatProps = useChat();

    return (
        <MainLayout>
            <ChatContainer {...chatProps} />
        </MainLayout>
    );
}

export default App;
