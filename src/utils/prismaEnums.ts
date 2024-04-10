import { $Enums } from "@prisma/client";

export function modLevelToInt(modLevel: $Enums.ModLevel) { // mod badge, request access
    switch (modLevel) {
        case $Enums.ModLevel.None:
            return [0, -1];
        case $Enums.ModLevel.Mod:
            return [1, 1];
        case $Enums.ModLevel.ElderMod:
            return [2, 2];
        case $Enums.ModLevel.LeaderboardMod:
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

export function friendRequestStateToInt(friendState: $Enums.FriendRequestState) {
    switch (friendState) {
        case $Enums.FriendRequestState.All:
            return 0;
        case $Enums.FriendRequestState.None:
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

export function questTypeToInt(questType: $Enums.QuestType) {
    switch (questType) {
        case $Enums.QuestType.Orbs:
            return 1;
        case $Enums.QuestType.Coins:
            return 2;
        case $Enums.QuestType.Stars:
            return 3;
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

export function friendRequestStateToEnum(friendRequestState: number) {
    switch (friendRequestState) {
        case 1:
            return $Enums.FriendRequestState.None;
        default:
            return $Enums.FriendRequestState.All
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

export function questTypeToEnum(questType: number) {
    switch (questType) {
        case 2:
            return $Enums.QuestType.Coins;
        case 3:
            return $Enums.QuestType.Stars;
        default:
            return $Enums.QuestType.Orbs;
    }
}