const local = () => window.location.href.includes("localhost");

export const localLog = (...args: any) => {
  if (local() && process.env.NODE_ENV !== "test") {
    console.log(...args);
  }
};

export const log = {
  local: (...args: any) => {
    if (local() && process.env.NODE_ENV !== "test") {
      console.log(...args);
    }
  },
  notest: (...args: any) => {
    if (process.env.NODE_ENV !== "test") {
      console.log(...args);
    }
  },
};

export default local;
