import Head from "next/head";
import { getFeed } from "../data/getFeed";

export default function Home({ feed }) {
  return (
    <div className="container">
      <Head>
        <title>Simply News</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 className="title">Simply News</h1>
      </main>
      {Object.values(feed).map((source) => (
        <>
          <h2 key={source.id}>{source.name}</h2>
          {source.articles.map((article) => (
            <p key={article.title + article.pubDate}>{article.title}</p>
          ))}
        </>
      ))}
    </div>
  );
}

export const getServerSideProps = async () => {
  const feed = await getFeed();
  return {
    props: { feed },
  };
};
