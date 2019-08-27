from django.db import models


# Create your models here.

class CaetgNews(models.Model):
    name = models.CharField(max_length=100,unique=True)

class Comments(models.Model):
    '''
    类似于知乎的评论显示模式：
    主评论A（master）
        B评论（回复A的，A名字省略）：
        C评论：
        D回复B：
    主评论F（master）：
        E回复
        G回复
        F回复E:
    '''
    commenter = models.ForeignKey('xfz_auth.User',on_delete=models.SET_NULL,null=True,related_name='commenter')
    comment_to = models.ForeignKey('xfz_auth.User',on_delete=models.SET_NULL,null=True,related_name='comment_to')
    news = models.ForeignKey('News',on_delete=models.CASCADE)
    content = models.TextField(null=False)
    pub_time = models.DateTimeField(auto_now_add=True)
    master = models.ForeignKey('self',on_delete=models.CASCADE,null=True)  #评论树的根部，第一条评论
    is_master = models.BooleanField(default=True)


class News(models.Model):
    """docstring for News"""
    title = models.CharField(max_length=100)
    desc = models.CharField(max_length=200)
    category = models.ForeignKey('CaetgNews', on_delete=models.SET_NULL,null=True)
    thumbnail = models.URLField(null=True)
    content = models.TextField()
    pub_time = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey('xfz_auth.User',on_delete=models.SET_NULL,null=True)
    edit_time = models.DateTimeField(auto_now=True)
