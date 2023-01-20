from pytube import YouTube
from pydub import AudioSegment
from random import randint
import os


def download(yt_url: str, language_code: str):
    # Download the video from YouTube
    print(f"Downloading {yt_url}")
    yt = YouTube(yt_url)
    video = yt.streams.first()
    video.download()
    print(f"Downloading done")
    # Extract the audio from the video file

    print(f"Extract the audio from the video file")
    audio = AudioSegment.from_file(video.default_filename)
    audio.export("data/" + language_code + ".mp3", format="mp3")
    print(f"Extract done")
    os.remove(video.default_filename)


def extract_segment(language_code: str, segment_number: int):
    # Load the audio file
    audio = AudioSegment.from_file("data/" + language_code + ".mp3")

    # Get the duration of the audio
    audio_duration = len(audio)

    # Generate a random start time for the segment
    start_time = randint(0, audio_duration - 30000)

    # Extract the 30 seconds segment from the audio
    segment = audio[start_time : start_time + 30000]

    # Save the segment to a new audio file
    segment.export(
        "data/" + language_code + "_" + str(segment_number) + ".mp3", format="mp3"
    )


import json

# Opening JSON file
f = open("data/languages.json")
# a dictionary
data = json.load(f)
for language in data:
   if "url" in language:
      if not os.path.exists("data/" + language["code"] + ".mp3"):
         download(language["url"], language["code"])
         for segment in range(3):
            extract_segment(language["code"], segment)
      else:
         print("data/" + language["code"] + ".mp3 already exists")
 
