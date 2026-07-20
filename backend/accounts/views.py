from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.exceptions import PermissionDenied
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView
from drf_spectacular.utils import extend_schema, OpenApiParameter
from django.shortcuts import get_object_or_404

from .serializers import *
from .permissions import *
from .models import *
from .pagination import *

@extend_schema(
    summary="Register a new user",
    description="Creates a new user account and automatically creates an associated profile",
    tags=["Authentication"]
)
class UserRegisterAPIView(generics.CreateAPIView):
    queryset= User.objects.all()
    serializer_class = UserRegistrationSerializer

@extend_schema(
    summary="Authenticate user",
    description="Authenticate using email and password and return JWT access and refresh tokens.",
    tags=["Authentication"]
)
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
    

class UserLogoutAPIView(APIView):
    permission_classes=[IsAuthenticated]
    serializer_class=UserLogoutSerializer
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            {"detail": "Successfully logged out."},
            status=status.HTTP_200_OK
        )
        
    
@extend_schema(
    summary="Retrieve or update profile",
    description="Retrieve or update authenticated user's profile information",
    tags=["Profile"]
)
class ProfileUpdateAPIView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileUpdateSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user.profile
    
@extend_schema(
    summary="List student profiles",
    description="Retrieve a paginated list of student profiles with support for filtering and ordering",
    tags=["Discovery"],
    parameters=[
        OpenApiParameter(
            name="college",
            type=str,
            location=OpenApiParameter.QUERY,
            required=False,
            description="Filter profiles by college name.",
        ),
        OpenApiParameter(
            name="skill",
            type=int,
            location=OpenApiParameter.QUERY,
            required=False,
            description="Filter profiles by one or more skill IDs. Repeat the parameterto filter by multiple skills."
        ),
        OpenApiParameter(
            name="availability",
            type=str,
            location=OpenApiParameter.QUERY,
            required=False,
            description="Filter profiles by availability status"
        ),
        OpenApiParameter(
            name="looking_for",
            type=str,
            location=OpenApiParameter.QUERY,
            required=False,
            description="Filter profiles by collaboration preference"
        ),OpenApiParameter(
            name="ordering",
            type=str,
            location=OpenApiParameter.QUERY,
            required=False,
            description="Order profiles by supported fields such as college or graduation_year"
        ),
    ],
)
class ProfileListAPIView(generics.ListAPIView):
    serializer_class=ProfileListSerializer
    pagination_class=StandardPagination
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

@extend_schema(
    summary="List predefined skills",
    description="Retrieve all available predefined skills",
    tags=["Skills"]
)
class SkillsAPIView(generics.ListAPIView):
    serializer_class = SkillSerializer
    permission_classes = [IsAuthenticated]
    queryset = Skill.objects.all()

class ProjectCreateAPIView(generics.CreateAPIView):
    serializer_class=ProjectCreateSerializer
    permission_classes=[IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class ProjectListAPIView(generics.ListAPIView):
    serializer_class=ProjectListSerializer
    pagination_class=StandardPagination
    permission_classes=[IsAuthenticated]
    filter_backends=[OrderingFilter, SearchFilter]
    ordering_fields=(
        "title",
        "created_at",
        "updated_at",
    )
    search_fields=(
        "title",
        "description",
    )

    def get_queryset(self):
        projects=Project.objects.filter(is_active=True)
        required_skills=self.request.query_params.getlist("required_skills")
        status=self.request.query_params.get("status")
        owner=self.request.query_params.get("owner")
        if required_skills:
            projects=projects.filter(required_skills__id__in=required_skills).distinct()
        if status:
            projects=projects.filter(status=status)
        if owner == "me":
            projects=projects.filter(owner=self.request.user)
        return projects
    
class ProjectDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes=[IsAuthenticated, IsProjectOwner]
    queryset=Project.objects.filter(is_active=True)
    
    def get_serializer_class(self):
        if self.request.method=="GET":
            return ProjectListSerializer
        return ProjectUpdateSerializer
    

### Join Requests

class SendJoinRequestAPIView(APIView):
    permission_classes=[IsAuthenticated]
    def post(self, request, pk):
        project=get_object_or_404(Project, pk=pk)
        
        if not project.is_active:
            return Response(
                {"detail": "Project is no longer active"},
                status=status.HTTP_400_BAD_REQUEST
            )
        if project.status!=project.Status.RECRUITING:
            return Response(
                {"detail": "Project is no longer recruiting"},
                status=status.HTTP_400_BAD_REQUEST
            )
        if project.owner==request.user:
            return Response(
                {"detail": "Project owner can't be a member"},
                status=status.HTTP_400_BAD_REQUEST
            )
        if project.members.filter(id=request.user.id).exists():
            return Response(
                {"detail": "User is already a member"},
                status=status.HTTP_400_BAD_REQUEST
            )
        if JoinRequest.objects.filter(
            user=request.user,
            project=project
        ).exists():
            return Response(
                {"detail": "User has already sent a join request"},
                status=status.HTTP_400_BAD_REQUEST
            )

        JoinRequest.objects.create(
            user=request.user,
            project=project,
        )
        return Response(
            {"detail": "Join request sent successfully!"},
            status=status.HTTP_201_CREATED
        )

class AcceptJoinRequestAPIView(APIView):
    permission_classes=[IsAuthenticated]

    def patch(self, request, pk):
        join_request=get_object_or_404(JoinRequest, pk=pk)
        if request.user!=join_request.project.owner:
            return Response(
                {"detail": "You are not authorized to accept requests"},
                status=status.HTTP_403_FORBIDDEN
            )
        if join_request.status!=JoinRequest.Status.PENDING:
            return Response(
                {"detail": "Request is no longer pending"},
                status=status.HTTP_400_BAD_REQUEST
            )
        if join_request.project.members.count()>=join_request.project.max_members:
            return Response(
                {"detail": "Project has reached its maximum member capacity"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        join_request.status=JoinRequest.Status.ACCEPTED
        join_request.project.members.add(join_request.user)
        if join_request.project.members.count() == join_request.project.max_members:
            join_request.project.status=Project.Status.FULL
        join_request.save()
        join_request.project.save()
        return Response(
            {"detail": "Request accepted successfully"},
            status=status.HTTP_200_OK
        )
    
class RejectJoinRequestAPIView(APIView):
    permission_classes=[IsAuthenticated]

    def patch(self, request, pk):
        join_request=get_object_or_404(JoinRequest, pk=pk)
        if request.user != join_request.project.owner:
            return Response(
                {"detail": "You are not authorized to reject requests"},
                status=status.HTTP_403_FORBIDDEN
            )
        if join_request.status != JoinRequest.Status.PENDING:
            return Response(
                {"detail": "Request is no longer pending"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        join_request.status=JoinRequest.Status.REJECTED
        join_request.save()
        return Response(
            {"detail": "Request rejected successfully"},
            status=status.HTTP_200_OK
        )
    
class MyJoinRequestsAPIVIew(generics.ListAPIView):
    permission_classes=[IsAuthenticated]
    pagination_class=StandardPagination
    serializer_class=JoinRequestListSerializer
    def get_queryset(self):
        return JoinRequest.objects.filter(user=self.request.user)
    
class ProjectJoinRequestsAPIView(generics.ListAPIView):
    permission_classes=[IsAuthenticated]
    pagination_class=StandardPagination
    serializer_class=JoinRequestListSerializer

    def get_queryset(self):
        project=get_object_or_404(Project, pk=self.kwargs["pk"])
        if project.owner != self.request.user:
            raise PermissionDenied(
                "You are not authorized to view join requests for this project."
            )
        return project.join_requests.all()
    

class DashboardAPIView(APIView):
    serializer_class=DashboardSerializer

    def get(self, request):
        data={
            "projects_owned": Project.objects.filter(owner=request.user).count(),
            "projects_joined": request.user.member_projects.count(),
            "pending_requests_received": JoinRequest.objects.filter(
                project__owner=request.user,
                status=JoinRequest.Status.PENDING
            ).count(),
            "pending_requests_sent": JoinRequest.objects.filter(
                user=request.user,
                status=JoinRequest.Status.PENDING
            ).count(),
            "recruiting_projects": Project.objects.filter(
                owner=request.user,
                status=Project.Status.RECRUITING
            ).count(),
            "completed_projects": Project.objects.filter(
                owner=request.user,
                status=Project.Status.COMPLETED
            ).count()
        }

        serializer=DashboardSerializer(data)
        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )