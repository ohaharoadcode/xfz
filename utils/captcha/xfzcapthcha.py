#!/usr/bin/env.python
# __author__="zhangbin"
# Date:2019/7/8/008
import random, time, os
from PIL import Image, ImageDraw, ImageFont


class Cpatcha():
    size = (200, 60)  # 生成图像大小
    bgcolor = (0, 0, 0)  # 背景颜色，采用RGB格式
    random.seed(time.time())
    # 随机字体颜色
    font_color = tuple((random.randint(150, 255) for i in range(3)))
    font_size = 40
    font_path = os.path.join(os.path.dirname('__file__'), 'font/LFAX.TTF')
    # 是否加入随机干扰线和随机干扰点
    draw_line = True
    line_num = 20
    draw_point = True
    point_num = 0.1  #点的数量占总的像素的比例
    element = 'abcdefghigklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

    def create_text(self):  # 选取验证码字符
        text = random.sample(self.element, random.randint(4, 6))
        return text  # 列表形式

    def _gene_line(self, draw):
        begin = (random.randint(0, self.size[0]), random.randint(0, self.size[1]))
        end = (random.randint(0, self.size[0]), random.randint(0, self.size[1]))
        draw.line([begin, end], fill=self.gene_color(50, 200))

    def _gene_point(self, draw,val):
        val = min(0.5,max(0,val))  #绘制点的像素数占总像素数的比例，最大不超过0.5，最小不超过0
        for x in range(self.size[0]):
            for y in range(self.size[1]):
                if random.random()<val :
                    draw.point((x,y),fill = self.gene_color(0,255))


    def gene_code(self):
        img = Image.new('RGB', self.size,self.gene_color(0,100))  # 生成画布
        font = ImageFont.truetype(self.font_path, self.font_size)  # 指定字体及大小
        draw = ImageDraw.Draw(img)  # 创建画笔
        text = self.create_text()   #获取验证码的文字

        width = self.size[0] / len(text)
        height = self.size[1]
        for i in range(len(text)):
            per_width, per_height = font.getsize(text[i])  # 获取单个字体的高度和宽度，如果把全部字放进去，可以获取全部的
            draw.text((width * i + random.random() * (width - per_width), random.random() * (height - per_height)),
                      text[i], font=font,fill= self.gene_color())
        if self.draw_line:
            for i in range(self.line_num):
                self._gene_line(draw)
        if self.draw_point:
            self._gene_point(draw,self.point_num)
        return ''.join(text),img

    # 生成随机颜色
    def gene_color(self, start=150, end=255):
        return tuple((random.randint(start, end) for i in range(3)))

create_verifycode = Cpatcha()