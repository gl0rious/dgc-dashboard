from django.urls import include, path
from rest_framework import routers
from restapp.views import BenifMandatViewSet, CreditViewSet, MandatListViewSet, MandatTreeViewSet, OrdonnateurViewSet, MandatViewSet, PersonneViewSet

router = routers.DefaultRouter()
router.register(r'ordonnateurs', OrdonnateurViewSet)
router.register(r'personnes', PersonneViewSet)
router.register(r'mandats', MandatViewSet)
# router.register(r'mandats', MandatListViewSet)
# router.register(r'benifs', BenifMandatViewSet)
# router.register(r'portef', PortefViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('api/', include(router.urls)),
    path('api/depenses/', CreditViewSet.as_view()),
    path('api/mandats_tree/', MandatTreeViewSet.as_view()),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]
