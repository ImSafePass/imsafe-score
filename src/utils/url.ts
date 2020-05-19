import queryString from "query-string";
import ReactGA from "react-ga";

export const updateSearch = (obj: object) => {
  const prevSearch = queryString.parse(window.location.search);
  const newSearch = { ...prevSearch, ...obj };
  const filteredNewSearch = Object.keys(newSearch)
    .filter((k) => newSearch[k])
    .sort()
    .reduce((obj, k) => ({ ...obj, [k]: newSearch[k] }), {});

  if (
    Object.keys(filteredNewSearch).every(
      (k) => (filteredNewSearch as any)[k] === prevSearch[k]
    )
  ) {
    return false;
  }

  const newUrl = window.location.href
    .split("?")[0]
    .concat(`?${queryString.stringify(filteredNewSearch)}`);

  window.history.replaceState({ path: newUrl }, "", newUrl);
  ReactGA.pageview(window.location.pathname + window.location.search);

  return true;
};
