from fastapi import APIRouter
import jwt 
from pydantic import BaseModel,EmailStr
from modules.auth_tb import User
from modules.new_chat_tb import NewChat
from modules.saving_chats_tb import Chat

auth_router = APIRouter()

class Auth(BaseModel):
    email : EmailStr
    password : str

class EmailId(BaseModel):
    email_id : int = 0
    
class Chat_(BaseModel):
    response : str
    context : str
    message : str
    chat_id : int = 0

def extracting_username(email):
    name = email.split('@')[0]
    return name

@auth_router.post('/signup')
async def authorization(auth:Auth):
    user = await User.all()
    try:
        if user == []:
            name = extracting_username(auth.email)
            encoded_password = jwt.encode({"password": auth.password}, name, 'HS256')
            user = await User.create(email=auth.email, password=encoded_password, username=name)
            return {'response' : "Sign-Up successful",
                    'token' : encoded_password,
                    "id": user.id}
        else:
            for row in user:
                if row.email == auth.email:
                    return {'response' : 'Email is taken.',
                            "verification": False}
            if len(auth.password) >= 8:
                name = extracting_username(auth.email)
                encoded_password = jwt.encode({"password": auth.password}, name, 'HS256')
                user = await User.create(email=auth.email, password=encoded_password, username=name)
                return {'response' : "Sign-Up successful",
                        "verification": True,
                        'token' : encoded_password,
                        "email_id": user.id,
                        "email": user.email}
            else:
                return {'response' : 'Password should be greater than 8 characters'}
    except Exception as e:
        print(e)
        return {'error' : e}

@auth_router.post('/signin')
async def authorization(auth:Auth):
    try:
        user = await User.all()
        name = extracting_username(auth.email)
        user = await User.get(email=auth.email)
        decoded_password = jwt.decode(user.password, name, ['HS256'])
        decoded_password = decoded_password['password']
        if auth.password == decoded_password:
            return {'response': "Sign-In successfully.",
                "token" : user.password,
                'verification' : True,
                "email_id": user.id,
                "email": user.email}
    except:
        return {'response': 'In-valid Credentials.',
                'verification' : False,
                }

# @auth_router.post('/saving_chats')
# async def example(arg1: EmailId,arg2:Chat_):
#     if arg2.chat_id == 0:
#         new_chat = await NewChat.create(email_id = arg1.email_id)
#         chat = await Chat.create(response=arg2.response,context=arg2.context,message=arg2.message, chat_id=new_chat.pk)
#         all = await chat.filter(chat_id = new_chat.pk)
#     else:
#         chat = await Chat.create(response=arg2.response,context=arg2.context,message=arg2.message, chat_id=arg2.chat_id)
#         print(chat)
        
#     # user = await User.all()
#     # example = await Chat_.create(email=arg.email_id)
#     # example = await Chat.create(response=arg.response,context=arg.context,message=arg.message, chat_id=new_chat.pk)
#     # print(example.all())
    
# @auth_router.post('/example_new_chat')
# async def example(arg1:EmailId, arg2:Chat_):
#     new_chat = await NewChat.filter(email_id=arg1.email_id)
#     print(new_chat)
#     # print(example.email.email)
#     # user = await User.get(email=example[0].email)
#     # print(user)
#     # for i in example:
#     #     print(i.email_id)