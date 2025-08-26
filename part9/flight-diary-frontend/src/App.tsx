import { useState, useEffect } from "react";
import { type DiaryEntry, Visibility, Weather } from "./types";
import { getAllDiaries, createDiary } from "./services/diary-service";
import axios from "axios";

const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [date, setDate] = useState("");
  const [visibility, setVisibility] = useState<Visibility>(Visibility.Great);
  const [weather, setWeather] = useState<Weather>(Weather.Sunny);
  const [comment, setComment] = useState("");
  const [notification, setNotification] = useState("");

  useEffect(() => {
    getAllDiaries().then((data) => {
      setDiaries(data);
    });
  }, []);

  const addDiary = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    createDiary({ date, visibility, weather, comment })
      .then((diary) => {
        setDiaries(diaries.concat(diary));
      })
      .catch((error: unknown) => {
        let errorMessage = "Error: ";
        if (axios.isAxiosError(error)) {
          errorMessage += error.response?.data;
        } else {
          errorMessage += "Unknown error";
        }

        setNotification(errorMessage);
        setTimeout(() => setNotification(""), 5000);
      });

    setDate("");
    setVisibility(Visibility.Great);
    setWeather(Weather.Sunny);
    setComment("");
  };

  return (
    <div>
      <h2>Add new entry</h2>
      {notification && <div style={{ color: "red" }}>{notification}</div>}
      <form onSubmit={addDiary}>
        <div>
          date
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </div>
        <div>
          visibility: great
          <input
            type="radio"
            name="visibility"
            value={visibility}
            onChange={() => setVisibility(Visibility.Great)}
            checked={visibility === Visibility.Great}
          />{" "}
          good
          <input
            type="radio"
            name="visibility"
            value={visibility}
            onChange={() => setVisibility(Visibility.Good)}
            checked={visibility === Visibility.Good}
          />{" "}
          ok
          <input
            type="radio"
            name="visibility"
            value={visibility}
            onChange={() => setVisibility(Visibility.Ok)}
            checked={visibility === Visibility.Ok}
          />{" "}
          poor
          <input
            type="radio"
            name="visibility"
            value={visibility}
            onChange={() => setVisibility(Visibility.Poor)}
            checked={visibility === Visibility.Poor}
          />
        </div>
        <div>
          weather: sunny
          <input
            type="radio"
            name="weather"
            value={weather}
            onChange={() => setWeather(Weather.Sunny)}
            checked={weather === Weather.Sunny}
          />{" "}
          rainy
          <input
            type="radio"
            name="weather"
            value={weather}
            onChange={() => setWeather(Weather.Rainy)}
            checked={weather === Weather.Rainy}
          />{" "}
          cloudy
          <input
            type="radio"
            name="weather"
            value={weather}
            onChange={() => setWeather(Weather.Cloudy)}
            checked={weather === Weather.Cloudy}
          />{" "}
          stormy
          <input
            type="radio"
            name="weather"
            value={weather}
            onChange={() => setWeather(Weather.Stormy)}
            checked={weather === Weather.Stormy}
          />{" "}
          windy
          <input
            type="radio"
            name="weather"
            value={weather}
            onChange={() => setWeather(Weather.Windy)}
            checked={weather === Weather.Windy}
          />
        </div>
        <div>
          comment
          <input
            value={comment}
            onChange={(event) => setComment(event.target.value)}
          />
        </div>
        <button type="submit">add entry</button>
      </form>

      <h2>Diary entries</h2>
      {diaries.map((diary) => (
        <div key={diary.id}>
          <h3>{diary.date}</h3>
          visibility: {diary.visibility}
          <br />
          weather: {diary.weather}
          <br />
          {diary.comment && <em>{diary.comment}</em>}
        </div>
      ))}
    </div>
  );
};

export default App;
