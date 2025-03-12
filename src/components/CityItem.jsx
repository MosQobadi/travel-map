import styles from "./CityItem.module.css";
import { Link } from "react-router-dom";
import { useCities } from "../contexts/CitiesContext";

const formDate = (date) => {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
};

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const CityItem = ({ city }) => {
  const { currentCity, deleteCity } = useCities();
  const { cityName, date, id, position, emoji } = city;

  const selectedCity = id === currentCity.id;

  const handleClick = (e) => {
    e.preventDefault();

    deleteCity(id);
  };

  return (
    <li>
      <Link
        className={`${styles.cityItem} ${
          selectedCity ? styles["cityItem--active"] : ""
        }`}
        to={`${id}?lat=${position.lat}&lng=${position.lng}`}
      >
        <span className={styles.emoji}>{emoji}</span>
        <h3 className={styles.name}>{cityName}</h3>
        <time className={styles.date}>{formDate(date)}</time>
        <button className={styles.deleteBtn} onClick={handleClick}>
          &times;
        </button>
      </Link>
    </li>
  );
};

export default CityItem;
