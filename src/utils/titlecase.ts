export default (string: string) => {
  const exceptions = ["a", "an", "of", "the", "and", "but", "or", "nor"];
  const capitalize = (w: string) => `${w[0].toUpperCase()}${w.slice(1)}`;
  return string
    .split(" ")
    .map((w, i) =>
      i === 0
        ? capitalize(w)
        : exceptions.includes(w.toLowerCase())
        ? w.toLowerCase()
        : capitalize(w)
    )
    .join(" ");
};
