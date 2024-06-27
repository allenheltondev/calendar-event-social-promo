import { query } from "../db/neon.mjs";
import Speaker from './speaker.mjs';

class Event {
  constructor() {
    this.id = null;
    this.title = null;
    this.description = null;
    this.startDate = null;
    this.endDate = null;
    this.streamLink = null;
    this.image = null;
    this.speakers = [];
  }

  async import(eventData) {
    this.title = eventData.title;
    this.description = eventData.description;
    this.startDate = eventData.startDate;
    this.endDate = eventData.endDate;
    this.streamLink = eventData.streamLink;
    this.image = eventData.image;
    this.speakers = eventData.speakers;
    return this;
  }

  static async find(eventId) {
    const command = `
            SELECT * FROM EVENT WHERE id = $1;
        `;
    const values = [eventId];
    const result = await query(command, values);
    const event = result[0];

    if (event) {
      this.id = event.id;
      this.title = event.title;
      this.description = event.description;
      this.startDate = event.startDate;
      this.endDate = event.endDate;
      this.streamLink = event.streamLink;
      this.image = event.image;
    }

    return event;
  }

  static loadSpeakers(eventId) {
    const command = `
            SELECT s.* FROM SPEAKER s
            JOIN SPEAKER_EVENT se ON s.id = se.speakerId
            WHERE se.eventId = $1;
        `;
    const values = [eventId];
    return query(command, values);
  }

  async save() {
    let command;
    let values;

    if (this.id) {
      command = `
                UPDATE EVENT
                SET title = $1, description = $2, startDate = $3, endDate = $4, streamLink = $5, image = $6
                WHERE id = $7
                RETURNING *;
            `;
      values = [this.title, this.description, this.startDate, this.endDate, this.streamLink, this.image, this.id];
    } else {
      command = `
                INSERT INTO EVENT (title, description, startDate, endDate, streamLink, image)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *;
            `;
      values = [this.title, this.description, this.startDate, this.endDate, this.streamLink, this.image];
    }

    const result = await query(command, values);
    const event = result[0];

    if (event) {
      this.id = event.id;
      this.title = event.title;
      this.description = event.description;
      this.startDate = event.startDate;
      this.endDate = event.endDate;
      this.streamLink = event.streamLink;
      this.image = event.image;

      const missingData = [];
      const allSpeakers = [];
      for (const speakerName of this.speakers) {
        let speaker = await Speaker.find(speakerName);

        if (!speaker) {
          speaker = new Speaker(speakerName);
          speaker = await speaker.save();
        }

        if(!speaker.twitter || !speaker.discord){
          missingData.push({ id: speaker.id, name: speakerName });
        }

        allSpeakers.push(speaker);
        const speakerEventCommand = `
          INSERT INTO SPEAKER_EVENT (speakerId, eventId)
          VALUES ($1, $2);
        `;
        const speakerEventValues = [speaker.id, this.id];
        await query(speakerEventCommand, speakerEventValues);
      }

      return { id: this.id, missingSpeakers: missingData, speakers: allSpeakers };
    } else {
      throw new Error('Failed to save event.');
    }
  }

  async delete() {
    if (!this.id) throw new Error('Event not loaded.');

    const command = `
            DELETE FROM EVENT WHERE id = $1
            RETURNING *;
        `;
    const values = [this.id];
    const result = await query(command, values);
    const deletedEvent = result[0];

    if (deletedEvent) {
      this.id = null;
      this.title = null;
      this.description = null;
      this.startDate = null;
      this.endDate = null;
      this.streamLink = null;
      this.image = null;
    }

    return deletedEvent;
  }
}

export default Event;
