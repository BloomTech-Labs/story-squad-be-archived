from sys import stdin, stdout
from json import loads, dumps
from decouple import config
from math import ceil
from sklearn.cluster import AgglomerativeClustering
from sklearn.preprocessing import StandardScaler
import pandas as pd
from collections import Counter


def make_team(li, n):
    """takes in list of participants length 2-5, outputs formatted match(es)"""
    match = {"team_1": [li[0]], "team_2": [li[1]]}
    output = {f'match_{n}': match}
    if len(li) == 2:
        return output
    match["team_1"].append(li[2])
    if len(li) == 3:
        return output
    if len(li) == 5:
        match2 = {"team_1": [li[3]], "team_2": [li[4]]}
        output2 = {f'match_{n+1}': match2}
        output.update(output2)
        return output
    match["team_2"].append(li[3])
    if len(li) == 4:
        return output
    return output


def break_index(li, start):
    """takes in the >1 index of the sorted dataframe and returns all matches"""
    matches = {}
    if len(li) <= 1:
        return {}
    for i in range(ceil(len(li) / 4)):
        if len(li[i*4:]) <= 5 and len(li[i*4:]) != 1:
            matches.update(make_team(li[i*4:], i+start))
        elif (i*4)+4 <= len(li):
            matches.update(make_team(li[i*4:(i*4)+4], i+start))
    return matches


# def break_df(df):
#     """Takes a dataframe, buckets by length, sorts by cli, teamifies"""
#     if df.shape[0] <= 50:
#         # small playing field means everyone plays together
#         df_sort = df.sort_values('coleman_liau_index')
#         return break_index(list(df_sort.index), 0)

#     lower_bound = df.quantile(q=.3, axis=0)['doc_length']
#     upper_bound = df.quantile(q=.7, axis=0)['doc_length']

#     df_short = df[df['doc_length'] <
#                   lower_bound].sort_values('coleman_liau_index')
#     df_long = df[df['doc_length'] >
#                  upper_bound].sort_values('coleman_liau_index')

#     df_filter = df[df['doc_length'] >= lower_bound]
#     df_med = df_filter[df_filter['doc_length'] <=
#                        upper_bound].sort_values('coleman_liau_index')

#     matches = {}
#     matches.update(break_index(list(df_short.index), 0))
#     matches.update(break_index(list(df_long.index), len(matches)))
#     matches.update(break_index(list(df_med.index), len(matches)))
#     return str(matches)

def get_cluster(df):
    """Applies clustering (with appropriate cluster number) to df"""
    feats = ['doc_length','quote_count','difficult_words','grade']
    scaler = StandardScaler()
    norm_X = scaler.fit_transform(df[feats])
    cluster_size = get_cluster_size(norm_X)
    model = AgglomerativeClustering(n_clusters=cluster_size, affinity='euclidean', linkage='ward')
    model.fit(norm_X)
    df['cluster'] = model.labels_
    return df

def break_clusters(df):
    """outputs matches for a dataframe with any number of clusters"""
    no_cluster = len(df['cluster'].unique())
    
    matches = {}
    
    for i in range(no_cluster):
        cluster_df = df[df['cluster'] == i]
        # cluster_index = cluster_df.sort_values('coleman_liau_index').index
        cluster_index = cluster_df.index
        matches.update(break_index(list(cluster_index), len(matches)))
        
    return str(matches)

def get_cluster_size(norm_X):
    """checks smallest cluster size for each number of clusters,
    returns max number of clusters such that the smallest cluster
    isn't under the minimum size"""
    cluster_size = 2
    min_cluster_size = 5
    while min_cluster_size >= 4:
        model = AgglomerativeClustering(n_clusters=cluster_size, affinity='euclidean', linkage='ward')
        model.fit(norm_X)
        min_cluster_size = min(Counter(model.labels_).values())
        cluster_size += 1
    return cluster_size - 2

# def check_cluster_size(cluster_size, labels):
#     min_size = min(Counter(labels).values())
#     print(min_size)
#     return None

def make_match(df):
    df = get_cluster(df)
    matches = break_clusters(df)
    #matches = break_df(df)
    return matches


def make_df(data_in):
    data = loads(data_in)
    df = pd.DataFrame(data).T
    return df


def main(data_in):
    df = make_df(data_in)
    matches = make_match(df)
    return matches


data_in = stdin.read()

output = main(data_in)

stdout.write(output)

# Can be tested with this command
# pipenv run python3 dotPy/matchmaking.py < integration/src/matchmaking_test.json