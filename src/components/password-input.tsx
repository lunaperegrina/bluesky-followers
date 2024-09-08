import * as React from "react";

import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
	const [view, setView] = React.useState<boolean>(false);

	return (
		<div
			className={cn(
				"border-input ring-offset-background focus-within:ring-ring flex h-10 items-center rounded-md border bg-white pl-1 pr-3 text-sm focus-within:ring-1 focus-within:ring-offset-2",
				className,
			)}
		>
			<input
				type={view ? "text" : "password"}
				className={cn(
					"placeholder:text-muted-foreground flex h-10 w-full border border-x-0 p-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
					className,
				)}
				ref={ref}
				{...props}
			/>
			{!view && <Eye className="h-[16px] w-[16px] cursor-pointer" onClick={() => setView(true)} />}
			{view && <EyeOff className="h-[16px] w-[16px] cursor-pointer" onClick={() => setView(false)} />}
		</div>
	);
});
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
