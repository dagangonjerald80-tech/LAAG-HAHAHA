from django.urls import path
from .views import RoomDetailAPIView, RoomCreateAPIView

urlpatterns = [
    path('', RoomCreateAPIView.as_view(), name='room-create'),
    path('<str:room_code>/', RoomDetailAPIView.as_view(), name='room-detail'),
]
