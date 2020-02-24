from sys import stdin, stdout
from json import loads, dumps
from decouple import config
from datauri import DataURI
from google.cloud import vision
from google.cloud.vision import types
# from google.oauth2 import service_account
from google.auth import compute_engine
import os
os.environ["GOOGLE_APPLICATION_CREDENTIALS"]="./src/util/scripts/StorySquad-2922ddf6e57d.json"
credentials = compute_engine.Credentials()

import urllib.request

client = vision.ImageAnnotatorClient()


def transcribe(uri):
    # Parses a URI and gets the encoded data string out
    data = DataURI(uri).data
    image = types.Image(content=data)
    response = client.document_text_detection(image)

    if response.text_annotations:
        return response.text_annotations[0].description.replace('\n', ' ')
    else:
        return "No Text"


# To be replaced with a function that gets the metadata out of the function
def nothing(transcript):
    return {"nada": "nothing"}


# Input list of URIs
def process_images(uris):
    # Map functions are used to take iterable data structures like list, maps, etc. and make a map
    # that consist of the data of the original data structure after being run through a function.
    # Outputs a map (list like data structure) of all the uris after being transcribed
    transcripts = map(transcribe, uris)
    # Outputs a map (list like data structure) of all the transcriptions after having the meta data parsed
    metadata = map(nothing, transcripts)
    return {'images': list(transcripts), 'metadata': list(metadata)}


# Input: JSON String in the transcribable data structure
# Output: JSON String of the data being processed into transcripts and metadata
def main(transcribable):
    json = loads(transcribable)
    transcriptions = process_images(json['images'])
    return dumps(transcriptions)


# Reads in from stdin the entire input as a string
data = stdin.read()

# Runs the main function using the input string and saving the output string
output = main(data)

# Prints the output string to stdout
stdout.write(output)


# Can be tested with this command
# pipenv run python3 dotPy/transcription.py < integration/src/transcription_test.json

# Notice how the `test.json` is piped into stdin with the `<`