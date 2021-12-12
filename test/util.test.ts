import { randomIntBetweenXandY } from "../src/util"

describe("randomIntBetweenXandY utils", () => {
  it("should return a random integer between x and y", () => {
    const x = 1
    const y = 10
    const randomInt = randomIntBetweenXandY(x, y)
    expect(randomInt).toBeGreaterThanOrEqual(x)
    expect(randomInt).toBeLessThanOrEqual(y)
  })

  it("should return a value of type number", () => {
    const x = 1
    const y = 10
    const randomInt = randomIntBetweenXandY(x, y)
    expect(typeof randomInt).toBe("number")
  })

  it("should also work when given floats", () => {
    const x = 1.5
    const y = 10.5
    const randomInt = randomIntBetweenXandY(x, y)
    expect(typeof randomInt).toBe("number")
  })

  it("should work when x equals y", () => {
    const x = 1
    const y = 1
    const randomInt = randomIntBetweenXandY(x, y)
    expect(typeof randomInt).toBe("number") 
  })

  it("should not work when x is smaller than y", () => {
    const x = 10
    const y = 1
    expect(() => randomIntBetweenXandY(x, y)).toThrow(Error)
  })
})