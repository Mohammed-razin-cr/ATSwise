from django.db import models
from django.contrib.auth.models import User


class ResumeAnalysis(models.Model):
    """Stores uploaded resume and its analysis result."""

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('done', 'Done'),
        ('failed', 'Failed'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    file = models.FileField(upload_to='resumes/')
    filename = models.CharField(max_length=255)
    job_desc = models.TextField(blank=True, default='')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    ats_score = models.IntegerField(null=True, blank=True)
    score_breakdown = models.JSONField(default=dict)
    matched_kw = models.JSONField(default=list)
    missing_kw = models.JSONField(default=list)

    ai_suggestions = models.JSONField(blank=True, default=list)
    raw_text = models.TextField(blank=True, default='')
    improved_resume = models.TextField(blank=True, default='')
    strengths = models.JSONField(blank=True, default=list)
    weaknesses = models.JSONField(blank=True, default=list)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.filename} – {self.ats_score or 0}/100'