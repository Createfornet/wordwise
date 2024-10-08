import { FormEvent, useEffect, useState } from 'react';

import styles from './Form.module.css';
import 'react-datepicker/dist/react-datepicker.css';
import Button from './Button';
import BackButton from './BackButton';
import useUrlPosition from '../hooks/useUrlPosition';
import axios from 'axios';
import Message from './Message';
import Spinner from './Spinner';
import DatePicker from 'react-datepicker';
import { useCities } from '../contexts/CitiesContext';
import { City } from '../interfaces';
import { useNavigate } from 'react-router-dom';

export function convertToEmoji(countryCode: string) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(1));
  return String.fromCodePoint(...codePoints);
}

const BASE_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client';

function Form() {
  const [cityName, setCityName] = useState('');
  const [country, setCountry] = useState('');
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [lat, lng] = useUrlPosition();
  const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false);
  const [emoji, setEmoji] = useState('');
  const [geocodingError, setGeocodingError] = useState('');
  const { postCity, isLoading } = useCities();
  const navigate = useNavigate();

  useEffect(
    function () {
      if (!lat && !lng) return;

      async function fetchCityData() {
        try {
          setGeocodingError('')
          setIsLoadingGeocoding(true);
          const res = await axios(
            `${BASE_URL}?latitude=${lat}&longitude=${lng}`
          );
          const data = res.data;

          console.log(data.countryCode)
          if (!data.countryCode)
            throw new Error('Doesnt seem to be a city! Click somewhere else.');

          setCityName(data.city || data.locality || 'no city name');
          setCountry(data.countryName);
          setEmoji(data.countryCode);
        } catch (err) {
          if (err instanceof Error) setGeocodingError(err.message);
        } finally {
          setIsLoadingGeocoding(false);
        }
      }

      fetchCityData();
    },
    [lat, lng]
  );

  async function handleSubmitForm(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!cityName || !date) return;

    const newCity: City = {
      cityName,
      country,
      emoji,
      notes,
      date,
      position: { lat, lng },
      id: String(Date.now()),
    };

    await postCity(newCity);
    navigate('/app');
  }

  if (isLoadingGeocoding) return <Spinner />;

  if (!lat && !lng)
    return <Message message='Start by clicking somewhere on the map' />;

  if (geocodingError) return <Message message={geocodingError} />;

  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ''}`}
      onSubmit={handleSubmitForm}
    >
      <div className={styles.row}>
        <label htmlFor='cityName'>City name</label>
        <input
          id='cityName'
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor='date'>When did you go to {cityName}?</label>

        <DatePicker
          id='date'
          onChange={(date) => date && setDate(date)}
          selected={date}
          dateFormat='dd/MM/yyyyy'
        />
      </div>

      <div className={styles.row}>
        <label htmlFor='notes'>Notes about your trip to {cityName}</label>
        <textarea
          id='notes'
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type='primary'>Add</Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
