var app = {
	initialize: function() {
		document.addEventListener('deviceready', this.onDeviceReady, false);
	},
	onDeviceReady: function() {
		var potText = document.getElementById('pot');
		var delta = document.getElementById('delta');
		var on = document.getElementById('on');
		var off = document.getElementById('off');
		var open = false;
		var str = '';
		var lastRead = new Date();
		
		var errorCallback = function(message) {
			alert('Error: ' + message);
		};
		// request permission first
		serial.requestPermission(
			// if user grants permission
			function(successMessage) {
				// open serial port
				serial.open(
					{baudRate: 9600, sleepOnPause: false},
					// if port is succesfuly opened
					function(successMessage) {
						open = true;
						// register the read callback
						serial.registerReadCallback(
							function success(data){
								// decode the received message
								var view = new Uint8Array(data);
								if(view.length >= 1) {
									for(var i=0; i < view.length; i++) {
										// if we received a \n, the message is complete, display it
										if(view[i] == 13) {
											// check if the read rate correspond to the arduino serial print rate
											var now = new Date();
											delta.innerText = now - lastRead;
											lastRead = now;
											// display the message
											var value = parseInt(str);
											pot.innerText = value;
											str = '';
										}
										// if not, concatenate with the begening of the message
										else {
											var temp_str = String.fromCharCode(view[i]);
											var str_esc = escape(temp_str);
											str += unescape(str_esc);
										}
									}
								}
							},
							// error attaching the callback
							errorCallback
						);
					},
					// error opening the port
					errorCallback
				);
			},
			// user does not grant permission
			errorCallback
		);

		on.onclick = function() {
			console.log('click');
			if (open) serial.write('1');
		};
		off.onclick = function() {
			if (open) serial.write('0');
		}
	}
};

app.initialize();