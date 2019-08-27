from django.db import models

# Create your models here.
class Banner(models.Model):
    create_time = models.DateTimeField(auto_now_add=True)
    priority = models.IntegerField(default=1)
    link_url = models.URLField()
    banner_img = models.URLField()
    class Meta:
        ordering = ['priority']