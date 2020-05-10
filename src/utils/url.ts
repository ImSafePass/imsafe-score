import queryString from "query-string";

export const updateSearch = (obj: object) => {
  const prevSearch = queryString.parse(window.location.search);
  const newSearch = { ...prevSearch, ...obj };
  const filteredNewSearch = Object.keys(newSearch)
    .filter((k) => newSearch[k])
    .reduce((obj, k) => ({ ...obj, [k]: newSearch[k] }), {});

  const newUrl = window.location.href
    .split("?")[0]
    .concat(`?${queryString.stringify(filteredNewSearch)}`);
  window.history.replaceState({ path: newUrl }, "", newUrl);
};
