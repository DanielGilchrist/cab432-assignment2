# CAB432 second assignment
# inspired by https://github.com/MMADave/Twitter-Sentiment-Analysis-using-TextBlob/blob/master/Twitter-Sentiment-Analysis-TextBlob.py

# Twitter sentiment analysis using TextBlob

import zerorpc
from textblob import TextBlob
import re
import gevent
import logging
import json


logging.basicConfig()

# A helper function that removes all the non ASCII characters
# from the given string. Retuns a string with only ASCII characters.
def strip_non_ascii(string):
    ''' Returns the string without non ASCII characters'''
    # stripped = string.get_text().encode('ascii', errors='ignore').decode()
    if string is not None:
        stripped = (c for c in string if 0 < ord(c) < 127)
        return ''.join(stripped)
    else:
        return None

# Remove URLS. (The regex is from the internet.)
def remove_url(string):
    data = re.sub(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', '', string)
    return data

# Remove/replace unreadable words and characters
def clean_tweet(data):
    data = strip_non_ascii(data)
    if data is not None:

        # remove url
        data = remove_url(data)

        # Fix classic tweet lingo
        data = re.sub(r'\bthats\b', 'that is', data)
        data = re.sub(r'\bive\b', 'i have', data)
        data = re.sub(r'\bim\b', 'i am', data)
        data = re.sub(r'\bya\b', 'yeah', data)
        data = re.sub(r'\bcant\b', 'can not', data)
        data = re.sub(r'\bwont\b', 'will not', data)
        data = re.sub(r'\bid\b', 'i would', data)
        data = re.sub(r'wtf', 'what the fuck', data)
        data = re.sub(r'\bwth\b', 'what the hell', data)
        data = re.sub(r'\br\b', 'are', data)
        data = re.sub(r'\bu\b', 'you', data)
        data = re.sub(r'\bk\b', 'OK', data)
        data = re.sub(r'\bsux\b', 'sucks', data)
        data = re.sub(r'\bno+\b', 'no', data)
        data = re.sub(r'\bcoo+\b', 'cool', data)
        data = re.sub(r'\\n', ' ', data)
        data = re.sub(r'\\r', ' ', data)
        data = re.sub(r'&gt;', '', data)
        data = re.sub(r'&amp;', 'and', data)
        data = re.sub(r'\$ *hit', 'shit', data)
        data = re.sub(r' w\/', 'with', data)
        data = re.sub(r'\ddelay', '\d delay', data)


    return data



# Returns a single JSON object which contains polarity and subjectivity
#
#  {"polarity": polarity, "subjectivity": subjectivity}
#
def sentiment(string):
     tweet = clean_tweet(string)
     if tweet is not None:
         text_blob = TextBlob(tweet)
         # add load by trying to correct the spelling
         text_blob = text_blob.correct()
         json_data = {"polarity": text_blob.sentiment.polarity, "subjectivity": text_blob.sentiment.subjectivity}
         data = json.dumps(json_data)
         return data
     else:
         return -2





# Returns the number of noun_phrases appearance in JSON format
# { "words" : [
#               {"text" : phrase, "size": count },
#               {"text" : phrase, "size": count }
#             ]
# }
def get_phrases(string):
    tweet = clean_tweet(string)
    dict_array = []
    output_dict = {}
    if tweet is not None:
        blob = TextBlob(tweet)
        
        for phrase in blob.noun_phrases:
            dictionary = {}
            dictionary['text'] = phrase
            dictionary['size'] = blob.noun_phrases.count(phrase)
            dict_array.append(dictionary)
            
        output_dict['words'] = dict_array
        json_data = json.dumps(output_dict)
        return json_data
    else:
        return '[]'


# ZeroRPC class
class RPC(object):
    def get_sentiment(self, string):
        analysis = sentiment(string)
        gevent.sleep(0)
        return analysis

    def get_entities(self, string):
        json_object = get_phrases(string)
        gevent.sleep(0)
        return json_object
        
        
s = zerorpc.Server(RPC())
s.bind("tcp://0.0.0.0:4242")
s.run()