import { useState, useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Title);

const COMPANY_LIST = [
  { name: "Apple", symbol: "AAPL" },
  { name: "Microsoft", symbol: "MSFT" },
  { name: "Google", symbol: "GOOG" },
  { name: "Amazon", symbol: "AMZN" },
  { name: "Tesla", symbol: "TSLA" },
  { name: "Meta (Facebook)", symbol: "META" },
  { name: "NVIDIA", symbol: "NVDA" },
  { name: "Netflix", symbol: "NFLX" },
  { name: "Adobe", symbol: "ADBE" },
  { name: "Intel", symbol: "INTC" },
  { name: "IBM", symbol: "IBM" },
  { name: "Cisco", symbol: "CSCO" },
  { name: "Oracle", symbol: "ORCL" },
  { name: "Salesforce", symbol: "CRM" },
  { name: "PayPal", symbol: "PYPL" },
  { name: "Qualcomm", symbol: "QCOM" },
  { name: "AMD", symbol: "AMD" },
  { name: "Uber", symbol: "UBER" },
  { name: "Spotify", symbol: "SPOT" },
  { name: "Zoom", symbol: "ZM" },
];

function App() {
  const [symbol, setSymbol] = useState("AAPL");
  const [price, setPrice] = useState(0);
  const [labels, setLabels] = useState([]);
  const [prices, setPrices] = useState([]);
  const [search, setSearch] = useState("");
  const wsRef = useRef(null);

  const connectWebSocket = (sym) => {
    if (wsRef.current) wsRef.current.close();
    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/${sym}`);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const now = new Date().toLocaleTimeString();
      setPrice(data.price);
      setLabels((l) => [...l.slice(-19), now]);
      setPrices((p) => [...p.slice(-19), data.price]);
    };
    ws.onerror = (err) => console.error("WebSocket error:", err);
    wsRef.current = ws;
  };

  useEffect(() => {
    connectWebSocket(symbol);
    return () => wsRef.current?.close();
  }, [symbol]);

  const data = {
    labels,
    datasets: [
      {
        label: symbol,
        data: prices,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { title: { display: true, text: "Time" } },
      y: { title: { display: true, text: "Price ($)" } },
    },
  };

  const filteredCompanies = COMPANY_LIST.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-100 p-4 overflow-y-auto border-r">
        <h2 className="text-xl font-bold mb-3">Stocks</h2>
        <input
          type="text"
          placeholder="Search company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />
        <ul>
          {filteredCompanies.map((c) => (
            <li
              key={c.symbol}
              onClick={() => {
                setSymbol(c.symbol);
                setLabels([]);
                setPrices([]);
              }}
              className={`p-2 rounded cursor-pointer hover:bg-blue-200 ${
                c.symbol === symbol ? "bg-blue-300" : ""
              }`}
            >
              {c.name} ({c.symbol})
            </li>
          ))}
        </ul>
      </div>

      {/* Main chart */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-2">Real-Time Stock Dashboard</h1>
        <p className="text-lg mb-4">
          Tracking: <span className="font-semibold">{symbol}</span> → ${price}
        </p>
        <div className="w-full h-[500px]">
          <Line key={labels.join("-")} data={data} options={options} />
        </div>
      </div>
    </div>
  );
}

export default App;
