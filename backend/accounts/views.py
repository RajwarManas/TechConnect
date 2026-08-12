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
from django.db.models import Count, Q

from .serializers import *
from .permissions import *
from .models import *
from .pagination import *


### AUTHENTICATION

@extend_schema(
    summary="Register a new user",
    description="Creates a new user account and automatically creates an associated profile",
    tags=["Authentication"],
    responses={201: UserRegistrationSerializer}
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
    
@extend_schema(
    summary="Logout User",
    description="Logout users using refresh token blacklisting",
    tags=["Authentication"]
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
        

### PROFILE 

@extend_schema(
    summary="Retrieve or update profile",
    description="Retrieve or update authenticated user's profile information",
    tags=["Profile"],
    responses={200: ProfileUpdateSerializer}
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
    responses={200: ProfileListSerializer(many=True)}
)
class ProfileListAPIView(generics.ListAPIView):
    serializer_class = ProfileListSerializer
    pagination_class = StandardPagination
    permission_classes = [IsAuthenticated]
    filter_backends = [
        SearchFilter,
        OrderingFilter,
    ]
    search_fields = [
        "user__username",
        "bio",
        "college",
        "branch",
    ]
    ordering_fields = (
        "college",
        "graduation_year",
    )
    def get_queryset(self):
        profiles = Profile.objects.all()

        skills = self.request.query_params.getlist("skill")

        print("SKILLS RECEIVED:", skills)

        college = self.request.query_params.get("college")
        availability = self.request.query_params.get("availability")
        looking_for = self.request.query_params.get("looking_for")

        if skills:
            profiles = profiles.filter(skills__id__in=skills).distinct()

        if college:
            profiles = profiles.filter(college__icontains=college)

        if availability:
            profiles = profiles.filter(availability=availability)

        if looking_for:
            profiles = profiles.filter(looking_for=looking_for)

        return profiles
    
class ProfileDetailAPIView(generics.RetrieveAPIView):
    serializer_class = ProfileListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Profile.objects.all()
    
    def get_object(self):
        return Profile.objects.get(user_id=self.kwargs["pk"])


### SKILLS

@extend_schema(
    summary="List predefined skills",
    description="Retrieve all available predefined skills",
    tags=["Skills"],
    responses={200: SkillSerializer(many=True)}
)
class SkillsAPIView(generics.ListAPIView):
    serializer_class = SkillSerializer
    permission_classes = [IsAuthenticated]
    queryset = Skill.objects.all()
    pagination_class = None


### PROJECT

@extend_schema(
    summary="Create a project",
    description="Create a new project owned by the authenticated user.",
    tags=["Projects"],
    responses={201: ProjectListSerializer}
)
class ProjectCreateAPIView(generics.CreateAPIView):
    serializer_class=ProjectCreateSerializer
    permission_classes=[IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

@extend_schema(
    summary="List projects",
    description="Retrieve a paginated list of active projects with support for searching, filtering and ordering.",
    tags=["Projects"],
    parameters=[
        OpenApiParameter(name="search", type=str, location=OpenApiParameter.QUERY, required=False,
                         description="Search projects by title or description."),
        OpenApiParameter(name="required_skills", type=int, location=OpenApiParameter.QUERY, required=False,
                         many=True, description="Filter projects by one or more required skill IDs."),
        OpenApiParameter(name="status", type=str, location=OpenApiParameter.QUERY, required=False,
                         description="Filter projects by project status."),
        OpenApiParameter(name="owner", type=str, location=OpenApiParameter.QUERY, required=False,
                         description='Use "me" to retrieve only projects owned by the authenticated user.'),
        OpenApiParameter(name="ordering", type=str, location=OpenApiParameter.QUERY, required=False,
                         description="Order by title, created_at or updated_at."),
    ],
    responses={200: ProjectListSerializer(many=True)}
)
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
    
class MyProjectsAPIView(generics.ListAPIView):
    serializer_class = ProjectListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            Project.objects
            .filter(owner=self.request.user)
            .order_by("-created_at")
        )
    
@extend_schema(
    summary="Retrieve, update or delete a project",
    description="Retrieve project details or update/delete a project if you are its owner.",
    tags=["Projects"],
    responses={200: ProjectListSerializer}
)
class ProjectDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes=[IsAuthenticated, IsProjectOwner]
    queryset=Project.objects.filter(is_active=True)
    
    def get_serializer_class(self):
        if self.request.method=="GET":
            return ProjectListSerializer
        return ProjectUpdateSerializer
    

### Join Requests

@extend_schema(
    summary="Send join request",
    description="Send a join request to a recruiting project.",
    tags=["Join Requests"]
)
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

@extend_schema(
    summary="Accept join request",
    description="Accept a pending join request and add the user as a project member.",
    tags=["Join Requests"]
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
    
@extend_schema(
    summary="Reject join request",
    description="Reject a pending join request for a project.",
    tags=["Join Requests"]
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
    
@extend_schema(
    summary="My join requests",
    description="Retrieve all join requests submitted by the authenticated user.",
    tags=["Join Requests"],
    responses={200: JoinRequestSerializer(many=True)}
)
class MyJoinRequestsAPIVIew(generics.ListAPIView):
    permission_classes=[IsAuthenticated]
    pagination_class=StandardPagination
    serializer_class=JoinRequestSerializer
    def get_queryset(self):
        return JoinRequest.objects.filter(user=self.request.user)
    
@extend_schema(
    summary="Project join requests",
    description="Retrieve all join requests for a project owned by the authenticated user.",
    tags=["Join Requests"],
    responses={200: JoinRequestSerializer(many=True)}
)
class ProjectJoinRequestsAPIView(generics.ListAPIView):
    permission_classes=[IsAuthenticated]
    pagination_class=StandardPagination
    serializer_class=JoinRequestSerializer

    def get_queryset(self):
        project=get_object_or_404(Project, pk=self.kwargs["pk"])
        if project.owner != self.request.user:
            raise PermissionDenied(
                "You are not authorized to view join requests for this project."
            )
        return project.join_requests.filter(
            status = JoinRequest.Status.PENDING
        )
    

### DASHBOARD

@extend_schema(
    summary="Dashboard",
    description="Retrieve dashboard statistics for the authenticated user including owned projects, joined projects and join request statistics.",
    tags=["Dashboard"],
    responses={200: DashboardSerializer}
)
class DashboardAPIView(APIView):
    serializer_class=DashboardSerializer

    def get(self, request):
        projects_needing_attention = (
            Project.objects.filter(owner=request.user)
            .annotate(
                pending_count=Count(
                    "join_requests",
                    filter=Q(join_requests__status=JoinRequest.Status.PENDING)
                )
            )
            .filter(pending_count__gt=0)
        )
        
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
            ).count(),
            "projects_needing_attention": ProjectAttentionSerializer(
                projects_needing_attention,
                many=True
            ).data,
        }

        serializer=DashboardSerializer(instance=data)
        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )