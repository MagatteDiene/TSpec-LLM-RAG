import { useState } from 'react';
import { sendAskRequest } from '../api/chatApi';

const useChat = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Bonjour ! Je suis votre assistant télécom 3GPP spécialisé, basé sur le dataset TSpec-LLM. Comment puis-je vous aider aujourd'hui ?",
            isBot: true,
            sources: []
        }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const [error, setError] = useState(null);

    const sendMessage = async (text) => {
        if (!text.trim()) return;

        // Ajouter le message utilisateur
        const userMsg = {
            id: Date.now(),
            text,
            isBot: false,
            sources: []
        };

        setMessages(prev => [...prev, userMsg]);
        setIsTyping(true);
        setError(null);

        try {
            const data = await sendAskRequest(text);

            const botMsg = {
                id: Date.now() + 1,
                text: data.answer || "Désolé, je n'ai pas pu formuler de réponse.",
                isBot: true,
                sources: data.sources || []
            };

            setMessages(prev => [...prev, botMsg]);
        } catch (err) {
            setError("Impossible de joindre le serveur. Vérifiez que le Backend FastAPI est bien lancé.");
            console.error(err);
        } finally {
            setIsTyping(false);
        }
    };

    return {
        messages,
        isTyping,
        error,
        sendMessage
    };
};

export default useChat;
