/**
 * Sits on top of Meeting and adds funtionality specific to Hullo.
 * This includes obfuscating the `hullo-` prefix and handling query params.
 */

import Meeting from './Meeting';

export const NAMESPACE = 'hullo'

export default class HulloMeeting extends Meeting {
   id = null;

   constructor(meetingId) {
       this.id = meetingId;
       super(`${NAMESPACE}-${meetingId}`);
   }
}