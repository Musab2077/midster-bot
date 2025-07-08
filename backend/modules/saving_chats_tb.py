from tortoise import fields
from tortoise.models import Model

class Chat(Model):
    chat = fields.ForeignKeyField('models.NewChat')
    response = fields.CharField(max_length=100) # Bot message or human human message
    context = fields.CharField(max_length=100) # the context of both bot and human so that it can remember previous chats
    message = fields.TextField() # The messages and response of bot and human