from django.urls import path
from .views import UserRegisterAPIView, UserLoginAPIView, ProfileUpdateAPIView, ProfileListAPIView, SkillsAPIView

urlpatterns = [
    path("register/", UserRegisterAPIView.as_view(), name="UserRegisterAPIView"),
    path("login/", UserLoginAPIView.as_view(), name="UserLoginAPIView"),
    path("profile/", ProfileUpdateAPIView.as_view(), name="ProfileAPIView"),
    path("skills/", SkillsAPIView.as_view(), name="SkillsAPIView"),
    path("profiles/", ProfileListAPIView.as_view(), name="ProfileListAPIView")
]