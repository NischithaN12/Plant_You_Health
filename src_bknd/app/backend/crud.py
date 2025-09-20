from sqlalchemy.orm import Session
import models, schemas
from passlib.context import CryptContext
from fastapi import HTTPException
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Hash password
def hash_password(password: str):
    return pwd_context.hash(password)

# Verify password
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# Get user by username OR email
def get_user_by_username_or_email(db: Session, identifier: str):
    # Check username OR email
    return db.query(models.User).filter(
        (models.User.username == identifier) | (models.User.email == identifier)
    ).first()


# Create user
from sqlalchemy.exc import IntegrityError

def create_user(db: Session, user: schemas.SignupData):
    existing_user = get_user_by_username_or_email(db, user.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email or username already exists")

    hashed_pw = hash_password(user.password)
    db_user = models.User(username=user.username, email=user.email, password=hashed_pw)
    try:
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Email or username already exists")
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Invalid data: {str(e)}")

# Verify login
def verify_user(db: Session, identifier: str, password: str):
    user = get_user_by_username_or_email(db, identifier)
    if not user or not verify_password(password, user.password):
        return None
    return user

