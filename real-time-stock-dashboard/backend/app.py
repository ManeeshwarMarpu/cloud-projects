from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import yfinance as yf
import asyncio

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001", "http://127.0.0.1:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/price/{symbol}")
def get_price(symbol: str):
    data = yf.Ticker(symbol).history(period="1d", interval="1m")
    return {"symbol": symbol, "price": round(data["Close"].iloc[-1], 2)}

@app.websocket("/ws/{symbol}")
async def ws_stock(websocket: WebSocket, symbol: str):
    await websocket.accept()
    while True:
        data = yf.Ticker(symbol).history(period="1d", interval="1m")
        price = round(data["Close"].iloc[-1], 2)
        await websocket.send_json({"symbol": symbol, "price": price})
        await asyncio.sleep(5)
