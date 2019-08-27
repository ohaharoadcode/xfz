
# Create your tests here.

def decorators(**args):
    print(args)
    def outter(func):
        print('outter')
        def inner(s):
            print('装饰器')
            return func(s)
        return inner
    return outter



@decorators(h = 'hello')
def dog(s):
    print('123')
    print(s)


print('main')
dog('saa')
