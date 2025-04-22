from django.db import models

class Item(models.Model):
    name = models.CharField(max_length=100)
    # Avatar parts
    skin = models.CharField(max_length=100, default='skin1.png')
    eyebrow = models.CharField(max_length=100, default='eyebrow1.png')
    eyes = models.CharField(max_length=100, default='eye1.png')
    hair = models.CharField(max_length=100, default='hair1.png')
    hat = models.CharField(max_length=100, default='hat1.png')
    clothes = models.CharField(max_length=100, default='clothes1.png')
    background = models.CharField(max_length=100, default='background1.png')

    def __str__(self):
        return self.name