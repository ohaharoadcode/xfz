#!/usr/bin/env.python
# __author__="zhangbin"
# Date:2019/6/28/028
from django.urls import path
from apps.news import views

app_name = 'news'
urlpatterns = [
    path('index/', views.index, name='news_index'),
    path('<int:news_id>/', views.new_detail, name='news_detail'),
    path('get_more_news/<int:p>', views.get_more, name='get_more_news'),
    path('pub_comment', views.pub_comment, name='pub_comment'),
]





