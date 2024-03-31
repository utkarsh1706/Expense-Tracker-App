import "./App.css";
import React, { useEffect, useState } from "react";

function App() {
  const [name, setName] = useState("");
  const [datetime, setDatetime] = useState("");
  const [description, setDescription] = useState("");
  const [transactions, setTransactions] = useState([]);
  

  useEffect(() => {
    getTransactions().then(setTransactions);
  }, []);

  async function getTransactions() {
    const url = process.env.REACT_APP_API_URL + "/transactions";
    const response = await fetch(url);
    return await response.json();
  }

  function addNewTransaction(ev) {
    ev.preventDefault();
    const url = process.env.REACT_APP_API_URL + "/transaction";
    const price = name.split(" ")[0];
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        price,
        name: name.substring(price.length + 1),
        description,
        datetime,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((errorMessage) => {
            throw new Error(
              `Server responded with status ${response.status}: ${errorMessage}`
            );
          });
        }
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          return response.json();
        } else {
          return Promise.resolve(); 
        }
      })
      .then((json) => {
        // Update the transactions state by fetching the updated transactions
        getTransactions().then(setTransactions);
        // Reset input fields
        setName("");
        setDatetime("");
        setDescription("");
        console.log("result", json);
      })
      .catch((error) => {
        console.error("Error:", error ? error : "Unknown error");
      });
  }
  let balance = 0;
  for (const transaction of transactions) {
    balance += transaction.price;
  }
  balance = balance.toFixed(2);
  const fraction = balance.split(".")[1];
  balance = balance.split(".")[0];
  return (
    <main>
      <h1>
        ${balance}
        <span>{fraction}</span>
      </h1>
      <form onSubmit={addNewTransaction}>
        <div className="basic">
          <input
            type="text"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
            placeholder={"-200 new Samsung TV"}
          ></input>
          <input
            type="datetime-local"
            value={datetime}
            onChange={(ev) => setDatetime(ev.target.value)}
          ></input>
        </div>
        <div className="description">
          <input
            type="text"
            placeholder={"Description"}
            value={description}
            onChange={(ev) => setDescription(ev.target.value)}
          ></input>
        </div>
        <button type="submit">Add New Transaction</button>
      </form>
      <div className="transactions">
        {transactions.length > 0 &&
          transactions.map((transaction) => (
            <div className="transaction" key={transaction.id}>
              {" "}
              {/* Add a unique key */}
              <div className="left">
                <div className="name">{transaction.name}</div>
                <div className="description">{transaction.description}</div>
              </div>
              <div className="right">
                {/* Correct the conditional class name */}
                <div
                  className={
                    "price " + (transaction.price < 0 ? "red" : "green")
                  }
                >
                  {transaction.price}
                </div>
                <div className="datetime">{transaction.datetime}</div>
              </div>
            </div>
          ))}
      </div>
    </main>
  );
}

export default App;
