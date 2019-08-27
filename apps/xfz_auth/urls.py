#!/usr/bin/env.python
#__author__="zhangbin"
#Date:2019/6/30/030
from django.urls import path
from apps.xfz_auth import views

app_name = 'xfz_auth'
urlpatterns=[
    path('login',views.login_view,name='login'),
    path('logout/',views.logout_view,name='logout'),
    path('verifycode',views.verify_code,name = 'verifycode'),
    path('register',views.register_view,name='register'),
]