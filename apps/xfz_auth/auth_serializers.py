#!/usr/bin/env.python
#__author__="zhangbin"
#Date:2019/7/23/023
from .models import User
from rest_framework import serializers
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model= User
        fields = ('uid','username')