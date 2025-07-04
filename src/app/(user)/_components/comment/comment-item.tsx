import React, { useCallback, useState } from "react";
import { Edit3, MoreHorizontal, Trash2 } from "lucide-react";

import { formatTimeAgo } from "@/utils/common";
import { Comment } from "@/types/comment.types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ConfirmDialog from "@/app/(user)/_components/confirm-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDeleteCommentMutation, useUpdateCommentMutation } from "@/queries/useVideo";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CommentItemProps {
    comment: Comment;
    videoId?: number | string;
    currentUserId?: number | string;
    onEditStart?: (commentId: string | number) => void;
    onEditEnd?: () => void;
    isEditing?: boolean;
}

const CommentItem = React.memo(
    ({ comment, videoId, currentUserId, onEditStart, onEditEnd, isEditing }: CommentItemProps) => {
        const [editContent, setEditContent] = useState(comment.content);

        const updateCommentMutation = useUpdateCommentMutation();
        const deleteCommentMutation = useDeleteCommentMutation();

        // Check if user owns this comment
        const isOwner = currentUserId && comment.userId === currentUserId;

        // Check if comment is temporary (optimistic)
        const isTempComment = typeof comment.id === "string" && comment.id.startsWith("temp-");

        // Check if comment is new (within 1 minute)
        const isNewComment = Date.now() - new Date(comment.createdAt).getTime() < 60000;

        const timeAgo = formatTimeAgo(comment.createdAt);

        const handleEditSave = useCallback(async () => {
            if (!editContent.trim() || editContent === comment.content) {
                onEditEnd?.();
                return;
            }

            if (isTempComment) {
                console.warn("Cannot edit temporary comment");
                onEditEnd?.();
                return;
            }

            updateCommentMutation.mutate(
                {
                    commentId: comment.id,
                    content: editContent.trim(),
                    videoId: videoId,
                },
                {
                    onSuccess: () => {
                        onEditEnd?.();
                    },
                    onError: (error) => {
                        console.error("Failed to update comment:", error);
                        setEditContent(comment.content);
                    },
                }
            );
        }, [
            editContent,
            comment.content,
            comment.id,
            videoId,
            isTempComment,
            updateCommentMutation,
            onEditEnd,
        ]);

        const handleEditCancel = useCallback(() => {
            setEditContent(comment.content);
            onEditEnd?.();
        }, [comment.content, onEditEnd]);

        const handleDeleteConfirm = useCallback(() => {
            deleteCommentMutation.mutate(
                {
                    commentId: comment.id,
                    videoId: videoId,
                },
                {
                    onError: (error) => {
                        console.error("Failed to delete comment:", error);
                    },
                }
            );
        }, [comment.id, deleteCommentMutation, videoId]);

        const handleEditStart = useCallback(() => {
            if (isTempComment) {
                console.warn("Cannot edit temporary comment");
                return;
            }
            onEditStart?.(comment.id);
        }, [comment.id, isTempComment, onEditStart]);

        return (
            <div className="flex gap-3 group">
                <Avatar className="flex-shrink-0">
                    <AvatarImage
                        src={comment.avatar || "https://via.placeholder.com/40"}
                        alt={comment.username}
                        className="w-8 h-8 rounded-full"
                    />
                    <AvatarFallback className="w-8 h-8 rounded-full bg-gray-600">
                        {comment.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium truncate">{comment.username}</span>
                        <span className="text-xs text-gray-400 flex-shrink-0">{timeAgo}</span>

                        {/* Status indicators */}
                        {isNewComment && (
                            <span className="text-xs bg-white text-black px-1 rounded flex-shrink-0">
                                new
                            </span>
                        )}
                        {isTempComment && (
                            <span className="text-xs bg-yellow-500 text-black px-1 rounded flex-shrink-0">
                                sending...
                            </span>
                        )}
                        {updateCommentMutation.isPending && (
                            <span className="text-xs bg-blue-500 text-white px-1 rounded flex-shrink-0">
                                updating...
                            </span>
                        )}
                        {deleteCommentMutation.isPending && (
                            <span className="text-xs bg-red-500 text-white px-1 rounded flex-shrink-0">
                                deleting...
                            </span>
                        )}
                    </div>

                    {/* Comment content or edit form */}
                    {isEditing ? (
                        <div className="mt-2 space-y-2">
                            <Textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="w-full min-h-[60px] text-sm"
                                disabled={updateCommentMutation.isPending}
                                autoFocus
                            />
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    onClick={handleEditSave}
                                    disabled={
                                        updateCommentMutation.isPending || !editContent.trim()
                                    }
                                    className="text-xs"
                                >
                                    {updateCommentMutation.isPending ? "Saving..." : "Save"}
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={handleEditCancel}
                                    disabled={updateCommentMutation.isPending}
                                    className="text-xs"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-start justify-between mt-1">
                            <p className="text-sm text-gray-300 break-words leading-relaxed flex-1">
                                {comment.content}
                            </p>

                            {/* Action menu */}
                            {isOwner && (
                                <div className="flex-shrink-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                                                disabled={
                                                    isTempComment || deleteCommentMutation.isPending
                                                }
                                            >
                                                <MoreHorizontal size={14} />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-32">
                                            <DropdownMenuItem
                                                onClick={handleEditStart}
                                                disabled={isTempComment}
                                                className="text-xs"
                                            >
                                                <Edit3 size={12} className="mr-2" />
                                                Edit
                                            </DropdownMenuItem>

                                            {/* Delete with ConfirmDialog */}
                                            <ConfirmDialog
                                                dialogTitle="Delete Comment"
                                                dialogDescription={
                                                    <span className="space-y-2 block">
                                                        <span className="block">
                                                            Are you sure you want to delete this
                                                            comment?
                                                        </span>
                                                        <span className="block bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs max-h-16 overflow-y-auto">
                                                            <span className="block text-gray-700 dark:text-gray-300 italic">
                                                                &quot;
                                                                {comment.content.length > 100
                                                                    ? comment.content.substring(
                                                                          0,
                                                                          100
                                                                      ) + "..."
                                                                    : comment.content}
                                                                &quot;
                                                            </span>
                                                        </span>
                                                        <span className="block text-sm text-red-600 dark:text-red-400">
                                                            This action cannot be undone.
                                                        </span>
                                                    </span>
                                                }
                                                confirmText={
                                                    deleteCommentMutation.isPending
                                                        ? "Deleting..."
                                                        : "Delete"
                                                }
                                                cancelText="Cancel"
                                                confirmAction={handleDeleteConfirm}
                                            >
                                                <DropdownMenuItem
                                                    disabled={
                                                        isTempComment ||
                                                        deleteCommentMutation.isPending
                                                    }
                                                    className="text-xs text-red-400"
                                                    onSelect={(e) => e.preventDefault()} // Prevent dropdown from closing
                                                >
                                                    <Trash2 size={12} className="mr-2" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </ConfirmDialog>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }
);

CommentItem.displayName = "CommentItem";

export default CommentItem;
