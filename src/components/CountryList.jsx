import Spinner from "./Spinner";
import Message from "./Message";
import CountryItem from "./CountryItem";
import styles from "./CountryList.module.css";
import { useCities } from "../contexts/CitiesContext";

const CountriesList = () => {
  const { cities, isLoading } = useCities();

  const countries = cities.reduce((arr, city) => {
    if (!arr.map((element) => element.country).includes(city.country)) {
      return [...arr, { country: city.country, emoji: city.emoji }];
    } else return arr;
  }, []);

  if (isLoading) return <Spinner />;

  if (cities.length < 1)
    return (
      <Message
        message={"Add your first city bt clicking on a city on the map"}
      />
    );

  return (
    <>
      <ul className={styles.countryList}>
        {countries.map((country, i) => (
          <CountryItem key={i} country={country} />
        ))}
      </ul>
    </>
  );
};

export default CountriesList;
