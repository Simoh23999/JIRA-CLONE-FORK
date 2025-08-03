import { useMedia } from "react-use";
import { DialogContent, Dialog } from "./ui/dialog";
import { Drawer, DrawerContent } from "./ui/drawer";
import { DialogTitle } from "@radix-ui/react-dialog";

export function ResponsiveModal({
	children,
	open,
	onOpenChange,
}: {
	children: React.ReactNode;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const isDesktop = useMedia("(min-width: 1024px)");

	if (isDesktop) {
		return (
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogTitle className="sr-only">
				</DialogTitle>
				<DialogContent className="w-full sm:max-w-lg p-0 border-none overflow-y-auto hide-scrollbar max-h-[85vh]">
					{children}
				</DialogContent>
			</Dialog>
			
		);
	}
	return (
		<Drawer open={open} onOpenChange={onOpenChange}>
			<DialogTitle></DialogTitle>
			<DrawerContent>
				<div className="overflow-y-auto hide-scrollbar max-h-[85vh]">
				{children}
				</div>
			</DrawerContent>
		</Drawer>
	);
}
