"use client";

import { Area, AreaChart, CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";

interface FollowData {
	userId: string;
	metricDate: string;
	followers: number;
	following: number;
	notFollowingBack: number;
}

// const chartData = [
//   { month: "January", desktop: 186, mobile: 80 },
//   { month: "February", desktop: 305, mobile: 200 },
//   { month: "March", desktop: 237, mobile: 120 },
//   { month: "April", desktop: 73, mobile: 190 },
//   { month: "May", desktop: 209, mobile: 130 },
//   { month: "June", desktop: 214, mobile: 140 },
//   { month: "June", desktop: 214, mobile: 140 },
// ]

const chartConfig = {
	followers: {
		label: "followers",
		color: "hsl(var(--chart-2))",
	},
	following: {
		label: "following",
		color: "hsl(var(--chart-1))",
	},
} satisfies ChartConfig;

export function FollowersChart({
	chartData,
}: {
	chartData: FollowData[];
}) {
	return (
		<Card>
			<CardHeader>
				{/* {JSON.stringify(chartData, null, 2)} */}
				<CardTitle>Followers chart</CardTitle>
				{/* <CardDescription>January - June 2024</CardDescription> */}
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig} className="h-60 w-full">
					<AreaChart
						accessibilityLayer
						data={chartData}
						margin={{
							top: 20,
							left: 12,
							right: 12,
						}}
						// style={{ height: "100px" }}
					>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="MetricDate"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							tickFormatter={(value) => value.slice(0, 3)}
						/>
						<ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />

						<Area
							dataKey="followers"
							type="monotone"
							fill={chartConfig.followers.color}
							fillOpacity={0.4}
							stroke={chartConfig.followers.color}
							stackId="followersStack" // Definindo um stackId único para "Followers"
							dot={{
								fill: chartConfig.followers.color,
							}}
							activeDot={{
								r: 6,
							}}
						>
							<LabelList position="top" offset={12} className="fill-foreground" fontSize={12} />
						</Area>

						<Area
							dataKey="following"
							type="monotone"
							fill={chartConfig.following.color}
							fillOpacity={0.4}
							stroke={chartConfig.following.color}
							stackId="followingStack" // Definindo um stackId único para "Following"
							dot={{
								fill: chartConfig.following.color,
							}}
							activeDot={{
								r: 6,
							}}
						>
							<LabelList position="top" offset={12} className="fill-foreground" fontSize={12} />
						</Area>

						<ChartLegend content={<ChartLegendContent />} />
					</AreaChart>
				</ChartContainer>
			</CardContent>
			{/* <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter> */}
		</Card>
	);
}
