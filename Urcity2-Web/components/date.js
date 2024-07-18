import { parseISO, format, formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale'

export default function Date({ dateString }) {
  const date = parseISO(dateString)
  return (
    <time dateTime={dateString} title={format(date, 'Pp', { locale: de })} suppressHydrationWarning>
      {formatDistanceToNow(date, { locale: de, addSuffix: true })}
    </time>
  )
}
