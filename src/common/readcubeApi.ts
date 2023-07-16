import fetch from "node-fetch";
import {
  assertNumberProp,
  assertStringProp,
  hasStringProp,
  hasObjectProp,
  assertObjectProp,
  hasArrayProp,
  assertArrayProp,
} from "./typeUtils";

export type QueryResultItem = {
  id: string;
  title: string;
  subtitle: string;
  url: string;
  link: string;
  accessoryTitle: string;
  icon: string;
  bib: string;
};

const getBookBib = (item) => {
  const author_name = (hasArrayProp(item.article, "authors") && item.article.authors.length !== 0) ? `${item.article.authors[0].split(" ").pop()} et al. `: "Unknown";

  return `${author_name}(${item.article.year}). ${item.article.title} - ${item.custom_metadata.publisher}.`;

};

const getJournalBib = (item) => {
  const author_name = (hasArrayProp(item.article, "authors") && item.article.authors.length !== 0) ? `${item.article.authors[0].split(" ").pop()} et al. `: "Unknown";

  return `${author_name}"${item.article.title}" ${item.article.journal}, ${item.article.year} ${item.custom_metadata.url ? item.custom_metadata.url : ''}`;

};

const parseResponse = (item) => {
  const author_name = (hasArrayProp(item.article, "authors") && item.article.authors.length !== 0) ? `${item.article.authors[0].split(" ").pop()} et al. `: "Unknown ";
  const url = `https://www.readcube.com/library/${item.collection_id}:${item.id}`;

  return {
    id: `${item.id}`,
    title: `${item.article.title.substring(0, 60)}`,
    subtitle: `${author_name}`,
    url: `${url}`,
    link: `${hasStringProp(item.article, "url") ? `${item.article.url}`: `${url}`}`,
    accessoryTitle: `${hasStringProp(item.article, "journal") ? item.article.journal.substring(0, 20) : "Book"} ${item.article.year}`,
    icon: `${item.item_type}.png`,
    bib: `${item.item_type === 'article' ? getJournalBib(item) : getBookBib(item)}`,
  }
};

export const searchResources = async (
  cookie: string,
  library_id: string,
  q: string
): Promise<QueryResultItem[]> => {
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept-Encoding': 'gzip, deflate, br',
      'Cookie': `${cookie}`
    }
  };
  const query = `https://sync.readcube.com/collections/${library_id}/items?query=${encodeURIComponent(q)}&sort=created,desc&sort=title,asc&size=50`
  const response = await fetch(
    query,
    requestOptions
  );
  if (response.status !== 200) {
    const data = (await response.json()) as { message?: unknown } | undefined;
    throw new Error(`${data?.message || "Not OK"}`);
  }
  const data = await response.json();
  assertArrayProp(data, "items");
  return data.items.map(parseResponse);
};