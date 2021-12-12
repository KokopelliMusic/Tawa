
// Returns a random integer between x (inclusive) and y (inclusive)
export const randomIntBetweenXandY = (x: number, y: number): number => {
  if (x > y) {
    throw new Error('x must be less than or equal to y')
  }
  return Math.floor(Math.random() * (y - x + 1) + x)
}