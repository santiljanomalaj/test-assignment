from django.http import JsonResponse
from rest_framework import generics
from .models import Document
from .serializers import DocumentSerializer

class DocumentView(generics.RetrieveUpdateAPIView):
    queryset = Document.objects.all()
    serializer = DocumentSerializer(queryset, many=True)

def get_document_list(request):
    queryset = Document.objects.all()
    serializer = DocumentSerializer(queryset, many=True)
    return JsonResponse(serializer.data, safe=False)