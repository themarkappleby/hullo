# Hullo

Spacial video conferencing for distributed teams.

Three.js implementation based on [FPS Octree](https://sbcode.net/react-three-fiber/fps-octree/).

## Change EC2 type (e.g. from t2.micro to t3a.nano)

1. Navigate to the instance in the AWS dashboard.
1. Click "Instance state" > "Stop instance".
1. Click "Actions" > "Instance settings" > "Change instance type" (the instance now has a new IP address).
1. Click "Instance state" > "Start instance".
1. Navigate to the assosiated CloudFront distribution (rally-meet.online).
1. In the "Origins" tab, create a new origin with the new EC2 instance IP.
1. In the "Behaviors" tab, "Edit" the behavior to use the new EC2 instance IP.
1. In the "Origins" tab, delete the old origin.
1. In the local Hullo code repo, modify the `package.json` `ssh` script to use the new EC2 address.
1. Run `yarn ssh`.
1. On the server, `sudo vi /etc/nginx/config.d/hullo.conf`.
1. Update the `proxy_pass` URL to reflect the new EC2 address.
1. Save and quit vi with `:wq + Enter`.
1. `cd ~/peerjs-server-master`.
1. `npm run pm2`.
1. `npm nginx-start`.
1. Navigate to the assosiated CloudFront distribution (rally-meet.online).
1. In the "Invalidations" tab, click "Create invalidation".
1. Enter `/*`, and click "Create invalidation".