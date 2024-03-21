import { useParams } from 'next/navigation';
import { useMemo } from 'react';

// This hook returns the current conversation ID
const useConversation = () => {
	// Get the current URL
	const params = useParams();

	// Get the conversation ID from the URL:
	const conversationId = useMemo(() => {
		// If there is no conversation ID in the URL...
		if (!params?.conversationId) {
			// return an empty string.
			return '';
		}

		// Otherwise, return the conversation ID
		return params.conversationId as string;
	}, [params?.conversationId]);

	// Define whether the conversation is open
	const isOpen = useMemo(() => !!conversationId, [conversationId]);

	// Return the conversation ID and whether the conversation is open
	return useMemo(
		() => ({
			isOpen,
			conversationId,
		}),
		[isOpen, conversationId]
	);
};

export default useConversation;
