from fastapi import FastAPI
from routers.auth import auth_router
from routers.chat import chat_router
from tortoise.contrib.fastapi import register_tortoise
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()
app.include_router(auth_router)
app.include_router(chat_router)

origins = [
    "http://localhost:5173/",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

register_tortoise(
    app,
    db_url="postgres://postgres:2077@localhost:5432/midsterbot",
    modules={"models": ["modules.auth_tb","modules.new_chat_tb","modules.saving_chats_tb"]},
    generate_schemas=True,
    add_exception_handlers=True,
)
