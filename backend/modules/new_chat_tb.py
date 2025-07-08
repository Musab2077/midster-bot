from tortoise import fields
from tortoise.models import Model

class NewChat(Model):
    new = fields.IntField(pk=True)
    email = fields.ForeignKeyField('models.User') # email id
    