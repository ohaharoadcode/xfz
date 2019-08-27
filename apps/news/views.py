from django.shortcuts import render
from .models import News, CaetgNews
from .news_serializers import NewsSerializer
from zl_prac import settings
from utils.resultful import result
from .models import Comments
from .forms import CommentForm
from apps.cms.models import Banner

# Create your views here.


def index(request):
    category = CaetgNews.objects.get(name='热点')
    newes = News.objects.select_related('author', 'category').filter(category=category).order_by('-pub_time')[
            0:settings.news_num]
    categories = CaetgNews.objects.all()
    banners = Banner.objects.all()
    print(banners)
    content = {
        'newses': newes,
        'categories': categories,
        'banners':banners
    }
    return render(request, 'news/index.html', context=content)


# 加载更多新闻的ajax请求
def get_more(request, p):
    # p = request.GET.get('p') #获取第几页数据
    category_id = request.GET.get('category_id')
    news_num = settings.news_num
    begin = p * news_num
    end = (p + 1) * news_num
    newses = []
    if CaetgNews.objects.filter(id=category_id).exists():
        category = CaetgNews.objects.get(pk=category_id)
        newses = News.objects.select_related('author', 'category').filter(category=category).order_by('-pub_time')[
                 begin:end]
    else:
        return result.auth_pwd_error(message='新闻分类存在错误')
    seria = NewsSerializer(newses, many=True)
    data = None
    if seria.data:
        data = {'newses': seria.data}
    return result.success(data=data)


def new_detail(request, news_id):
    news = News.objects.select_related('author', 'category').get(pk=news_id)

    comments = Comments.objects.select_related('comment_to', 'commenter', 'master').filter(news=news).order_by('pub_time')
    content = {
        'news': news,
        'comments': comments
    }
    return render(request, 'news/news_detail.html', context=content)


def pub_comment(request):
    form = CommentForm(request.POST)
    if form.is_valid():
        commenter = request.user
        comment_to = request.POST.get('comment_to')
        news = request.POST.get('news')
        content = request.POST.get('content')
        master = request.POST.get('master')
        is_master = True
        print(master)
        if master:
            if Comments.objects.filter(pk=master).exists():
                is_master = False
        comment = Comments.objects.create(commenter=commenter, comment_to_id=comment_to, news_id=news, content=content,
                                master_id=master, is_master=is_master)
        comment.save()
        return result.success()
    else:
        error = form.get_errors()
        return result.auth_pwd_error(data=error)
