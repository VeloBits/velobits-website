/** "{n} min read" label. Pure + prop-driven. */
export default function ReadingTime({ minutes }: { minutes: number }) {
  return <span>{minutes} min read</span>;
}
