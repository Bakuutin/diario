from rest_framework import routers

from .views import PersonViewSet

router = routers.SimpleRouter()
router.register(r'persons', PersonViewSet)

urlpatterns = router.urls
