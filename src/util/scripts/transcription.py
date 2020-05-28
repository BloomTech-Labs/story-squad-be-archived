from sys import stdin, stdout
from json import loads, dumps
from decouple import config
from datauri import DataURI
import re
import pandas as pd
import os

from google.cloud import vision
from google.cloud.vision import types
from google.oauth2 import service_account

import urllib.request

api_key = config("GOOGLE_APPLICATION_CREDENTIALS")
api_key = loads(api_key)
api_key = service_account.Credentials.from_service_account_info(api_key)
client = vision.ImageAnnotatorClient(credentials=api_key)


def transcribe(uri):
    # Parses a URI and gets the encoded data string out
    data = DataURI(uri).data
    image = types.Image(content=data) # pylint: disable=no-member
    response = client.document_text_detection(image) # pylint: disable=no-member

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


# Converts bad phrases dataframe to a list 
df = pd.read_csv('bad_phrases.csv')
bad_phrases = df['bad_phrases'].to_list()

# Converts bad single words dataframe to a list
df1 = pd.read_csv('bad_single.csv')
bad_words = df1['bad_single'].to_list()

# Global variable to put caught words and phrase in
flagged_list = []

# Function that removes punctuation from story
def remove_punctuation(transcriptions):
    parsed_string = dumps(transcriptions)
    punctuations = '''[],!.'"\\?'''
    for char in parsed_string:
        if char in punctuations:
            parsed_string = parsed_string.replace(char, '')
    return parsed_string


# Function that looks for bad phrases in story
def return_bad_phrases(transcriptions):
    # Convert dict to str using dumps to keep phrases in tact
    parsed_string = dumps(transcriptions)
    # Lowercase to match list of bad phrases
    parsed_string = parsed_string.lower()
    # Remove punctuation
    parsed_string = remove_punctuation(parsed_string)
    # Returns list of matching words and puts in flagged_list global variable
    for word in bad_phrases:
        if word in parsed_string:
            flagged_list.append(word)
    # Returns dictionary with list of matches
    dict = {'possible_words' : flagged_list}
    return transcriptions.update(dict)


# Function that looks for single bad words in story
def return_bad_words(transcriptions):
    # Parsing out just the story string from dict to avoid conflicts
    parsed_string = list(transcriptions.values())[0][0]
    # Lowercase to match list of bad words
    parsed_string = parsed_string.lower()
    # Remove punctuation
    parsed_string = remove_punctuation(parsed_string)
    # Splitting into list of strings to detect exact matches
    parsed_string = parsed_string.split()
    # Finding matches and appending them to flagged_list
    for word in bad_words:
        if word in parsed_string:
            flagged_list.append(word)
    # Returns dictionary with list of matches
    dict = {'possible_words' : flagged_list}
    return transcriptions.update(dict)


# Checks to see if any words have been added to the flagged_list
def flag_bad_words(transcriptions):
    if any(flagged_list):
        dict = {'flagged' : [True]}
        return transcriptions.update(dict)
    else:
        dict = {'flagged' : [False]}
        return transcriptions.update(dict)

# Input: JSON String in the transcribable data structure
# Output: JSON String of the data being processed into transcripts and metadata

# # Will need to change the path based on User's local environment
# path = "C:/Users/micha/Desktop/Lambda/DS-Unit-5_Labs/Story_Squad_Dataset_results"

def main(transcribable):
    json = loads(transcribable)
    transcriptions = process_images(json['images'])
    return_bad_phrases(transcriptions)
    return_bad_words(transcriptions)

    # # ONLY uncomment the following block when running tests
    # # writing the dictionary output to a .txt file and saving in "path"
    # file_name = json['file_name']
    # file_name = os.path.join(path, file_name+".txt")
    # print(file_name)
    # output_file = open(f"{file_name}", "w")
    # output_file.write(dumps(transcriptions))
    # output_file.close()

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