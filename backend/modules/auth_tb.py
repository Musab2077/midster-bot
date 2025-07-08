from tortoise import fields
from tortoise.models import Model

class User(Model):
    id = fields.IntField(pk=True)
    email = fields.CharField(max_length=100, unique=True)
    username = fields.CharField(max_length=100)
    password = fields.CharField(max_length=255)