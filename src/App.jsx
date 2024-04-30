import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import cat from "./assets/cat.jpeg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [data, setData] = useState([]);
  const [sellerRank, setSellerRank] = useState([]);
  const [asin, setAsin] = useState([]);
  const [fact, setFact] = useState([]);

  const getTdElementAfterASIN = () => {
    const thElements = document.querySelectorAll("th");
    for (let i = 0; i < thElements.length; i++) {
      const thElement = thElements[i];
      if (thElement.textContent.trim() === "ASIN") {
        const tdElement = thElement.nextElementSibling;
        if (tdElement && tdElement.tagName.toLowerCase() === "td") {
          console.log(tdElement.textContent.trim());
          // Do something with the td element, like accessing its text content
          return tdElement;
        } else {
          console.error(
            "No <td> element found after the <th> element with 'ASIN'.",
          );
          return null;
        }
      }
    }
    console.error("No <th> element found with text 'ASIN'.");
    return null;
  };

  const extractRankAndCategory = (input) => {
    // Remove content within parentheses
    const withoutParentheses = input.replace(/\([^()]*\)/g, "");

    // Match the main pattern globally
    const regex = /#(\d[\d,]*)\s+in\s+([^#]+)/g;

    const matches = withoutParentheses.match(regex) || [];

    const extractedData = matches
      .map((match) => {
        const matchResult = match.match(regex);
        if (matchResult && matchResult.length === 3) {
          const rank = matchResult[1].replace(/,/g, ""); // Remove commas from the rank number
          const category = matchResult[2].trim(); // Trim leading and trailing spaces from the category
          return { rank, category };
        } else {
          console.error("Invalid match:", match);
          return null;
        }
      })
      .filter(Boolean); // Filter out null values

    if (extractedData.length > 0) {
      return extractedData;
    } else {
      console.error("No valid matches found in the input string.");
      return null;
    }
  };

  const getProductData = async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const thElements = document.querySelectorAll("th");
        for (let i = 0; i < thElements.length; i++) {
          const thElement = thElements[i];
          if (thElement.textContent.trim() === "ASIN") {
            const asin = thElement.nextElementSibling;
            if (asin && asin.tagName.toLowerCase() === "td") {
              console.log(asin.textContent.trim());
              // Do something with the td element, like accessing its text content
              //return asin;
            }
          } else if (thElement.textContent.trim() === "Best Sellers Rank") {
            const tdElement = thElement.nextElementSibling;
            if (tdElement && tdElement.tagName.toLowerCase() === "td") {
              console.log(tdElement.textContent.trim());
              rank = tdElement.textContent.trim();
            }
          }
        }

        const extractRankAndCategory = (input) => {
          // Regular expression to remove content within parentheses
          const withoutParentheses = input.replace(/\([^()]*\)/g, "");

          // Regular expression to match the main pattern globally
          const regex = /#(\d+(?:,\d+)*)\s+in\s+(.*?)(?=#|$)/g;

          let matches = [];
          let match;
          while ((match = regex.exec(withoutParentheses)) !== null) {
            if (match.length === 3) {
              const rank = match[1]; // Extract the rank number
              const category = match[2]; // Extract the category
              matches.push({ rank, category });
            }
          }
          if (matches.length > 0) {
            return matches;
          } else {
            console.error("No matches found in the input string.");
            return null;
          }
        };

        const matches = extractRankAndCategory(rank);

        console.log(matches);
      },
    });
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
        <button onClick={getProductData}>getProductData</button>
        <p>{sellerRank}</p>
      </div>
    </>
  );
}

export default App;
