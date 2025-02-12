/**
 * Sits on top of Meeting and adds funtionality specific to Hullo.
 * This includes obfuscating the `hullo-` prefix and handling query params.
 */

import Meeting from './Meeting';

const NAMESPACE = 'hullo'
const getRandom = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

export default class HulloMeeting extends Meeting {
   id = null;

   constructor(meetingId) {
       this.id = meetingId;
       super(`${NAMESPACE}-${meetingId}`);
   }
}