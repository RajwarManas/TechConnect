from django.urls import path
from .views import UserRegisterAPIView, UserLoginAPIView, ProfileUpdateAPIView, ProfileListAPIView, SkillsAPIView, TokenRefreshView

urlpatterns = [
    path("register/", UserRegisterAPIView.as_view(), name="UserRegisterAPIView"),
    path("login/", UserLoginAPIView.as_view(), name="UserLoginAPIView"),
    path("profile/", ProfileUpdateAPIView.as_view(), name="ProfileAPIView"),
    path("skills/", SkillsAPIView.as_view(), name="SkillsAPIView"),
    path("profiles/", ProfileListAPIView.as_view(), name="ProfileListAPIView"),
    path("token/refresh/", TokenRefreshView.as_view(), name="TokenRefreshView")
]