import django_filters

from ..models import Day


class DayFilter(django_filters.rest_framework.FilterSet):
    date_from = django_filters.DateFilter(name='date', lookup_expr='gte')
    date_to = django_filters.DateFilter(name='date', lookup_expr='lte')

    class Meta:
        model = Day
        fields = ['date_from', 'date_to']
