"use client";

import { AtSign } from "lucide-react";
import type { ComponentProps } from "react";
import { Input } from "./ui/input";

interface UsernameInputProps extends ComponentProps<"input"> {}

export function UsernameInput({ ...props }: UsernameInputProps) {
	return (
		<div className="relative">
			<AtSign className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
			<Input className="w-full bg-white shadow-none appearance-none pl-8" {...props} />
		</div>
	);
}
