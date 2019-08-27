#!/usr/bin/env.python
#__author__="zhangbin"
#Date:2019/7/23/023
from rest_framework import serializers
from .models import News,CaetgNews
from apps.xfz_auth import auth_serializers

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CaetgNews
        fields = ('id','name')


class NewsSerializer(serializers.ModelSerializer):
    category = CategorySerializer()  #获取外键的内容
    author = auth_serializers.UserSerializer()  #获取外键的内容
    class Meta:
        model = News
        fields = ('id','title','thumbnail','pub_time','author','category','desc')