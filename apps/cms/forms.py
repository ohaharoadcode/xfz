#!/usr/bin/env.python
# __author__="zhangbin"
# Date:2019/8/2/002
from django import forms
from utils.forms import FormsMixin
from .models import Banner


class BannerForm(forms.ModelForm, FormsMixin):
    class Meta:
        model = Banner
        fields = ['banner_img', 'link_url', 'priority']
