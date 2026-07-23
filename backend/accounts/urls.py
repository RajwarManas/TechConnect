from django.urls import path 
from .views import *

urlpatterns = [
    path("register/", UserRegisterAPIView.as_view(), name="UserRegisterAPIView"),
    path("login/", UserLoginAPIView.as_view(), name="login"),
    path("logout/", UserLogoutAPIView.as_view(), name="logout"),
    path("profile/", ProfileUpdateAPIView.as_view(), name="ProfileAPIView"),
    path("skills/", SkillsAPIView.as_view(), name="skills-list"),
    path("profiles/", ProfileListAPIView.as_view(), name="profile-list"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path('project/', ProjectCreateAPIView.as_view(), name="project-craete"),
    path("projects/", ProjectListAPIView.as_view(), name="project-list"),
    path("projects/<int:pk>/", ProjectDetailAPIView.as_view(), name="project-detail"),
    path("projects/<int:pk>/join/", SendJoinRequestAPIView.as_view(), name="send-join-request"),
    path("join-requests/<int:pk>/accept/", AcceptJoinRequestAPIView.as_view(), name="accept-join-request"),
    path("join-requests/<int:pk>/reject/", RejectJoinRequestAPIView.as_view(), name="reject-join-request"),
    path("join-requests/", MyJoinRequestsAPIVIew.as_view(), name="list-join-requests"),
    path("projects/<int:pk>/join-requests/", ProjectJoinRequestsAPIView.as_view(), name="list-project-join-requests"),
    path("dashboard/", DashboardAPIView.as_view(), name="dashboard")
]