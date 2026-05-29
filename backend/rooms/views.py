from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import LaagRoom
from .serializers import LaagRoomSerializer
from datetime import datetime, timedelta, timezone

class RoomDetailAPIView(APIView):
    """
    Retrieve or update a specific laag room by room_code.
    """
    def get(self, request, room_code):
        try:
            room = LaagRoom.objects.get(room_code=room_code)
            serializer = LaagRoomSerializer(room)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except LaagRoom.DoesNotExist:
            return Response({"detail": "Room not found."}, status=status.HTTP_404_NOT_FOUND)

    def patch(self, request, room_code):
        try:
            room = LaagRoom.objects.get(room_code=room_code)
        except LaagRoom.DoesNotExist:
            return Response({"detail": "Room not found."}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = LaagRoomSerializer(room, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RoomCreateAPIView(APIView):
    """
    Create a new laag room, or update it if it already exists (upsert).
    """
    def post(self, request):
        room_code = request.data.get('room_code')
        if not room_code:
            return Response({"room_code": ["This field is required."]}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if the room already exists (for upsert support)
        try:
            room = LaagRoom.objects.get(room_code=room_code)
            serializer = LaagRoomSerializer(room, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except LaagRoom.DoesNotExist:
            # Create a new entry
            serializer = LaagRoomSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RoomHeartbeatAPIView(APIView):
    """
    Heartbeat endpoint: POST {"room_code": "...", "nickname": "..."}
    Updates the user's last_seen timestamp in the room's active_users list.
    Removes users who haven't sent a heartbeat in >60 seconds.
    """
    def post(self, request):
        room_code = request.data.get('room_code')
        nickname = request.data.get('nickname', '').strip()
        if not room_code or not nickname:
            return Response(
                {"error": "room_code and nickname are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            room = LaagRoom.objects.get(room_code=room_code)
        except LaagRoom.DoesNotExist:
            return Response({"detail": "Room not found."}, status=status.HTTP_404_NOT_FOUND)

        now = datetime.now(timezone.utc)
        cutoff = now - timedelta(seconds=60)
        current_users = room.active_users if isinstance(room.active_users, list) else []

        # Remove stale users (inactive for >60s)
        active = []
        for u in current_users:
            try:
                last_seen = datetime.fromisoformat(u.get('last_seen', ''))
                if last_seen.tzinfo is None:
                    last_seen = last_seen.replace(tzinfo=timezone.utc)
                if last_seen > cutoff:
                    active.append(u)
            except (ValueError, TypeError):
                pass  # Remove malformed entries

        # Update or add the current user
        found = False
        for u in active:
            if u['nickname'].lower() == nickname.lower():
                u['last_seen'] = now.isoformat()
                found = True
                break
        if not found:
            active.append({'nickname': nickname, 'last_seen': now.isoformat()})

        room.active_users = active
        room.save(update_fields=['active_users'])

        return Response({
            "active_users": active,
            "count": len(active)
        }, status=status.HTTP_200_OK)

