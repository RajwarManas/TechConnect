from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import OrderingFilter
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView

from .serializers import UserRegistrationSerializer, UserLoginSerializer, ProfileUpdateSerializer, ProfileListSerializer, SkillSerializer
from .models import User, Skill, Profile
from .pagination import ProfileListPagination

class UserRegisterAPIView(generics.CreateAPIView):
    queryset= User.objects.all()
    serializer_class = UserRegistrationSerializer


class UserLoginAPIView(APIView):
    def post(self, request):
        serializer = UserLoginSerializer(data= request.data)
        serializer.is_valid(raise_exception=True)
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
    filter_backends=[OrderingFilter]
    ordering_fields= (
        "college",
        "graduation_year",
    )
    def get_queryset(self):
        profiles = Profile.objects.all()
        skills=self.request.query_params.getlist("skill")
        college=self.request.query_params.get("college")
        availability=self.request.query_params.get("availability")
        looking_for=self.request.query_params.get("looking_for")
        if skills:
            profiles = profiles.filter(skills__id__in=skills).distinct()
        if college:
            profiles=profiles.filter(college__iexact=college)
        if availability:
            profiles=profiles.filter(availability=availability)
        if looking_for:
            profiles=profiles.filter(looking_for=looking_for)
        return profiles


class SkillsAPIView(generics.ListAPIView):
    serializer_class = SkillSerializer
    permission_classes = [IsAuthenticated]
    queryset = Skill.objects.all()