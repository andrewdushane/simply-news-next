import React, { useState } from "react";
import Head from "next/head";
import styled from "styled-components";
import { ServerStyleSheet } from "styled-components";
import { MdExpandLess } from "react-icons/md";
import { formatDistance } from "date-fns";

import { getFeed } from "../data/getFeed";
import usePersistedState from "../hooks/usePersistedState";

const CONTENT_MAX_LENGTH = 750;
const COLLAPSED_QTY = 3;

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
  const [expanded, setExpanded] = usePersistedState("simply_news_expanded", []);
  const onToggle = (id) => {
    setExpanded((current) => {
      const isCurrentlyExpanded = current.includes(id);
      if (isCurrentlyExpanded) {
        document.getElementById(`${id}`).scrollIntoView({ behavior: "smooth" });
      }
      return isCurrentlyExpanded
        ? current.filter((item) => item !== id)
        : [...current, id];
    });
  };
  const now = new Date();
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
          return (
            <section key={source.id} id={`${source.id}`}>
              <SourceHeading>
                <SourceName>{source.name}</SourceName>
                <MdExpandLess
                  onClick={() => onToggle(source.id)}
                  style={{
                    width: 25,
                    height: 25,
                    transform: `rotate(${isExpanded ? "0" : "180"}deg)`,
                    transition: "transform 250ms ease-in-out",
                  }}
                />
              </SourceHeading>
              {source.articles.map((article, index) => {
                const content = verifyContent(
                  truncate(scrubText(article.content))
                );
                const isVisible = isExpanded || index < COLLAPSED_QTY;
                const publishDate =
                  article.pubDate && new Date(article.pubDate);
                return (
                  <Article
                    key={article.title + article.pubDate}
                    style={{
                      display: isVisible ? "block" : "none",
                    }}
                  >
                    <ArticleTitleAndDate>
                      <ArticleTitle
                        title="View article"
                        href={article.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {scrubText(article.title)}
                      </ArticleTitle>
                      {publishDate ? (
                        <>
                          <ArticleDate>
                            {" "}
                            {formatDistance(now, publishDate)} ago
                          </ArticleDate>
                        </>
                      ) : null}
                    </ArticleTitleAndDate>
                    {content && <ArticleContent>{content}</ArticleContent>}
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

const ArticleTitleAndDate = styled.div`
  font-size: 1rem;
  line-height: 1em;
`;

const ArticleTitle = styled.a`
  color: skyblue;
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

const ArticleDate = styled.span`
  color: #aaa;
  font-size: 0.8rem;
  padding-left: 5px;
  line-height: 0.5em;
`;

const ArticleContent = styled.p`
  font-size: 0.8rem;
  margin-top: 7px;
  margin-bottom: 0;
`;

export const getServerSideProps = async () => {
  const feed = await getFeed();
  const sheet = new ServerStyleSheet();
  return {
    props: { feed, styles: sheet.getStyleTags() },
  };
};
