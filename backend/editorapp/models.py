from django.db import models


class Document(models.Model):
    text = models.TextField()
    content = models.TextField()
    version = models.IntegerField(default=1)

    def __str__(self):
        return f"{self.text} ({self.content})"

    class Meta:
        ordering = ('version',)
