from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import models, schemas, crud, database

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],  # Angular frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables
models.Base.metadata.create_all(bind=database.engine)
@app.get("/")
def root():
    return {"message": "FastAPI backend is running!"}

# Signup endpoint
@app.post("/signup", response_model=schemas.UserResponse)
def signup(user: schemas.SignupData, db: Session = Depends(database.get_db)):
    db_user = crud.get_user_by_username_or_email(db, user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username or email already exists")
    return crud.create_user(db, user)

# Login endpoint
@app.post("/login", response_model=schemas.UserResponse)
def login(data: schemas.LoginData, db: Session = Depends(database.get_db)):
    user = crud.verify_user(db, data.username_or_email, data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid username/email or password")
    return user
