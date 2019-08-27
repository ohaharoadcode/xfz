#!/usr/bin/env.python
#__author__="zhangbin"
#Date:2019/7/19/019
from .models import News,Comments
from django import forms
from utils.forms import FormsMixin
from apps.xfz_auth.models import User

class NewsForm(forms.ModelForm,FormsMixin):
    category_id = forms.IntegerField()

    class Meta:
        model = News
        exclude = ['category','pub_time','author']

class CommentForm(forms.ModelForm,FormsMixin):

    class Meta:
        model = Comments
        exclude = ['commenter','is_master','pub_time','master']

    def clean_comment_to(self):
        clean_comment_to = self.cleaned_data.get('comment_to')
        if not clean_comment_to:
            raise forms.ValidationError('回复人不存在！')
        return clean_comment_to

    def clean_news(self):
        clean_news = self.cleaned_data.get('news')
        print(clean_news)
        if not clean_news:
            raise forms.ValidationError('新闻不存在！')
        return clean_news

    # def clean_master(self):
    #     clean_master = self.cleaned_data.get('master')
    #     if clean_master:
    #         if not Comments.objects.filter(pk=clean_master).exists():
    #             raise forms.ValidationError('')


