const local = () => window.location.href.includes("localhost");

export const localLog = (...args: any) => {
  if (local()) {
    console.log(...args);
  }
};

export default local;
