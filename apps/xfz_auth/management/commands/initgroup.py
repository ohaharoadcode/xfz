#!/usr/bin/env.python
# __author__="zhangbin"
# Date:2019/8/12/012
from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission, ContentType  # 导入三个model
from apps.news.models import News, CaetgNews, Comments  # 导入需要设置权限的model
from apps.cms.models import Banner  # 导入需要设置权限的model


class Command(BaseCommand):
    def handle(self, *args, **options):
        #####1.编辑组：新闻、分类、轮播图等
        # 获取对应的model的content_type的id
        edit_content_types = [
            ContentType.objects.get_for_model(News),
            ContentType.objects.get_for_model(CaetgNews),
            ContentType.objects.get_for_model(Banner),
            ContentType.objects.get_for_model(Comments)
        ]
        # 获取编辑组的所有权限
        edit_permissions = Permission.objects.filter(content_type__in=edit_content_types)
        # 创建分组
        edit_group = Group.objects.create(name='编辑')
        # 将权限添加到分组中去
        edit_group.permissions.set(edit_permissions)

        #命令行输出一般使用stdout.write，style.SUCCESS则是输出的样式。
        self.stdout.write(self.style.SUCCESS('创建编辑组成功'))

        ####2.财务组，类似与编辑组,由于未写代码，此处用banner组代替。
        finance_content_types = [
            ContentType.objects.get_for_model(Banner)
        ]
        finance_permissions = Permission.objects.filter(content_type__in=finance_content_types)
        finance_group = Group.objects.create(name='财务')
        finance_group.permissions.set(finance_permissions)
        # 命令行输出一般使用stdout.write，style.SUCCESS则是输出的样式。
        self.stdout.write(self.style.SUCCESS('创建财务组成功'))

        ###3.管理员组（以上各组的组合）：管理员组拥有上述各组的权限，将上述各组组合起来即可。
        admin_permissions = edit_permissions.union(finance_permissions)
        admin_group = Group.objects.create(name='管理员')
        admin_group.permissions.set(admin_permissions)
        # 命令行输出一般使用stdout.write，style.SUCCESS则是输出的样式。
        self.stdout.write(self.style.SUCCESS('创建管理员组成功'))


        ##超级管理员组：不用创建，超级管理员在用户表中有superuser中可以设置。
        self.stdout.write(self.style.SUCCESS('创建超级管理员组成功'))
