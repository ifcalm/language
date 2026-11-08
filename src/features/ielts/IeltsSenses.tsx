import type { IeltsEntry } from '../../data/ielts'

export function IeltsSenses({ entry }: { entry: IeltsEntry }) {
  return (
    <span className="ielts-senses">
      {entry.senses.map((sense, index) => (
        <span key={index}>
          <em>{sense.pos}</em> {sense.meaning}
        </span>
      ))}
    </span>
  )
}
