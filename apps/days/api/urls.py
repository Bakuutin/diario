from rest_framework import routers

from .views import DayViewSet

router = routers.SimpleRouter()
router.register(r'days', DayViewSet)

urlpatterns = router.urls
