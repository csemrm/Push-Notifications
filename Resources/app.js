var deviceToken = null;

Ti.Network.registerForPushNotifications({
	// Specifies which notifications to receive
	types : [Ti.Network.NOTIFICATION_TYPE_BADGE, Ti.Network.NOTIFICATION_TYPE_ALERT, Ti.Network.NOTIFICATION_TYPE_SOUND],
	success : deviceTokenSuccess,
	error : deviceTokenError,
	callback : receivePush
});
// Process incoming push notifications
function receivePush(e) {
	alert('Received push: ' + JSON.stringify(e));
}

// Save the device token for subsequent API calls
function deviceTokenSuccess(e) {
	deviceToken = e.deviceToken;

	alert('deviceToken' + deviceToken);
}

function deviceTokenError(e) {
	alert('Failed to register for push notifications! ' + e.error);
}

// For this example to work, you need to get the device token. See the previous section.

// Require in the Cloud module
var Cloud = require("ti.cloud");
function subscribeToChannel() {
	// Subscribes the device to the 'test' channel
	// Specify the push type as either 'android' for Android or 'ios' for iOS
	Cloud.PushNotifications.subscribeToken({
		device_token : deviceToken,
		channel : 'test',
		type : Ti.Platform.name == 'android' ? 'android' : 'ios'
	}, function(e) {
		if (e.success) {
			alert('Subscribed');
		} else {
			alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
		}
	});
}

function sendTestNotification() {
	// Sends an 'This is a test.' alert to specified device if its subscribed to the 'test' channel.
	Cloud.PushNotifications.notifyTokens({
		to_tokens : deviceToken,
		channel : 'test',
		payload : 'This is a test.'
	}, function(e) {
		if (e.success) {
			alert('Push notification sent');
		} else {
			alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
		}
	});
}

function unsubscribeToChannel() {
	// Unsubscribes the device from the 'test' channel
	Cloud.PushNotifications.unsubscribeToken({
		device_token : deviceToken,
		channel : 'test',
	}, function(e) {
		if (e.success) {
			alert('Unsubscribed');
		} else {
			alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
		}
	});
}

var win = Ti.UI.createWindow({
	backgroundColor : 'white',
	layout : 'vertical',
	exitOnClose : true,

});

var subscribe = Ti.UI.createButton({
	top : 20,
	title : 'Subscribe'
});
subscribe.addEventListener('click', subscribeToChannel);
win.add(subscribe);

var notify = Ti.UI.createButton({
	title : 'Notify'
});
notify.addEventListener('click', sendTestNotification);
win.add(notify);

var unsubscribe = Ti.UI.createButton({
	title : 'Unsubscribe'
});
unsubscribe.addEventListener('click', unsubscribeToChannel);
win.add(unsubscribe);

win.open();
