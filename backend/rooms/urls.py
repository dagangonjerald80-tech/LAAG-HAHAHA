from django.urls import path
from .views import RoomDetailAPIView, RoomCreateAPIView, RoomHeartbeatAPIView

urlpatterns = [
    path('', RoomCreateAPIView.as_view(), name='room-create'),
    path('heartbeat/', RoomHeartbeatAPIView.as_view(), name='room-heartbeat'),
    path('<str:room_code>/', RoomDetailAPIView.as_view(), name='room-detail'),
]

