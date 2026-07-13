from rest_framework import generics, status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import UserRegistrationSerializer, UserLoginSerializer, ProfileUpdateSerializer, ProfileListSerializer, SkillSerializer
from .models import User, Skill, Profile
from .pagination import ProfileListPagination

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
    

class ProfileUpdateAPIView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileUpdateSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user.profile
    

class ProfileListAPIView(generics.ListAPIView):
    serializer_class=ProfileListSerializer
    pagination_class=ProfileListPagination
    permission_classes=[IsAuthenticated]
    queryset=Profile.objects.all()  

class SkillsAPIView(generics.ListAPIView):
    serializer_class = SkillSerializer
    permission_classes = [IsAuthenticated]
    queryset = Skill.objects.all()