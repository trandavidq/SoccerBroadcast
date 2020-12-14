import requests
from bs4 import BeautifulSoup
import sqlite3
import os
from os import path



url_bundesliga = 'https://www.theguardian.com/football/laligafootball/table'
r_bundesliga = requests.get(url_bundesliga)

soup=BeautifulSoup(r_bundesliga.text,'html.parser')

teams_bundesliga_dict = {};
#grabs the html table (there is only one table)
theTable = soup.find('table',class_='table table--football table--league-table table--responsive-font table--striped')


def print_dict(teams_epl_dict):
    for team in teams_epl_dict.keys():
            print(team,end=" ")
            for stat in teams_epl_dict[team]:
                print(str(stat),end=" ")
            print()

#this for loop scrapes the data from the standings table
def get_data(teams_epl_dict, theTable):
    #initializes the dictionary with stats from the standings located on the guardian sports website
    for epl_team in (theTable.find_all('tr',)[1:]):
        team_name=epl_team.find('td',class_='table-column--main').text.strip()

        #the stats in order: position, games played, wins, draws, losses, goals for
        #goals against, goals differential, points
        position = epl_team.find('td',class_='table-column--sub').text.strip()
        games_played = epl_team.find_all('td')[2].text.strip()
        wins = epl_team.find_all('td',class_='table-column--importance-1')[0].text.strip()
        draws = epl_team.find_all('td',class_='table-column--importance-1')[1].text.strip()
        losses = epl_team.find_all('td',class_='table-column--importance-1')[2].text.strip()
        goal_differential = epl_team.find('td',class_='table-column--importance-3').text.strip()
        points = epl_team.find_all('td')[9].text.strip()

        teams_epl_dict[team_name]=[int(position),int(games_played),int(wins),int(draws),int(losses),int(goal_differential),int(points)]

get_data(teams_bundesliga_dict,theTable)
#print_dict(teams_epl_dict)


#creating a database of the standings
def create_and_initialize_db(tableName,teams_epl_dict):
    print('la liga (bundesliga) creating')
    connection = sqlite3.connect(tableName)
    cursor = connection.cursor()

    # table already created
    cursor.execute("""CREATE TABLE IF NOT EXISTS laliga_table (
                position INTEGER,
                team_name TEXT UNIQUE,
                games_played INTEGER,
                wins INTEGER,
                draws INTEGER,
                losses INTEGER,
                goal_differential INTEGER,
                points INTEGER
                )""")
    

    for t in teams_epl_dict.keys():
        cursor.execute("INSERT OR IGNORE INTO laliga_table (position, team_name, games_played, wins, draws, losses, goal_differential, points) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        (teams_epl_dict[t][0],t,teams_epl_dict[t][1],teams_epl_dict[t][2],teams_epl_dict[t][3],teams_epl_dict[t][4],teams_epl_dict[t][5],teams_epl_dict[t][6]))
        connection.commit()



    cursor.close()
    connection.close()

def delete_db(tableName):
    if(path.isfile(tableName)):
        print('la liga (bundesliga) updating db')
        os.remove(tableName)
    else:
        print('la liga (bundesliga) nothing to delete')

delete_db('laliga_table.db')
create_and_initialize_db('laliga_table.db',teams_bundesliga_dict)