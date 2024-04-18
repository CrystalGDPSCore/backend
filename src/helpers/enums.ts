export enum Secret {
    Common = "Wmfd2893gb7",
    User = "Wmfv3899gc9",
    Level = "Wmfv2898gc9",
    Mod = "Wmfp3879gc3",
    Admin = "Wmfx2878gb9"
}

export enum Salt {
    Level = "xI25fpAapCQg",
    Challenge = "oC36fpYaPtdg",
    Reward = "pC26fpYaQCtg",
    RegisterUser = "mI29fmAnxgTs"
}

export enum LikeType {
    Level = 1,
    LevelComment,
    UserComment
}

export enum IconType {
    Cube = "Cube",
    Ship = "Ship",
    Ball = "Ball",
    Ufo = "Ufo",
    Wave = "Wave",
    Robot = "Robot",
    Spider = "Spider",
    Swing = "Swing",
    Jetpack = "Jetpack"
}

export enum ChestType {
    Small = 1,
    Big
}

export enum ShardType {
    FireShard = 1,
    IceShard,
    PoisonShard,
    ShadowShard,
    LavaShard,
    EarthShard = 10,
    BloodShard,
    MetalShard,
    LightShard,
    SoulShard
}

export enum QueryMode {
    default,
    insensitive
}

export enum SongError {
    SongNotFound = "SONG_NOT_FOUND",
    SongAlreadyUploaded = "SONG_ALREADY_UPLOADED",
    SongIncorrectLink = "SONG_INCORRECT_LINK",
    SongAddedTimeLimit = "SONG_ADDED_TIME_LIMIT"
}

export enum UserError {
    UserNotFound = "USER_NOT_FOUND",
    UserIncorrectPassword = "USER_INCORRECT_PASSWORD",
    UserIsDisabled = "USER_IS_DISABLED"
}