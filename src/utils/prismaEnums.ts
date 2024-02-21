import { $Enums } from "@prisma/client";

export function modLevelToInt(modLevel: $Enums.ModLevel) { // mod badge, request access
    switch (modLevel) {
        case $Enums.ModLevel.None:
            return [0, -1];
        case $Enums.ModLevel.Mod:
            return [1, 1];
        case $Enums.ModLevel.ElderMod:
            return [2, 2];
        case $Enums.ModLevel.ListMod:
            return [3, 1];
        case $Enums.ModLevel.Admin:
            return [2, 2];
    }
}

export function messageStateToInt(messageState: $Enums.MessageState) {
    switch (messageState) {
        case $Enums.MessageState.All:
            return 0;
        case $Enums.MessageState.Friends:
            return 1;
        case $Enums.MessageState.None:
            return 2;
    }
}

export function friendStateToInt(friendState: $Enums.FriendState) {
    switch (friendState) {
        case $Enums.FriendState.All:
            return 0;
        case $Enums.FriendState.None:
            return 1;
    }
}

export function commentHistoryStateToInt(commentHistoryState: $Enums.CommentHistoryState) {
    switch (commentHistoryState) {
        case $Enums.CommentHistoryState.All:
            return 0;
        case $Enums.CommentHistoryState.Friends:
            return 1;
        case $Enums.CommentHistoryState.None:
            return 2;
    }
}

export function messageStateToEnum(messageState: number) {
    switch (messageState) {
        case 1:
            return $Enums.MessageState.Friends;
        case 2:
            return $Enums.MessageState.None;
        default:
            return $Enums.MessageState.All
    }
}

export function friendStateToEnum(friendState: number) {
    switch (friendState) {
        case 1:
            return $Enums.FriendState.None;
        default:
            return $Enums.FriendState.All
    }
}

export function commentHistoryStateToEnum(commentHistoryState: number) {
    switch (commentHistoryState) {
        case 1:
            return $Enums.CommentHistoryState.Friends;
        case 2:
            return $Enums.CommentHistoryState.None;
        default:
            return $Enums.CommentHistoryState.All
    }
}