#!/usr/bin/env.python
#__author__="zhangbin"
#Date:2019/7/23/023
from django import template
from datetime import datetime  #不是awaretime
from django.utils.timezone import now  #获得awaretime
register = template.Library()

def time_since(value):
    if isinstance(value,datetime):
        time_now = now()
        timestemp = (time_now - value).total_seconds()
        if timestemp < 60 :
            return '刚刚'
        elif timestemp < 60*60:
            return '%s分钟前'%int(timestemp/60)
        elif timestemp < 60*60*24:
            return '%s小时前'%int(timestemp/(60*60))
        elif timestemp < 60*60*24*3:
            return '%s天前'%int(timestemp/(60*60*24))
        else:
            return value.strftime('%Y-%m-%d')
    return value

register.filter("time_since",time_since)