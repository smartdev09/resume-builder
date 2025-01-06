'use client'

import ResumePreview from "../../../components/ResumePreview";
import { Button } from "@resume/ui/button";
import { useToast } from "@resume/ui/hooks/use-toast";
import { ResumeServerData } from "utils/types"
import { mapToResumeValues } from "utils/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@resume/ui/dropdown-menu";
import { formatDate } from "date-fns";
import { MoreVertical, Printer, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRef, useState, useTransition } from "react";
import { deleteResume } from "./actions";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@resume/ui/dialog";
import { DialogFooter, DialogHeader } from "@resume/ui/dialog";
import { useReactToPrint } from "react-to-print"
import LoadingButton from "components/LoadingButton";

interface ResumeItemProps {
    resume: ResumeServerData
}

export default function ResumeItem({resume}: ResumeItemProps) {
    const contentRef = useRef<HTMLDivElement>(null);

    const reactToPrintFn = useReactToPrint({
        contentRef,
        documentTitle: resume.title || "Resume"
    });

    const wasUpdated = resume.updatedAt !== resume.createdAt;

    return (
        <div className="group relative border rounded-lg border-transparent hover:border-border transition-color bg-secondary p-3">
            <div className="space-y-3">
                <Link 
                    href={`/editor?resumeId=${resume.id}`} 
                    className="inline-block w-full text-center"
                >
                    <p className="font-semibold line-clamp-1">
                        {resume.title || "No title"}
                    </p>
                    {resume.description && (
                        <p className="line-clamp-2 text-sm">{resume.description}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                        {wasUpdated ? "Updated" : "Created"} on{" "}
                        {formatDate(resume.updatedAt, "MMM d, yyyy h:mm a")}
                    </p>
                </Link>
                <Link 
                    href={`/editor?resumeId=${resume.id}`} 
                    className="relative inline-block w-full"
                >
                    <ResumePreview 
                        resumeData={mapToResumeValues(resume)}
                        contentRef={contentRef}
                        className="overflow-hidden shadow-sm grouo-hover:shadow-lg transition-shadow"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
                </Link>
            </div>
            <MoreMenu resumeId={resume.id} onPrintClick={reactToPrintFn} />
        </div>
    )
} 


interface MoreMenuProps {
    resumeId: string;
    onPrintClick: () => void;
}

function MoreMenu({ resumeId, onPrintClick } : MoreMenuProps) {
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-0.5 top-0.5 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                        <MoreVertical className="size-4"></MoreVertical>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem
                        className="flex items-center gap-2"
                        onClick={() => setShowDeleteConfirmation(true)}
                    >
                        <Trash2 className="size-4">
                            Delete
                        </Trash2>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="flex items-center gap-2"
                        onClick={onPrintClick}
                    >
                        <Printer className="size-4">
                            Print
                        </Printer>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <DeleteConfirmationDialog 
                resumeId={resumeId}
                open={showDeleteConfirmation}
                onOpenChange={setShowDeleteConfirmation}
            />
        </>
    )
}

interface DeleteConfirmationDialogProps {
    resumeId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

function DeleteConfirmationDialog({ resumeId, open, onOpenChange } : DeleteConfirmationDialogProps) {
    const { toast } = useToast();
    
    const [isPending, startTransition] = useTransition();

    async function handleDelete() {
        startTransition(async () => {
            try {
                await deleteResume(resumeId);
                onOpenChange(false);
            } catch (error) {
                toast({
                    variant: "destructive",
                    description: "Something went wrong"
                })
            }
        })
    }
    return(
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete resume?</DialogTitle>
                    <DialogDescription>This will permanently delete resume</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <LoadingButton variant="destructive" onClick={handleDelete} loading={isPending}>Delete</LoadingButton>
                    <Button variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}