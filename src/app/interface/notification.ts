export interface Notification {
    message: string,
    date: Date,
    isViewed: boolean,
    for: string,
    notificationID: string,
    popedUp: boolean
}
