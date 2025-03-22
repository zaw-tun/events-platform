import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const EVENTBRITE_API_KEY = process.env.EVENTBRITE_API_KEY;

app.delete('/api/eventbrite/events/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await axios.delete(`https://www.eventbriteapi.com/v3/events/${id}/`, {
      headers: {
        Authorization: `Bearer ${EVENTBRITE_API_KEY}`,
      },
    });
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error deleting Eventbrite event:", error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/", (req, res) => res.send("Eventbrite Proxy API is running."));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
