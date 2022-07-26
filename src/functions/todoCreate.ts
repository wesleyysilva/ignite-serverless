import { APIGatewayProxyHandler } from "aws-lambda";
import { randomUUID } from "crypto";
import { document } from "../utils/dynamodbClient";

interface ICreateTodo {
	id: string;
	title: string;
	done: boolean;
}

export const handler: APIGatewayProxyHandler = async (event) => {

	const id = randomUUID();
	const user_id = event.pathParameters.user_id;

	const { title, done } = JSON.parse(event.body) as ICreateTodo;

	await document.put({
		TableName: 'todos',
		Item: {
			id,
			user_id,
			title,
			done,
			deadline: new Date().getTime()
		}
	}).promise();

	const response = await document.query({

		TableName: 'todos',
		KeyConditionExpression: 'id = :id',
		ExpressionAttributeValues: {
			':id': id
		}
	}).promise();

	return {
		statusCode: 201,
		body: JSON.stringify(response.Items[0])
	};
};