#!/usr/bin/env python
import os
from json import dumps

from subprocess import check_output, Popen


def get_videos():
    videos = []
    for video_filename in os.listdir('videos/'):
        video = os.path.join('videos', video_filename)
        duration = check_output(['/usr/bin/ffprobe', '-i', video, '-show_entries', 'format=duration', '-v', 'quiet',
                                 '-of', 'csv=p=0']).decode('utf-8').strip()
        videos.append({'file': video_filename, 'duration': float(duration)})
    print(dumps(videos, sort_keys=True, indent=4))


if __name__ == '__main__':
    get_videos()