import { Conversation, Message, User } from '@prisma/client';

// Create a type for the user object
export type FullMessageType = Message & {
	// Add a sender property to the message object
	sender: User;
	// Add a seen property to the message object
	seen: User[];
};

// Create a type for the conversation object
export type FullConversationType = Conversation & {
	// Add a users property to the conversation object
	users: User[];
	// Add a messages property to the conversation object
	messages: FullMessageType[];
};
