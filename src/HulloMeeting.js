/**
 * Sits on top of Meeting and adds funtionality specific to Hullo.
 * This includes obfuscating the `hullo-` prefix and handling query params.
 */

import Meeting from './Meeting';

const NAMESPACE = 'hullo'
const getRandom = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

export default class HulloMeeting extends Meeting {
   id = null;

   constructor(id) {
        const meetingNumber = id || getRandom(100000, 999999);
        const meetingId = `${NAMESPACE}-${meetingNumber}`;
        super(meetingId);
        this.id = meetingId;
        const url = new URL(window.location.href);
        url.searchParams.set('id', meetingNumber);
        window.history.pushState(null, '', url.toString());
   }
}