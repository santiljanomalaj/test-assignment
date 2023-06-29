import json
import os
from ssl import PROTOCOL_TLSv1_2
from django.dispatch import receiver
from .signals import update_signal
from .settings import DEFAULT_WS_PORT
from SimpleWebSocketServer import SimpleWebSocketServer, WebSocket
from threading import Event
from .models import Document

import logging
logger = logging.getLogger()

class WebSocketHandler(WebSocket):
    def __init__(self, server, sock, address):
        print('pass')
        super().__init__(server, sock, address)

    @staticmethod
    def sendBroadcast(msg):
        # Broadcast a message to connected clients
        for ws in WSServerWrapper.ws_server.connections.values():
            ws.sendMessage(msg)

    # Signal handling methods

    @staticmethod
    @receiver(update_signal)
    def onUpdateSignal(**kwargs):
        logger.info('Received a signal')
        msg = kwargs.get('msg', '')
        # Broadcast the message received from update_signal
        WebSocketHandler.sendBroadcast(msg)

    # WebSocket handling methods

    def get_or_create_document(self):
        try:
            document = self.retrieve_document()
        except Document.DoesNotExist:
            document = self.create_document()

        return document

    def retrieve_document(self):
        return Document.objects.get(id=self.document_id)

    def create_document(self):
        return Document.objects.create(id=self.document_id, text='', content='', version = 0)
    
    def handleMessage(self):
        data = json.loads(self.data)
        username = data['username']
        text = data['text']
        content = data['content']
        version = data['version']
    
        document = self.get_or_create_document()
        print(document.version, version)
         # Check if document is locked
        if document.version != version:
            # Notify user that document is locked
            self.sendMessage(json.dumps({
                'message': 'Document is locked by another user. version is ',
                'version': document.version
            }))
        
        else:
            # Update document
            document.text = text
            document.content = content
            document.version += 1
            document.save()

            self.sendBroadcast(json.dumps({
                'username': username,
                'text': document.text,
                'content': document.content,
                'version': document.version
            }))

    
    def handleConnected(self):
        logger.info('New client connected %s' % self.address[0])
        self.document_id = self.request.path.split('/')[3]
        self.document_group_name = 'document_%s' % self.document_id
        
        document = self.get_or_create_document()
        
        self.sendMessage(json.dumps({
            'id': document.id,
            'text': document.text,
            'content': document.content,
            'version': document.version,
        })) 

    def handleClose(self):
        logger.info('Client disconnected %s' % self.address[0])


class WSServerWrapper():
    ws_started_event = Event()
    # NOTE: to use WSS, assuming the certificate and private key are in the base directory, switch the ws_server from SimpleWebSocketServer to SimpleSSLWebSocketServer.
    # ws_server = SimpleSSLWebSocketServer('', DEFAULT_WS_PORT, WebSocketHandler, certfile=os.path.join(BASE_DIR, 'cert.pem'), keyfile=os.path.join(BASE_DIR, 'key.pem'), version=PROTOCOL_TLSv1_2)
    ws_server = SimpleWebSocketServer('', DEFAULT_WS_PORT, WebSocketHandler)

    @staticmethod
    def run():
        logger.info('Starting WebSocket server')
        WSServerWrapper.ws_started_event.set()
        WSServerWrapper.ws_server.serveforever()
