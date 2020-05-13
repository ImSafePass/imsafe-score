import { daysFrom, brief } from "../date";

describe("date", () => {
  describe("daysFrom", () => {
    it("calculates forwards and backwards correctly, and is idempotent", () => {
      const day = new Date("2020-05-15");
      expect(brief(day)).toEqual("2020-05-15");
      expect(brief(daysFrom(2, day))).toEqual("2020-05-17");
      expect(brief(daysFrom(2, day))).toEqual("2020-05-17");
      expect(brief(daysFrom(-2, day))).toEqual("2020-05-13");
      expect(brief(daysFrom(-20, day))).toEqual("2020-04-25");
      expect(brief(daysFrom(20, day))).toEqual("2020-06-04");
    });
  });
});
