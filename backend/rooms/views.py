from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import LaagRoom
from .serializers import LaagRoomSerializer

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
