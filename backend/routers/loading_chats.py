from fastapi import APIRouter
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from modules.saving_chats_tb import Chat
from modules.new_chat_tb import NewChat

loading_chats = APIRouter()

class Ids(BaseModel):
    email_id : int

class ButtonIds(BaseModel):
    id : int

@loading_chats.post('/loading_chats')
async def loading_chat(arg:Ids):
    newchats = await NewChat.filter(email_id=arg.email_id)
    button_keys = []
    try:
        for newchat in newchats:
            chat = await Chat.filter(chat_id=newchat.pk)
            chat = chat[1]
            button_keys.append({"chat_id":newchat.pk,"context":chat.context})

        button_keys.reverse()
    except:
        return button_keys
    return button_keys

@loading_chats.post('/accessing_chat')
async def accessing_chats(arg :ButtonIds):
    chats = await Chat.filter(chat_id = arg.id)
    human_chats = chats[0::2]
    bot_chats = chats[1::2]
    instance = []
    for i in range(len(bot_chats)):
        human_row = await human_chats[i].get(id=human_chats[i].pk)
        human_response = human_row.response
        human_message = human_row.message
        
        bot_row = await bot_chats[i].get(id=bot_chats[i].pk)
        bot_response = bot_row.response
        bot_message = bot_row.message
        instance.append({human_response : human_message, bot_response: bot_message})
    return list(instance)
