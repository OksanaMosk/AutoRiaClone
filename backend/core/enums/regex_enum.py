from enum import Enum
import re

from django.core.exceptions import ValidationError
from profanity_check import predict


class RegexEnum(Enum):
    NAME=(
        r'^[A-Z][a-z]{,29}$',
        'Only alphanumeric characters are allowed.',
    )
    def __init__(self, pattern:str,msg:str):
        self.pattern = pattern
        self.msg = msg

    def validate(self, value: str):
        if not re.match(self.pattern, value):
            raise ValueError(self.msg)
