import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ConfirmDialogProps {
    dialogTitle: string;
    dialogDescription: React.ReactNode;
    children?: React.ReactNode;
    confirmText?: string; // Optional text for the confirmation button
    cancelText?: string; // Optional text for the cancellation button
    confirmAction?: () => void; // Optional action to perform on confirmation
    cancelAction?: () => void; // Optional action to perform on cancellation
}

const ConfirmDialog = ({
    dialogTitle,
    dialogDescription,
    children,
    confirmText = "Continue", // Default text for confirmation button
    cancelText = "Cancel", // Default text for cancellation button
    confirmAction = () => {},
    cancelAction = () => {},
}: ConfirmDialogProps) => {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{dialogTitle}</AlertDialogTitle>
                    <AlertDialogDescription>{dialogDescription}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction
                        onClick={() => {
                            confirmAction();
                        }}
                    >
                        {confirmText}
                    </AlertDialogAction>
                    <AlertDialogCancel
                        onClick={() => {
                            cancelAction();
                        }}
                    >
                        {cancelText}
                    </AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
export default ConfirmDialog;
