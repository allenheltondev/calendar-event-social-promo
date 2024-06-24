import { query } from "../db/neon.mjs";

class Speaker {
  constructor(name) {
    this.speakerName = name ?? null;
    this.id = null;
    this.twitter = null;
    this.discord = null;
  }

  static async find(name) {
    const command = `
            SELECT * FROM SPEAKER WHERE name ILIKE $1;
        `;
    const values = [name.trim()];
    const result = await query(command, values);
    const speaker = result[0];

    if (speaker) {
      this.id = speaker.id;
      this.speakerName = speaker.name;
      this.twitter = speaker.twitter;
      this.discord = speaker.discord;
    }

    return speaker;
  }

  async import(speakerData) {
    if (typeof speakerData == 'string') {
      speakerData = JSON.parse(speakerData);
    }

    this.speakerName = speakerData.name;
    this.twitter = speakerData.twitter;
    this.discord = speakerData.discord;
    return this;
  };

  async load(speakerId) {
    const command = `
            SELECT * FROM SPEAKER WHERE id = $1;
        `;
    const values = [speakerId];
    const result = await query(command, values);
    const speaker = result[0];

    if (speaker) {
      this.id = speaker.id;
      this.speakerName = speaker.name;
      this.twitter = speaker.twitter;
      this.discord = speaker.discord;
    }

    return speaker;
  }

  async save() {
    let command;
    let values;

    if (this.id) {
      command = `
                UPDATE SPEAKER
                SET name = $1, twitter = $2, discord = $3
                WHERE id = $4
                RETURNING *;
            `;
      values = [this.speakerName, this.twitter, this.discord, this.id];
    } else {
      command = `
                INSERT INTO SPEAKER (name, twitter, discord)
                VALUES ($1, $2, $3)
                RETURNING *;
            `;
      values = [this.speakerName, this.twitter, this.discord];
    }

    try {
      const result = await query(command, values);
      const speaker = result[0];

      if (speaker) {
        this.id = speaker.id;
        this.speakerName = speaker.name;
        this.twitter = speaker.twitter;
        this.discord = speaker.discord;
      }

      return speaker;
    } catch (error) {
      if (error.code === '23505') { // Unique violation error code in PostgreSQL
        throw new Error('A speaker with this name already exists.');
      }
      throw error;
    }
  }

  async delete() {
    if (!this.id) throw new Error('Speaker not loaded.');

    const command = `
            DELETE FROM SPEAKER WHERE id = $1
            RETURNING *;
        `;
    const values = [this.id];
    const result = await query(command, values);
    const deletedSpeaker = result[0];

    if (deletedSpeaker) {
      this.id = null;
      this.speakerName = null;
      this.twitter = null;
      this.discord = null;
    }

    return deletedSpeaker;
  }
}

export default Speaker;
