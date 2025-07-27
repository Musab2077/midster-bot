from fastapi import APIRouter
from pydantic import BaseModel
from modules.saving_chats_tb import Chat
from modules.new_chat_tb import NewChat

loading_chats = APIRouter()
    
class Accessing(BaseModel):
    email_id : int
    chat_id : int

@loading_chats.get('/loading_chats/{email_id}')
async def loading_chat(email_id):
    newchats = await NewChat.filter(email_id=email_id)
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
async def accessing_chats(arg: Accessing):
    if arg.chat_id > 0:
        chat = await Chat.exists(chat_id = arg.chat_id)
    if chat:
        chats = await Chat.filter(chat_id = arg.chat_id)
        newchat = await NewChat.get(pk = arg.chat_id)
        if newchat.email_id == arg.email_id:
            human_chats = chats[0::2]
            bot_chats = chats[1::2]
            context = bot_chats[0].context
            instance = []
            for i in range(len(bot_chats)):
                human_row = await human_chats[i].get(id=human_chats[i].pk)
                human_response = human_row.response
                human_message = human_row.message
                
                bot_row = await bot_chats[i].get(id=bot_chats[i].pk)
                bot_response = bot_row.response
                bot_message = bot_row.message
                instance.append({human_response : human_message, bot_response: bot_message})
            return {"exist" : True,
                    "response" : list(instance),
                    "context" : context}
        else:
            return {"exist" : False}
    return {"exist" : False}

@loading_chats.delete('/deleting_chat/{id}')
async def deleting_the_chat(id):
    chat = await Chat.filter(chat_id=id).delete()
    new_chat = await NewChat.filter(new=id).delete()
    return {"response" : "Successfully deleted"}