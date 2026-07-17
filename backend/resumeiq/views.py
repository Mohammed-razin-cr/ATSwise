import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.files.storage import default_storage
from django.contrib.auth import authenticate
from django.http import HttpResponse
from .models import ResumeAnalysis
from .serializers import ResumeUploadSerializer, ResumeAnalysisSerializer, UserRegisterSerializer, UserSerializer
from .ai_service import (
    extract_text_from_pdf,
    extract_text_from_docx,
    analyze_resume,
    generate_pdf_content,
    generate_docx_content
)
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.models import Token


class RegisterView(APIView):
    """POST /api/register/ - Register a new user."""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                'user': UserSerializer(user).data,
                'token': token.key
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    """POST /api/login/ - Login user and return token."""
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        try:
            from django.contrib.auth.models import User
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = authenticate(username=user.username, password=password)
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                'user': UserSerializer(user).data,
                'token': token.key
            })
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    """POST /api/logout/ - Logout user by deleting their token."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        request.user.auth_token.delete()
        return Response({'success': 'Logged out successfully.'}, status=status.HTTP_200_OK)


class UploadResumeView(APIView):
    """POST /api/upload/ – upload a resume and receive analysis."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ResumeUploadSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        file     = serializer.validated_data['file']
        job_desc = serializer.validated_data.get('job_desc', '')

        # Save file to disk
        analysis = ResumeAnalysis.objects.create(
            file=file,
            filename=file.name,
            job_desc=job_desc,
            status='processing',
            user=request.user if request.user.is_authenticated else None,
        )

        try:
            file_path = analysis.file.path

            # 1. Extract text
            if file.name.lower().endswith('.pdf'):
                raw_text = extract_text_from_pdf(file_path)
            elif file.name.lower().endswith('.docx'):
                raw_text = extract_text_from_docx(file_path)
            else:
                raw_text = ''

            # 2. Full analysis
            analysis_data = analyze_resume(raw_text, job_desc)

            # 3. Save results
            analysis.raw_text = raw_text[:10000]
            analysis.ats_score = analysis_data['ats_score']
            analysis.score_breakdown = analysis_data['score_breakdown']
            analysis.matched_kw = analysis_data['matched_kw']
            analysis.missing_kw = analysis_data['missing_kw']
            analysis.ai_suggestions = analysis_data['ai_suggestions']
            analysis.strengths = analysis_data['strengths']
            analysis.weaknesses = analysis_data['weaknesses']
            analysis.improved_resume = analysis_data['improved_resume']
            analysis.status = 'done'
            analysis.save()

        except Exception as exc:
            analysis.status = 'failed'
            analysis.save()
            return Response(
                {'error': f'Analysis failed: {str(exc)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        return Response(
            ResumeAnalysisSerializer(analysis).data,
            status=status.HTTP_201_CREATED,
        )


class AnalysisListView(APIView):
    """GET /api/analyses/ – list past analyses."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = ResumeAnalysis.objects.filter(status='done', user=request.user).order_by('-created_at')[:20]
        return Response(ResumeAnalysisSerializer(qs, many=True).data)


class AnalysisDetailView(APIView):
    """GET /api/analyses/<id>/ – get one analysis."""
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            obj = ResumeAnalysis.objects.get(pk=pk, user=request.user)
        except ResumeAnalysis.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)
        return Response(ResumeAnalysisSerializer(obj).data)


class ImproveResumeView(APIView):
    """POST /api/analyses/<id>/improve/ – generate improved resume."""
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            analysis = ResumeAnalysis.objects.get(pk=pk, user=request.user)
        except ResumeAnalysis.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)
        
        # Return already stored improved resume
        return Response({'improved_resume': analysis.improved_resume})


class DownloadPDFView(APIView):
    """GET /api/analyses/<id>/download/pdf/ – download improved resume as PDF."""
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            analysis = ResumeAnalysis.objects.get(pk=pk, user=request.user)
        except ResumeAnalysis.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)
        
        try:
            pdf_buffer = generate_pdf_content(analysis.improved_resume)
            
            response = HttpResponse(pdf_buffer, content_type='application/pdf')
            response['Content-Disposition'] = 'attachment; filename="improved-resume.pdf"'
            return response
        except Exception as exc:
            return Response(
                {'error': f'Failed to generate PDF: {str(exc)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class DownloadDOCXView(APIView):
    """GET /api/analyses/<id>/download/docx/ – download improved resume as DOCX."""
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            analysis = ResumeAnalysis.objects.get(pk=pk, user=request.user)
        except ResumeAnalysis.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)
        
        try:
            docx_buffer = generate_docx_content(analysis.improved_resume)
            
            response = HttpResponse(docx_buffer, content_type='application/vnd.openxmlformats-officedocument.wordprocessingml.document')
            response['Content-Disposition'] = 'attachment; filename="improved-resume.docx"'
            return response
        except Exception as exc:
            return Response(
                {'error': f'Failed to generate DOCX: {str(exc)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
