import type { IeltsEntry } from '../../data/ielts'
import './ielts-senses.css'

// n. / v. / adj. / adv. each keep one colour across the site, so a list can be
// scanned by part of speech; everything else (phr., prep., conj.) stays neutral.
// "n./v." takes the colour of its first part.
const POS_TONES: Record<string, string> = { n: 'n', v: 'v', adj: 'adj', adv: 'adv' }

export function IeltsPos({ pos }: { pos: string }) {
  const tone = POS_TONES[pos.split(/[./]/)[0]] ?? 'other'

  return <em className={`ielts-pos is-${tone}`}>{pos}</em>
}

export function IeltsSenses({ entry }: { entry: IeltsEntry }) {
  return (
    <span className="ielts-senses">
      {entry.senses.map((sense, index) => (
        <span key={index}>
          <IeltsPos pos={sense.pos} /> {sense.meaning}
        </span>
      ))}
    </span>
  )
}
