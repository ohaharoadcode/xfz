#!/usr/bin/env.python
#__author__="zhangbin"
#Date:2019/6/30/030
class FormsMixin():   #制作一个form的插件，用于补足form的一些功能。form表单继承这个类即可。


    #简化提取errors
    def get_errors(self):
        errors = self.errors.get_json_data()
        # error:  {'username': [{'message': 'Enter a valid URL.', 'code': 'invalid'}, {'message': 'Ensure this value has at most 4 characters (it has 22).', 'code': 'max_length'}]}
        new_errors = {}
        for key, messages in errors.items():
            new_errors[key] = []
            for message in messages:
                new_errors[key].append(message['message'])
        return new_errors    #new_error: {'username': ['Enter a valid URL.', 'Ensure this value has at most 4 characters (it has 22).'],}
