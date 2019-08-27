#!/usr/bin/env.python
# __author__="zhangbin"
# Date:2019/7/4/004
from django.http import JsonResponse

#用来定义登录状态返回码
class HttpCode():
    success_code = 200
    auth_pwd_error_code = 400
    auth_freeze_code = 405

#定义登录返回的信息
class Result(HttpCode):

    def success(self, message='登录成功', data=None, **kwargs):
        return self._message(self.success_code, message, data, **kwargs)

    def auth_pwd_error(self, message='账户或密码错误', data=None, **kwargs):
        return self._message(self.auth_pwd_error_code,message,data,**kwargs)

    def auth_freeze(self,message='账户被冻结',data=None,**kwargs):
        return self._message(self.auth_freeze_code,message,data,**kwargs)

    def _message(self,code,message,data,**kwargs):
        json_dict = {'code':code, 'message': message, 'data': data}
        json_dict.update(**kwargs)
        return JsonResponse(json_dict)

result = Result()