import { getFeed } from "../../data/getFeed";

export default async (req, res) => {
  try {
    const feed = await getFeed();
    res.status(200);
    res.json(feed);
    res.end();
  } catch (e) {
    console.error(e);
    res.status(400);
    res.json({ message: "Error getting feed" });
    res.end();
  }
};
