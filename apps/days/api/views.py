from rest_framework import viewsets

from ..models import Day
from .serializers import DaySerializer
from .filters import DayFilter


class DayViewSet(viewsets.ModelViewSet):
    queryset = Day.objects.all()
    serializer_class = DaySerializer
    filter_class = DayFilter
    lookup_field = 'date'
