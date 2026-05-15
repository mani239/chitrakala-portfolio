from flask import Flask, abort, render_template, send_from_directory, url_for
import os

app = Flask(__name__)
app.config['JSON_SORT_KEYS'] = False

# Configuration
app.config['ENV'] = os.environ.get('FLASK_ENV', 'production')
app.config['DEBUG'] = os.environ.get('DEBUG', 'False').lower() == 'true'
SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-key-change-in-production')
app.config['SECRET_KEY'] = SECRET_KEY

# Portfolio Configuration
# Primary brand shown on the site. The owner (Manideep) is available in metadata but not highlighted.
PORTFOLIO_OWNER = "Chitrakala Media Production Company"
STUDIO_NAME = "Chitrakala Media Production Company"
STUDIO_TAGLINE = "Global Media Localization, Dubbing & Post-Production Infrastructure"
# If you prefer a phrase like 'Emerging Storyteller' replace this with a string.
YEARS_EXPERIENCE = 4

SHOWREEL_LINK = os.environ.get('SHOWREEL_LINK', "https://drive.google.com/file/d/YOUR_SHOWREEL_FILE_ID/view")

PROJECTS = [
    {
        "id": 1,
        "slug": "global-launch-the-long-weekend",
        "title": "Global Launch: The Long Weekend",
        "category": "Streaming Localization",
        "description": "Multi-language localization program supporting a global episodic release.",
        "image": "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&h=900&fit=crop&crop=center",
        "alt": "Demo brand film still",
        "video_link": "https://drive.google.com/file/d/16Fv2jZXcgXOR7xHo2FKvuoI-IjMy1rDz/view?usp=drivesdk",
        "gallery": [
            "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1400&h=900&fit=crop&crop=center",
            "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1400&h=900&fit=crop&crop=center",
        ],
        "testimonial": "Exceptional coordination across languages and delivery formats.",
    },
    {
        "id": 2,
        "slug": "gaming-localization-pulse",
        "title": "Gaming Localization: Pulse",
        "category": "Interactive Media",
        "description": "Voice direction and UI adaptation for a live-service gaming experience.",
        "image": "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=1200&h=900&fit=crop&crop=center",
        "alt": "Demo healthcare interface still",
        "video_link": "https://drive.google.com/file/d/1RJYv0MGWsalXtwnCuw0xPOfjTUVEMAWO/view?usp=drivesdk",
        "gallery": [
            "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=1400&h=900&fit=crop&crop=center",
            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1400&h=900&fit=crop&crop=center",
        ],
        "testimonial": "Precise localization with strong performance continuity.",
    },
    {
        "id": 3,
        "slug": "feature-localization-river-voices",
        "title": "Feature Localization: River Voices",
        "category": "Film Studios",
        "description": "Premium dubbing and subtitling package for a multi-region theatrical release.",
        "image": "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&h=900&fit=crop&crop=center",
        "alt": "Demo documentary still",
        "video_link": "https://drive.google.com/file/d/1cgJgYNQe0OAZQroFX_mg696o7zZNm_B9/view?usp=drivesdk",
        "featured": True,
        "gallery": [
            "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1400&h=900&fit=crop&crop=center",
            "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1400&h=900&fit=crop&crop=center",
        ],
    },
    {
        "id": 4,
        "slug": "brand-dubbing-wild-echoes",
        "title": "Brand Dubbing: Wild Echoes",
        "category": "Global Brands",
        "description": "Multilingual adaptation and VO production for a global brand campaign.",
        "image": "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&h=900&fit=crop&crop=center",
        "alt": "Demo wildlife reel still",
        "video_link": "https://drive.google.com/file/d/1botvmlKVTYkVDuMjlBG91H_mFcMsZ_B4/view?usp=drivesdk",
        "gallery": [
            "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1400&h=900&fit=crop&crop=center",
            "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=1400&h=900&fit=crop&crop=center",
        ],
    },
]

SERVICES = [
    {
        "group": "Localization & Dubbing",
        "items": [
            "Language dubbing and voice casting",
            "Voice direction and performance coaching",
            "Multilingual media adaptation",
            "In-market linguistic review",
        ],
    },
    {
        "group": "Subtitling & Captioning",
        "items": [
            "Broadcast-compliant subtitling (SDH)",
            "Closed captioning and accessibility",
            "Timed text QC and compliance checks",
            "Multi-platform subtitle delivery",
        ],
    },
    {
        "group": "Transcription & Adaptation",
        "items": [
            "Multilingual transcription",
            "Script adaptation and localization",
            "Glossary and terminology management",
            "Cultural nuance alignment",
        ],
    },
    {
        "group": "Audio Post-Production",
        "items": [
            "Mixing, mastering, and restoration",
            "Dolby-ready theatrical delivery",
            "M&E splits and versioning",
            "Immersive audio support",
        ],
    },
    {
        "group": "Video Post-Production",
        "items": [
            "Editorial finishing and mastering",
            "Multi-format delivery and versioning",
            "QC automation and compliance",
            "Localization-ready asset prep",
        ],
    },
    {
        "group": "Animation & Creative Tech",
        "items": [
            "Localized motion design",
            "2D/3D animation systems",
            "Multilingual graphics packages",
            "Creative technology toolkits",
        ],
    },
]

BLOGS = [
    {
        "category": "Localization Strategy",
        "title": "Designing global release workflows for streaming platforms",
        "author": "Chitrakala Media",
        "date": "May 15, 2026",
        "excerpt": "A strategic view on coordinating localization, dubbing, and subtitling at scale without losing creative intent.",
    },
    {
        "category": "Dubbing & Voice",
        "title": "Voice direction standards for premium multilingual releases",
        "author": "Chitrakala Media",
        "date": "May 10, 2026",
        "excerpt": "How to maintain performance authenticity while scaling across markets and delivery formats.",
    },
    {
        "category": "Media Technology",
        "title": "QA automation in modern localization pipelines",
        "author": "Chitrakala Media",
        "date": "April 28, 2026",
        "excerpt": "A look at compliance tooling, timed-text validation, and AI-assisted QC for enterprise media.",
    },
]

CONTACT = {
    "address": "C-43, Second Floor, DDA Sheds, Okhla Phase 1, Delhi – 110020",
    "email": "contact@chitrakala.media",
    "company": "Chitrakala Media Production Company",
    "phones": ["+91 9818926235", "+91 9811566409"],
    "year": "© 2026",
}

PROCESS = [
    {
        "index": "01",
        "icon": "INT",
        "title": "Intake & Strategy",
        "text": "Scope languages, timelines, security requirements, and global release objectives.",
    },
    {
        "index": "02",
        "icon": "ADP",
        "title": "Script & Adaptation",
        "text": "Localization, cultural review, casting, and voice direction planning.",
    },
    {
        "index": "03",
        "icon": "PRO",
        "title": "Production & QA",
        "text": "Studio recording, mixing, subtitling, and automated QC gates.",
    },
    {
        "index": "04",
        "icon": "DEL",
        "title": "Global Delivery",
        "text": "Secure multi-format delivery, versioning, and release management.",
    },
]

TESTIMONIALS = []

STATS = [
    {"label": "Projects Completed", "value": "40+", "icon": "🎯"},
    {"label": "Years Experience", "value": str(YEARS_EXPERIENCE), "icon": "⏱️"},
    {"label": "Client Satisfaction", "value": "98%", "icon": "⭐"},
    {"label": "Team Collaborations", "value": "25+", "icon": "🤝"},
]


@app.route("/")
def home():
    # Prefer a custom workspace-level placeholder file if present, otherwise prefer a local static video, then fallback to CDN.
    workspace_video = os.path.join(app.root_path, '26537-357886155_medium.mp4')
    local_video_path = os.path.join(app.root_path, "static", "video", "showreel.mp4")
    if os.path.exists(workspace_video):
        video_src = url_for('custom_showreel')
    elif os.path.exists(local_video_path):
        video_src = url_for('static', filename='video/showreel.mp4')
    else:
        # Public short sample as a fallback (5s sample). Replace with your CDN or hosted file for production.
        video_src = "https://samplelib.com/lib/preview/mp4/sample-5s.mp4"
    # Optional mic audio/video sample in the workspace root
    workspace_mic = os.path.join(app.root_path, '27465-363961181_medium.mp4')
    if os.path.exists(workspace_mic):
        mic_video_src = url_for('custom_mic')
    else:
        mic_video_src = ''
    return render_template(
        "index.html",
        projects=PROJECTS,
        process=PROCESS,
        testimonials=TESTIMONIALS,
        stats=STATS,
        showreel_link=SHOWREEL_LINK,
        video_src=video_src,
        mic_video_src=mic_video_src,
        portfolio_owner=PORTFOLIO_OWNER,
        studio_name=STUDIO_NAME,
        studio_tagline=STUDIO_TAGLINE,
        services=SERVICES,
        blogs=BLOGS,
        contact=CONTACT,
    )


@app.route("/services")
def services_page():
    return render_template(
        "services.html",
        services=SERVICES,
        contact=CONTACT,
        studio_name=STUDIO_NAME,
        studio_tagline=STUDIO_TAGLINE,
    )


@app.route("/blogs")
def blogs_page():
    return render_template(
        "blogs.html",
        blogs=BLOGS,
        contact=CONTACT,
        studio_name=STUDIO_NAME,
        studio_tagline=STUDIO_TAGLINE,
    )


@app.route("/portfolio")
def portfolio_page():
    return render_template(
        "portfolio.html",
        projects=PROJECTS,
        contact=CONTACT,
        studio_name=STUDIO_NAME,
        studio_tagline=STUDIO_TAGLINE,
    )


@app.route("/work")
def work_page():
    return render_template(
        "work.html",
        projects=PROJECTS,
        contact=CONTACT,
        studio_name=STUDIO_NAME,
        studio_tagline=STUDIO_TAGLINE,
    )


@app.route("/portfolio/<slug>")
def portfolio_detail_page(slug):
    project = next((item for item in PROJECTS if item.get("slug") == slug), None)
    if not project:
        abort(404)
    return render_template(
        "portfolio-detail.html",
        project=project,
        projects=PROJECTS,
        contact=CONTACT,
        studio_name=STUDIO_NAME,
        studio_tagline=STUDIO_TAGLINE,
    )


@app.route("/work/<slug>")
def work_detail_page(slug):
    project = next((item for item in PROJECTS if item.get("slug") == slug), None)
    if not project:
        abort(404)
    return render_template(
        "portfolio-detail.html",
        project=project,
        projects=PROJECTS,
        contact=CONTACT,
        studio_name=STUDIO_NAME,
        studio_tagline=STUDIO_TAGLINE,
    )


@app.route("/contact")
def contact_page():
    return render_template(
        "contact.html",
        contact=CONTACT,
        studio_name=STUDIO_NAME,
        studio_tagline=STUDIO_TAGLINE,
    )


@app.route("/process")
def process_page():
    return render_template(
        "process.html",
        process=PROCESS,
        contact=CONTACT,
        studio_name=STUDIO_NAME,
        studio_tagline=STUDIO_TAGLINE,
    )


@app.route("/about")
def about_page():
    return render_template(
        "about.html",
        contact=CONTACT,
        studio_name=STUDIO_NAME,
        studio_tagline=STUDIO_TAGLINE,
    )


@app.route('/static/video/custom-showreel.mp4')
def custom_showreel():
    # Serve the workspace-level placeholder file if present.
    filename = '26537-357886155_medium.mp4'
    return send_from_directory(app.root_path, filename)


@app.route('/static/video/custom-mic.mp4')
def custom_mic():
    # Serve the workspace-level mic file if present.
    filename = '27465-363961181_medium.mp4'
    return send_from_directory(app.root_path, filename)


@app.route("/robots.txt")
def robots():
    return send_from_directory(app.root_path, "robots.txt")


@app.route("/sitemap.xml")
def sitemap():
    return send_from_directory(app.root_path, "sitemap.xml")


@app.route("/download.jpg")
def showreel_thumbnail():
    return send_from_directory(app.root_path, "download.jpg")


@app.route("/showreel.jpg")
def showreel_image():
    return send_from_directory(app.root_path, "view-black-white-light-projector-theatre.jpg")


@app.route("/ancient-humans.jpg")
def ancient_humans_image():
    return send_from_directory(app.root_path, "pexels-areeba-hassan-2154118816-33494425.jpg")


@app.route("/animal-behaviour.jpg")
def animal_behaviour_image():
    return send_from_directory(app.root_path, "pexels-musstashy-35445399.jpg")


if __name__ == "__main__":
    app.run(debug=app.config['DEBUG'])
