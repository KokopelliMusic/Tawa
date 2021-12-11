
// Returns a random integer between x (inclusive) and y (inclusive)
export const randomIntBetweenXandY = (x: number, y: number): number => {
  return Math.floor(Math.random() * (y - x + 1) + x)
}