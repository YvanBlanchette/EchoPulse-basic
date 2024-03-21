interface IParams {
	conversationId: string;
}

const ConversationId = async ({ params }: { params: IParams }) => {
	return (
		<div>
			<h1>ConversationId</h1>
		</div>
	);
};

export default ConversationId;
