import asyncio
import websockets
import json

async def main():
    uri = "ws://127.0.0.1:8000/ws/AAPL"
    async with websockets.connect(uri) as ws:
        while True:
            data = await ws.recv()
            print(json.loads(data))

asyncio.run(main())
