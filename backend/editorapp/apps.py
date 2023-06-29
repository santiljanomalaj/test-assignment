from django.apps import AppConfig
from threading import Thread
from .settings import DEFAULT_WS_PORT


class EditorAppConfig(AppConfig):
    name = 'editorapp'

    def ready(self):
        # Implicitly connect signal handlers decorated with @receiver
        from . import signals

        # Start the WebSocket server in a new thread
        from .websocket import WSServerWrapper
        self.t = Thread(target=WSServerWrapper.run, daemon=True)
        self.t.start()
        if not WSServerWrapper.ws_started_event.wait(10):
            raise RuntimeError("Could not start websocket server on port %s"%DEFAULT_WS_PORT)
