from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from shortuuidfield import ShortUUIDField
import time
from zl_prac import settings


# Create your models here.

def up_to(instance, filename):
    return '/'.join([instance.uid,'thumbnail', str(int(time.time())) + '_' + filename])


class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, telephone, password, username, **extra_fields):
        if not telephone:
            raise ValueError('请输入手机号码！')
        if not username:
            raise ValueError('请输入用户名！')
        if not password:
            raise ValueError('请输入密码！')
        user = self.model(telephone=telephone, username=username, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_user(self, telephone, password, username, **extra_fields):
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(telephone=telephone, password=password, username=username, **extra_fields)

    def create_superuser(self, telephone, password, username, **extra_fields):
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_staff',True)
        return self._create_user(telephone=telephone, password=password, username=username, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    uid = ShortUUIDField(primary_key=True)
    username = models.CharField(max_length=30,unique=True)
    telephone = models.CharField(max_length=11, unique=True)
    email = models.EmailField(unique=True,null=True)
    thumbnail = models.ImageField(upload_to=up_to)#用户头像
    register_time = models.DateTimeField(auto_now_add=True)  # 注册日期
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)  # 是否是员工，决定其能否登录到后台。

    USERNAME_FIELD = 'telephone'
    REQUIRED_FIELDS = ['username']
    EMAIL_FIELD = 'email'  # 发送邮件时使用

    objects = UserManager()

    def get_fullname(self):
        return self.username

    def get_short_name(self):
        return self.username
