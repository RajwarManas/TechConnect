from django.urls import path 
from .views import *

urlpatterns = [
    path("register/", UserRegisterAPIView.as_view(), name="UserRegisterAPIView"),
    path("login/", UserLoginAPIView.as_view(), name="login"),
    path("logout/", UserLogoutAPIView.as_view(), name="logout"),
    path("skills/", SkillsAPIView.as_view(), name="skills-list"),
    path("profile/", ProfileUpdateAPIView.as_view(), name="ProfileAPIView"),
    path("profiles/", ProfileListAPIView.as_view(), name="profile-list"),
    path("profiles/<int:pk>/", ProfileDetailAPIView.as_view()),
    path("token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path('projects/create/', ProjectCreateAPIView.as_view(), name="project-create"),
    path("projects/", ProjectListAPIView.as_view(), name="project-list"),
    path("projects/me/", MyProjectsAPIView.as_view(),name= "my-projects" ),
    path("projects/<int:pk>/", ProjectDetailAPIView.as_view(), name="project-detail"),
    path("projects/<int:pk>/join/", SendJoinRequestAPIView.as_view(), name="send-join-request"),
    path("join-requests/<int:pk>/accept/", AcceptJoinRequestAPIView.as_view(), name="accept-join-request"),
    path("join-requests/<int:pk>/reject/", RejectJoinRequestAPIView.as_view(), name="reject-join-request"),
    path("join-requests/my/", MyJoinRequestsAPIVIew.as_view(), name="my-join-requests"),
    path("projects/<int:pk>/join-requests/", ProjectJoinRequestsAPIView.as_view(), name="list-project-join-requests"),
    path("dashboard/", DashboardAPIView.as_view(), name="dashboard")
]