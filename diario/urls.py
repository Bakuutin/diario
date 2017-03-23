from django.conf import settings
from django.conf.urls import url, include, static

from django.views.generic import TemplateView

urlpatterns = [
    url(r'^api/', include('diario.api', namespace='api')),
    url(r'^$', TemplateView.as_view(template_name='index.html')),
] + static.static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
