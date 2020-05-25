import Parser from "rss-parser";
import feed from "./feed.json";

const parser = new Parser();

export const getFeed = async () => {
  const composedFeed = {};
  await Promise.all(
    feed.map(async (source) => {
      try {
        const sourceFeed = await parser.parseURL(source.rss_url);
        const articles = sourceFeed?.items;
        if (!articles) {
          return;
        }
        composedFeed[source.id] = {
          ...source,
          articles: sourceFeed.items,
        };
        return;
      } catch (e) {
        // skip any sources that can't be parsed
        return;
      }
    })
  );
  return composedFeed;
};
