import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

class PDFService:
    def __init__(self):
        self.output_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "static", "reports")
        os.makedirs(self.output_dir, exist_ok=True)

    def generate_report_pdf(self, report_data: dict, file_name: str) -> str:
        """
        Generates a beautiful agricultural report PDF.
        report_data format:
        {
            "farm_name": str,
            "farmer_name": str,
            "date": str,
            "crop_health_score": int,
            "soil_status": str,
            "active_tasks_count": int,
            "market_recommendation": str,
            "sustainability_score": int,
            "ai_insights": list of str,
            "tasks": list of dicts with keys (title, due_date, category, status)
        }
        """
        pdf_path = os.path.join(self.output_dir, file_name)
        doc = SimpleDocTemplate(
            pdf_path,
            pagesize=letter,
            rightMargin=54,
            leftMargin=54,
            topMargin=54,
            bottomMargin=54
        )

        styles = getSampleStyleSheet()
        
        # Custom Styles for Premium Look
        title_style = ParagraphStyle(
            'ReportTitle',
            parent=styles['Heading1'],
            fontName='Helvetica-Bold',
            fontSize=24,
            leading=28,
            textColor=colors.HexColor("#1e3a8a"),  # Navy blue
            spaceAfter=15
        )
        
        subtitle_style = ParagraphStyle(
            'ReportSubtitle',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=12,
            leading=16,
            textColor=colors.HexColor("#4b5563"),
            spaceAfter=20
        )
        
        h2_style = ParagraphStyle(
            'SectionHeader',
            parent=styles['Heading2'],
            fontName='Helvetica-Bold',
            fontSize=16,
            leading=20,
            textColor=colors.HexColor("#0f766e"),  # Teal
            spaceBefore=12,
            spaceAfter=8
        )

        body_style = ParagraphStyle(
            'Body',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=10,
            leading=14,
            textColor=colors.HexColor("#1f2937")
        )

        bullet_style = ParagraphStyle(
            'Bullet',
            parent=body_style,
            leftIndent=20,
            firstLineIndent=-10,
            spaceAfter=5
        )

        story = []

        # Header Title
        story.append(Paragraph("AgriGuardian Swarm - Farm Intelligence Report", title_style))
        story.append(Paragraph(f"<b>Farm:</b> {report_data.get('farm_name', 'My Farm')} | <b>Farmer:</b> {report_data.get('farmer_name', 'Farmer')} | <b>Date:</b> {report_data.get('date', 'Today')}", subtitle_style))
        story.append(Spacer(1, 10))

        # Key Metrics Table
        metric_data = [
            [
                Paragraph("<b>Crop Health Score</b>", body_style),
                Paragraph("<b>Sustainability Score</b>", body_style),
                Paragraph("<b>Pending Tasks</b>", body_style)
            ],
            [
                Paragraph(f"<font size=16 color='#16a34a'><b>{report_data.get('crop_health_score', 85)}%</b></font>", body_style),
                Paragraph(f"<font size=16 color='#0284c7'><b>{report_data.get('sustainability_score', 75)}/100</b></font>", body_style),
                Paragraph(f"<font size=16 color='#dc2626'><b>{report_data.get('active_tasks_count', 0)}</b></font>", body_style)
            ]
        ]
        
        t_metrics = Table(metric_data, colWidths=[2.3*inch, 2.3*inch, 2.3*inch])
        t_metrics.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f3f4f6")),
            ('ALIGN', (0,0), (-1,-1), 'CENTER'),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('TEXTCOLOR', (0,0), (-1,0), colors.HexColor("#374151")),
            ('BOTTOMPADDING', (0,0), (-1,-1), 10),
            ('TOPPADDING', (0,0), (-1,-1), 10),
            ('GRID', (0,0), (-1,-1), 1, colors.HexColor("#e5e7eb")),
        ]))
        
        story.append(t_metrics)
        story.append(Spacer(1, 20))

        # AI Insights Section
        story.append(Paragraph("Autonomous AI Swarm Insights", h2_style))
        insights = report_data.get("ai_insights", [])
        if not insights:
            insights = ["All systems functioning normally. Soil moisture levels are optimal.", "No active pests or disease threats detected in recent scans."]
        
        for insight in insights:
            story.append(Paragraph(f"• {insight}", bullet_style))
        story.append(Spacer(1, 15))

        # Farm Status Details
        story.append(Paragraph("Soil & Resource Status", h2_style))
        status_text = f"<b>Soil Status:</b> {report_data.get('soil_status', 'Loamy Soil, Moderate Nitrogen')}<br/>" \
                      f"<b>Market Price Outlook:</b> {report_data.get('market_recommendation', 'Prices stable. Selling opportunity optimal in 2 weeks.')}"
        story.append(Paragraph(status_text, body_style))
        story.append(Spacer(1, 15))

        # Action Plan / Task List
        story.append(Paragraph("Recommended Action Plan", h2_style))
        tasks = report_data.get("tasks", [])
        
        if tasks:
            task_table_data = [[
                Paragraph("<b>Task</b>", body_style),
                Paragraph("<b>Category</b>", body_style),
                Paragraph("<b>Due Date</b>", body_style),
                Paragraph("<b>Status</b>", body_style)
            ]]
            for task in tasks:
                task_table_data.append([
                    Paragraph(task.get("title", "Task"), body_style),
                    Paragraph(task.get("category", "General"), body_style),
                    Paragraph(task.get("due_date", "Today"), body_style),
                    Paragraph(f"<font color='#d97706'><b>{task.get('status', 'Pending')}</b></font>", body_style)
                ])
            
            t_tasks = Table(task_table_data, colWidths=[3.2*inch, 1.2*inch, 1.3*inch, 1.3*inch])
            t_tasks.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f3f4f6")),
                ('BOTTOMPADDING', (0,0), (-1,-1), 6),
                ('TOPPADDING', (0,0), (-1,-1), 6),
                ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#e5e7eb")),
            ]))
            story.append(t_tasks)
        else:
            story.append(Paragraph("No pending tasks. Your farm is up to date!", body_style))

        story.append(Spacer(1, 30))
        story.append(Paragraph("<font size=8 color='#9ca3af'>AgriGuardian Swarm uses advanced multi-agent intelligence to synthesize reports. This is an automated output and should be used in conjunction with local agricultural guidelines.</font>", body_style))

        doc.build(story)
        
        # Return path relative to project root or absolute
        return pdf_path

pdf_service = PDFService()
