from rest_framework import generics, status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import UserRegistrationSerializer, UserLoginSerializer, ProfileSerializer
from .models import User


class UserRegisterAPIView(generics.CreateAPIView):
    queryset= User.objects.all()
    serializer_class = UserRegistrationSerializer


class UserLoginAPIView(APIView):
    def post(self, request):
        serializer = UserLoginSerializer(data= request.data)
        serializer.is_valid(raise_exception= True)
        user = serializer.validated_data["user"]
        refresh = RefreshToken.for_user(user)
        return Response(
            data = {"refresh": str(refresh), "access": str(refresh.access_token)},
            status = status.HTTP_200_OK
            )
    

class ProfileAPIView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user.profile