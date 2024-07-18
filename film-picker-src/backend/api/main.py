from fastapi import FastAPI
import pika
from .routers import intersection, lb_link, watchlists

app = FastAPI()

# Настройка соединения с RabbitMQ
connection = pika.BlockingConnection(pika.ConnectionParameters('rabbitmq'))
channel = connection.channel()
channel.queue_declare(queue='task_queue')

@app.get("/")
async def root():
    return {"message": "my endpoints: /lb_link, /watchlists, /intersection"}

@app.post("/send_task")
async def send_task(url: str):
    channel.basic_publish(
        exchange='',
        routing_key='task_queue',
        body=url,
        properties=pika.BasicProperties(
            delivery_mode=2,  # Устойчивое сообщение
        ))
    return {"status": "Task sent"}

app.include_router(lb_link.router)
app.include_router(watchlists.router)
app.include_router(intersection.router)
