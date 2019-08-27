from django.shortcuts import render, reverse
from django.contrib.admin.views.decorators import staff_member_required
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from django.views import View
from django.utils.decorators import method_decorator
from apps.xfz_auth.models import User
from utils.resultful import result
import time
from zl_prac import settings
import os
from apps.news.forms import NewsForm
from apps.news.models import News, CaetgNews
from django.core.paginator import Paginator
from utils.mydecorator import my_login_required
from .forms import BannerForm
from .models import Banner
from datetime import date
from django.contrib.auth.decorators import permission_required
from django.shortcuts import redirect
from django.contrib.auth.models import Group


# Create your views here.

@my_login_required(login_url='news:news_index')
def personal_ifno(request):
    return render(request, 'cms/personal_info.html')


@require_POST
@login_required(login_url='news:news_index')
def upto_thumbnail(request):
    file = request.FILES.get('thumbnail')
    request.user.thumbnail = file
    request.user.save()
    return result.success(message='上传成功！')


@method_decorator(staff_member_required(login_url='cms:personal_info'), name='dispatch')
class Publish_news(View):
    def get(self, request, **kwargs):
        categories = CaetgNews.objects.all()
        news = None
        if kwargs:
            uid = kwargs.get('news_id')
            if News.objects.filter(pk=uid).exists():
                news = News.objects.get(pk=uid)

        context = {'categories': categories, 'news': news}
        return render(request, 'cms/publish_news.html', context=context)

    def post(self, request):
        form = NewsForm(request.POST)
        if form.is_valid():
            title = form.cleaned_data.get('title')
            desc = form.cleaned_data.get('desc')
            category_id = form.cleaned_data.get('category_id')
            thumbnail = form.cleaned_data.get('thumbnail')
            content = form.cleaned_data.get('content')
            author = request.user
            category = CaetgNews.objects.get(pk=category_id)
            pk = request.POST.get('pk')
            news = None
            if pk.isdigit():
                pk = int(pk)
                if News.objects.filter(pk=pk).exists():
                    news = News.objects.get(pk=pk)
                    news.title = title
                    news.desc = desc
                    news.category = category
                    news.thumbnail = thumbnail
                    news.content = content
                else:
                    news = News.objects.create(title=title, desc=desc, category=category, thumbnail=thumbnail,
                                               content=content, author=author)
            news.save()
            url = reverse('cms:news_manage')
            data = {
                'url': url
            }
            return result.success(data=data)
        else:
            error = form.get_errors()
            return result.auth_pwd_error(data=error)


def save_file(file, path):
    filename = str(time.time()) + file.name
    absolute_path = os.path.join(settings.MEDIA_ROOT, path)
    if not os.path.exists(absolute_path):
        os.makedirs(absolute_path)
    with open(os.path.join(absolute_path, filename), 'wb') as fp:
        for chunk in file.chunks():
            fp.write(chunk)
    file_url = settings.MEDIA_URL + path + '/' + filename
    return file_url


@staff_member_required(login_url='cms:personal_info')
@require_POST
# 发布新闻页 上传新闻缩略图
def upload_newsthumbnail(request):
    file = request.FILES.get('thumbnail')
    file_url = save_file(file, 'news_thumbnail')
    data = {
        'url': request.build_absolute_uri(file_url),
    }
    return result.success(data=data)


@staff_member_required(login_url='cms:personal_info')
@require_POST
# 发表新闻页  编辑框中上传图片
def news_picture(request):
    file = request.FILES.get('news_picture')
    file_url = save_file(file, 'news_picture/%s' % str(date.today()))
    data = {
        'url': request.build_absolute_uri(file_url),
    }
    return result.success(data=data)


@method_decorator(staff_member_required(login_url='cms:personal_info'), name='dispatch')
class Categ_news(View):
    def get(self, request):
        search = request.GET.get('search', '')
        code = 200
        message = ''
        if not search:
            categorys = CaetgNews.objects.all()
        else:
            categorys = CaetgNews.objects.filter(name__icontains=search)

        if not categorys:
            code = 400
            message = '没有相关分类'
        return render(request, 'cms/categ_news.html',
                      context={'code': code, 'message': message, 'categorys': categorys, 'search': search})


@require_POST
@staff_member_required(login_url='cms:personal_info')
def delete_categnews(request):
    select_id = request.POST.get('select_id')
    message = '删除成功'
    if select_id:
        select_id = [i for i in select_id[:-1].split('$')]
        for i in select_id:
            if not i.isdigit():
                message = '您未正确选择需要删除的分类'
                return result.auth_pwd_error(message=message)
        # 获取数据库中该id的数据并删除，由于没有判断该id是否存在，所以对不存在的数据会忽略掉，并返回删除成功。
        select_id = [int(i) for i in select_id]
        CaetgNews.objects.filter(pk__in=select_id).delete()
        return result.success(message=message)
    else:
        message = '您未正确选择需要删除的分类'
        return result.auth_pwd_error(message=message)


@require_POST
@staff_member_required(login_url='cms:personal_info')
def edit_categnews(request):
    pk = request.POST.get('pk')
    name = request.POST.get('name')
    if pk and name:
        if pk.isdigit():
            pk = int(pk)
            if CaetgNews.objects.filter(name=name).exists():
                return result.auth_pwd_error(message='该分类已存在')
            else:
                caetg = CaetgNews.objects.filter(pk=pk)
                if caetg:
                    caetg.update(name=name)
                    return result.success(message='修改成功')
    return result.auth_pwd_error(message='修改失败')


@require_POST
@staff_member_required(login_url='cms:personal_info')
def add_categnews(request):
    names = request.POST.get('name')
    if names:
        names = names.split(' ')
        for name in names:
            # 如果该类名不存在，添加，如果存在就不采取操作，达到了添加的目的，所以也是添加成功
            if not CaetgNews.objects.filter(name=name).exists():
                CaetgNews.objects.create(name=name)
        return result.success(message='添加成功')
    return result.auth_pwd_error(message='分类名称不能为空')


def get_digit(s, value):
    if s.isdigit():
        return int(s)
    else:
        return value


@staff_member_required(login_url='cms:personal_info')
def news_manage(request):
    search = request.GET.get('search', '')
    current_page = request.GET.get('page', '1')
    category_search = request.GET.get('category', '0')
    category_search = get_digit(category_search, 0)
    start_date = request.GET.get('start_date', '')
    end_date = request.GET.get('end_date', '')

    # 处理搜索问题
    newses = News.objects.all().order_by('-pub_time')
    if start_date:
        newses = newses.filter(pub_time__gt=start_date)
    if end_date:
        newses = newses.filter(pub_time__lt=end_date)
    if category_search:
        newses = newses.filter(category_id=category_search)
    if search:
        newses = newses.filter(title__contains=search)

    total_num = len(newses)

    # 处理页码问题
    num_per_page = request.GET.get('page_num', '')  # 每页显示多少条
    page_display = 7  # 页码框中显示多少个页码

    num_per_page = get_digit(num_per_page, settings.page_num[0])
    pages = Paginator(newses, num_per_page)

    current_page = get_digit(current_page, 1)
    if current_page > pages.num_pages:
        current_page = 1
    if current_page < 1:
        current_page = 1

    page_range = []  # 初始化
    if pages.num_pages < page_display:
        page_range = pages.page_range
    else:
        if current_page <= int(page_display / 2):
            page_range = [i for i in range(1, 1 + page_display)]
        elif current_page > pages.num_pages - int(page_display / 2):
            page_range = [i for i in range(pages.num_pages - page_display + 1, pages.num_pages + 1)]
        else:
            a = current_page - int(page_display / 2)
            page_range = [i for i in range(a, a + 7)]

    newses = pages.page(current_page)

    categories = CaetgNews.objects.all()

    content = {
        'code': 200,
        'newses': newses,
        'search': search,
        'page_range': page_range,
        'current_page': current_page,
        'page_num': num_per_page,
        'page_num_list': settings.page_num,
        'num_pages': pages.num_pages,  # 一共有多少页
        'categories': categories,
        'category_search': category_search,
        'start_date': start_date,
        'end_date': end_date,
        'total_num': total_num
    }
    return render(request, 'cms/news_manage.html', context=content)


@staff_member_required(login_url='cms:personal_info')
def delete_news(request):
    select_id = request.POST.get('select_id')
    message = '删除成功'
    if select_id:
        select_id = [i for i in select_id[:-1].split('$')]
        for i in select_id:
            if not i.isdigit():
                message = '您未正确选择需要删除的新闻'
                return result.auth_pwd_error(message=message)
        # 获取数据库中该id的数据并删除，由于没有判断该id是否存在，所以对不存在的数据会忽略掉，并返回删除成功。
        select_id = [int(i) for i in select_id]
        News.objects.filter(pk__in=select_id).delete()
        return result.success(message=message)
    else:
        message = '您未正确选择需要删除的新闻'
        return result.auth_pwd_error(message=message)


@method_decorator(permission_required(perm='cms.change_banner', login_url='cms:personal_info')
    , name='dispatch')
class Banner_manage(View):
    def get(self, request):
        banners = Banner.objects.all()
        context = {
            'banners': banners
        }
        return render(request, 'cms/banner_manage.html', context=context)

    def post(self, request):
        form = BannerForm(request.POST)
        if form.is_valid():
            priority = form.cleaned_data.get('priority')
            link_url = form.cleaned_data.get('link_url')
            banner_img = form.cleaned_data.get('banner_img')
            pk = request.POST.get('id')
            message = '添加成功！'
            if pk:
                if Banner.objects.filter(pk=pk).exists():
                    Banner.objects.filter(pk=pk).delete()
                    message = '更改成功！'
                else:
                    return result.auth_pwd_error(message='该轮播图不存在！')
            new_banner = Banner(priority=priority, link_url=link_url, banner_img=banner_img)
            new_banner.save()
            data = {
                'name': new_banner.pk,
            }
            return result.success(message=message, data=data)
        else:
            return result.auth_pwd_error(message='您的输入有误！')


@permission_required(perm='cms.change_banner', login_url='cms:personal_info')
@require_POST
def banner_img_upload(request):
    file = request.FILES.get('banner_img')
    file_url = save_file(file, 'banner_img/%s' % str(date.today()))
    data = {
        'url': request.build_absolute_uri(file_url),
    }
    return result.success(data=data)


@permission_required(perm='cms.delete_banner', login_url='cms:personal_info')
@require_POST
def delete_banner(request):
    id = request.POST.get('id')
    if Banner.objects.filter(pk=id).exists():
        Banner.objects.filter(pk=id).delete()
        return result.success()
    else:
        return result.auth_pwd_error()


def staff_list(request):
    users = User.objects.filter(is_staff=True)
    search = request.GET.get('search')
    if search:
        users1 = users.filter(telephone=search)
        users =users1 | users.filter(username__contains=search)


    context = {
        'users': users,
        'search': search
    }
    return render(request, 'cms/staff_list.html', context=context)


def add_group(request):
    print(request.method)
    if request.method == 'GET':
        groups = Group.objects.all()
        context = {
            'groups': groups
        }
        return render(request, 'cms/add_group.html', context=context)
    if request.method == 'POST':
        telephone = request.POST.get('telephone')
        print(telephone)
        user = User.objects.filter(telephone=telephone).first()
        if not user:
            return result.auth_pwd_error()
        else:
            groups_id = request.POST.getlist('groups_id[]')
            groups = Group.objects.filter(pk__in=groups_id)
            user.groups.add(*groups)
            user.is_staff = True
            user.save()
            return result.success('设置成功！')
