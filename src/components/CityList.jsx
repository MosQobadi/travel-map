import CityItem from "./CityItem";
import styles from "./CityList.module.css";
import Spinner from "./Spinner";
import Message from "./Message";
import { useCities } from "../contexts/CitiesContext";

const CityList = () => {
  const { cities = [], isLoading } = useCities();

  if (isLoading) return <Spinner />;

  if (cities.length < 1)
    return (
      <Message
        message={"Add your first city bt clicking on a city on the map"}
      />
    );

  return (
    <>
      <ul className={styles.cityList}>
        {cities.map((city) => (
          <CityItem key={city.id} city={city} />
        ))}
      </ul>
    </>
  );
};

export default CityList;
