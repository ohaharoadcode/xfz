from django.shortcuts import render, redirect, reverse
from django.contrib.auth import login, logout, authenticate
from django.views.decorators.http import require_POST
from django.http import HttpResponse
from .forms import Login_form, Register_form
from utils.resultful import result  # 在工具包中，用于定义登录成功或不成功后返回的一些信息
from utils.captcha.xfzcapthcha import create_verifycode
from io import BytesIO  # 在内存中读取和存放二进制码
from django.core.cache import cache
from .models import User
from django.contrib.admin.views.decorators import staff_member_required

# Create your views here.

@require_POST
def login_view(request):
    form = Login_form(request.POST)
    if form.is_valid():  # 验证表单数据，具体验证方法，也可以自己写。验证通过：
        telephone = form.cleaned_data.get('telephone')
        password = form.cleaned_data.get('password')
        remember = form.cleaned_data.get('remember')  # 此处要用get，因为如果没有选中“记住我”选项，则remember为空
        user = authenticate(request, telephone=telephone, password=password)  # 验证登录信息，验证成功，则返回user对象
        if user:  # 返回有效user对象，说明输入的账号密码正确
            if user.is_active:  # 用户未被禁用
                login(request, user)  # 将登录信息存入session
                if remember:  # 登录时选中了“记住我”
                    request.session.set_expiry(None)  # 设置session过期时间，None为默认过期时间。默认过期时间可以在settings中设置
                else:  # 未选中
                    request.session.set_expiry(0)

                # 登录验证后，返回给前端的信息由后端和前端进行协商这里返回三个：
                # code状态码：200登录成功；405：登录失败，用户被禁用；400：用户名或者密码错误
                # message：发送什么信息，也是由前后端协商
                # data：一些数据，也是通过前后端协商
                # 不管是否成功，一般返回的信息都包含三个内容：自定义的状态码，message，data。内容根据需要可以为空，但一般这三个键都有
                return result.success()
            else:  # 用户被禁用，黑名单
                return result.auth_freeze()
        else:  # 未返回user信息：账号密码格式符合，但是不正确
            return result.auth_pwd_error()
    else:  # 验证表单数据未通过：账号密码格式不正确
        errors = form.get_errors()  # 返回form表单的验证错误信息
        if errors.get('img_verify'):
            message = '请输入正确的验证码'
        else:
            message = '手机号或密码错误'
        return result.auth_pwd_error(message=message, data=errors)

def logout_view(request):
    logout(request)
    request.session.flush()
    return redirect(reverse('news:news_index'))


def verify_code(request):
    verify_text, verify_img = create_verifycode.gene_code()
    cache.set(verify_text.lower(), verify_text.lower(), 60 * 5)
    out = BytesIO()  # 相当于一个保存文件的地址
    verify_img.save(out, 'png')  # 将二进制像存放文件一样存放到内存中
    out.seek(0)  # 将文件光标移至到首位
    response = HttpResponse(content_type='image/png')
    # 将img文件写入到response中
    response.write(out.read())
    response['Content-length'] = out.tell()  # out最后光标的位置就是文件的长度
    return response  # 前端收到后，会将这个文件流直接生成为一个png图片文件


@require_POST
def register_view(request):
    form = Register_form(request.POST)
    if form.is_valid():
        telephone = form.cleaned_data.get('telephone')
        username = form.cleaned_data.get('username')
        password = form.cleaned_data.get('password1')
        email = form.cleaned_data.get('email')
        user = User.objects.create_user(telephone=telephone, username=username, password=password, email=email)
        login(request, user)
        return result.success(message='注册成功，正在跳转至首页...')
    else:
        errors = form.get_errors()
        return result.auth_pwd_error(message='您的注册信息有误，请修改', data=errors)
