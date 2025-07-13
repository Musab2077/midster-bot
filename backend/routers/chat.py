from fastapi import APIRouter
from pydantic import BaseModel
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_pinecone import PineconeVectorStore
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_groq import ChatGroq
from dotenv import find_dotenv,load_dotenv
from modules.new_chat_tb import NewChat
from modules.saving_chats_tb import Chat
import os


chat_router = APIRouter()

class BotResponse(BaseModel):
    message : str
    email_id : int
    chat_id : int

def rendering_bot():
    try:
        index_name = "midster-bot"
        embedding_model_name = 'sentence-transformers/all-MiniLM-L6-v2'

        PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
        GROQ_API_KEY = os.getenv("GROQ_API_KEY")
        dotenv_path = find_dotenv()

        x = load_dotenv(dotenv_path)

        embeddings=HuggingFaceEmbeddings(model_name= embedding_model_name)
        docsearch = PineconeVectorStore.from_existing_index(
            index_name = index_name,
            embedding = embeddings,
        )

        retriever = docsearch.as_retriever(search_type = 'similarity', search_kwargs = {'k':3})
        llm = ChatGroq(model_name = 'llama-3.3-70b-versatile',groq_api_key = GROQ_API_KEY)
        system_prompt = (
            "You are an assistant for question-answering tasks. "
            "Use the following pieces of retrieved context to answer "
            "the question. If you don't know the answer, say that you "
            "don't know. keep the "
            "answer detailed."
            "\n\n"
            "{context}"
        )

        system_prompt = ChatPromptTemplate.from_messages(
            [
                ("system", system_prompt),
                ("human", "{input}"),
            ]
        )

        question_answer_chain = create_stuff_documents_chain(llm, system_prompt)
        rag_chain = create_retrieval_chain(retriever, question_answer_chain)
        return llm, rag_chain
    except:
        return "error"

output = rendering_bot()

@chat_router.post('/bot_responses')
async def bot_responses(bot:BotResponse):
    try:
        if output == "error":
            return {"response" : "Server is busy."}
        
        llm, rag_chain = output
        med_response = rag_chain.invoke({"input": bot.message})
        def context_prompt(type_of_response):
            context_prompt = [
                ("system",
                "you are an assistant that make the big statements into small and consise"
                "I give you the statement and you have to make it into three words"
                ),
                ('human',type_of_response)]
            return context_prompt
        human_context = llm.invoke(context_prompt(bot.message)) # for making the human messages context
        bot_context = llm.invoke(context_prompt(med_response["answer"])) # for making the bot generated messages context

        # Saving in the DB
        if bot.chat_id == 0:
            new_chat = await NewChat.create(email_id = bot.email_id)
            human_chat = await Chat.create(response="human",context=human_context.content,message=bot.message, chat_id=new_chat.pk) # For saving human messages
            bot_chat = await Chat.create(response="bot",context=bot_context.content,message=med_response['answer'], chat_id=new_chat.pk) # For saving bot messages
            return {'response' : med_response['answer'], "chat_id" : bot_chat.chat_id}
        else:
            human_chat = await Chat.create(response="human",context=human_context.content,message=bot.message, chat_id=bot.chat_id) # For saving human messages
            bot_chat = await Chat.create(response="bot",context=bot_context.content,message=med_response['answer'], chat_id=bot.chat_id) # For saving bot messages
            return {'response' : med_response['answer'], "chat_id" : bot_chat.chat_id}
    except:
        return {"response" : "An error Ocurred"}