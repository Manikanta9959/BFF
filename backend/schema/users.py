from pydantic import BaseModel

class User(BaseModel):
    username: str
    password: str
    email : str

    class Config:
        response_schema_ex = {
            "username": "maniii",
            "password": "123456",
            "email" : "mani@yopmail.com"

        }
        schema_extra = {"example": response_schema_ex}


class UserLogin(BaseModel):
    username: str
    password: str

    class Config:
        response_schema_ex = {
            "username": "maniii",
            "password": "123456",
        }
        schema_extra = {"example": response_schema_ex}