from django.urls import path
from .views import (
    UploadResumeView, AnalysisListView, AnalysisDetailView,
    RegisterView, LoginView, LogoutView, ImproveResumeView,
    DownloadPDFView, DownloadDOCXView
)

urlpatterns = [
    path('register/',        RegisterView.as_view(),        name='register'),
    path('login/',           LoginView.as_view(),           name='login'),
    path('logout/',          LogoutView.as_view(),          name='logout'),
    path('upload/',          UploadResumeView.as_view(),    name='upload'),
    path('analyses/',        AnalysisListView.as_view(),    name='analyses'),
    path('analyses/<int:pk>/', AnalysisDetailView.as_view(), name='analysis-detail'),
    path('analyses/<int:pk>/improve/', ImproveResumeView.as_view(), name='improve-resume'),
    path('analyses/<int:pk>/download/pdf/', DownloadPDFView.as_view(), name='download-pdf'),
    path('analyses/<int:pk>/download/docx/', DownloadDOCXView.as_view(), name='download-docx'),
]
