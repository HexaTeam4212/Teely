# Teely

## Front-End

Mobile application made using the framework React Native and the platform Expo.

### Quickstart

Install the latest stable version of Node.js.

Install the Expo client mobile application on your smartphone.

If you are hosting the server side code on localhost, ngrok is necessary.
ngrok command : ngrok http 5000.
5000 is the port used by our server.
This command will expose this port to the internet. Without this, it's not possible to communicate with the server from another device.
Copy the generated URL and update the value of the variable backendURL in Front/Teely/app/modules/BackendConfig.js

Update the npm dependencies from the Front/Teely folder : npm install

Launch the app : npm start

3 different QR codes are then displayed : Tunnel, LAN and local.
Scan this code using your smartphone and you will be able to download the app through Expo.

The tunnel one works but sometimes take too much time to get ready.

In order to use the LAN one, make sure that the following conditions are verified.

 -Your mobile device and computer are on the same network. The network must be a private one otherwise are hidden from each other.

 -The currently network interface you're using must be prioritized. You can verify using the command : ifconfig on Windows.
 If it is not first one displayed in the results, it is necessary to manually set the priority order : https://www.windowscentral.com/how-change-priority-order-network-adapters-windows-10.