
export enum MainEndPoints {
    users = "/api/users",
    dialog = "/api/dialog",
    friend = "/api/friend"
}

export enum UserEndPoints {
    register = "/",
    login = "/login",
    logout = "/logout",
    auth = "/",
    getUsers = "/all/:data",
    removeUser = "/",
    uploadAvatar = "/upload-avatar",
    search = "/search",
    userStatus = "/user-status",
    newUserData = "/new-user-data",
    userInfo = "/user-info/:userId"
}

export enum FriendEndPoints {
    addNewFriend = "/new-friend/:userId",
    removeFriend = "/remove-friend/:userId",
    getFriends = "/friends/:data",
    search = "/search"
}

export enum DialogEndPoints {
    create = "/",
    getDialogs = "/:data",
    delete = "/:dialogId",
    search = "/search",
    uploadFile = "/file",
}