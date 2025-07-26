from django.urls import path
from .views import FileUploadView, SearchEventsView

urlpatterns = [
    path('upload/', FileUploadView.as_view(), name='file-upload'),
    path('search/', SearchEventsView.as_view(), name='event-search'),
]
