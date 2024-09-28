import { Link } from 'react-router-dom';
import { City as CityInterface } from './../interfaces';
import styles from './CityItem.module.css';
import { useCities } from '../contexts/CitiesContext';

interface Props {
  city: CityInterface;
}

function getFlagEmoji(countryCode: string): string {
  return countryCode
    .toUpperCase()
    .split('')
    .map((char) => String.fromCodePoint(char.charCodeAt(0) + 0x1f1a5))
    .join('');
}

console.log(getFlagEmoji('en'))

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    weekday: 'long',
  }).format(new Date(date));

function CityItem({
  city: { cityName, country, date, emoji, id, notes, position },
}: Props) {
  const { currentCity } = useCities();
  return (
    <li>
      <Link
        className={`${styles.cityItem} ${
          id === currentCity?.id ? styles['cityItem--active'] : ''
        }`}
        to={`${id}?lat=${position.lat}&lng=${position.lng}`}
      >
        <span className={styles.emoji}>{getFlagEmoji(emoji)}</span>
        <h3 className={styles.name}>{cityName}</h3>
        <time className={styles.date}>({formatDate(date)})</time>
        <button className={styles.deleteBtn}>&times;</button>
      </Link>
    </li>
  );
}

export default CityItem;
