#!/usr/bin/env sh
/usr/bin/sqlite3 homesensors.db < purpleairtable.sql
/usr/bin/sqlite3 homesensors.db < ambientweathertable.sql