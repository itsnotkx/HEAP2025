from sqlalchemy.orm import Session, aliased
from typing import List, Optional, Any
from models.event import Event
from schemas.event import EventCreate, EventUpdate
from datetime import datetime
from sqlalchemy import func, text, select, literal_column
from sqlalchemy.dialects.postgresql import array

def get_event(db: Session, event_id: int) -> Optional[Event]:
    return db.query(Event).filter(Event.event_id == event_id).first()

def get_all_events(db: Session, skip: int = 0, limit: int = 100) -> List[Event]:
    return db.query(Event).offset(skip).limit(limit).all()

def create_event(db: Session, event_data: EventCreate) -> Event:
    db_event = Event(
        title=event_data.title,
        start_date=event_data.start_date,
        end_date=event_data.end_date,
        address=event_data.address,
        price=event_data.price,
        categories=event_data.categories,
        description=event_data.description,

    )
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

def update_event(db: Session, event_id: int, updates: EventUpdate) -> Optional[Event]:
    event = get_event(db, event_id)
    if not event:
        return None
    for key, value in updates.dict(exclude_unset=True).items():
        setattr(event, key, value)
    db.commit()
    db.refresh(event)
    return event


def delete_event(db: Session, event_id: int) -> bool:
    event = get_event(db, event_id)
    if event:
        db.delete(event)
        db.commit()
        return True
    return False

# def search_event(db: Session, start_date: datetime, end_date: datetime, user_id: int) -> List[Event]:
#     # Fetch user preferences from the database
#     user = db.execute(
#         text("SELECT preferences FROM \"users\" WHERE user_id = :user_id"),
#         {"user_id": user_id}
#     ).fetchone()
#     print(f"User preferences fetched: {user}")
#     if not user or not user[0]:
#         preferences_array = []
#     else:
#         preferences_array = user[0]
       
#     print(f"start:{start_date}, end:{end_date}, user_id:{user_id}, preferences:{preferences_array}")
    
#     # If preferences_array is empty, just return events in date range
#     if not preferences_array:
#         # Find events that overlap with the specified time range
#         # Event overlaps if: event starts before search_end AND event ends after search_start
#         sql = text("""
#             SELECT * FROM event
#             WHERE start_date < :end_date
#               AND end_date > :start_date
#         """)
#         results = db.execute(
#             sql,
#             {
#                 "start_date": start_date,
#                 "end_date": end_date,
#             }
#         ).fetchall()
#     else:
#         # preferences_array is expected to be a list of numbers (weights)
#         sql = text("""
#             SELECT e.*,
#                    (
#                        SELECT SUM(ec * pc)
#                        FROM unnest(e.categories, :preferences) AS t(ec, pc)
#                    ) AS relevance
#             FROM event e
#             WHERE e.start_date < :end_date
#               AND e.end_date > :start_date
#             ORDER BY relevance DESC NULLS LAST
#         """)
#         results = db.execute(
#             sql,
#             {
#                 "start_date": start_date,
#                 "end_date": end_date,
#                 "preferences": preferences_array,
#             }
#         ).mappings().all()
    
#     # Map results to Event objects (assuming Event has all columns in SELECT *)
#     events = []
#     for row in results:
#         print(row)
#         event_data = dict(row)
#         event_data.pop("relevance", None)  # remove relevance if not in Event model
#         events.append(Event(**event_data))
    
#     print(f"Found {len(events)} events")
#     return events

def search_event_keyword(
    db: Session,
    user_id: int,
    keyword: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None
) -> list[Event]:
    # Fetch user preferences
    user = db.execute(
        text("SELECT preferences FROM \"users\" WHERE user_id = :user_id"),
        {"user_id": user_id}
    ).fetchone()
   
    preferences_array = user[0] if user and user[0] else []
    
    print(f"Search params - keyword: {keyword}, start_date: {start_date}, end_date: {end_date}, user_id: {user_id}")
    print(f"User preferences: {preferences_array}")
    
    # Build WHERE clause dynamically
    filters = []
    params: dict[str, Any] = {"user_id": user_id}
    
    # Keyword search in title and description
    if keyword and keyword.strip():
        filters.append("(e.title ILIKE :kw OR e.description ILIKE :kw)")
        params["kw"] = f"%{keyword.strip()}%"
    
    # Date range filtering with proper overlap logic
    if start_date and end_date:
        # Find events that overlap with the specified time range
        # Event overlaps if: event starts before search_end AND event ends after search_start
        filters.append("e.start_date < :end_date AND e.end_date > :start_date")
        params["start_date"] = start_date
        params["end_date"] = end_date
    elif start_date:
        # Only start date provided - find events that end after start_date
        filters.append("e.end_date > :start_date")
        params["start_date"] = start_date
    elif end_date:
        # Only end date provided - find events that start before end_date
        filters.append("e.start_date < :end_date")
        params["end_date"] = end_date
    
    where_clause = " AND ".join(filters) if filters else "TRUE"
    
    print(f"WHERE clause: {where_clause}")
    print(f"Parameters: {params}")
    
    # SQL Query
    if preferences_array:
        sql = text(f"""
            SELECT e.*,
                   (
                       SELECT SUM(ec * pc)
                       FROM unnest(e.categories, :preferences) AS t(ec, pc)
                   ) AS relevance
            FROM event e
            WHERE {where_clause}
            ORDER BY relevance DESC NULLS LAST, e.start_date
        """)
        params["preferences"] = preferences_array
        results = db.execute(sql, params).mappings().all()
    else:
        sql = text(f"""
            SELECT * FROM event e
            WHERE {where_clause}
            ORDER BY e.start_date
        """)
        results = db.execute(sql, params).mappings().all()
    
    print(f"SQL executed: {sql}")
    print(f"Found {len(results)} results")
    
    # Convert to Event model
    events = []
    for row in results:
        row_dict = dict(row)
        row_dict.pop("relevance", None)
        events.append(Event(**row_dict))
    
    print(f"Returning {len(events)} events")
    return events
