from pydantic import BaseModel, EmailStr

class SignupData(BaseModel):
    username: str
    email: EmailStr
    password: str

class LoginData(BaseModel):
    username_or_email: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr

    class Config:
        from_attributes = True  # updated for Pydantic V2
