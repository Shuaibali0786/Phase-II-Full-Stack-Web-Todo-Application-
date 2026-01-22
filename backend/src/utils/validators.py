from typing import Optional
from datetime import datetime
import re


def validate_email(email: str) -> bool:
    """
    Validate email format using regex
    """
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None


def validate_password_strength(password: str) -> bool:
    """
    Validate password strength:
    - At least 8 characters
    - Contains uppercase, lowercase, digit, and special character
    """
    if len(password) < 8:
        return False

    has_upper = any(c.isupper() for c in password)
    has_lower = any(c.islower() for c in password)
    has_digit = any(c.isdigit() for c in password)
    has_special = any(c in "!@#$%^&*()_+-=[]{}|;:,.<>?" for c in password)

    return has_upper and has_lower and has_digit and has_special


def validate_title_length(title: str) -> bool:
    """
    Validate task title length (1-255 characters)
    """
    return 1 <= len(title) <= 255


def convert_date_string_to_datetime(date_str: Optional[str]) -> Optional[datetime]:
    """
    Convert date string (YYYY-MM-DD) to datetime object at start of day
    """
    if not date_str:
        return None

    try:
        # Parse date string and convert to datetime at start of day (00:00:00)
        parsed_date = datetime.strptime(date_str, "%Y-%m-%d").date()
        return datetime.combine(parsed_date, datetime.min.time())
    except ValueError:
        return None


def convert_time_string_to_datetime(time_str: Optional[str], date_obj: Optional[datetime] = None) -> Optional[datetime]:
    """
    Convert time string (HH:MM) to datetime object, using provided date or today
    """
    if not time_str:
        return None

    try:
        # Parse time string
        parsed_time = datetime.strptime(time_str, "%H:%M").time()

        # Use provided date or default to today
        if date_obj:
            date_part = date_obj.date()
        else:
            date_part = datetime.now().date()

        return datetime.combine(date_part, parsed_time)
    except ValueError:
        return None


def validate_due_date_not_past(due_date_input: Optional[datetime]) -> bool:
    """
    Validate that due date is not in the past
    """
    if due_date_input is None:
        return True
    return due_date_input >= datetime.now()


def validate_reminder_before_due(
    reminder_time_input: Optional[datetime],
    due_date_input: Optional[datetime]
) -> bool:
    """
    Validate that reminder time is before due date
    """
    if reminder_time_input is None or due_date_input is None:
        return True
    return reminder_time_input < due_date_input


def validate_hex_color(color: str) -> bool:
    """
    Validate hex color format (#RRGGBB)
    """
    pattern = r'^#[0-9A-Fa-f]{6}$'
    return re.match(pattern, color) is not None


def validate_recurrence_interval(interval: int) -> bool:
    """
    Validate recurrence interval is positive
    """
    return interval > 0


def validate_max_occurrences(max_occurrences: Optional[int]) -> bool:
    """
    Validate max occurrences is positive if provided
    """
    if max_occurrences is None:
        return True
    return max_occurrences > 0