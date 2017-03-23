from django.conf import settings
from django.conf.urls import url, include, static

urlpatterns = [
    url(r'^api/', include('diario.api', namespace='api')),
    # static.static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
]
