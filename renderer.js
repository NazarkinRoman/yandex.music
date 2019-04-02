'use strict';
const {globalShortcut, dialog, app} = require('electron').remote;
const currentWindow = require('electron').remote.getCurrentWindow();
const currentWebContents = currentWindow.webContents;

const init = () => {
	var ret;
	
	// bail if domain is not correct
    if (window.location.host !== 'music.yandex.ru') {
        return;
    }

	// setup notifications
	externalAPI.on(externalAPI.EVENT_TRACK, function() {
		let trackInfo = externalAPI.getCurrentTrack();
		let artists = trackInfo.artists.map(function(obj) { return obj.title; }).join(', ');
	
		new Notification('Yandex.Music: Track changed', {
			silent: true,
			body: `Album: ${trackInfo.album.title} (${trackInfo.album.year})\r\nTrack: ${artists} - ${trackInfo.title}`
		});
		
		app.dock.setBadge('');
	});
	
	// bind play/pause button
    ret = globalShortcut.register('MediaPlayPause', () => {
        externalAPI.togglePause();
    });
    if (!ret) {
        dialog.showErrorBox('Cant bind global shortcut', 'Cant bind MediaPlayPause. Possible second opened tab?');
    }

	// bind next track button
    ret = globalShortcut.register('MediaNextTrack', () => {
        externalAPI.next();
    });
    if (!ret) {
        dialog.showErrorBox('Cant bind global shortcut', 'Cant bind MediaNextTrack. Possible second opened tab?');
    }

	// bind prev track button
    ret = globalShortcut.register('MediaPreviousTrack', () => {
        if (externalAPI.getProgress().position >= 5) {
            externalAPI.setPosition(0);
        } else {
            externalAPI.prev();
        }
    });
    if (!ret) {
        dialog.showErrorBox('Cant bind global shortcut', 'Cant bind MediaPreviousTrack. Possible second opened tab?');
	}
};

currentWebContents.on('did-finish-load', init);
