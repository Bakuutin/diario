from django.conf.urls import include, url

urlpatterns = [
    url('^', include('apps.days.api.urls'))
]
