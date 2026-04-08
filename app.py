from flask import Flask, render_template, send_from_directory

app = Flask(__name__)

SHOWREEL_LINK = "https://drive.google.com/file/d/YOUR_SHOWREEL_FILE_ID/view"

PROJECTS = [
    {
        "title": "Human Story",
        "description": "Cinematic short-form visual storytelling.",
        "image": "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
        "alt": "Human Story",
        "video_link": "https://drive.google.com/file/d/16Fv2jZXcgXOR7xHo2FKvuoI-IjMy1rDz/view?usp=drivesdk",
    },
    {
        "title": "Healthcare Visual",
        "description": "3D-based health awareness concept.",
        "image": "https://images.unsplash.com/photo-1581595219315-a187dd40c322",
        "alt": "Healthcare Visual",
        "video_link": "https://drive.google.com/file/d/1RJYv0MGWsalXtwnCuw0xPOfjTUVEMAWO/view?usp=drivesdk",
    },
    {
        "title": "Ancient Humans",
        "description": "Conceptual visual storytelling.",
        "image": "/ancient-humans.jpg",
        "alt": "Ancient Humans",
        "video_link": "https://drive.google.com/file/d/1cgJgYNQe0OAZQroFX_mg696o7zZNm_B9/view?usp=drivesdk",
    },
    {
        "title": "Animal Behaviour",
        "description": "Visual exploration of natural patterns.",
        "image": "/animal-behaviour.jpg",
        "alt": "Animal Behaviour",
        "video_link": "https://drive.google.com/file/d/1botvmlKVTYkVDuMjlBG91H_mFcMsZ_B4/view?usp=drivesdk",
    },
]

PROCESS = [
    {
        "index": "01",
        "title": "Script",
        "text": "Structuring ideas into clear, engaging short-form narratives.",
    },
    {
        "index": "02",
        "title": "Visuals",
        "text": "Designing scenes with attention to consistency and composition.",
    },
    {
        "index": "03",
        "title": "Motion",
        "text": "Building flow through transitions, movement, and timing.",
    },
    {
        "index": "04",
        "title": "Final Edit",
        "text": "Refining cuts, sound, and pacing for a clean final output.",
    },
]


@app.route("/")
def home():
    return render_template("index.html", projects=PROJECTS, process=PROCESS, showreel_link=SHOWREEL_LINK)


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
    app.run(debug=True)
