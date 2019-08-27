#!/usr/bin/env.python
#__author__="zhangbin"
#Date:2019/7/4/004
from django.urls import path
from . import views

app_name = 'course'
urlpatterns=[
    path('index/',views.index,name='index'),
    path('<int:id>/',views.course_detail,name='course_detail')
]
