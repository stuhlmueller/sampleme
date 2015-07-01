// Set up global App object, and add API info for Google Cloud Messaging

App = {
  notificationClient: new NotificationClient({
    senderId: "346735413894",
    gcmAuthorization: "AIzaSyBFvzHupnDR3hwFHHhiyaUaYtJLHNMo5sI"
  })
};
