export enum Secret {
    Common = "Wmfd2893gb7",
    User = "Wmfv3899gc9",
    Level = "Wmfv2898gc9",
    Mod = "Wmfp3879gc3",
    Admin = "Wmfx2878gb9"
}

export enum Salts {
    Level = "xI25fpAapCQg",
    Challenge = "oC36fpYaPtdg", // Quest
    Reward = "pC26fpYaQCtg",
    RegisterUser = "mI29fmAnxgTs"
}

export enum LikeType {
    Level = 1,
    LevelComment = 2,
    UserComment = 3
}

export enum ErrorCode {
    SongNotFound = "SONG_NOT_FOUND",
    SongAlreadyUploaded = "SONG_ALREADY_UPLOADED",
    IncorrectLink = "INCORRECT_LINK",
    AddedSongTimeLimit = "ADDED_SONG_TIME_LIMIT"
}

export enum QueryMode {
    Default = "default",
    Insensitive = "insensitive"
}