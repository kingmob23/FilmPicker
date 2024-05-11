from sqlalchemy import Column, ForeignKey, Integer, String, Table, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///./film_picker.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


watchlist_association_table = Table(
    "watchlist",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id")),
    Column("film_id", Integer, ForeignKey("films.id")),
)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    watchlist = relationship(
        "Film", secondary=watchlist_association_table, back_populates="users"
    )


class Film(Base):
    __tablename__ = "films"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    users = relationship(
        "User", secondary=watchlist_association_table, back_populates="watchlist"
    )


Base.metadata.create_all(bind=engine)


def create_user(db, username):
    user = User(username=username)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def create_film(db, title):
    film = Film(title=title)
    db.add(film)
    db.commit()
    db.refresh(film)
    return film


def add_film_to_user_watchlist(db, user_id, film_id):
    user = db.query(User).filter(User.id == user_id).first()
    film = db.query(Film).filter(Film.id == film_id).first()
    if not film or not user:
        return None
    user.watchlist.append(film)
    db.commit()
    return user


def get_user_watchlist(db, user_id):
    user = db.query(User).filter(User.id == user_id).first()
    if user:
        return [film.title for film in user.watchlist]
    return []
