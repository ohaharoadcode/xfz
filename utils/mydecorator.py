#!/usr/bin/env.python
#__author__="zhangbin"
#Date:2019/8/1/001
from django.shortcuts import redirect,reverse
from utils.resultful import result
def my_login_required(login_url='login'):
    def outter(func):
        def wrapper(request,*args,**kwargs):
            if request.user.is_authenticated:
                return func(request,*args,**kwargs)
            else:
                if request.is_ajax():
                    return result.auth_pwd_error(message='请先登录！')
                else:
                    try:
                        return redirect(reverse(login_url))
                    except:
                        return redirect(login_url)
        return wrapper
    return outter