from django.urls import path
from .views import UserRegisterAPIView, UserLoginAPIView, ProfileAPIView

urlpatterns = [
    path("register/", UserRegisterAPIView.as_view(), name="UserRegisterAPIView"),
    path("login/", UserLoginAPIView.as_view(), name="UserLoginAPIView"),
    path("profile/", ProfileAPIView.as_view(), name="ProfileAPIView")
]