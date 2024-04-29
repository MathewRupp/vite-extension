import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import cat from "./assets/cat.jpeg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [data, setData] = useState([]);
  const [fact, setFact] = useState([]);

  const fetchData = async () => {
    try {
      const res = await fetch("https://catfact.ninja/fact");
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await res.json();
      setFact(data.fact);
    } catch (err) {
      console.log("error");
    }
  };

  const handleClick = () => {
    fetchData();
  };

  return (
    <>
      <div>
        <img src={cat} />
      </div>
      <h1>Muthafucking Cat Fact</h1>
      <div className="card">
        <button onClick={handleClick}>Cat Fact?</button>
        <p> {`Cat Fact - ${fact}`}</p>
      </div>
    </>
  );
}

export default App;
