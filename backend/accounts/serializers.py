from rest_framework import serializers
from .models import User


class UserRegistrationSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only= True)

    class Meta:
        model = User
        fields = ("email", "username", "password", "confirm_password")
        extra_kwargs = {"password": {"write_only": True}}
        
    def validate(self, attrs):
        if attrs.get("password")!=attrs.get("confirm_password"):
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})

        return attrs
    
    def create(self, validated_data):
        validated_data.pop("confirm_password", None)

        return User.objects.create_user(**validated_data)

    
    