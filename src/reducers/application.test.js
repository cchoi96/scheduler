import reducer from "reducers/application";

describe("Reducer module", () => {
  it("throws an error with an unsupported type", () => {
    expect(() => reducer({}, { type: null })).toThrowError();
  });
});
