from sys import stdin, stdout
from json import loads, dumps
from decouple import config
import textstat

import urllib.request

def get_stats(text):
    fre = textstat.flesch_reading_ease(text)
    smog = textstat.smog_index(text)
    fkg = textstat.flesch_kincaid_grade(text)
    cli = textstat.coleman_liau_index(text)
    ari = textstat.automated_readability_index(text)
    dcr = textstat.dale_chall_readability_score(text)
    diff_words = textstat.difficult_words(text)
    lwf = textstat.linsear_write_formula(text)
    gunn_fog = textstat.gunning_fog(text)
    consolidated_score = textstat.text_standard(text)

    doc_length = len(text)  # think about excluding spaces?
    quote_count = text.count('"')

    stats = {
        "flesch_reading_ease": fre,
        "smog_index": smog,
        "flesch_kincaid_grade": fkg,
        "coleman_liau_index": cli,
        "automated_readability_index": ari,
        "dale_chall_readability_score": dcr,
        "difficult_words": diff_words,
        "linsear_write_formula": lwf,
        "gunning_fog": gunn_fog,
        "consolidated_score": consolidated_score,
        "doc_length": doc_length,
        "quote_count": quote_count
    }
    return stats



# Input: JSON String in the transcribable data structure
# Output: JSON String of the data being processed to retrieve readability scores
def main(text):
    json = loads(text)
    scores = get_stats(json['story']) # Assuming the web side calls the text "story"
    return dumps(scores)


# Reads in from stdin the entire input as a string
data = stdin.read()

# Runs the main function using the input string and saving the output string
output = main(data)

# Prints the output string to stdout
stdout.write(output)



# Can be tested with this command
# pipenv run python3 dotPy/readability.py < integration/src/stats_test.json
