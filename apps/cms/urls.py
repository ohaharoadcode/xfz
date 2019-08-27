#!/usr/bin/env.python
# __author__="zhangbin"
# Date:2019/6/29/029
from django.urls import path, include, re_path
from apps.cms import views

app_name = 'cms'
urlpatterns = [
    path('personal_info/', views.personal_ifno, name='personal_info'),
    re_path('publish_news/$', views.Publish_news.as_view(), name='publish_news'),
    re_path('publish_news/(?P<news_id>[0-9]*)', views.Publish_news.as_view(), name='edit_news'),
    path('categ_news/', views.Categ_news.as_view(), name='categ_news'),
    path('delete_categnews/', views.delete_categnews, name='delete_categnews'),
    path('edit_categnews/', views.edit_categnews, name='edit_categnews'),
    path('add_categnews/', views.add_categnews, name='add_categnews'),
    path('upto_thumbnail/', views.upto_thumbnail, name='upto_thumbnail'),
    path('upload_newsthumbnail', views.upload_newsthumbnail, name='upload_newsthumbnali'),
    path('news_picture', views.news_picture, name='news_picture'),
    path('news_manage/', views.news_manage, name='news_manage'),
    path('delete_news/', views.delete_news, name='delete_news'),
    path('banner_manage', views.Banner_manage.as_view(), name='banner_manage'),
    path('banner_img_upload/', views.banner_img_upload, name='banner_img_upload'),
    path('delete_banner/', views.delete_banner, name='delete_banner'),
]

##员工管理url
urlpatterns = urlpatterns + [
    path('staff_list', views.staff_list, name='staff_list'),
    path('add_group/',views.add_group,name='add_group'),
]
