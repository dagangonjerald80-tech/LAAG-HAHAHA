from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def home_view(request):
    return JsonResponse({
        "status": "Laag Plan Backend is running successfully!",
        "database": "Supabase PostgreSQL connected",
        "endpoints": {
            "rooms_api": "/api/rooms/<room_code>/"
        }
    })

urlpatterns = [
    path('', home_view, name='home'),
    path('admin/', admin.site.urls),
    path('api/rooms/', include('rooms.urls')),
]
