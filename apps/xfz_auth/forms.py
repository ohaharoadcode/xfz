#!/usr/bin/env.python
# __author__="zhangbin"
# Date:2019/6/30/030
from django import forms
from utils.forms import FormsMixin
from django.core.cache import cache
from django.core import validators
from .models import User


class Login_form(forms.Form, FormsMixin):
    # FormsMixin中含有一些form的操作方法，比如对errors进行简化提取等
    telephone = forms.CharField(max_length=11, min_length=11,
                                error_messages={'max_length': '请输入11位手机号码', 'min_length': '请输入11位手机号码',
                                                'required': '请输入手机号'})
    password = forms.CharField(max_length=20, min_length=6,
                               error_messages={'max_length': '密码最多不超过20位', 'min_length': '密码最少不能少于6位',
                                               'required': '请输入密码'})
    img_verify = forms.CharField(max_length=6, min_length=4,
                                 error_messages={'max_length': '请输入正确的验证码', 'min_length': '请输入正确的验证码',
                                                 'required': '请输入验证码'})
    remember = forms.BooleanField(required=False)

    def clean_img_verify(self):
        img_verify = self.cleaned_data.get('img_verify')
        if not cache.get(img_verify.lower()):
            raise forms.ValidationError('请输入正确的验证码')
        else:
            cache.delete(img_verify)
            return img_verify


class Register_form(forms.Form, FormsMixin):
    telephone = forms.CharField(max_length=11, min_length=11,
                                error_messages={'max_length': '请输入11位手机号码', 'min_length': '请输入11位手机号码',
                                                'required': '请输入手机号'})
    password2 = forms.CharField(max_length=20, min_length=6,
                                error_messages={'max_length': '密码最多不超过20位', 'min_length': '密码最少不能少于6位',
                                                'required': '请输入密码'})
    password1 = forms.CharField(max_length=20, min_length=6,
                                error_messages={'max_length': '密码最多不超过20位', 'min_length': '密码最少不能少于6位',
                                                'required': '请输入密码'})
    img_verify = forms.CharField(max_length=6, min_length=4,
                                 error_messages={'max_length': '请输入正确的验证码', 'min_length': '请输入正确的验证码',
                                                 'required': '请输入验证码'})
    username = forms.CharField(max_length=30, min_length=2,
                               error_messages={'max_length': '用户名过长', 'min_length': '用户名过短', 'required': '请输入用户名'})
    email = forms.EmailField(required=False,validators=[validators.EmailValidator(message='您输入的邮箱格式有误')])

    def clean_img_verify(self):
        img_verify = self.cleaned_data.get('img_verify')
        if not cache.get(img_verify.lower()):
            raise forms.ValidationError('请输入正确的验证码')
        else:
            cache.delete(img_verify)
            return img_verify

    def clean_telephone(self):
        telephone = self.cleaned_data.get('telephone')
        if User.object.filter(telephone = telephone):
            raise forms.ValidationError('该手机号已被注册')
        return telephone

    def clean_email(self):
        email = self.cleaned_data.get('emain')
        if User.object.filter(email=email):
            raise forms.ValidationError('该邮箱已被注册')
        return email

    def clean_password1(self):
        cleaned_data = super().clean()
        password1 = cleaned_data.get('password1')
        password2 = cleaned_data.get('password2')
        print(password1,password2)
        if password1 != password2:
            raise forms.ValidationError('两次输入的密码不一致')
        return password1

