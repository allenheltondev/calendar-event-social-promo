-- Create tables
CREATE TABLE SPEAKER (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    twitter VARCHAR(255),
    discord VARCHAR(255)
);

CREATE TABLE EVENT (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    startDate TIMESTAMP NOT NULL,
    endDate TIMESTAMP NOT NULL,
    streamLink VARCHAR(255) NOT NULL,
    image VARCHAR(255)
);

CREATE TABLE SPEAKER_EVENT (
    id SERIAL PRIMARY KEY,
    speakerId INT NOT NULL,
    eventId INT NOT NULL,
    FOREIGN KEY (speakerId) REFERENCES SPEAKER(id),
    FOREIGN KEY (eventId) REFERENCES EVENT(id) ON DELETE CASCADE
);

CREATE TABLE EVENT_ANALYTICS (
    id SERIAL PRIMARY KEY,
    eventId INT NOT NULL,
    twitterViews INT,
    linkedInViews INT,
    youTubeViews INT,
    twitchViews INT,
    FOREIGN KEY (eventId) REFERENCES EVENT(id)
);
