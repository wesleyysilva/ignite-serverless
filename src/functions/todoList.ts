import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../utils/dynamodbClient";

export const handler: APIGatewayProxyHandler = async (event) => {

	const user_id = event.pathParameters.user_id;

	console.log(user_id);

	const response = await document.scan({
		TableName: 'todos',
		FilterExpression: 'user_id = :id',
		ExpressionAttributeValues: {
			':id': String(user_id)
		}
	}).promise();

	return {
		statusCode: 201,
		body: JSON.stringify(response.Items)
	};
};