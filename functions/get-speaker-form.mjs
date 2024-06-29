import Event from "./models/event.mjs";
import { verifyHashKey } from "./utils/helper.mjs";

export const handler = async (event) => {
  try {
    const { eventId } = event.pathParameters;
    const { key, token } = event.queryStringParameters;
    if (!key || !token) {
      return {
        statusCode: 403,
        body: JSON.stringify({ message: 'Forbidden' })
      };
    }

    const eventData = await Event.find(eventId);
    if (!eventData) {
      return {
        statusCode: 403,
        body: JSON.stringify({ message: 'Forbidden' })
      };
    }

    const isValidKey = verifyHashKey(eventData, key);
    if (!isValidKey) {
      return {
        statusCode: 403,
        body: JSON.stringify({ message: 'Forbidden' })
      };
    }

    const speakers = await Event.loadSpeakers(eventId);

    const formHtml = getSpeakerFormHtml(eventData, speakers, token);
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html' },
      body: formHtml
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: err.message //message: 'Something went wrong'
      })
    };
  }
};

const getSpeakerFormHtml = (event, speakers, token) => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Speaker data | ${event.title}</title>
<style>
  body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f4;
    padding: 20px;
    display: flex;
    justify-content: center;
  }
  form {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    max-width: 615px;
    width: 100%;
  }
  h2 {
    text-align: center;
  }
  fieldset {
    border: 2px solid #ccc;
    border-radius: 10px;
    padding: 10px;
    margin-bottom: 15px;
  }
  legend {
    padding: 0 10px;
    font-size: larger;
    font-weight: bold;
  }
  .form-group {
    margin-bottom: 15px;
  }
  .top-margin {
    margin-top: 15px;
  }
  .flex-group {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .flex-side-by-side {
    display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: center;
    margin-bottom: 10px;
  }
  .help-text {
    font-size: .9rem;
    color: slategray;
    margin-bottom: 10px;
  }
  .hint-text {
    font-style: italic;
    font-size: .95rem;
    margin-bottom: 10px;
  }
  .save-button {
    float: right;
    margin-right: 7px;
  }
  label {
    display: block;
    margin-bottom: 5px;
  }
  input {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 95%;
  }
  button {
    background-color: #A238FF;
    color: white;
    border: none;
    cursor: pointer;
    padding: 10px;
    border-radius: 5px;
  }
  input[type="submit"] {
    width: 100%;
    background-color: #A238FF;
    color: white;
    border: none;
    cursor: pointer;
    padding: 10px;
    border-radius: 5px;
  }
  input[type="submit"]:hover, button:hover {
    background-color: #250083;
  }
</style>
</head>
<body>
  <form id="speakersForm">
    <h2>Speaker data for event "${event.title}"</h2>
    ${speakers.map(speaker => `
      <fieldset>
        <legend>${speaker.name}</legend>
        <div class="form-group">
          <label for="twitter-${speaker.id}">Twitter username</label>
          <input id="twitter-${speaker.id}" name="twitter-${speaker.id}" type="text" placeholder="Just the handle without the @" value="${getValue(speaker.twitter)}">
        </div>
        <div class="form-group">
          <label for="discord-${speaker.id}">Discord user id</label>
          <input id="discord-${speaker.id}" name="discord-${speaker.id}" type="text" placeholder="Right click the user > Copy User iD" value="${getValue(speaker.discord)}">
        </div>
        <div class="form-group">
          <button type="button" class="save-button" onclick="saveSpeaker('${speaker.id}')">Save</button>
        </div>
      </fieldset>
    `).join('')}
    <input type="submit" value="Submit" onclick="submitForm(event)">
  </form>
  <script>
    function saveSpeaker(speakerId) {
      const twitter = document.getElementById('twitter-' + speakerId).value;
      const discord = document.getElementById('discord-' + speakerId).value;
      fetch('/v1/speakers/' + speakerId, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ twitter, discord })
      })
      .then(data => {
        alert('Speaker saved successfully');
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('Error saving speaker');
      });
    }

    function submitForm(event) {
      event.preventDefault();
      const form = document.getElementById('speakersForm');
      const formData = new FormData(form);
      fetch('./${event.id}/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: "${token}" })
      })
      .then(data => {
        alert('Got it, thanks!');
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('Error submitting form');
      });
    }
  </script>
</body>
</html>
`;

const getValue = (v) => {
  if (!v || v == null || v == 'null') return '';
  return v;
};
