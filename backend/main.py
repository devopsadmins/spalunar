from __future__ import annotations

import os
from datetime import datetime, timezone
from typing import Optional

from fastapi import Depends, FastAPI, Header, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from slugify import slugify
from sqlmodel import Field as SQLField
from sqlmodel import Session, SQLModel, create_engine, desc, select


class BlogPost(SQLModel, table=True):
    id: Optional[int] = SQLField(default=None, primary_key=True)
    title: str = SQLField(index=True)
    slug: str = SQLField(index=True, unique=True)
    excerpt: Optional[str] = None
    content_md: str
    cover_image: Optional[str] = None
    published: bool = SQLField(default=False, index=True)
    created_at: datetime = SQLField(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = SQLField(default_factory=lambda: datetime.now(timezone.utc))
    published_at: Optional[datetime] = SQLField(default=None, index=True)


class BlogPostCreate(BaseModel):
    title: str = Field(min_length=5, max_length=180)
    excerpt: Optional[str] = Field(default=None, max_length=320)
    content_md: str = Field(min_length=20)
    cover_image: Optional[str] = Field(default=None, max_length=500)
    slug: Optional[str] = Field(default=None, max_length=220)
    published: bool = False


class BlogPostUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=5, max_length=180)
    excerpt: Optional[str] = Field(default=None, max_length=320)
    content_md: Optional[str] = Field(default=None, min_length=20)
    cover_image: Optional[str] = Field(default=None, max_length=500)
    slug: Optional[str] = Field(default=None, max_length=220)
    published: Optional[bool] = None


class BlogPostOut(BaseModel):
    id: int
    title: str
    slug: str
    excerpt: Optional[str]
    content_md: str
    cover_image: Optional[str]
    published: bool
    created_at: datetime
    updated_at: datetime
    published_at: Optional[datetime]


class BlogPostListItem(BaseModel):
    id: int
    title: str
    slug: str
    excerpt: Optional[str]
    cover_image: Optional[str]
    published_at: Optional[datetime]


DATABASE_URL = os.getenv("BLOG_DATABASE_URL", "sqlite:///./blog.db")
engine = create_engine(DATABASE_URL, echo=False, connect_args={"check_same_thread": False})

app = FastAPI(title="SPA LUNAR Blog API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://spalunar.com.br",
        "http://localhost:4321",
        "http://127.0.0.1:4321",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_session():
    with Session(engine) as session:
        yield session


def ensure_admin(x_admin_token: Optional[str] = Header(default=None)) -> None:
    expected = os.getenv("BLOG_ADMIN_TOKEN", "change-me")
    if not x_admin_token or x_admin_token != expected:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid admin token")


def unique_slug(session: Session, title: str, preferred_slug: Optional[str], current_id: Optional[int] = None) -> str:
    base = slugify(preferred_slug or title)
    if not base:
        base = f"post-{int(datetime.now(timezone.utc).timestamp())}"

    candidate = base
    suffix = 1
    while True:
        query = select(BlogPost).where(BlogPost.slug == candidate)
        found = session.exec(query).first()
        if not found or found.id == current_id:
            return candidate
        suffix += 1
        candidate = f"{base}-{suffix}"


@app.on_event("startup")
def on_startup() -> None:
    SQLModel.metadata.create_all(engine)


@app.get("/healthz")
def healthz() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/blog/posts", response_model=list[BlogPostListItem])
def list_posts(
    published_only: bool = Query(default=True),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=12, ge=1, le=50),
    session: Session = Depends(get_session),
) -> list[BlogPostListItem]:
    statement = select(BlogPost)
    if published_only:
        statement = statement.where(BlogPost.published == True)  # noqa: E712
    statement = statement.order_by(desc(BlogPost.published_at), desc(BlogPost.created_at))
    statement = statement.offset((page - 1) * page_size).limit(page_size)

    rows = session.exec(statement).all()
    return [
        BlogPostListItem(
            id=item.id,
            title=item.title,
            slug=item.slug,
            excerpt=item.excerpt,
            cover_image=item.cover_image,
            published_at=item.published_at,
        )
        for item in rows
        if item.id is not None
    ]


@app.get("/api/blog/posts/{slug}", response_model=BlogPostOut)
def get_post(slug: str, session: Session = Depends(get_session)) -> BlogPostOut:
    row = session.exec(select(BlogPost).where(BlogPost.slug == slug, BlogPost.published == True)).first()  # noqa: E712
    if not row:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")

    return BlogPostOut(
        id=row.id,
        title=row.title,
        slug=row.slug,
        excerpt=row.excerpt,
        content_md=row.content_md,
        cover_image=row.cover_image,
        published=row.published,
        created_at=row.created_at,
        updated_at=row.updated_at,
        published_at=row.published_at,
    )


@app.get("/api/blog/admin/posts", response_model=list[BlogPostListItem], dependencies=[Depends(ensure_admin)])
def list_posts_admin(session: Session = Depends(get_session)) -> list[BlogPostListItem]:
    rows = session.exec(select(BlogPost).order_by(desc(BlogPost.updated_at))).all()
    return [
        BlogPostListItem(
            id=item.id,
            title=item.title,
            slug=item.slug,
            excerpt=item.excerpt,
            cover_image=item.cover_image,
            published_at=item.published_at,
        )
        for item in rows
        if item.id is not None
    ]


@app.post("/api/blog/admin/posts", response_model=BlogPostOut, dependencies=[Depends(ensure_admin)])
def create_post(payload: BlogPostCreate, session: Session = Depends(get_session)) -> BlogPostOut:
    now = datetime.now(timezone.utc)
    row = BlogPost(
        title=payload.title.strip(),
        slug=unique_slug(session, payload.title, payload.slug),
        excerpt=(payload.excerpt or "").strip() or None,
        content_md=payload.content_md.strip(),
        cover_image=(payload.cover_image or "").strip() or None,
        published=payload.published,
        created_at=now,
        updated_at=now,
        published_at=now if payload.published else None,
    )
    session.add(row)
    session.commit()
    session.refresh(row)

    return BlogPostOut(
        id=row.id,
        title=row.title,
        slug=row.slug,
        excerpt=row.excerpt,
        content_md=row.content_md,
        cover_image=row.cover_image,
        published=row.published,
        created_at=row.created_at,
        updated_at=row.updated_at,
        published_at=row.published_at,
    )


@app.put("/api/blog/admin/posts/{post_id}", response_model=BlogPostOut, dependencies=[Depends(ensure_admin)])
def update_post(post_id: int, payload: BlogPostUpdate, session: Session = Depends(get_session)) -> BlogPostOut:
    row = session.get(BlogPost, post_id)
    if not row:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")

    if payload.title is not None:
        row.title = payload.title.strip()
    if payload.excerpt is not None:
        row.excerpt = payload.excerpt.strip() or None
    if payload.content_md is not None:
        row.content_md = payload.content_md.strip()
    if payload.cover_image is not None:
        row.cover_image = payload.cover_image.strip() or None
    if payload.slug is not None or payload.title is not None:
        row.slug = unique_slug(session, row.title, payload.slug, current_id=row.id)

    if payload.published is not None:
        row.published = payload.published
        if payload.published and not row.published_at:
            row.published_at = datetime.now(timezone.utc)
        if not payload.published:
            row.published_at = None

    row.updated_at = datetime.now(timezone.utc)
    session.add(row)
    session.commit()
    session.refresh(row)

    return BlogPostOut(
        id=row.id,
        title=row.title,
        slug=row.slug,
        excerpt=row.excerpt,
        content_md=row.content_md,
        cover_image=row.cover_image,
        published=row.published,
        created_at=row.created_at,
        updated_at=row.updated_at,
        published_at=row.published_at,
    )


@app.delete("/api/blog/admin/posts/{post_id}", dependencies=[Depends(ensure_admin)])
def delete_post(post_id: int, session: Session = Depends(get_session)) -> dict[str, bool]:
    row = session.get(BlogPost, post_id)
    if not row:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")

    session.delete(row)
    session.commit()
    return {"deleted": True}
