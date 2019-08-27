from django.shortcuts import render


# Create your views here.

def index(request):
    return render(request, 'course/course.html')

def course_detail(request, id):
    return render(request, 'course/course_detail.html')



