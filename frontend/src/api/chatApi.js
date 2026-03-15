export const sendAskRequest = async (question) => {
    try {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        const response = await fetch(`${baseUrl}/api/v1/chat/ask`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question }),
        });

        if (!response.ok) {
            // Fallback or error checking
            if (response.status === 404) {
                // Check if the old route is still used
                const resOld = await fetch(`${baseUrl}/ask`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ question })
                });
                if (resOld.ok) return await resOld.json();
            }
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Erreur d'API:", error);
        throw error;
    }
};
