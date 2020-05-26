import React, { useState } from "react";
import Head from "next/head";
import styled from "styled-components";
import { ServerStyleSheet } from "styled-components";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import { getFeed } from "../data/getFeed";

const CONTENT_MAX_LENGTH = 250;
const COLLAPSED_QTY = 5;

const scrubText = (text) =>
  text ? text.trim().replace(/(<\/?[^>]+(>|$))|(&(.*?);)/g, "") : "";

const truncate = (text) =>
  text.length > CONTENT_MAX_LENGTH
    ? `${text.substring(0, CONTENT_MAX_LENGTH)}...`
    : text;

const verifyContent = (content) =>
  content && content !== "Comments" ? content : "";

const sortFeed = (feed) =>
  Object.values(feed).sort((a, b) => a.name.localeCompare(b.name));

const SimplyNews = ({ feed, styles }) => {
  const [expanded, setExpanded] = useState([]);
  const onToggle = (id) => {
    setExpanded((current) => {
      const isCurrentlyExpanded = current.includes(id);
      if (isCurrentlyExpanded) {
        document.getElementById(`${id}`).scrollIntoView();
      }
      return isCurrentlyExpanded
        ? current.filter((item) => item !== id)
        : [...current, id];
    });
  };

  return (
    <Container>
      <Head>
        <title>Simply News</title>
        <link rel="icon" href="/favicon.ico" />
        {styles}
      </Head>
      <Bar>
        <Title>Simply News</Title>
      </Bar>
      <Content>
        {sortFeed(feed).map((source) => {
          const isExpanded = expanded.includes(source.id);
          const Toggle = isExpanded ? MdExpandLess : MdExpandMore;
          return (
            <section key={source.id} id={`${source.id}`}>
              <SourceHeading>
                {" "}
                <SourceName>{source.name}</SourceName>
                <Toggle
                  onClick={() => onToggle(source.id)}
                  style={{ width: 25, height: 25 }}
                />
              </SourceHeading>
              {source.articles.map((article, index) => {
                const content = verifyContent(
                  truncate(scrubText(article.content))
                );
                const isVisible = isExpanded || index < COLLAPSED_QTY;
                return (
                  <Article
                    key={article.title + article.pubDate}
                    style={{
                      display: isVisible ? "block" : "none",
                    }}
                  >
                    <ArticleTitle
                      title="View article"
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {article.title}
                    </ArticleTitle>
                    {content && (
                      <ArticleContent>
                        {scrubText(article.content)}
                      </ArticleContent>
                    )}
                  </Article>
                );
              })}
            </section>
          );
        })}
      </Content>
    </Container>
  );
};

export default SimplyNews;

const Container = styled.main`
  background-color: black;
  color: white;
  margin: 0;
  padding: 0;
`;

const Bar = styled.header`
  background-color: steelblue;
  margin: 0;
  padding: 20;
  display: flex;
  flex-flow: row;
  align-items: center;
  padding: 10px 20px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.5rem;
`;

const Content = styled.div`
  margin: 0;
  padding: 0;
`;

const SourceHeading = styled.div`
  background-color: #222;
  color: #ddd;
  margin: 0;
  padding: 10px 20px;
  position: sticky;
  top: 0;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
`;

const SourceName = styled.h2`
  font-size: 1.2rem;
  font-weight: 400;
  color: #ddd;
  margin: 0;
`;

const Article = styled.article`
  padding: 20px;
  margin: 0;
  &:not(:last-child) {
    border-bottom: 1px solid #333;
  }
  max-width: 100%;
  overflow-wrap: break-word;
  word-wrap: break-word;
`;

const ArticleTitle = styled.a`
  display: block;
  color: skyblue;
  font-size: 1rem;
  margin-top: 0;
  text-decoration: none;
  &:visited {
    color: skyblue;
    text-decoration: none;
  }
  &:active {
    color: skyblue;
    text-decoration: none;
  }
`;

const ArticleContent = styled.p`
  font-size: 0.8rem;
  margin-top: 15px;
  margin-bottom: 0;
`;

export const getServerSideProps = async () => {
  const feed = await getFeed();
  const sheet = new ServerStyleSheet();
  return {
    props: { feed, styles: sheet.getStyleTags() },
  };
};
