from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import re_path
from .consumers import DocumentConsumer

websocket_urlpatterns = [
    re_path(r'doc/(?P<document_id>\d+)/$', DocumentConsumer.as_asgi()),
]
