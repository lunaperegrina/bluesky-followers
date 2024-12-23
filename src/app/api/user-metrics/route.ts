import dynamoClient from "@/lib/aws";
import {
	PutItemCommand,
	type PutItemCommandInput,
	QueryCommand,
	type QueryCommandInput,
} from "@aws-sdk/client-dynamodb";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	try {
		const data = await req.json();
		// const { UserId, StartDate, EndDate } = data;

		// if (!UserId || !StartDate || !EndDate) {
		//   return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
		// }

		const params: QueryCommandInput = {
			TableName: "bluesky-followers",
			// KeyConditionExpression: 'UserId = :userId AND MetricDate BETWEEN :start AND :end',
			// ExpressionAttributeValues: {
			//   ':userId': { S: UserId }, // Assuming UserId is a string
			//   ':start': { S: StartDate.toISOString() }, // Assuming StartDate is a Date object
			//   ':end': { S: EndDate.toISOString() }, // Assuming EndDate is a Date object
			// },
		};

		const command = new QueryCommand(params);

		const result = await dynamoClient.send(command);
		console.log(result);
		dynamoClient.destroy();
		return NextResponse.json(result.Items, { status: 200 });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: "Error fetching data" }, { status: 500 });
	}
}

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { UserId, MetricDate, Followers, Following, NotFollowingBack } = body;

		if (!UserId || !MetricDate || Followers == null || Following == null || NotFollowingBack == null) {
			return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
		}

		console.log(body);

		const params: PutItemCommandInput = {
			TableName: "bluesky-followers",
			Item: {
				UserId: { S: UserId },
				MetricDate: { S: new Date(MetricDate).toISOString().split("T")[0] },
				Followers: { N: Followers.toString() },
				Following: { N: Following.toString() },
				NotFollowingBack: { N: NotFollowingBack.toString() },
			},
		};

		const command = new PutItemCommand(params);
		const result = await dynamoClient.send(command);
		console.log(result);
		dynamoClient.destroy();

		return NextResponse.json({ message: "Data inserted successfully" }, { status: 200 });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: "Error inserting data" }, { status: 500 });
	}
}
