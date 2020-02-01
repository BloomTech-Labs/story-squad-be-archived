from sys import argv
from json import loads, dumps
from decouple import config

from google.cloud import vision
from google.cloud.vision import types
from google.oauth2 import service_account

import urllib.request
import base64

api_key = config('GOOGLE_CREDS')
api_key = loads(api_key)
api_key = service_account.Credentials.from_service_account_info(api_key)


def transcribe(encoded_image):
    """Detects document features in the file located in Google Cloud Storage."""
    client = vision.ImageAnnotatorClient(credentials=api_key)
    image = types.Image(content=encoded_image)
    response = client.document_text_detection(image)

    if response.text_annotations:
        return response.text_annotations[0].description.replace('\n', ' ')
    else:
        return "No Text"


def nothing(image):
    return {"nada": "nothing"}


def process_images(raw_images):
    images = map(base64.b64decode, raw_images)
    transcripts = list(map(transcribe, images))
    metadata = list(map(nothing, transcripts))
    return {'images': transcripts, 'metadata': metadata}


incoming = loads(argv[1])
processed = process_images(incoming['images'])
stringified = dumps(processed)
print(stringified)
